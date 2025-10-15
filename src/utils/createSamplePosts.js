import { doc, updateDoc, arrayUnion, ref, uploadBytes, getDownloadURL } from 'firebase/firestore';
import { firestore, storage } from '../firebase/firebase';

// Utility function to create sample posts for testing
export const createSamplePosts = async () => {
  try {
    const samplePosts = [
      {
        createdBy: "alice456",
        createdByUsername: "alice_photography",
        caption: "Beautiful sunset today! 🌅 #photography #nature",
        imageURLs: ["https://picsum.photos/400/400?random=1"],
        likes: ["testUser123", "bob789"],
        comments: [],
        createdAt: Date.now() - 86400000, // 1 day ago
        postId: `post-${Date.now()}-alice1`
      },
      {
        createdBy: "bob789", 
        createdByUsername: "bob_travels",
        caption: "Just arrived in Paris! ✈️ #travel #adventure",
        imageURLs: ["https://picsum.photos/400/400?random=2"],
        likes: ["alice456"],
        comments: [],
        createdAt: Date.now() - 172800000, // 2 days ago
        postId: `post-${Date.now()}-bob1`
      },
      {
        createdBy: "charlie101",
        createdByUsername: "charlie_tech",
        caption: "New coding setup is complete! 💻 #coding #tech",
        imageURLs: ["https://picsum.photos/400/400?random=3"],
        likes: ["testUser123", "alice456", "bob789"],
        comments: [],
        createdAt: Date.now() - 259200000, // 3 days ago
        postId: `post-${Date.now()}-charlie1`
      },
      {
        createdBy: "diana202",
        createdByUsername: "diana_art",
        caption: "Working on some new digital art 🎨 #art #digital",
        imageURLs: ["https://picsum.photos/400/400?random=4"],
        likes: ["charlie101"],
        comments: [],
        createdAt: Date.now() - 345600000, // 4 days ago
        postId: `post-${Date.now()}-diana1`
      },
      {
        createdBy: "eve303",
        createdByUsername: "eve_fitness",
        caption: "Morning workout complete! 💪 #fitness #health",
        imageURLs: ["https://picsum.photos/400/400?random=5"],
        likes: ["diana202", "alice456"],
        comments: [],
        createdAt: Date.now() - 432000000, // 5 days ago
        postId: `post-${Date.now()}-eve1`
      }
    ];

    const createdPostURLs = [];
    
    for (const postData of samplePosts) {
      // Upload post data as JSON to Firebase Storage
      const postJson = JSON.stringify(postData);
      const postBlob = new Blob([postJson], { type: 'application/json' });
      const postRef = ref(storage, `posts/${postData.createdBy}/sample-post-${Date.now()}.json`);
      
      await uploadBytes(postRef, postBlob);
      const postStorageURL = await getDownloadURL(postRef);
      createdPostURLs.push(postStorageURL);
      
      // Update user's posts array in Firestore (store the storage URL)
      await updateDoc(doc(firestore, "users", postData.createdBy), {
        posts: arrayUnion(postStorageURL)
      });
    }
    
    console.log("Sample posts created successfully!");
    console.log("Created posts:", createdPostURLs.length);
    console.log("Posts are now available in user profiles!");
  } catch (error) {
    console.error("Error creating sample posts:", error);
  }
};

// Call this function in browser console to create sample posts
// createSamplePosts();
