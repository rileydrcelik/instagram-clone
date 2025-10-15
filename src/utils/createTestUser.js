import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Utility function to create test users for follow/unfollow testing
export const createTestUser = async () => {
  try {
    const testUsers = [
      {
        uid: "testUser123",
        email: "testuser@gmail.com",
        username: "testuser",
        fullName: "Test User",
        bio: "This is a test user for testing follow functionality",
        profilePicURL: "",
        followers: ["HhqXXVyocHgDN3j0vtePRfKCfzA3"], // Add your current user as a follower
        following: [],
        posts: [],
        createdAt: Date.now()
      },
      {
        uid: "alice456",
        email: "alice@gmail.com",
        username: "alice_photography",
        fullName: "Alice Johnson",
        bio: "Photography enthusiast 📸",
        profilePicURL: "",
        followers: [],
        following: [],
        posts: [],
        createdAt: Date.now()
      },
      {
        uid: "bob789",
        email: "bob@gmail.com",
        username: "bob_travels",
        fullName: "Bob Smith",
        bio: "Travel blogger ✈️",
        profilePicURL: "",
        followers: [],
        following: [],
        posts: [],
        createdAt: Date.now()
      },
      {
        uid: "charlie101",
        email: "charlie@gmail.com",
        username: "charlie_tech",
        fullName: "Charlie Brown",
        bio: "Tech enthusiast 💻",
        profilePicURL: "",
        followers: [],
        following: [],
        posts: [],
        createdAt: Date.now()
      },
      {
        uid: "diana202",
        email: "diana@gmail.com",
        username: "diana_art",
        fullName: "Diana Prince",
        bio: "Digital artist 🎨",
        profilePicURL: "",
        followers: [],
        following: [],
        posts: [],
        createdAt: Date.now()
      },
      {
        uid: "eve303",
        email: "eve@gmail.com",
        username: "eve_fitness",
        fullName: "Eve Wilson",
        bio: "Fitness coach 💪",
        profilePicURL: "",
        followers: [],
        following: [],
        posts: [],
        createdAt: Date.now()
      }
    ];

    for (const testUser of testUsers) {
      await setDoc(doc(firestore, "users", testUser.uid), testUser);
    }
    
    console.log("Test users created successfully!");
    console.log("Users created: testuser, alice_photography, bob_travels, charlie_tech");
    console.log("You can now see them in the suggested users section!");
  } catch (error) {
    console.error("Error creating test users:", error);
  }
};

// Call this function in browser console to create test user
// createTestUser();
