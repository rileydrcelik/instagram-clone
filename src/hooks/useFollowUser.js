import { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import useShowToast from './useShowToast';
import useAuthStore from '../store/authStore';
import useUserProfileStore from '../store/userProfileStore';

const useFollowUser = (userID) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const showToast = useShowToast();
    const { user, setUser } = useAuthStore();
    const { userProfile, setUserProfile } = useUserProfileStore();

    const handleFollowUser = async () => {
        if (isUpdating) return;
        if (!user) {
            showToast("Error", "You must be logged in to follow users", "error");
            return;
        }
        if (userID === user.uid) {
            showToast("Error", "You cannot follow yourself", "error");
            return;
        }

        setIsUpdating(true);

        try {
            // Get current user document
            const currentUserRef = doc(firestore, "users", user.uid);
            const currentUserSnap = await getDoc(currentUserRef);
            
            // Get target user document
            const targetUserRef = doc(firestore, "users", userID);
            const targetUserSnap = await getDoc(targetUserRef);

            if (!currentUserSnap.exists() || !targetUserSnap.exists()) {
                showToast("Error", "User not found", "error");
                return;
            }

            const currentUserData = currentUserSnap.data();
            const targetUserData = targetUserSnap.data();

            // Check if already following
            const isCurrentlyFollowing = currentUserData.following.includes(userID);

            if (isCurrentlyFollowing) {
                // Unfollow: Remove from current user's following and target user's followers
                await updateDoc(currentUserRef, {
                    following: arrayRemove(userID)
                });
                
                await updateDoc(targetUserRef, {
                    followers: arrayRemove(user.uid)
                });

                // Update local state
                const updatedFollowing = currentUserData.following.filter(id => id !== userID);
                const updatedFollowers = targetUserData.followers.filter(id => id !== user.uid);

                setUser({
                    ...user,
                    following: updatedFollowing
                });

                if (userProfile && userProfile.uid === userID) {
                    setUserProfile({
                        ...userProfile,
                        followers: updatedFollowers
                    });
                }

                setIsFollowing(false);
            } else {
                // Follow: Add to current user's following and target user's followers
                await updateDoc(currentUserRef, {
                    following: arrayUnion(userID)
                });
                
                await updateDoc(targetUserRef, {
                    followers: arrayUnion(user.uid)
                });

                // Update local state
                setUser({
                    ...user,
                    following: [...currentUserData.following, userID]
                });

                if (userProfile && userProfile.uid === userID) {
                    setUserProfile({
                        ...userProfile,
                        followers: [...targetUserData.followers, user.uid]
                    });
                }

                setIsFollowing(true);
                
                        // Create notification for followed user
                        await createFollowNotification(
                            userID,
                            user.uid,
                            user.username,
                            user.profilePicURL || ''
                        );
            }

            // Update localStorage
            const updatedUser = {
                ...user,
                following: isCurrentlyFollowing 
                    ? currentUserData.following.filter(id => id !== userID)
                    : [...currentUserData.following, userID]
            };
            localStorage.setItem("user-info", JSON.stringify(updatedUser));

        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsUpdating(false);
        }
    };

    return { isUpdating, isFollowing, handleFollowUser };
};

export default useFollowUser;
