import { Grid, VStack, Skeleton, Box, Text } from '@chakra-ui/react';
import ProfilePost from './ProfilePost';
import useGetUserPosts from '../../hooks/useGetUserPosts';
import useUserProfileStore from '../../store/userProfileStore';

const ProfilePosts = () => {
    const { posts, isLoading } = useGetUserPosts();
    const { setPosts } = useUserProfileStore();

    const handlePostDeleted = (deletedPostId) => {
        // Remove the deleted post from the local posts array
        const updatedPosts = posts.filter(post => post.id !== deletedPostId);
        setPosts(updatedPosts);
    };

    return (
        <Grid
        templateColumns={{
            sm:"repeat(1, 1fr)",
            md:"repeat(3, 1fr)",
        }}
        gap={1} columnGap={1}
        >
            {isLoading && [0, 1, 2, 3, 4, 5].map((_,idx) => (
                <VStack key={idx} alignItems={"flex-start"} gap={4}>
                    <Skeleton w={"full"}>
                        <Box h="300px">contents wrapped</Box>
                    </Skeleton>
                </VStack>
            ))}

            {!isLoading && posts.length === 0 && (
                <Box 
                    gridColumn="1 / -1" 
                    textAlign="center" 
                    py={20}
                >
                    <Text fontSize="2xl" fontWeight="bold" color="gray.500">
                        No posts yet
                    </Text>
                    <Text fontSize="md" color="gray.400" mt={2}>
                        When you share photos and videos, they'll appear here.
                    </Text>
                </Box>
            )}

            {!isLoading && posts.map((post, index) => (
                <ProfilePost 
                    key={post.postId || index} 
                    post={post}
                    onPostDeleted={handlePostDeleted}
                />
            ))}
        </Grid>
    );
};

export default ProfilePosts
