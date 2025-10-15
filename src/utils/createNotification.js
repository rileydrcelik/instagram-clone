import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Utility function to create a notification
export const createNotification = async (notificationData) => {
    try {
        const notificationsRef = collection(firestore, 'notifications');
        await addDoc(notificationsRef, {
            ...notificationData,
            createdAt: Date.now(),
            read: false
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

// Helper functions for specific notification types
export const createLikeNotification = async (postOwnerId, likerId, likerUsername, postId, likerProfilePic = '') => {
    if (postOwnerId === likerId) return; // Don't notify for own likes
    
    await createNotification({
        type: 'like',
        recipientId: postOwnerId,
        senderId: likerId,
        senderUsername: likerUsername,
        senderProfilePic: likerProfilePic,
        postId: postId,
        message: `${likerUsername} liked your post`
    });
};

export const createCommentNotification = async (postOwnerId, commenterId, commenterUsername, postId, commenterProfilePic = '') => {
    if (postOwnerId === commenterId) return; // Don't notify for own comments
    
    await createNotification({
        type: 'comment',
        recipientId: postOwnerId,
        senderId: commenterId,
        senderUsername: commenterUsername,
        senderProfilePic: commenterProfilePic,
        postId: postId,
        message: `${commenterUsername} commented on your post`
    });
};

export const createFollowNotification = async (followedUserId, followerId, followerUsername, followerProfilePic = '') => {
    if (followedUserId === followerId) return; // Don't notify for following yourself
    
    await createNotification({
        type: 'follow',
        recipientId: followedUserId,
        senderId: followerId,
        senderUsername: followerUsername,
        senderProfilePic: followerProfilePic,
        message: `${followerUsername} started following you`
    });
};
