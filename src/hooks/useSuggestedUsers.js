import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit, orderBy, where } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import useShowToast from './useShowToast';
import useAuthStore from '../store/authStore';

const useSuggestedUsers = () => {
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const showToast = useShowToast();
    const { user } = useAuthStore();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Get users that the current user is not following
                const usersRef = collection(firestore, 'users');
                const q = query(
                    usersRef,
                    where('uid', '!=', user.uid), // Exclude current user
                    limit(5) // Limit to 5 suggestions
                );
                
                const querySnapshot = await getDocs(q);
                const users = [];
                
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    // Only include users that current user is not already following
                    if (!user.following?.includes(userData.uid)) {
                        users.push(userData);
                    }
                });
                
                setSuggestedUsers(users);
            } catch (error) {
                showToast('Error', 'Failed to fetch suggested users', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        getSuggestedUsers();
    }, [user, showToast]);

    return { suggestedUsers, isLoading };
};

export default useSuggestedUsers;
