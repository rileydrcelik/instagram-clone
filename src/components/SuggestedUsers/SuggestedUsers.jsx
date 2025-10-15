import {VStack, Flex, Text, Box, Link, Spinner} from '@chakra-ui/react';
import SuggestedHeader from './SuggestedHeader';
import SuggestedUser from './SuggestedUser';
import useSuggestedUsers from '../../hooks/useSuggestedUsers';

const SuggestedUsers = () => {
  const { suggestedUsers, isLoading } = useSuggestedUsers();

  return <VStack py={8} px={6} gap={4}>
    <SuggestedHeader />
    <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
        <Text fontSize={12} fontWeight={"bold"} color={"gray.500"}>
            Suggested for you
        </Text>
        <Text fontSize={12} fontWeight={"bold"} color={"gray.400"} cursor={"pointer"}>
            See All
        </Text>
    </Flex>
    
    {isLoading ? (
        <Flex justify="center" py={4}>
            <Spinner size="sm" />
        </Flex>
    ) : (
        suggestedUsers.map((user) => (
            <SuggestedUser key={user.uid} userData={user} />
        ))
    )}

    {!isLoading && suggestedUsers.length === 0 && (
        <Text fontSize={12} color={"gray.500"} textAlign="center">
            No suggestions available
        </Text>
    )}

    <Box fontSize={12} color={"gray.500"} mt={5} alignSelf={"start"}>
        Built by{" "}
        <Link href="https://www.rileydrcelik.com" target="_blank" color="blue.500" fontSize={14}>
            riley
        </Link>
    </Box>
  </VStack>;
};

export default SuggestedUsers;
