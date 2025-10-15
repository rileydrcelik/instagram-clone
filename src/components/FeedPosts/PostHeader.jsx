import {Avatar, Box, Flex, Text} from '@chakra-ui/react';
import { formatTime } from '../../utils/formatTime';
import { Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { useState } from 'react';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';

const PostHeader = ({username, avatar, createdAt, postCreatorId}) => {
  const { user, setUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Check if current user is following this person
  const isFollowing = user?.following?.includes(postCreatorId) || false;
  
  // Only show unfollow button if user is following this person and it's not their own post
  const showUnfollowButton = user?.uid !== postCreatorId && isFollowing;

  const handleUnfollow = async () => {
    if (isUpdating || !user) return;
    
    setIsUpdating(true);
    try {
      // Update current user's following list
      const currentUserRef = doc(firestore, "users", user.uid);
      await updateDoc(currentUserRef, {
        following: arrayRemove(postCreatorId)
      });

      // Update the other user's followers list
      const otherUserRef = doc(firestore, "users", postCreatorId);
      await updateDoc(otherUserRef, {
        followers: arrayRemove(user.uid)
      });

      // Update local state
      const updatedUser = {
        ...user,
        following: user.following.filter(uid => uid !== postCreatorId)
      };
      
      setUser(updatedUser);
      localStorage.setItem("user-info", JSON.stringify(updatedUser));
    } finally {
      setIsUpdating(false);
    }
  };
  return <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} my={2}>
    <Flex 
    alignItems={"center"}
    gap={2}>
        <Avatar 
          src={avatar || ""} 
          alt='user profile pic'
          size={"sm"}
          bg="gray.600"
        />
        <Flex fontSize={12} fontWeight={"bold"} gap="2">
            <Text 
              as={RouterLink} 
              to={`/${username}`} 
              _hover={{ textDecoration: "underline" }}
              color="white"
            >
              {username}
            </Text>
            <Box color="gray.500">
              - {formatTime(createdAt)}
            </Box>
        </Flex>
    </Flex>
    {showUnfollowButton && (
        <Box
            cursor={"pointer"}
            onClick={handleUnfollow}
        >
            <Text
                fontSize={12}
                color={"blue.500"}
                fontWeight={"bold"}
                _hover={{
                    color:"white",
                }}
                transition={".2s ease-in-out"}
            >
                {isUpdating ? "..." : "Unfollow"}
            </Text>
        </Box>
    )}
  </Flex>
}

export default PostHeader
