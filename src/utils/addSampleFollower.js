import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Function to add a sample follower
export const addSampleFollower = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    
    // Add a sample follower ID to the followers array
    await updateDoc(userRef, {
      followers: arrayUnion('sampleFollower123')
    });
    
    console.log('Sample follower added successfully!');
  } catch (error) {
    console.error('Error adding sample follower:', error);
  }
};

// Function to add a sample following
export const addSampleFollowing = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    
    // Add a sample user ID to the following array
    await updateDoc(userRef, {
      following: arrayUnion('sampleFollowing456')
    });
    
    console.log('Sample following added successfully!');
  } catch (error) {
    console.error('Error adding sample following:', error);
  }
};

// Function to add a sample post
export const addSamplePost = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    
    // Add a sample post ID to the posts array
    await updateDoc(userRef, {
      posts: arrayUnion('samplePost789')
    });
    
    console.log('Sample post added successfully!');
  } catch (error) {
    console.error('Error adding sample post:', error);
  }
};
