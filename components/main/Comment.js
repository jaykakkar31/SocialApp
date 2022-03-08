import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import { FlatList } from "react-native";
import { TextInput, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../store/actions/userActions";
const Comment = (props) => {
	const [comments, setComments] = useState([]);
	const [postId, setPostId] = useState("");
	const [text, setText] = useState("");
	const dispatch = useDispatch();
	const usersState = useSelector((state) => state.usersState);
	const [refresh, setRefresh] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { users } = usersState;
	// props.route.params.postId
	useEffect(() => {
		getComments();
	}, [props.route.params.postId, users, refresh,comments]);

	const matchUserToComment = (comments) => {
		for (let i = 0; i < comments.length; i++) {
			if (comments[i].hasOwnProperty("user")) {
				continue;
			}
			const user = users.find((x) => x.id === comments[i].creator);
			// setRefresh(true);
			if (user == undefined) {
				dispatch(fetchUserData(comments[i].creator, false));
			} else {
				//adding user attribute to user
				comments[i].user = user;
				// setRefresh(true)
			}
		}
		setComments(comments);
		setRefresh(false);
	};
	const getComments = () => {
		setIsLoading(true);
		if (props.route.params.postId !== postId || refresh) {
			firebase
				.firestore()
				.collection("posts")
				.doc(props.route.params.id)
				.collection("userPosts")
				.doc(props.route.params.postId)
				.collection("comments")
				.get()
				.then((snapshot) => {
					let comments = snapshot.docs.map((doc) => {
						let data = doc.data();
						const id = doc.id;
						return { id, ...data };
					});
					matchUserToComment(comments);
				});

			setPostId(props.route.params.postId);
		} else {
			matchUserToComment(comments);
		}
	};
	const sendComment = () => {
		firebase
			.firestore()
			.collection("posts")
			.doc(props.route.params.id)
			.collection("userPosts")
			.doc(props.route.params.postId)
			.collection("comments")
			.add({
				creator: firebase?.auth().currentUser.uid,
				text: text,
			})
			.then((response) => {
				setText("");
				setRefresh(true);
			});
	};
	if (comments.length===0) {
		return (
			<View style={{flex:1,justifyContent:"center"}}>
				<ActivityIndicator color={"grey"} size="large" />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			{comments.length!==0 && (
				<FlatList
					numColumns={1}
					data={comments}
					horizontal={false}
					renderItem={(itemData) => {
						return (
							itemData.item.user !== undefined && (
								<View
									style={{
										marginVertical: 8,
										borderColor: "#ccc",
										borderWidth: 1,
										padding: 10,
										marginHorizontal: 10,
										borderRadius: 10,
									}}
								>
									{itemData.item.user && (
										<Text
											style={{
												fontSize: 18,
												fontWeight: "700",
												color: "#005a00",
											}}
										>
											{itemData.item.user.name}
										</Text>
									)}
									<Text style={{ fontSize: 16, color: "#0c8900" }}>
										{itemData.item.text}
									</Text>
								</View>
							)
						);
					}}
				/>
			)}

			<View>
				<TextInput
					value={text}
					style={{
						borderBottomColor: "#ccc",
						borderBottomWidth: 1,
						marginVertical: 10,
						paddingVertical: 5,
						paddingHorizontal: 3,
						marginHorizontal: 20,
					}}
					placeholder="Comment ..."
					onChangeText={(text) => {
						setText(text);
					}}
				/>
				<View
					style={{
						marginHorizontal: 70,
						marginVertical: 15,
						borderRadius: 20,
						overflow: "hidden",
					}}
				>
					<Button title="Post"color={"#005a00"} onPress={sendComment} />
				</View>
			</View>
		</View>
	);
};

export default Comment;
