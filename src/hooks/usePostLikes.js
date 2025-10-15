import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import useAuthStore from '../store/authStore';
import { createLikeNotification } from '../utils/createNotification';

const usePostLikes = (post) => {
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        if (!post?.id) return;

        // Set up real-time listener for post likes
        const postRef = doc(firestore, 'posts', post.id);
        const unsubscribe = onSnapshot(postRef, (doc) => {
            if (doc.exists()) {
                const postData = doc.data();
                const postLikes = postData.likes || [];
                setLikes(postLikes);
                setIsLiked(postLikes.includes(user?.uid));
            }
        });

        return () => unsubscribe();
    }, [post?.id, user?.uid]);

    const handleLike = async () => {
        if (!post?.id || !user?.uid || isUpdating) return;

        setIsUpdating(true);
        try {
            const postRef = doc(firestore, 'posts', post.id);
            
            if (isLiked) {
                // Unlike the post
                await updateDoc(postRef, {
                    likes: arrayRemove(user.uid)
                });
            } else {
                // Like the post
                await updateDoc(postRef, {
                    likes: arrayUnion(user.uid)
                });
                
                        // Create notification for post owner
                        if (post.createdBy && post.createdBy !== user.uid) {
                            await createLikeNotification(
                                post.createdBy,
                                user.uid,
                                user.username,
                                post.id,
                                user.profilePicURL || ''
                            );
                        }
            }
        } catch (error) {
            console.error('Error updating like:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        likes,
        likesCount: likes.length,
        isLiked,
        isUpdating,
        handleLike
    };
};

export default usePostLikes;
