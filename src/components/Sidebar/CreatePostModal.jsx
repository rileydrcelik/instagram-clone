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
	Textarea,
	Image,
	VStack,
	HStack,
	Icon,
	useToast,
	Progress,
	Spinner,
} from "@chakra-ui/react";
import { useState, useRef, useCallback } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection, updateDoc, arrayUnion } from "firebase/firestore";
import { storage, firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";
import useShowToast from "../../hooks/useShowToast";
import { MdAddPhotoAlternate, MdClose } from "react-icons/md";

const CreatePostModal = ({ isOpen, onClose }) => {
	const [step, setStep] = useState(1); // 1: Upload, 2: Caption
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [imagePreviews, setImagePreviews] = useState([]);
	const [caption, setCaption] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const fileRef = useRef(null);
	const { user } = useAuthStore();
	const showToast = useShowToast();
	const toast = useToast();

	const handleFileSelect = useCallback((files) => {
		const validFiles = Array.from(files).filter(file => 
			file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
		);

		if (validFiles.length === 0) {
			showToast("Error", "Please select valid image files (max 10MB each)", "error");
			return;
		}

		if (validFiles.length > 10) {
			showToast("Error", "Maximum 10 images allowed", "error");
			return;
		}

		setSelectedFiles(validFiles);
		
		// Create previews
		const previews = validFiles.map(file => {
			const reader = new FileReader();
			return new Promise((resolve) => {
				reader.onload = (e) => resolve(e.target.result);
				reader.readAsDataURL(file);
			});
		});

		Promise.all(previews).then(setImagePreviews);
		
		// Auto advance to caption step if files selected
		if (validFiles.length > 0) {
			setTimeout(() => setStep(2), 500);
		}
	}, [showToast]);

	const handleDragOver = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		const files = e.dataTransfer.files;
		handleFileSelect(files);
	}, [handleFileSelect]);

	const removeImage = (index) => {
		const newFiles = selectedFiles.filter((_, i) => i !== index);
		const newPreviews = imagePreviews.filter((_, i) => i !== index);
		setSelectedFiles(newFiles);
		setImagePreviews(newPreviews);
		
		if (newFiles.length === 0) {
			setStep(1);
		}
	};

	const uploadImages = async () => {
		if (selectedFiles.length === 0) return [];

		const uploadPromises = selectedFiles.map((file, index) => {
			const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}-${index}`);
			const uploadTask = uploadBytesResumable(storageRef, file);

			return new Promise((resolve, reject) => {
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						setUploadProgress(progress);
					},
					(error) => {
						reject(error);
					},
					async () => {
						try {
							const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
							resolve(downloadURL);
						} catch (error) {
							reject(error);
						}
					}
				);
			});
		});

		return Promise.all(uploadPromises);
	};

	const uploadPostToStorage = async (postData) => {
		const postJson = JSON.stringify(postData);
		const postBlob = new Blob([postJson], { type: 'application/json' });
		const postRef = ref(storage, `posts/${user.uid}/post-${Date.now()}.json`);
		
		const uploadTask = uploadBytesResumable(postRef, postBlob);
		
		return new Promise((resolve, reject) => {
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setUploadProgress(progress);
				},
				(error) => {
					reject(error);
				},
				async () => {
					try {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
						resolve(downloadURL);
					} catch (error) {
						reject(error);
					}
				}
			);
		});
	};

	const handleCreatePost = async () => {
		if (selectedFiles.length === 0) {
			showToast("Error", "Please select at least one image", "error");
			return;
		}

		setIsUploading(true);
		try {
			// Upload images to Firebase Storage
			const imageURLs = await uploadImages();

			// Create post data
			const postData = {
				createdBy: user.uid,
				createdByUsername: user.username,
				createdByProfilePic: user.profilePicURL,
				caption: caption.trim(),
				imageURLs: imageURLs,
				likes: [],
				comments: [],
				createdAt: Date.now(),
				postId: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
			};

			// Store post data directly in Firestore
			const postRef = doc(collection(firestore, 'posts'));
			await setDoc(postRef, postData);

			// Update user's posts array in Firestore (store the post document ID)
			await updateDoc(doc(firestore, "users", user.uid), {
				posts: arrayUnion(postRef.id)
			});

			showToast("Success", "Post created successfully!", "success");
			
			// Reset form and close modal
			setSelectedFiles([]);
			setImagePreviews([]);
			setCaption("");
			setStep(1);
			setUploadProgress(0);
			onClose();
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsUploading(false);
		}
	};

	const handleClose = () => {
		if (!isUploading) {
			setSelectedFiles([]);
			setImagePreviews([]);
			setCaption("");
			setStep(1);
			setUploadProgress(0);
			onClose();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} size="2xl" closeOnOverlayClick={!isUploading}>
			<ModalOverlay />
			<ModalContent bg="black" border="1px solid" borderColor="whiteAlpha.300">
				<ModalHeader>
					<Flex justify="space-between" align="center">
						<Text fontSize="lg" fontWeight="bold">
							{step === 1 ? "Create new post" : "Create new post"}
						</Text>
						{step === 2 && (
							<Button
								size="sm"
								variant="ghost"
								onClick={() => setStep(1)}
								_hover={{ bg: "whiteAlpha.100" }}
							>
								Back
							</Button>
						)}
					</Flex>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					{step === 1 && (
						<Box>
							{imagePreviews.length === 0 ? (
								<Box
									border="2px dashed"
									borderColor="gray.600"
									borderRadius="lg"
									p={12}
									textAlign="center"
									onDragOver={handleDragOver}
									onDrop={handleDrop}
									_hover={{ borderColor: "blue.400" }}
									cursor="pointer"
									onClick={() => fileRef.current?.click()}
								>
									<Icon as={MdAddPhotoAlternate} boxSize={16} color="gray.500" mb={4} />
									<Text fontSize="xl" fontWeight="bold" mb={2}>
										Drag photos and videos here
									</Text>
									<Button colorScheme="blue" size="sm">
										Select from computer
									</Button>
									<input
										type="file"
										hidden
										ref={fileRef}
										multiple
										accept="image/*"
										onChange={(e) => handleFileSelect(e.target.files)}
									/>
								</Box>
							) : (
								<VStack spacing={4}>
									<Text fontSize="md" fontWeight="semibold">
										Selected photos ({imagePreviews.length})
									</Text>
									<Box
										display="grid"
										gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))"
										gap={4}
										w="full"
									>
										{imagePreviews.map((preview, index) => (
											<Box key={index} position="relative">
												<Image
													src={preview}
													alt={`Preview ${index + 1}`}
													objectFit="cover"
													borderRadius="md"
													boxSize="120px"
												/>
												<Button
													position="absolute"
													top={2}
													right={2}
													size="sm"
													bg="red.500"
													color="white"
													_hover={{ bg: "red.600" }}
													onClick={() => removeImage(index)}
													boxSize={8}
													borderRadius="full"
													p={0}
												>
													<Icon as={MdClose} boxSize={4} />
												</Button>
											</Box>
										))}
									</Box>
								</VStack>
							)}
						</Box>
					)}

					{step === 2 && (
						<VStack spacing={4} align="stretch">
							{/* Image Preview */}
							<Box>
								<Text fontSize="md" fontWeight="semibold" mb={3}>
									Your photos
								</Text>
								<Box
									display="grid"
									gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
									gap={2}
									maxH="200px"
									overflowY="auto"
								>
									{imagePreviews.map((preview, index) => (
										<Image
											key={index}
											src={preview}
											alt={`Preview ${index + 1}`}
											objectFit="cover"
											borderRadius="md"
											boxSize="100px"
										/>
									))}
								</Box>
							</Box>

							{/* Caption Input */}
							<Box>
								<Text fontSize="md" fontWeight="semibold" mb={3}>
									Write a caption...
								</Text>
								<Textarea
									placeholder="Write a caption..."
									value={caption}
									onChange={(e) => setCaption(e.target.value)}
									size="md"
									bg="gray.800"
									border="1px solid"
									borderColor="whiteAlpha.300"
									_focus={{
										borderColor: "blue.500",
										boxShadow: "0 0 0 1px #3182ce",
									}}
									rows={4}
									resize="none"
								/>
								<Text fontSize="xs" color="gray.500" mt={2}>
									{caption.length}/2,200 characters
								</Text>
							</Box>
						</VStack>
					)}

					{isUploading && (
						<Box mt={4}>
							<Flex align="center" gap={3}>
								<Spinner size="sm" />
								<Text fontSize="sm">Uploading your post...</Text>
							</Flex>
							<Progress value={uploadProgress} size="sm" colorScheme="blue" mt={2} />
						</Box>
					)}
				</ModalBody>

				{step === 2 && (
					<ModalFooter>
						<HStack spacing={3}>
							<Button
								variant="ghost"
								onClick={handleClose}
								disabled={isUploading}
							>
								Cancel
							</Button>
							<Button
								colorScheme="blue"
								onClick={handleCreatePost}
								isLoading={isUploading}
								loadingText="Sharing..."
								disabled={isUploading}
							>
								Share Post
							</Button>
						</HStack>
					</ModalFooter>
				)}
			</ModalContent>
		</Modal>
	);
};

export default CreatePostModal;
