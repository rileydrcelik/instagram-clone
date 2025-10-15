import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useUserProfileStore from '../store/userProfileStore';

const useGetUserPosts = () => {
    const [isLoading, setIsLoading] = useState(true);
    const showToast = useShowToast();
    const { userProfile, posts, setPosts } = useUserProfileStore();

    useEffect(() => {
        const fetchUserPosts = async () => {
            console.log('useGetUserPosts: Hook called, userProfile:', userProfile);

            if (!userProfile?.uid) {
                console.log('useGetUserPosts: No userProfile, returning');
                setIsLoading(false);
                setPosts([]);
                return;
            }

            setIsLoading(true);
            try {
                console.log('useGetUserPosts: Querying posts for uid:', userProfile.uid);
                
                // First, try a simple query without orderBy to check if posts exist
                const postsRef = collection(firestore, 'posts');
                const simpleQuery = query(
                    postsRef, 
                    where('createdBy', '==', userProfile.uid)
                );
                
                const querySnapshot = await getDocs(simpleQuery);
                console.log('useGetUserPosts: Query snapshot size:', querySnapshot.size);
                
                const fetchedPosts = [];
                querySnapshot.forEach((doc) => {
                    console.log('useGetUserPosts: Processing doc:', doc.id, doc.data());
                    fetchedPosts.push({ id: doc.id, ...doc.data() });
                });

                // Sort posts by createdAt in descending order (newest first)
                fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);

                console.log('useGetUserPosts: Final posts array:', fetchedPosts);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('useGetUserPosts: Error fetching posts:', error);
                showToast("Error", "Failed to fetch user posts: " + error.message, "error");
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPosts();
    }, [userProfile, showToast, setPosts]);

    return { isLoading, posts };
};

export default useGetUserPosts;