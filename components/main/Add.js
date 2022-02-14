import React, { useState, useEffect, useCallback } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button ,
	Image,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function Add({ navigation ,route}) {
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
	const [camStatus, setCamStatus] = useState();
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [camera, setCamera] = useState(null);
	const [imageUri, setImageUri] = useState(null);
	const [galleryPickedImage, setGalleryPickedImage] = useState(null);
	const [isCamera, setIsCamera] = useState(true);
    
	useEffect(() => {
       
		(async () => {
			try {
				const { status } = await Camera.requestCameraPermissionsAsync();
				setHasCameraPermission(status === "granted");

				setCamStatus(status);

				const galleryStatus =
					await ImagePicker.requestMediaLibraryPermissionsAsync();

				setHasGalleryPermission(galleryStatus.status === "granted");
			} catch (e) {
				console.log(e);
			}
		})();
	}, [isCamera]);

	const takePicture = async () => {
		setIsCamera(true);
		setImageUri(null);
		try {
			if (camera) {
				const data = await camera.takePictureAsync(null);
				setImageUri(data.uri);
				setIsCamera(false);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const pickImage = async () => {
		setIsCamera(false);
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			setImageUri(result.uri);
		}
	};

	if (hasCameraPermission === null || hasGalleryPermission == null) {
		return <View />;
	}
	if (hasCameraPermission === false || hasGalleryPermission === false) {
		return <Text>No access to camera</Text>;
	}
	return (
		<View style={styles.container}>
			{isCamera && (
				<Camera
					style={styles.camera}
					type={type}
					ratio="4:3"
					ref={(ref) => setCamera(ref)}
				/>
			)}
			<View style={styles.buttonContainer}>
				<View style={styles.button}>
					<Button color={"#005a00"}
						onPress={() => {
							setType(
								type === Camera.Constants.Type.back
									? Camera.Constants.Type.front
									: Camera.Constants.Type.back
							);
						}}
						title="Flip"
					/>
				</View>
				<View style={styles.button}>
					<Button color={"#005a00"} title="Take picture" onPress={takePicture} />
				</View>
				<View style={styles.button}>
					<Button color={"#005a00"}  title="Pick image from Gallery" onPress={pickImage} />
				</View>
				{imageUri && (
					<View style={styles.button}>
						<Button color={"#005a00"}
							title="Save image"
							onPress={() => navigation.navigate("Save", { imageUri })}
						/>
					</View>
				)}
			</View>
			{imageUri && <Image style={{ flex: 1 }} source={{ uri: imageUri }} />}
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		// flex: 1,
		// backgroundColor: "transparent",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-around",
		// margin: 20,
	},
	button: {
		width: "70%",
		borderRadius: 20,

		overflow: "hidden",
		margin: 10,
		// alignItems: "center",
	},
	text: {
		fontSize: 18,
		color: "black",
	},
});

// export default function ImagePickerExample() {
// 	const [image, setImage] = useState(null);

// 	const pickImage = async () => {
// 		// No permissions request is necessary for launching the image library
// 		let result = await ImagePicker.launchImageLibraryAsync({
// 			mediaTypes: ImagePicker.MediaTypeOptions.All,
// 			allowsEditing: true,
// 			aspect: [4, 3],
// 			quality: 1,
// 		});

// 		console.log(result);

// 		if (!result.cancelled) {
// 			setImage(result.uri);
// 		}
// 	};

// 	return (
// 		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
// 			<Button color={"#005a00"} title="Pick an image from camera roll" onPress={pickImage} />
// 			{image && (
// 				<Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
// 			)}
// 		</View>
// 	);
// }
