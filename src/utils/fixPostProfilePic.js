import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Function to fix missing profile picture in existing posts
export const fixPostProfilePic = async (postId, profilePicURL) => {
  try {
    const postRef = doc(firestore, 'posts', postId);
    await updateDoc(postRef, {
      createdByProfilePic: profilePicURL
    });
    
    console.log("✅ Post profile picture updated successfully!");
    console.log("Post ID:", postId);
    console.log("Profile Pic URL:", profilePicURL);
    
  } catch (error) {
    console.error("❌ Error updating post profile picture:", error);
  }
};

// Call this function in browser console to fix your existing post
// fixPostProfilePic("LIIZ7X7RkJrhU1lNQZao", "https://firebasestorage.googleapis.com/v0/b/insta-clone-b8ccf.firebasestorage.app/o/profilePics%2FIQLKfFWexRVkJ6mOS41apZJZK7H2?alt=media&token=c45e89a9-c152-47c2-84ec-39f10e6c3332");
