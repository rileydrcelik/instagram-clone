import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Function to add a sample comment to a post for testing
export const addSampleComment = async (postId) => {
  try {
    const sampleComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdBy: "sampleUser123",
      createdByUsername: "sample_user",
      createdByProfilePic: "https://picsum.photos/100/100?random=1",
      text: "This is a sample comment! 🎉",
      createdAt: Date.now()
    };

    const postRef = doc(firestore, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion(sampleComment)
    });
    
    console.log("✅ Sample comment added successfully!");
    console.log("Comment:", sampleComment);
    
  } catch (error) {
    console.error("❌ Error adding sample comment:", error);
  }
};

// Call this function in browser console to add a sample comment
// addSampleComment("YOUR_POST_ID");
