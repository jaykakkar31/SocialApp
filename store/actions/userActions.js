import firebase from "firebase";
import {
	USERS_DATA_STATE_CHANGED,
	USER_FOLLOWING_STATE_CHANGED,
	USER_POST_STATE_CHANGED,
	USER_STATE_CHANGED,
	USERS_DATA_POST_STATE_CHANGED,
	CLEAR_DATA,
	USERS_DATA_LIKES_STATE_CHANGED,
} from "../constants/contants";

export const clearData = () => {
	return (dispatch) => {
		dispatch({ type: CLEAR_DATA });
	};
};

export const fetchUser = (user) => {
	return (dispatch) => {
		firebase
			.firestore()
			.collection("users")
			.doc(user)
			.get()
			.then((doc) => {
				if (doc.exists) {
					dispatch({
						type: USER_STATE_CHANGED,
						payload: { currentUser: doc.data() },
					});
				} else {
					console.log("Snapshot doesnt exist");
				}
			});
	};
};

export const fetchUserPosts = () => {
	return (dispatch, getState) => {
		firebase
			.firestore()
			.collection("posts")
			.doc(firebase?.auth().currentUser.uid)
			.collection("userPosts")
			.orderBy("creation", "asc")
			.get()
			.then((snapshot) => {
				let posts = snapshot.docs.map((doc) => {
					const data = doc.data();
					const id = doc.id;
					return { id, ...data };
				});

				dispatch({
					type: USER_POST_STATE_CHANGED,
					payload: { posts: posts },
				});
			});
	};
};

export const reload=()=>{
    return dispatch=>{
        dispatch(clearData());
				dispatch(fetchUser(firebase?.auth().currentUser.uid));
				dispatch(fetchUserPosts());
				dispatch(fetchUserFollowing());
    }
}

export const fetchUserFollowing = () => {
	return (dispatch) => {
		firebase
			.firestore()
			.collection("following")
			.doc(firebase?.auth().currentUser.uid)
			.collection("userFollowing")
			.onSnapshot((snapshot) => {
				let following = snapshot.docs.map((doc) => {
					const id = doc.id;
					return id;
				});

				dispatch({
					type: USER_FOLLOWING_STATE_CHANGED,
					payload: { following: following },
				});
				for (let i = 0; i < following.length; i++) {
					dispatch(fetchUserData(following[i], true));
				}
			});
	};
};

export const fetchUserData = (id, getPost) => {
	return (dispatch, getState) => {
		//some give boolean and find gives value
		const found = getState().usersState.users.some((item) => item.id === id);
		if (!found) {
			firebase
				.firestore()
				.collection("users")
				.doc(id)
				.get()
				.then((doc) => {
					if (doc.exists) {
						let user = doc.data();
						user.id = doc.id;
						dispatch({
							type: USERS_DATA_STATE_CHANGED,
							payload: { user: user },
						});
					} else {
						console.log("Snapshot doesnt exist");
					}
					if (getPost) {
						dispatch(fetchUsersFollowingPosts(id));
					}
				});
		}
	};
};
export const fetchUsersFollowingPosts = (uid) => {
	return (dispatch, getState) => {
		firebase
			.firestore()
			.collection("posts")
			.doc(uid)
			.collection("userPosts")
			.orderBy("creation", "asc")
			.get()
			.then((snapshot) => {
				try {
					const id = snapshot.docs[0].ref.path.split("/")[1];
					const user = getState().usersState.users.find(
						(item) => item.id === id
					);

					let posts = snapshot.docs.map((doc) => {
						const data = doc.data();
						const id = doc.id;
						return { id, ...data, user };
					});
					for (let i = 0; i < posts.length; i++) {
						dispatch(fetchUsersFollowingLikes(uid, posts[i].id));
					}

					dispatch({
						type: USERS_DATA_POST_STATE_CHANGED,
						payload: { posts: posts, id: id },
					});
				} catch (e) {
					console.log(e);
				}
			});
	};
};

export const fetchUsersFollowingLikes = (uid, postId) => {
	return (dispatch, getState) => {
        console.log(postId,"INITIAL");
		try {
			firebase
				.firestore()
				.collection("posts")
				.doc(uid)
				.collection("userPosts")
				.doc(postId)
				.collection("likes")
				// .orderBy("creation", "asc")
				.doc(firebase?.auth().currentUser.uid)
				//realtime
				.onSnapshot((snapshot) => {
					try {
						const Id = snapshot.id;
// console.log("KJ",snapshot,"JU");
						let currentUserLike = false;
						if (snapshot.exists) {
							currentUserLike = true;
						}

						dispatch({
							type: USERS_DATA_LIKES_STATE_CHANGED,
							payload: { postId: postId, currentUserLike: currentUserLike },
						});
					} catch (e) {
						console.log(e, "LIKE");
					}
				});
		} catch (e) {
			console.log(e.message);
		}
	};
};
