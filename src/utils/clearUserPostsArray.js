import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Function to clear the user's posts array (remove old Firebase Storage URLs)
export const clearUserPostsArray = async (userId) => {
  try {
    // Clear the posts array by setting it to empty array
    await updateDoc(doc(firestore, "users", userId), {
      posts: []
    });
    
    console.log("✅ User posts array cleared successfully!");
    console.log("User ID:", userId);
    
  } catch (error) {
    console.error("❌ Error clearing user posts array:", error);
  }
};

// Call this function in browser console to clear your posts array
// clearUserPostsArray("IQLKfFWexRVkJ6mOS41apZJZK7H2"); // Replace with your actual user ID
