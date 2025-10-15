import { Box, Flex, Tooltip, Badge, useDisclosure } from '@chakra-ui/react';
import { NotificationsLogo } from '../../assets/constants.jsx';
import useNotifications from '../../hooks/useNotifications';
import NotificationsDrawer from './NotificationsDrawer';

const NotificationsItem = () => {
  const { notifications, unreadCount, isLoading } = useNotifications();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip
        hasArrow
        label="Notifications"
        placement="right"
        ml={1}
        openDelay={500}
        display={{base:'block', md:'none'}}
      >
        <Flex
          display={"flex"}
          alignItems={"center"}
          gap={4}
          _hover={{bg:"whiteAlpha.400"}}
          borderRadius={6}
          p={2}
          w={{base:10, md:"full"}}
          justifyContent={{base:'center', md:'flex-start'}}
          cursor="pointer"
          onClick={onOpen}
        >
          <Box position="relative">
            <NotificationsLogo />
            {unreadCount > 0 && (
              <Badge
                position="absolute"
                top="-2px"
                right="-2px"
                bg="red.500"
                color="white"
                borderRadius="full"
                minW="18px"
                h="18px"
                fontSize="xs"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Box>
          <Box display={{base:'none', md:'block'}}>
            Notifications
          </Box>
        </Flex>
      </Tooltip>

      <NotificationsDrawer 
        isOpen={isOpen}
        onClose={onClose}
        notifications={notifications}
        isLoading={isLoading}
      />
    </>
  );
};

export default NotificationsItem;
