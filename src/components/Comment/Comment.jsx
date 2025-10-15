import { Flex, Avatar, Text, Button, Box } from '@chakra-ui/react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { formatTime } from '../../utils/formatTime'
import { useState } from 'react'
import useAuthStore from '../../store/authStore'

const Comment = ({comment, postId, onLikeComment}) => {
  const { user } = useAuthStore()
  const [isLiking, setIsLiking] = useState(false)
  
  const likes = comment?.likes || []
  const isLiked = user?.uid ? likes.includes(user.uid) : false
  const likesCount = likes.length

  const handleLike = async () => {
    if (!user?.uid || isLiking || !onLikeComment) return
    
    setIsLiking(true)
    try {
      await onLikeComment(comment.id, user.uid)
    } catch (error) {
      console.error('Error liking comment:', error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Flex gap={4}>
        <Avatar src={comment.createdByProfilePic} name={comment.createdByUsername} size={"sm"} />
        <Flex direction={"column"} flex={1}>
            <Flex gap={2}>
                <Text fontWeight={"bold"} fontSize={12}>
                    {comment.createdByUsername}
                </Text>
                <Text fontSize={14}>
                    {comment.text}
                </Text>
            </Flex>
            <Flex alignItems="center" gap={4} mt={1}>
                <Text fontSize={12} color={"gray"}>
                    {formatTime(comment.createdAt)}
                </Text>
                {likesCount > 0 && (
                  <Text fontSize={12} color={"gray"}>
                    {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                  </Text>
                )}
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleLike}
                  isLoading={isLiking}
                  leftIcon={isLiked ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
                  color={isLiked ? "red" : "gray"}
                  _hover={{ bg: "whiteAlpha.100" }}
                  minW="auto"
                  h="auto"
                  p={1}
                >
                  Like
                </Button>
            </Flex>
        </Flex>
    </Flex>
  )
}

export default Comment
