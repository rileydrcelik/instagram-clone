import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Input,
	Flex,
	Text,
	Avatar,
	VStack,
	HStack,
	Spinner,
	Link as ChakraLink,
	Box,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";

const SearchModal = ({ isOpen, onClose }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const showToast = useShowToast();

	useEffect(() => {
		const searchUsers = async () => {
			if (!searchQuery || searchQuery.length < 2) {
				setSearchResults([]);
				return;
			}

			setIsSearching(true);
			try {
				const usersRef = collection(firestore, "users");
				const q = query(
					usersRef,
					where("username", ">=", searchQuery.toLowerCase()),
					where("username", "<=", searchQuery.toLowerCase() + "\uf8ff"),
					limit(10)
				);
				
				const querySnapshot = await getDocs(q);
				const users = [];
				
				querySnapshot.forEach((doc) => {
					users.push(doc.data());
				});
				
				// Also search by full name
				const fullNameQuery = query(
					usersRef,
					where("fullName", ">=", searchQuery),
					where("fullName", "<=", searchQuery + "\uf8ff"),
					limit(10)
				);
				
				const fullNameSnapshot = await getDocs(fullNameQuery);
				fullNameSnapshot.forEach((doc) => {
					const userData = doc.data();
					// Avoid duplicates
					if (!users.find(user => user.uid === userData.uid)) {
						users.push(userData);
					}
				});
				
				setSearchResults(users);
			} catch (error) {
				showToast("Error", "Failed to search users", "error");
			} finally {
				setIsSearching(false);
			}
		};

		const timeoutId = setTimeout(() => {
			searchUsers();
		}, 500); // Debounce search

		return () => clearTimeout(timeoutId);
	}, [searchQuery, showToast]);

	const handleUserClick = () => {
		setSearchQuery("");
		setSearchResults([]);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md">
			<ModalOverlay />
			<ModalContent bg="black" border="1px solid" borderColor="whiteAlpha.300">
				<ModalHeader>
					<Text fontSize="lg" fontWeight="bold">
						Search Users
					</Text>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<Input
						placeholder="Search by username or name..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						size="md"
						mb={4}
						bg="gray.800"
						border="1px solid"
						borderColor="whiteAlpha.300"
						_focus={{
							borderColor: "blue.500",
							boxShadow: "0 0 0 1px #3182ce",
						}}
					/>

					{isSearching && (
						<Flex justify="center" py={4}>
							<Spinner size="md" />
						</Flex>
					)}

					{!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
						<Text color="gray.500" textAlign="center" py={4}>
							No users found
						</Text>
					)}

					{searchQuery.length < 2 && (
						<Text color="gray.500" textAlign="center" py={4}>
							Type at least 2 characters to search
						</Text>
					)}

					{searchResults.length > 0 && (
						<VStack spacing={2} align="stretch" maxH="400px" overflowY="auto">
							{searchResults.map((user) => (
								<ChakraLink
									key={user.uid}
									as={RouterLink}
									to={`/${user.username}`}
									onClick={handleUserClick}
									_hover={{ textDecoration: "none" }}
								>
									<HStack spacing={3} p={3} _hover={{ bg: "whiteAlpha.100" }} borderRadius="md">
										<Avatar
											size="md"
											src={user.profilePicURL}
											name={user.fullName || user.username}
										/>
										<VStack align="start" spacing={1} flex={1}>
											<Text fontWeight="bold" fontSize="sm" color="white">
												{user.username}
											</Text>
											<Text fontSize="xs" color="gray.400">
												{user.fullName}
											</Text>
											{user.bio && (
												<Text fontSize="xs" color="gray.500" noOfLines={1}>
													{user.bio}
												</Text>
											)}
										</VStack>
										<Box>
											<Text fontSize="xs" color="gray.500">
												{user.followers?.length || 0} followers
											</Text>
										</Box>
									</HStack>
								</ChakraLink>
							))}
						</VStack>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default SearchModal;
