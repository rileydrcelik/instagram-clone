import { NotificationsLogo, UnlikeLogo, CommentLogo } from '../../assets/constants';
import {Box, Flex, Text, InputGroup, Input, InputRightElement, Button} from '@chakra-ui/react';
import { useState } from 'react';

const PostFooter = ({username, isProfilePage, likesCount, isLiked, handleLike, isUpdating, addComment, isSubmittingComment, postCaption, commentsCount, onViewComments}) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmitComment = () => {
        if (commentText.trim() && addComment) {
            addComment(commentText);
            setCommentText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmitComment();
        }
    };
  return (
    <Box mb={10} marginTop={"auto"}>
        <Flex alignItems={"center"} gap={4} w={"full"} pt={0} mb={2} mt={4}>
            <Box onClick={handleLike}
            cursor={"pointer"}
            fontSize={18}>
                {!isLiked ? (<NotificationsLogo />) : (<UnlikeLogo />)}
            </Box>
            <Box cursor={"pointer"} fontSize={18}>
                <CommentLogo />
            </Box>
        </Flex>
        <Text fontWeight={600} fontSize={"sm"}>
            {likesCount} likes
        </Text>
        {!isProfilePage && (
            <>
                {postCaption && (
                    <Text fontSize='sm' fontWeight={700} mb={1}>
                        {username}{" "}
                        <Text as='span' fontWeight={400}>
                            {postCaption}
                        </Text>
                    </Text>
                )}
                {commentsCount > 0 && (
                    <Text 
                        fontSize='sm' 
                        color={"gray"}
                        cursor="pointer"
                        _hover={{ color: "white", textDecoration: "underline" }}
                        onClick={onViewComments}
                    >
                        View all {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
                    </Text>
                )}
            </>
        )}

        <Flex
            alignItems={"center"}
            gap={2}
            justifyContent={"space"}
            w={"full"}
        >
            <InputGroup>
                <Input 
                    variant={"flushed"} 
                    placeholder={"Add a comment..."} 
                    fontSize={14}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <InputRightElement>
                    <Button
                        fontSize={14}
                        color={commentText.trim() ? "blue.500" : "gray.500"}
                        fontWeight={600}
                        cursor={commentText.trim() ? "pointer" : "not-allowed"}
                        _hover={{color: commentText.trim() ? "white" : "gray.500"}}
                        bg={"transparent"}
                        onClick={handleSubmitComment}
                        isDisabled={!commentText.trim() || isSubmittingComment}
                        isLoading={isSubmittingComment}
                    >
                        Post
                    </Button>
                </InputRightElement>
            </InputGroup>

        </Flex>
    </Box>
  );
}

export default PostFooter
