import { Box, Flex, Link } from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import { InstagramLogo, InstagramMobileLogo } from '../../assets/constants.jsx';

import HomeItem from './HomeItem';
import SearchItem from './SearchItem';
import NotificationsItem from './NotificationsItem';
import CreateItem from './CreateItem';
import ProfileItem from './ProfileItem';
import LogoutItem from './LogoutItem';

const Sidebar = () => {
  return (
    <Box
    height = {"100vh"}
    borderRight={"1px solid"}
    borderColor={"whiteAlpha.300"}
    padding={8}
    position={"sticky"}
    top={0}
    left={0}
    px={{base:2, md:4}}
    zIndex={10}>
      <Flex
      direction={"column"}
      gap={10}
      w="full"
      height={"full"}>
        <Link 
        to={"/"} 
        as={RouterLink}
        pl={2}
        display={{base:"none", md:"block"}}
        cursor="pointer">
          <InstagramLogo />
        </Link>
        <Link 
        to={"/"} 
        as={RouterLink}
        p={2}
        borderRadius={6}
        display={{base:"block", md:"none"}}
        cursor="pointer"
        w={10}
        
        _hover={{
          bg:"whiteAlpha.200"
        }}
        >
          <InstagramMobileLogo />
        </Link>
        <Flex
        direction={"column"}
        gap={5}
        cursor={"pointer"}>
          <HomeItem />
          <SearchItem />
          <NotificationsItem />
          <CreateItem />
          <ProfileItem />
          <LogoutItem />
        </Flex>
      </Flex>
      
      
    </Box>
  )
}

export default Sidebar
