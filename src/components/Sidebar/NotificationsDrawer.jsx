import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,
    HStack,
    Avatar,
    Text,
    Box,
    Spinner,
    Button,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { formatTime } from '../../utils/formatTime';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment, FaUserPlus } from 'react-icons/fa';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { useState } from 'react';

const NotificationsDrawer = ({ isOpen, onClose, notifications, isLoading }) => {
    const [markingAsRead, setMarkingAsRead] = useState(false);

    const markAllAsRead = async () => {
        setMarkingAsRead(true);
        try {
            // Update all unread notifications to read
            const unreadNotifications = notifications.filter(n => !n.read);
            const updatePromises = unreadNotifications.map(notification => {
                const notificationRef = doc(firestore, 'notifications', notification.id);
                return updateDoc(notificationRef, { read: true });
            });
            await Promise.all(updatePromises);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        } finally {
            setMarkingAsRead(false);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return <AiFillHeart size={24} color="#ED4956" />;
            case 'comment':
                return <FaComment size={20} color="#0095F6" />;
            case 'follow':
                return <FaUserPlus size={20} color="#0095F6" />;
            default:
                return null;
        }
    };

    const getNotificationText = (notification) => {
        switch (notification.type) {
            case 'like':
                return (
                    <>
                        <Text as="span" fontWeight="bold">{notification.senderUsername}</Text>
                        {' liked your post.'}
                    </>
                );
            case 'comment':
                return (
                    <>
                        <Text as="span" fontWeight="bold">{notification.senderUsername}</Text>
                        {' commented on your post.'}
                    </>
                );
            case 'follow':
                return (
                    <>
                        <Text as="span" fontWeight="bold">{notification.senderUsername}</Text>
                        {' started following you.'}
                    </>
                );
            default:
                return '';
        }
    };

    return (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
            <DrawerOverlay 
                zIndex={1}
                bg="blackAlpha.600"
                ml={{base: 0, md: "240px"}}
            />
            <DrawerContent 
                bg="black" 
                borderRight="1px solid" 
                borderColor="whiteAlpha.300"
                ml={{base: 0, md: "240px"}}
                zIndex={1}
                transform={{base: "translateX(0)", md: "translateX(240px)"}}
                left={{base: 0, md: "-240px"}}
            >
                <DrawerCloseButton />
                <DrawerHeader borderBottom="1px solid" borderColor="whiteAlpha.300">
                    <HStack justify="space-between" pr={8}>
                        <Text>Notifications</Text>
                        {notifications.filter(n => !n.read).length > 0 && (
                            <Button
                                size="xs"
                                variant="ghost"
                                color="blue.500"
                                onClick={markAllAsRead}
                                isLoading={markingAsRead}
                                _hover={{ bg: 'whiteAlpha.200' }}
                            >
                                Mark all as read
                            </Button>
                        )}
                    </HStack>
                </DrawerHeader>

                <DrawerBody p={0}>
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" h="200px">
                            <Spinner size="xl" />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box textAlign="center" py={20}>
                            <Text fontSize="lg" color="gray.500">
                                No notifications yet
                            </Text>
                            <Text fontSize="sm" color="gray.400" mt={2}>
                                When someone likes or comments on your posts, you'll see them here.
                            </Text>
                        </Box>
                    ) : (
                        <VStack spacing={0} align="stretch">
                            {notifications.map((notification) => (
                                <Box
                                    key={notification.id}
                                    as={notification.postId ? RouterLink : 'div'}
                                    to={notification.type === 'follow' 
                                        ? `/${notification.senderUsername}` 
                                        : undefined}
                                    p={4}
                                    borderBottom="1px solid"
                                    borderColor="whiteAlpha.100"
                                    bg={notification.read ? 'transparent' : 'whiteAlpha.100'}
                                    _hover={{ bg: 'whiteAlpha.200' }}
                                    cursor="pointer"
                                    transition="all 0.2s"
                                >
                                    <HStack spacing={3} align="start">
                                        <Avatar 
                                            size="md" 
                                            src={notification.senderProfilePic || ''}
                                            name={notification.senderUsername}
                                            bg="gray.600"
                                        />
                                        <Box flex={1}>
                                            <Text fontSize="sm">
                                                {getNotificationText(notification)}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500" mt={1}>
                                                {formatTime(notification.createdAt)}
                                            </Text>
                                        </Box>
                                        <Box>
                                            {getNotificationIcon(notification.type)}
                                        </Box>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default NotificationsDrawer;

