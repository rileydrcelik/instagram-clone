import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Utility function to update all posts by a user when they change their profile picture
export const updateUserPostsProfilePic = async (userId, newProfilePicURL) => {
    try {
        console.log(`Updating profile pictures for all posts by user ${userId}...`);
        
        // Get all posts by this user
        const postsRef = collection(firestore, 'posts');
        const q = query(postsRef, where('createdBy', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const updatePromises = [];
        
        querySnapshot.forEach((postDoc) => {
            const postRef = doc(firestore, 'posts', postDoc.id);
            updatePromises.push(
                updateDoc(postRef, {
                    createdByProfilePic: newProfilePicURL
                })
            );
        });
        
        // Execute all updates
        await Promise.all(updatePromises);
        
        console.log(`Successfully updated ${updatePromises.length} posts with new profile picture!`);
        return updatePromises.length;
    } catch (error) {
        console.error('Error updating user posts profile pictures:', error);
        throw error;
    }
};

// Call this function when a user updates their profile picture
// updateUserPostsProfilePic(userId, newProfilePicURL);
