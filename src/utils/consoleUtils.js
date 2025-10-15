import { fixMissingProfilePics } from './fixMissingProfilePics';
import { createNotification, createLikeNotification, createCommentNotification, createFollowNotification } from './createNotification';

// Make the fix function available in browser console for easy access
window.fixMissingProfilePics = fixMissingProfilePics;

// Make notification functions available for testing
window.createNotification = createNotification;
window.createLikeNotification = createLikeNotification;
window.createCommentNotification = createCommentNotification;
window.createFollowNotification = createFollowNotification;

console.log('Utility functions available:');
console.log('- fixMissingProfilePics(): Fix posts missing profile pictures');
console.log('- createLikeNotification(ownerId, likerId, likerUsername, postId, profilePic): Create like notification');
console.log('- createCommentNotification(ownerId, commenterId, commenterUsername, postId, profilePic): Create comment notification');
console.log('- createFollowNotification(followedId, followerId, followerUsername, profilePic): Create follow notification');
