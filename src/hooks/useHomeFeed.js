import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import useAuthStore from '../store/authStore';
import useShowToast from './useShowToast';

const useHomeFeed = () => {
    const [feedPosts, setFeedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const showToast = useShowToast();

    useEffect(() => {
        const fetchFeedPosts = async () => {
            if (!user?.following || user.following.length === 0) {
                setIsLoading(false);
                setFeedPosts([]);
                return;
            }

            setIsLoading(true);
            try {
                // Query posts from users that the current user follows
                const postsRef = collection(firestore, 'posts');
                const q = query(
                    postsRef,
                    where('createdBy', 'in', user.following),
                    limit(50) // Get more posts to sort from
                );

                const querySnapshot = await getDocs(q);
                const posts = [];
                
                querySnapshot.forEach((doc) => {
                    posts.push({ id: doc.id, ...doc.data() });
                });

                // Sort posts by creation time (newest first) and limit to 20
                posts.sort((a, b) => b.createdAt - a.createdAt);
                const limitedPosts = posts.slice(0, 20);
                
                setFeedPosts(limitedPosts);
            } catch (error) {
                console.error('Error fetching feed posts:', error);
                showToast("Error", "Failed to load feed posts", "error");
                setFeedPosts([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchFeedPosts();
        }
    }, [user, showToast]);

    return { feedPosts, isLoading };
};

export default useHomeFeed;
