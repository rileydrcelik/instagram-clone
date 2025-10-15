import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import useAuthStore from '../store/authStore';
import { createCommentNotification } from '../utils/createNotification';

const usePostComments = (post) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        if (!post?.id) return;

        // Set up real-time listener for post comments
        const postRef = doc(firestore, 'posts', post.id);
        const unsubscribe = onSnapshot(postRef, (doc) => {
            if (doc.exists()) {
                const postData = doc.data();
                const postComments = postData.comments || [];
                setComments(postComments);
            }
        });

        return () => unsubscribe();
    }, [post?.id]);

    const addComment = async (commentText) => {
        if (!post?.id || !user?.uid || !commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const newComment = {
                id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                createdBy: user.uid,
                createdByUsername: user.username,
                createdByProfilePic: user.profilePicURL,
                text: commentText.trim(),
                createdAt: Date.now(),
                likes: [] // Initialize with empty likes array
            };

            const postRef = doc(firestore, 'posts', post.id);
            await updateDoc(postRef, {
                comments: arrayUnion(newComment)
            });

                    // Create notification for post owner
                    if (post.createdBy && post.createdBy !== user.uid) {
                        await createCommentNotification(
                            post.createdBy,
                            user.uid,
                            user.username,
                            post.id,
                            user.profilePicURL || ''
                        );
                    }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const likeComment = async (commentId, userId) => {
        if (!post?.id || !user?.uid || !commentId) return;

        try {
            const postRef = doc(firestore, 'posts', post.id);
            const currentComments = comments || [];
            
            // Find the comment and update its likes
            const updatedComments = currentComments.map(comment => {
                if (comment.id === commentId) {
                    const likes = comment.likes || [];
                    const isLiked = likes.includes(userId);
                    
                    return {
                        ...comment,
                        likes: isLiked 
                            ? likes.filter(uid => uid !== userId) // Remove like
                            : [...likes, userId] // Add like
                    };
                }
                return comment;
            });

            await updateDoc(postRef, {
                comments: updatedComments
            });
            // UI update handled by onSnapshot
        } catch (error) {
            console.error('Error liking comment:', error);
            showToast("Error", error.message, "error");
            throw error;
        }
    };

    return {
        comments,
        isLoading,
        isSubmitting,
        addComment,
        likeComment
    };
};

export default usePostComments;
