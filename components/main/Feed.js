import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Button,
	FlatList,
	Image,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
    RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import { AntDesign, FontAwesome, Fontisto } from "@expo/vector-icons";

import "firebase/firestore";
import {
	clearData,
	fetchUser,
	fetchUserFollowing,
	fetchUserPosts,
	reload,
} from "../../store/actions/userActions";
const Feed = (props) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const [userPosts, setUserPosts] = useState([]);

	const userState = useSelector((state) => state.usersState);
	const { users, usersFollowingLoaded, feed } = userState;
	const [posts, setPosts] = useState([]);
	const usersReducer = useSelector((state) => state.usersReducer);
	const { currentUser, following } = usersReducer;
	const [likeCheck, setLikeCheck] = useState(0);
	const [refresh, setRefresh] = useState(false);
	const [id, setId] = useState();
	const dispatch = useDispatch();
	useEffect(() => {
		if (usersFollowingLoaded == following.length && following.length !== 0) {
			feed.sort((x, y) => {
				return x.creation - y.creation;
			});
			setPosts(feed);
		}

		setIsLoading(false);
	}, [usersFollowingLoaded, feed]);

	useEffect(() => {
		const update = async () => {
			dispatch(reload());
			if (usersFollowingLoaded == following.length && following.length !== 0) {
				await feed.sort((x, y) => {
					return x.creation - y.creation;
				});
				setPosts(feed);
				setRefresh(false);
			}
		};

		if (refresh) {
			update();
		}
	}, [dispatch, refresh]);
	const likeHandler = (uid, postId) => {
		firebase
			.firestore()
			.collection("posts")
			.doc(uid)
			.collection("userPosts")
			.doc(postId)
			.collection("likes")
			// .orderBy("creation", "asc")
			.doc(firebase.auth().currentUser.uid)
			.set({});

		firebase
			.firestore()
			.collection("posts")
			.doc(uid)
			.collection("userPosts")
			.doc(postId)

			.update({ likesCount: firebase.firestore.FieldValue.increment(1) })
			.then(() => {
				setRefresh(true);
			});
	};
	const dislikeHandler = (uid, postId) => {
		firebase
			.firestore()
			.collection("posts")
			.doc(uid)
			.collection("userPosts")
			.doc(postId)
			.collection("likes")
			// .orderBy("creation", "asc")
			.doc(firebase.auth().currentUser.uid)
			.delete();
		firebase
			.firestore()
			.collection("posts")
			.doc(uid)
			.collection("userPosts")
			.doc(postId)

			.update({ likesCount: firebase.firestore.FieldValue.increment(-1) })
			.then(() => {
				setRefresh(true);
			});
	};
	return isLoading ? (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<ActivityIndicator color={"#000"} size={"large"} />
		</View>
	) : posts ? (
		<View style={styles.container}>
			<View style={styles.containerGallery}>
				<FlatList
					refreshControl={
						<RefreshControl
							refreshing={isLoading}
							onRefresh={() => {
								setIsLoading(true);
								dispatch(reload());
							}}
						/>
					}
					style={{ flex: 1 }}
					data={posts}
					numColumns={1}
					renderItem={(itemData) => {
						return (
							<View style={styles.imageContainer}>
								<View
									style={{
										marginVertical: 10,
										flex: 1,
										marginHorizontal: 20,
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<FontAwesome name="user-circle" size={30} color="#0c8900" />
									<Text
										style={{
											fontWeight: "700",
											fontSize: 18,
											marginLeft: 10,
											color: "#005a00",
										}}
									>
										{itemData.item.user.name}
									</Text>
								</View>
								<View style={{ flex: 1, backgroundColor: "#000" }}>
									{itemData.item.downloadUrl ? (
										<Image
											style={styles.image}
											source={{ uri: itemData.item.downloadUrl }}
										/>
									) : (
										<View style={{ flex: 1 }}>
											<ActivityIndicator color={"#005a00"} size="large" />
										</View>
									)}
								</View>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									{itemData.item.currentUserLike ? (
										<TouchableOpacity
											style={{ marginHorizontal: 20, marginVertical: 10 }}
											onPress={() =>
												dislikeHandler(itemData.item.user.id, itemData.item.id)
											}
										>
											<AntDesign name="heart" size={24} color="red" />
										</TouchableOpacity>
									) : (
										<TouchableOpacity
											style={{ marginHorizontal: 20, marginVertical: 10 }}
											onPress={() =>
												likeHandler(itemData.item.user.id, itemData.item.id)
											}
										>
											<AntDesign name="hearto" size={24} color="#005a00" />
										</TouchableOpacity>
									)}
									<TouchableOpacity
										onPress={() => {
											props.navigation.navigate("Comments", {
												id: itemData.item.user.id,
												postId: itemData.item.id,
											});
										}}
									>
										<Fontisto name="comment" size={24} color="#005a00" />
									</TouchableOpacity>
								</View>
								{/* {refresh && itemData.item.likesCount ? (
									<ActivityIndicator color={"grey"} size="small" />
								) : ( */}
								<View style={{ marginBottom: 10, marginLeft: 20 }}>
									<Text style={{ fontWeight: "700", color: "#005a00" }}>
										{itemData.item.likesCount} Likes
									</Text>
								</View>
								{/* )} */}

								<View
									style={{
										borderBottomWidth: 1,
										borderBottomColor: "#ccc",
										// marginTop: 10,
									}}
								></View>
							</View>
						);
					}}
					horizontal={false}
				/>
			</View>
		</View>
	) : (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontSize: 16 }}>Starting following users ...</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	containerInfo: { margin: 10 },
	containerGallery: { flex: 1 },
	image: { flex: 1, aspectRatio: 1 / 1, backgroundColor: "#000" },
	imageContainer: {
		flex: 1 / 3,
	},
});
export default Feed;
