import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Box,
	Flex,
	Text,
	Avatar,
	VStack,
	HStack,
	Spinner,
	Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";

const FollowersModal = ({ isOpen, onClose, followers, following, userProfile }) => {
	const [activeTab, setActiveTab] = useState("followers");
	const [followersData, setFollowersData] = useState([]);
	const [followingData, setFollowingData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const showToast = useShowToast();

	useEffect(() => {
		if (isOpen) {
			setActiveTab("followers");
			if (followers?.length > 0) {
				fetchUsersData(followers, setFollowersData);
			}
		}
	}, [isOpen, followers]);

	useEffect(() => {
		if (isOpen && following?.length > 0) {
			fetchUsersData(following, setFollowingData);
		}
	}, [isOpen, following]);

	const fetchUsersData = async (userIds, setData) => {
		if (!userIds || userIds.length === 0) {
			setData([]);
			return;
		}

		setIsLoading(true);
		try {
			const usersRef = collection(firestore, "users");
			const q = query(usersRef, where("uid", "in", userIds));
			const querySnapshot = await getDocs(q);
			
			const users = [];
			querySnapshot.forEach((doc) => {
				users.push(doc.data());
			});
			
			setData(users);
		} catch (error) {
			showToast("Error", "Failed to fetch user data", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		if (tab === "following" && followingData.length === 0 && following?.length > 0) {
			fetchUsersData(following, setFollowingData);
		}
	};

	const renderUserList = (users) => {
		if (isLoading) {
			return (
				<Flex justify="center" py={4}>
					<Spinner size="lg" />
				</Flex>
			);
		}

		if (!users || users.length === 0) {
			return (
				<Flex justify="center" py={4}>
					<Text color="gray.500">No {activeTab} yet</Text>
				</Flex>
			);
		}

		return (
			<VStack spacing={4} align="stretch" maxH="400px" overflowY="auto">
				{users.map((user) => (
					<ChakraLink
						key={user.uid}
						as={RouterLink}
						to={`/${user.username}`}
						onClick={onClose}
						_hover={{ textDecoration: "none" }}
					>
						<HStack spacing={3} p={2} _hover={{ bg: "whiteAlpha.100" }} borderRadius="md">
							<Avatar
								size="md"
								src={user.profilePicURL}
								name={user.fullName || user.username}
							/>
							<VStack align="start" spacing={1} flex={1}>
								<Text fontWeight="bold" fontSize="sm">
									{user.username}
								</Text>
								<Text fontSize="xs" color="gray.400">
									{user.fullName}
								</Text>
							</VStack>
						</HStack>
					</ChakraLink>
				))}
			</VStack>
		);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md">
			<ModalOverlay />
			<ModalContent bg="black" border="1px solid" borderColor="whiteAlpha.300">
				<ModalHeader>
					<Flex gap={4}>
						<Button
							variant="ghost"
							color={activeTab === "followers" ? "blue.400" : "gray.400"}
							onClick={() => handleTabChange("followers")}
							_hover={{ bg: "transparent" }}
							fontSize="sm"
							fontWeight="bold"
						>
							Followers ({followers?.length || 0})
						</Button>
						<Button
							variant="ghost"
							color={activeTab === "following" ? "blue.400" : "gray.400"}
							onClick={() => handleTabChange("following")}
							_hover={{ bg: "transparent" }}
							fontSize="sm"
							fontWeight="bold"
						>
							Following ({following?.length || 0})
						</Button>
					</Flex>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{activeTab === "followers" && renderUserList(followersData)}
					{activeTab === "following" && renderUserList(followingData)}
				</ModalBody>
				<ModalFooter>
					<Button variant="ghost" onClick={onClose} size="sm">
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default FollowersModal;
