import { Avatar, Box, Button, Flex, Link, Tooltip } from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import {BiLogOut} from "react-icons/bi"
import useLogout from '../../hooks/useLogout.js'

const LogoutItem = () => {
  const {handleLogout, isLoggingOut} = useLogout();
  
  return (
    <Tooltip
      hasArrow
      label={"Logout"}
      placement="right"
      ml={1}
      openDelay={500}
      display={{base:'block', md:'none'}}
    >
      <Flex
        onClick={handleLogout}
        alignItems={"center"}
        gap={4}
        _hover={{bg:"whiteAlpha.400"}}
        borderRadius={6}
        p={2}
        w={{base:10, md:"full"}}
        mt={'auto'}
        justifyContent={{base:'center', md:'flex-start'}}
      >
        <BiLogOut size={25} />
        <Button
          display={{base:'none', md:'block'}}
          variant={"ghost"}
          _hover={{bg:"transparent"}}
          isLoading={isLoggingOut}
        >
          Logout
        </Button>
      </Flex>
    </Tooltip>
  );
};

export default LogoutItem;
