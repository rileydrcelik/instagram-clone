import {AvatarGroup, Flex, VStack, Avatar, Text, Button, useDisclosure} from '@chakra-ui/react';
import EditProfile from './EditProfile';
import FollowersModal from './FollowersModal';
import useFollowUser from '../../hooks/useFollowUser';
import useAuthStore from '../../store/authStore';

const ProfileHeader = ({userProfile}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isFollowersOpen, 
    onOpen: onFollowersOpen, 
    onClose: onFollowersClose 
  } = useDisclosure();
  const { user } = useAuthStore();
  const { isUpdating, isFollowing, handleFollowUser } = useFollowUser(userProfile?.uid);
  
  // Check if current user is following this profile
  const isCurrentlyFollowing = user?.following?.includes(userProfile?.uid);
  
  // Check if this is the current user's own profile
  const isOwnProfile = user?.uid === userProfile?.uid;

  return (
    <>
        <Flex gap={{base:4,sm:10}} py={10} direction={{base:"column",sm:"row"}}>
            <AvatarGroup size={{base:"xl",md:"2xl"}} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
                <Avatar name={userProfile.fullName} src={userProfile.profilePicURL} alt={`${userProfile.username} profile picture`} />
            </AvatarGroup>

            <VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
                <Flex gap={4} direction={{base:"column",sm:"row"}} justifyContent={{base:"center",sm:"flex-start"}} alignItems={"center"} w={"full"}>
                    <Text fontSize={{base:"sm",md:"lg"}}>
                        {userProfile.username}
                    </Text>
                    <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
                        {isOwnProfile ? (
                            <Button bg={"white"} color={"black"} _hover={{bg:"whiteAlpha.800"}} size={{base:"xs",md:"sm"}} onClick={onOpen}>
                                Edit Profile
                            </Button>
                        ) : (
                            <Button 
                                bg={isCurrentlyFollowing ? "transparent" : "blue.500"} 
                                color={isCurrentlyFollowing ? "white" : "white"} 
                                border={isCurrentlyFollowing ? "1px solid" : "none"}
                                borderColor={isCurrentlyFollowing ? "white" : "transparent"}
                                _hover={{bg: isCurrentlyFollowing ? "whiteAlpha.300" : "blue.600"}} 
                                size={{base:"xs",md:"sm"}} 
                                onClick={handleFollowUser}
                                isLoading={isUpdating}
                            >
                                {isCurrentlyFollowing ? "Following" : "Follow"}
                            </Button>
                        )}
                    </Flex>
                </Flex>

                <Flex alignItems={"center"} gap={{base:2,sm:4}}>
                    <Text fontSize={{base:"xs",md:"sm"}}>
                        <Text as="span" fontWeight={"bold"} mr={1}>{userProfile.posts.length}</Text>
                        Posts
                    </Text>
                    <Text 
                        fontSize={{base:"xs",md:"sm"}} 
                        cursor="pointer" 
                        _hover={{textDecoration: "underline"}}
                        onClick={onFollowersOpen}
                    >
                        <Text as="span" fontWeight={"bold"} mr={1}>{userProfile.followers.length}</Text>
                        Followers
                    </Text>
                    <Text 
                        fontSize={{base:"xs",md:"sm"}} 
                        cursor="pointer" 
                        _hover={{textDecoration: "underline"}}
                        onClick={onFollowersOpen}
                    >
                        <Text as="span" fontWeight={"bold"} mr={1}>{userProfile.following.length}</Text>
                        Following
                    </Text>
                </Flex>
                <Flex alignItems={"center"} gap={4}>
                    <Text fontSize={"sm"} fontWeight={"bold"}>{userProfile.fullName}</Text>
                </Flex>
                {userProfile.bio && (
                    <Flex alignItems={"center"} gap={4}>
                        <Text fontSize={"sm"}>{userProfile.bio}</Text>
                    </Flex>
                )}
            </VStack>
        </Flex>
        
        {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
        
        <FollowersModal 
            isOpen={isFollowersOpen} 
            onClose={onFollowersClose}
            followers={userProfile?.followers}
            following={userProfile?.following}
            userProfile={userProfile}
        />
    </>
    );
};

export default ProfileHeader
