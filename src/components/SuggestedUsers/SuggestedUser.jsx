import {Flex, Button, Avatar, VStack, Box, Link as ChakraLink} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import useFollowUser from '../../hooks/useFollowUser';
import useAuthStore from '../../store/authStore';

const SuggestedUser = ({userData}) => {
  const { user } = useAuthStore();
  const { isUpdating, handleFollowUser } = useFollowUser(userData?.uid);
  
  // Check if current user is following this suggested user
  const isFollowing = user?.following?.includes(userData?.uid);
  
  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
        <Flex alignItems={"center"} gap={2}>
            <ChakraLink as={RouterLink} to={`/${userData.username}`}>
                <Avatar 
                    src={userData.profilePicURL} 
                    name={userData.fullName || userData.username} 
                    size={"md"} 
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                />
            </ChakraLink>
            <VStack spacing={2} alignItems={"flex-start"}>
                <ChakraLink as={RouterLink} to={`/${userData.username}`} _hover={{ textDecoration: "none" }}>
                    <Box fontSize={12} fontWeight={"bold"} color="white" _hover={{ color: "blue.400" }}>
                        {userData.username}
                    </Box>
                </ChakraLink>
                <Box fontSize={11} color={"gray.500"}>
                    {userData.followers?.length || 0} followers
                </Box>
            </VStack>
        </Flex>
        <Button
            fontSize={13}
            bg={"transparent"}
            p={0}
            h={"max-content"}
            fontWeight={"medium"}
            color={"blue.400"}
            cursor={"pointer"}
            _hover={{color:"white"}}
            onClick={handleFollowUser}
            isLoading={isUpdating}
            loadingText="..."
        >
            {isFollowing ? "Following" : "Follow"}
        </Button>
    </Flex>
  );
};

export default SuggestedUser
