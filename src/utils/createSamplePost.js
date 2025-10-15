import { doc, setDoc, collection } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Utility function to create a sample post in Firestore
export const createSamplePost = async (userId, username) => {
  try {
    const postData = {
      createdBy: userId,
      createdByUsername: username,
      caption: "This is a sample post! 📸",
      imageURLs: ["https://picsum.photos/400/400?random=1"],
      likes: [],
      comments: [],
      createdAt: Date.now(),
      postId: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Create a new post document in Firestore
    const postRef = doc(collection(firestore, 'posts'));
    await setDoc(postRef, postData);
    
    console.log("Sample post created successfully!");
    console.log("Post ID:", postRef.id);
    console.log("Post data:", postData);
    
    return postRef.id;
  } catch (error) {
    console.error("Error creating sample post:", error);
  }
};

// Call this function in browser console to create a sample post
// createSamplePost("YOUR_USER_ID", "YOUR_USERNAME");
