import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    Text,
    Flex,
    Avatar,
    Box,
    Divider
} from '@chakra-ui/react';
import Comment from '../Comment/Comment';
import PostFooter from './PostFooter';
import usePostComments from '../../hooks/usePostComments';

const CommentsModal = ({ isOpen, onClose, post }) => {
    const { comments, addComment, isSubmittingComment, likeComment } = usePostComments(post);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: "xs", md: "md" }}>
            <ModalOverlay />
            <ModalContent bg={"black"} boxShadow={"xl"} border={"1px solid gray"} mx={3} maxH="80vh">
                <ModalHeader textAlign={"center"} fontSize="sm" fontWeight="bold">
                    Comments
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch" maxH="60vh">
                        {/* Display all comments */}
                        {comments.length === 0 ? (
                            <Text textAlign="center" color="gray.500" py={8}>
                                No comments yet
                            </Text>
                        ) : (
                            <Box maxH="400px" overflowY="auto" w="full">
                                {comments.map((comment, index) => (
                                    <Comment 
                                        key={comment.id || index}
                                        comment={comment}
                                        postId={post?.id}
                                        onLikeComment={likeComment}
                                    />
                                ))}
                            </Box>
                        )}
                        
                        {/* Comment input */}
                        <Box mt={4} pt={4} borderTop="1px solid" borderColor="gray.600">
                            <PostFooter 
                                isProfilePage={false}
                                addComment={addComment}
                                isSubmittingComment={isSubmittingComment}
                                username={post?.createdByUsername}
                            />
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CommentsModal;
