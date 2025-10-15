import { VStack, Divider, Box, GridItem, Flex, Text, Image, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Avatar, Button} from '@chakra-ui/react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import Comment from "../Comment/Comment.jsx"
import PostFooter from '../FeedPosts/PostFooter.jsx';
import usePostLikes from '../../hooks/usePostLikes';
import usePostComments from '../../hooks/usePostComments';
import useDeletePost from '../../hooks/useDeletePost';
import { formatTime } from '../../utils/formatTime';
import useAuthStore from '../../store/authStore';

const ProfilePost = ({post, onPostDeleted}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { likesCount, isLiked, isUpdating, handleLike } = usePostLikes(post);
    const { comments, addComment, isSubmittingComment, likeComment } = usePostComments(post);
    const { deletePost, isDeleting } = useDeletePost();
    const { user } = useAuthStore();
    
    
    // Get the first image for the grid display
    const firstImage = post?.imageURLs?.[0];
    const commentsCount = comments.length;
    
    // Check if current user owns this post
    const isOwnPost = user?.uid === post?.createdBy;

    const handleDeletePost = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
        if (!confirmed) return;

        const success = await deletePost(post);
        if (success && onPostDeleted) {
            onPostDeleted(post.id);
            onClose(); // Close the modal after successful deletion
        }
    };
    return (
        <>
        <GridItem cursor={"pointer"} borderRadius={4} overflow={"hidden"} border={"1px solid"} borderColor={"whiteAlpha.300"} position={"relative"} aspectRatio={1/1} onClick={onOpen}>
            <Flex opacity={0} _hover={{opacity:1}} position={"absolute"} top={0} right={0} bottom={0} left={0} bg={"blackAlpha.700"} transition={"all .3s ease"} zIndex={1} justifyContent={"center"}>
                <Flex alignItems={"center"} justifyContent={"center"} gap={50}>
                    <Flex>
                        <AiFillHeart size={20} />
                        <Text fontWeight={"bold"} ml={2}>
                            {likesCount}
                        </Text>
                    </Flex>

                    <Flex>
                        <FaComment size={20} />
                        <Text fontWeight={"bold"} ml={2}>
                            {commentsCount}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            <Image src={firstImage} alt='profile post' w={"100%"} h={"100%"} objectFit={"cover"}/>
        </GridItem>

        <Modal isOpen={isOpen} onClose={onClose}
            isCentered={true}
            size={{base:"3xl",md:"5xl"}}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody bg={"black"} pb={5}>
                    <Flex gap="4" w={{base:"90%", sm:"70%", md:"full"}} mx={"auto"}>
                        <Box borderRadius={4} overflow={"hidden"} border={"1 px solid"} borderColor={"whiteAlpha.300"} flex={1.5}>
                            <Image src={firstImage} alt='profile post' />
                        </Box>
                        <Flex flex={1} flexDir={"column"} px={10} display={{base:"none", md:"flex"}}>
                            <Flex alignItems={"center"} justifyContent={"space-between"}>
                                <Flex alignItems={"center"} gap={4}>
                                    <Avatar 
                                        src={post?.createdByProfilePic || ""} 
                                        size={"sm"} 
                                        name={post?.createdByUsername}
                                        bg="gray.600"
                                    />
                                    <VStack alignItems="flex-start" spacing={0}>
                                        <Text fontWeight={"bold"} fontSize={12}>
                                            {post?.createdByUsername}
                                        </Text>
                                        <Text fontSize={10} color="gray.500">
                                            {formatTime(post?.createdAt)}
                                        </Text>
                                    </VStack>
                                </Flex>
                                {isOwnPost && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleDeletePost}
                                        isLoading={isDeleting}
                                        leftIcon={<MdDelete />}
                                        color="red.400"
                                        _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                                        borderRadius={4}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </Flex>
                            <Divider my={4} bg={"gray.500"}/>
                            
                            <VStack w="full" alignItems={"start"} maxH={"350px"} overflowY={"auto"}>
                                {/* Display post caption */}
                                {post?.caption && (
                                    <Flex alignItems="center" gap={2} mb={2}>
                                        <Text fontWeight="bold" fontSize="sm">{post.createdByUsername}</Text>
                                        <Text fontSize="sm">{post.caption}</Text>
                                    </Flex>
                                )}
                                
                                        {/* Display comments */}
                                        {comments.map((comment, index) => (
                                            <Comment 
                                                key={comment.id || index}
                                                comment={comment}
                                                postId={post.id}
                                                onLikeComment={likeComment}
                                            />
                                        ))}
                                
                                {comments.length === 0 && (
                                    <Text color="gray.500" fontSize="sm">No comments yet</Text>
                                )}
                            </VStack>
                            <Divider my={4} bg={"gray.800"} />
                            
                            <PostFooter 
                                isProfilePage={true}
                                likesCount={likesCount}
                                isLiked={isLiked}
                                handleLike={handleLike}
                                isUpdating={isUpdating}
                                addComment={addComment}
                                isSubmittingComment={isSubmittingComment}
                            />
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    );
}

export default ProfilePost