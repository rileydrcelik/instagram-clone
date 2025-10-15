import {Box, Image, useDisclosure } from '@chakra-ui/react';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
import CommentsModal from './CommentsModal';
import usePostLikes from '../../hooks/usePostLikes';
import usePostComments from '../../hooks/usePostComments';

const FeedPost = ({post}) => {
  const { isOpen: isCommentsOpen, onOpen: onCommentsOpen, onClose: onCommentsClose } = useDisclosure();
  const { likesCount, isLiked, isUpdating, handleLike } = usePostLikes(post);
  const { comments, addComment, isSubmittingComment } = usePostComments(post);
  
  // Get the first image for display
  const firstImage = post?.imageURLs?.[0];
  
  return <>
    <PostHeader 
      username={post.createdByUsername} 
      avatar={post.createdByProfilePic}
      createdAt={post.createdAt}
      postCreatorId={post.createdBy}
    />
    <Box my={2} borderRadius={4} overflow={"hidden"}>
      <Image src={firstImage} alt={post.createdByUsername} />
    </Box>
    <PostFooter 
      username={post.createdByUsername}
      likesCount={likesCount}
      isLiked={isLiked}
      handleLike={handleLike}
      isUpdating={isUpdating}
      addComment={addComment}
      isSubmittingComment={isSubmittingComment}
      postCaption={post.caption}
      commentsCount={comments.length}
      onViewComments={onCommentsOpen}
    />
    
    <CommentsModal 
      isOpen={isCommentsOpen} 
      onClose={onCommentsClose}
      post={post}
    />
  </>;
}

export default FeedPost
