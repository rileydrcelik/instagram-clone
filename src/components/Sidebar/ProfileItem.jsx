import { Avatar, Box, Button, Flex, Link, Tooltip } from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import useAuthStore from '../../store/authStore.js'

const ProfileItem = () => {
  const { user } = useAuthStore();
  
  return (
    <Tooltip
      hasArrow
      label="Profile"
      placement="right"
      ml={1}
      openDelay={500}
      display={{base:'block', md:'none'}}
    >
      <Link
        display={"flex"}
        to={user ? `/${user.username}` : "/auth"}
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{bg:"whiteAlpha.400"}}
        borderRadius={6}
        p={2}
        w={{base:10, md:"full"}}
        justifyContent={{base:'center', md:'flex-start'}}
      >
        <Avatar size={"sm"} name={user?.fullName || user?.username} src={user?.profilePicURL} />
        <Box display={{base:'none', md:'block'}}>
          Profile
        </Box>
      </Link>
    </Tooltip>
  );
};

export default ProfileItem;
