import React, { useEffect, useState } from "react";
import {
	Button,
	Image,
	TextInput,
	View,
	KeyboardAvoidingView,
	Text,
} from "react-native";
import firebase from "firebase";
import "firebase/firebase-firestore";
import "firebase/firebase-storage";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
const Save = (props) => {
	const [caption, setCaption] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	// const childPath = `post//${Math.random().toString(36)}`;
	const childPath = `post/${
		firebase.auth().currentUser.uid
	}/${Math.random().toString(36)}`;
	useEffect(() => {}, [isLoading]);
	const savePostData = (url) => {
		firebase
			.firestore()
			.collection("posts")
			.doc(firebase.auth().currentUser.uid)
			.collection("userPosts")
			.add({
				likesCount: 0,

				downloadUrl: url,
				caption: caption,
				creation: firebase.firestore.FieldValue.serverTimestamp(),
			})
			.then(() => {
				//Take to main screen
				setIsLoading(false);
				props.navigation?.navigate("Feed");
			});
	};
	const uploadImage = async () => {
		const uri = props.route.params.imageUri;
		try {
			const response = await fetch(uri);
			const blob = await response.blob();
			await firebase.storage().ref().child(childPath).put(blob);

			firebase
				.storage()
				.ref()
				.child(childPath)
				.getDownloadURL()
				.then((responseUrl) => {
					savePostData(responseUrl);
				});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<ScrollView style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<Image
					style={{ aspectRatio: 1 / 1 }}
					source={{ uri: props.route.params.imageUri }}
				/>
			</View>
			{!isLoading ? (
				<View>
					<View>
						<TextInput
							style={{
								paddingHorizontal: 3,
								paddingVertical: 5,
								borderBottomColor: "#ccc",
								borderBottomWidth: 1,
								marginHorizontal: 20,
								marginVertical: 10,
							}}
							placeholder="Write a caption ..."
							onChangeText={(text) => setCaption(text)}
						/>
					</View>
					<View
						style={{
							marginVertical: 20,
							borderRadius: 20,
							overflow: "hidden",
							marginHorizontal: 50,
							justifyContent: "center",
						}}
					>
						<Button
							color={"#005a00"}
							title="Discard"
							onPress={() => {
								props.navigation.navigate("Feed");
							}}
						/>
					</View>
					<View
						style={{
							// marginVertical: 20,
							borderRadius: 20,
							overflow: "hidden",
							marginHorizontal: 50,
							justifyContent: "center",
						}}
					>
						<Button
							color={"#005a00"}
							title="Save"
							onPress={() => {
								setIsLoading(true);
								uploadImage();
							}}
						/>
					</View>
				</View>
			) : (
				<View style={{ alignItems: "center", marginVertical: 15 }}>
					<ActivityIndicator color="#ccc" size={"small"} />
					<View style={{ marginVertical: 15 }}>
						<Text style={{ fontSize: 18, color: "grey" }}>Saving ...</Text>
					</View>
				</View>
			)}
		</ScrollView>
	);
};

export default Save;
