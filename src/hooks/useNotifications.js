import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot, limit, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import useAuthStore from '../store/authStore';

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        if (!user?.uid) {
            setIsLoading(false);
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        // Set up real-time listener for notifications
        const notificationsRef = collection(firestore, 'notifications');
        const q = query(
            notificationsRef,
            where('recipientId', '==', user.uid),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const notificationsList = [];
            let unread = 0;

            // Collect all notifications first
            querySnapshot.forEach((doc) => {
                const notification = { id: doc.id, ...doc.data() };
                notificationsList.push(notification);
                if (!notification.read) {
                    unread++;
                }
            });

            // Fetch current profile pictures for all senders
            const senderIds = [...new Set(notificationsList.map(n => n.senderId))];
            const profilePicMap = {};
            
            await Promise.all(senderIds.map(async (senderId) => {
                try {
                    const userDocRef = doc(firestore, 'users', senderId);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        profilePicMap[senderId] = userDoc.data().profilePicURL || '';
                    }
                } catch (error) {
                    console.error(`Error fetching profile pic for user ${senderId}:`, error);
                }
            }));

            // Update notifications with current profile pictures
            const updatedNotifications = notificationsList.map(notification => ({
                ...notification,
                senderProfilePic: profilePicMap[notification.senderId] || notification.senderProfilePic || ''
            }));

            // Sort by createdAt in JavaScript to avoid composite index requirement
            updatedNotifications.sort((a, b) => b.createdAt - a.createdAt);

            setNotifications(updatedNotifications);
            setUnreadCount(unread);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user?.uid]);

    return { notifications, unreadCount, isLoading };
};

export default useNotifications;
