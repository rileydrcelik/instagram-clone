import { useState } from 'react';
import { doc, deleteDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { firestore, storage } from '../firebase/firebase';
import useAuthStore from '../store/authStore';
import useShowToast from './useShowToast';

const useDeletePost = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { user } = useAuthStore();
    const showToast = useShowToast();

    const deletePost = async (post) => {
        if (!user || !post) {
            showToast("Error", "Invalid post or user", "error");
            return;
        }

        // Check if user owns the post
        if (post.createdBy !== user.uid) {
            showToast("Error", "You can only delete your own posts", "error");
            return;
        }

        setIsDeleting(true);
        try {
            // Delete images from Firebase Storage
            if (post.imageURLs && post.imageURLs.length > 0) {
                const deletePromises = post.imageURLs.map(async (imageURL) => {
                    try {
                        // Extract the path from the URL
                        const url = new URL(imageURL);
                        const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
                        if (pathMatch) {
                            const imagePath = decodeURIComponent(pathMatch[1]);
                            const imageRef = ref(storage, imagePath);
                            await deleteObject(imageRef);
                        }
                    } catch (error) {
                        console.error('Error deleting image:', error);
                        // Continue with deletion even if image deletion fails
                    }
                });
                await Promise.all(deletePromises);
            }

            // Remove post ID from user's posts array
            await updateDoc(doc(firestore, "users", user.uid), {
                posts: arrayRemove(post.id)
            });

            // Delete the post document from Firestore
            await deleteDoc(doc(firestore, 'posts', post.id));

            showToast("Success", "Post deleted successfully", "success");
            return true; // Indicate successful deletion
        } catch (error) {
            console.error('Error deleting post:', error);
            showToast("Error", "Failed to delete post: " + error.message, "error");
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return { deletePost, isDeleting };
};

export default useDeletePost;
