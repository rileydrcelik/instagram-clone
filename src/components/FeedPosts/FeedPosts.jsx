import {Container, VStack, SkeletonCircle, Skeleton, Flex, Box, Text} from '@chakra-ui/react'
import FeedPost from './FeedPost'
import useHomeFeed from '../../hooks/useHomeFeed'
import useAuthStore from '../../store/authStore'

const FeedPosts = () => {
    const { feedPosts, isLoading } = useHomeFeed();
    const { user } = useAuthStore();
    return (
        <Container
        maxW={'container.sm'}
        py={10}
        px={2}>
            {isLoading && [0, 1, 2, 3].map((_, idx) => (
                <VStack key={idx} gap={4} alignItems={"flex-start"} mb={10}>
                    <Flex gap="2">
                        <SkeletonCircle size='10' />
                        <VStack gap={2} alignItems={"flex-start"}>
                            <Skeleton height='10px' w={'200px'} />
                            <Skeleton height='10px' w={'200px'} />
                        </VStack>
                    </Flex>
                    <Skeleton w={"full"}>
                        <Box h={'500px'}>contents wrapped</Box>
                    </Skeleton>
                </VStack>
            ))}
            {!isLoading && feedPosts.length === 0 && user?.following?.length > 0 && (
                <Box textAlign="center" py={20}>
                    <Text fontSize="xl" color="gray.500">
                        No new posts from people you follow
                    </Text>
                    <Text fontSize="md" color="gray.400" mt={2}>
                        Check back later for updates!
                    </Text>
                </Box>
            )}

            {!isLoading && user?.following?.length === 0 && (
                <Box textAlign="center" py={20}>
                    <Text fontSize="xl" color="gray.500">
                        Welcome to Instagram!
                    </Text>
                    <Text fontSize="md" color="gray.400" mt={2}>
                        Follow some accounts to see their posts here
                    </Text>
                </Box>
            )}

            {!isLoading && feedPosts.map((post) => (
                <FeedPost 
                    key={post.id}
                    post={post}
                />
            ))}
            
        </Container>
    )
}

export default FeedPosts
