import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Utility function to fix posts that are missing createdByProfilePic
export const fixMissingProfilePics = async () => {
    try {
        console.log('Starting to fix missing profile pictures in posts...');
        
        // Get all posts
        const postsRef = collection(firestore, 'posts');
        const querySnapshot = await getDocs(postsRef);
        
        let fixedCount = 0;
        const updatePromises = [];
        
        for (const postDoc of querySnapshot.docs) {
            const postData = postDoc.data();
            
            // Check if post is missing createdByProfilePic
            if (!postData.createdByProfilePic && postData.createdBy) {
                // Get the user's current profile picture
                const userRef = doc(firestore, 'users', postData.createdBy);
                const userDoc = await getDoc(userRef);
                
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const currentProfilePic = userData.profilePicURL || '';
                    
                    // Update the post with the user's current profile picture
                    const postRef = doc(firestore, 'posts', postDoc.id);
                    updatePromises.push(
                        updateDoc(postRef, {
                            createdByProfilePic: currentProfilePic
                        })
                    );
                    
                    fixedCount++;
                    console.log(`Fixed post ${postDoc.id} for user ${postData.createdByUsername}`);
                }
            }
        }
        
        // Execute all updates
        await Promise.all(updatePromises);
        
        console.log(`Successfully fixed ${fixedCount} posts with missing profile pictures!`);
        return fixedCount;
    } catch (error) {
        console.error('Error fixing missing profile pictures:', error);
        throw error;
    }
};

// Call this function in browser console to fix missing profile pictures
// fixMissingProfilePics();
