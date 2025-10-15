import { Avatar, Box, Button, Flex, Link, Tooltip, useDisclosure } from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import { CreatePostLogo } from '../../assets/constants.jsx';
import CreatePostModal from './CreatePostModal';

const CreateItem = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip
        hasArrow
        label="Create"
        placement="right"
        ml={1}
        openDelay={500}
        display={{base:'block', md:'none'}}
      >
        <Link
          display={"flex"}
          onClick={onOpen}
          alignItems={"center"}
          gap={4}
          _hover={{bg:"whiteAlpha.400"}}
          borderRadius={6}
          p={2}
          w={{base:10, md:"full"}}
          justifyContent={{base:'center', md:'flex-start'}}
          cursor="pointer"
        >
          <CreatePostLogo />
          <Box display={{base:'none', md:'block'}}>
            Create
          </Box>
        </Link>
      </Tooltip>
      
      <CreatePostModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default CreateItem;
