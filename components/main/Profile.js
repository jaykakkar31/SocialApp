import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Button,
	FlatList,
	Image,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import * as Updates from "expo-updates";

import { clearData, reload } from "../../store/actions/userActions";
const Profile = (props) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const usersReducer = useSelector((state) => state.usersReducer);
	const { currentUser, posts, following: follow } = usersReducer;
	const [userPosts, setUserPosts] = useState([]);
	const dispatch = useDispatch();
	const [following, setFollowing] = useState(false);
	useEffect(() => {
		if (firebase?.auth()?.currentUser.uid == props.route.params.id) {
			setUser(currentUser);
			setUserPosts(posts);
			setIsLoading(false);
		} else {
			firebase
				.firestore()
				.collection("users")
				.doc(props.route.params.id)
				.get()
				.then((doc) => {
					if (doc.exists) {
						setUser(doc.data());
					} else {
						console.log("Snapshot doesnt exist");
					}
					setIsLoading(false);
				});

			firebase
				.firestore()
				.collection("posts")
				.doc(props.route.params.id)
				.collection("userPosts")
				.orderBy("creation", "asc")
				.get()
				.then((snapshot) => {
					let posts = snapshot.docs.map((doc) => {
						const data = doc.data();
						const id = doc.id;
						return { id, ...data };
					});

					setUserPosts(posts);
					setIsLoading(false);
				});
		}
		if (follow.length != 0) {
			if (follow.indexOf(props.route.params.id > -1)) {
				setFollowing(true);
			} else {
				setFollowing(false);
			}
		} else {
			setFollowing(false);
		}
	}, [props.route.params.id, follow]);

	const unFollowHandler = () => {
		firebase
			.firestore()
			.collection("following")
			.doc(firebase?.auth().currentUser.uid)
			.collection("userFollowing")
			.doc(props.route.params.id)
			.delete();
	};
	const followHandler = () => {
		firebase
			.firestore()
			.collection("following")
			.doc(firebase?.auth().currentUser.uid)
			.collection("userFollowing")
			.doc(props.route.params.id)
			.set({});
	};
	const logoutHandler = () => {
		firebase
			.auth()
			.signOut()
		// 	.then(() => {
				// dispatch(clearData())

			// });

		// Updates.reloadAsync();
	};

	return isLoading ? (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<ActivityIndicator color={"#000"} size={"large"} />
		</View>
	) : (
		<View style={styles.container}>
			{user ? (
				<View style={styles.containerInfo}>
					<View style={{ marginVertical: 10 }}>
						<FontAwesome name="user-circle" size={60} color="#0c8900" />
					</View>

					<View style={{ alignItems: "center" }}>
						<Text style={{ fontSize: 19, fontWeight: "700", color: "#005a00" }}>
							{user.name}
						</Text>
						<Text style={{ color: "#0c8900" }}>{user.email}</Text>
					</View>
				</View>
			) : (
				dispatch(reload())
			)}
			<View style={{ marginVertical: 10, width: "100%", alignItems: "center" }}>
				{firebase?.auth().currentUser.uid !== props.route.params.id ? (
					following ? (
						<Button
							color={"#005a00"}
							title="Following"
							onPress={unFollowHandler}
						/>
					) : (
						<Button color={"#005a00"} title="follow" onPress={followHandler} />
					)
				) : (
					<View style={{ borderRadius: 20, width: "50%", overflow: "hidden" }}>
						<Button color={"#005a00"} title="Logout" onPress={logoutHandler} />
					</View>
				)}
			</View>
			<View style={styles.containerGallery}>
				<FlatList
					data={userPosts}
					numColumns={3}
					renderItem={(itemData) => {
						return (
							<View style={styles.imageContainer}>
								<Image
									style={styles.image}
									source={{ uri: itemData.item.downloadUrl }}
								/>
							</View>
						);
					}}
					horizontal={false}
				/>
			</View>
		</View>
	);
};

Profile.navigationOptions = (navData) => {
	console.log(navData);
	return {
		title: "Add Product",
		// headerRight: () => (
		// 	<TouchableOpacity onPress={submit}>
		// 		<View style={{ paddingRight: 15 }}>
		// 			<Ionicons name="ios-checkmark" size={23} color="white" />
		// 		</View>
		// 	</TouchableOpacity>
		// ),
	};
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	containerInfo: { marginVertical: 10, alignItems: "center" },
	containerGallery: { flex: 1, marginTop: 10 },
	image: { flex: 1, aspectRatio: 1 / 1 },
	imageContainer: {
		flex: 1 / 3,
	},
});
export default Profile;
