import { doc, setDoc, collection } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Function to add your existing post to Firestore
export const addExistingPostToFirestore = async () => {
  try {
    // Your existing post data (from the JSON file in Storage)
    const existingPostData = {
      createdBy: "IQLKfFWexRVkJ6mOS41apZJZK7H2", // Your user ID
      createdByUsername: "stevebaconpants",
      caption: "This is a sample post! 📸", // Add whatever caption you want
      imageURLs: ["https://picsum.photos/400/400?random=1"], // Or use your actual image URL
      likes: [],
      comments: [],
      createdAt: Date.now(),
      postId: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Create a new post document in Firestore
    const postRef = doc(collection(firestore, 'posts'));
    await setDoc(postRef, existingPostData);
    
    console.log("✅ Existing post added to Firestore successfully!");
    console.log("Post ID:", postRef.id);
    console.log("Post data:", existingPostData);
    
    return postRef.id;
  } catch (error) {
    console.error("❌ Error adding post to Firestore:", error);
  }
};

// Call this function in browser console to add your existing post
// addExistingPostToFirestore();
