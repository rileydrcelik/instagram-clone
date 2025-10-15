import {
	Avatar,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Textarea,
	useDisclosure,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import useUserProfileStore from "../../store/userProfileStore";
import { updateUserPostsProfilePic } from "../../utils/updateUserPostsProfilePic";

const EditProfile = ({ isOpen, onClose }) => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		bio: "",
	});
	const [selectedFile, setSelectedFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const fileRef = useRef(null);
	const showToast = useShowToast();
	const { user, setUser } = useAuthStore();
	const { setUserProfile } = useUserProfileStore();
	const [isUpdating, setIsUpdating] = useState(false);

	// Initialize form with current user data
	useEffect(() => {
		if (user) {
			setInputs({
				fullName: user.fullName || "",
				username: user.username || "",
				bio: user.bio || "",
			});
			setImagePreview(user.profilePicURL || "");
		}
	}, [user]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setInputs((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isUpdating) return;

		setIsUpdating(true);

		try {
			let profilePicURL = user.profilePicURL;

			// Upload new profile picture if selected
			let profilePicChanged = false;
			if (selectedFile) {
				const imageRef = ref(storage, `profilePics/${user.uid}`);
				const imageData = imagePreview;
				await uploadString(imageRef, imageData, "data_url");
				profilePicURL = await getDownloadURL(imageRef);
				profilePicChanged = true;
			}

			// Update user document in Firestore
			const userRef = doc(firestore, "users", user.uid);
			await updateDoc(userRef, {
				fullName: inputs.fullName,
				username: inputs.username,
				bio: inputs.bio,
				profilePicURL: profilePicURL,
			});

			// Update local state
			const updatedUser = {
				...user,
				fullName: inputs.fullName,
				username: inputs.username,
				bio: inputs.bio,
				profilePicURL: profilePicURL,
			};

			setUser(updatedUser);
			setUserProfile(updatedUser);
			localStorage.setItem("user-info", JSON.stringify(updatedUser));

			// Update all user's posts with new profile picture if it changed
			if (profilePicChanged) {
				try {
					await updateUserPostsProfilePic(user.uid, profilePicURL);
				} catch (error) {
					console.error('Error updating posts with new profile picture:', error);
					// Don't show error to user as profile was still updated successfully
				}
			}

			showToast("Success", "Profile updated successfully", "success");
			onClose();
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleCancel = () => {
		// Reset form to original values
		if (user) {
			setInputs({
				fullName: user.fullName || "",
				username: user.username || "",
				bio: user.bio || "",
			});
			setImagePreview(user.profilePicURL || "");
		}
		setSelectedFile(null);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleCancel} size="lg">
			<ModalOverlay />
			<ModalContent bg={"black"} boxShadow={"xl"} border={"1px solid gray"} mx={3}>
				<ModalHeader />
				<ModalCloseButton />
				<ModalBody>
					<Flex bg={"black"}>
						<Stack spacing={4} w={"full"} maxW={"md"} bg={"black"} p={6} my={0}>
							<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
								Edit Profile
							</Heading>
							<form onSubmit={handleSubmit}>
								<FormControl>
									<Stack direction={["column", "row"]} spacing={6}>
										<Center>
											<Avatar
												size="xl"
												src={imagePreview}
												name={inputs.fullName || inputs.username}
												border={"2px solid white"}
											/>
										</Center>
										<Center w="full">
											<Button
												w="full"
												onClick={() => fileRef.current?.click()}
												type="button"
											>
												Edit Profile Picture
											</Button>
											<input
												type="file"
												hidden
												ref={fileRef}
												onChange={handleImageChange}
												accept="image/*"
											/>
										</Center>
									</Stack>
								</FormControl>

								<FormControl>
									<FormLabel fontSize={"sm"}>Full Name</FormLabel>
									<Input
										placeholder={"Full Name"}
										size={"sm"}
										type={"text"}
										name="fullName"
										value={inputs.fullName}
										onChange={handleInputChange}
									/>
								</FormControl>

								<FormControl>
									<FormLabel fontSize={"sm"}>Username</FormLabel>
									<Input
										placeholder={"Username"}
										size={"sm"}
										type={"text"}
										name="username"
										value={inputs.username}
										onChange={handleInputChange}
									/>
								</FormControl>

								<FormControl>
									<FormLabel fontSize={"sm"}>Bio</FormLabel>
									<Textarea
										placeholder={"Bio"}
										size={"sm"}
										name="bio"
										value={inputs.bio}
										onChange={handleInputChange}
										rows={3}
									/>
								</FormControl>

								<Stack spacing={6} direction={["column", "row"]}>
									<Button
										bg={"red.400"}
										color={"white"}
										w="full"
										size="sm"
										_hover={{ bg: "red.500" }}
										onClick={handleCancel}
										type="button"
									>
										Cancel
									</Button>
									<Button
										bg={"blue.400"}
										color={"white"}
										size="sm"
										w="full"
										_hover={{ bg: "blue.500" }}
										type="submit"
										isLoading={isUpdating}
									>
										Submit
									</Button>
								</Stack>
							</form>
						</Stack>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default EditProfile;
