import {
	CLEAR_DATA,
	USERS_DATA_LIKES_STATE_CHANGED,
	USERS_DATA_POST_STATE_CHANGED,
	USERS_DATA_STATE_CHANGED,
} from "../constants/contants";

const initialState = {
	users: [],
	usersFollowingLoaded: 0,
	feed: [],
};

export const usersState = (state = initialState, action) => {
	switch (action.type) {
		case USERS_DATA_STATE_CHANGED:
			return { ...state, users: [...state.users, action.payload.user] };
		case USERS_DATA_POST_STATE_CHANGED:

			return {
				...state,
				usersFollowingLoaded: state.usersFollowingLoaded + 1,
				// users: state.users.map((user) =>
				// 	user.id == action.payload.id
				// 		? { ...user, posts: action.payload.posts }
				// 		: user
				// ),
				feed: [...state.feed, ...action.payload.posts],
			};
		case USERS_DATA_LIKES_STATE_CHANGED:
                        

            // console.log(action.payload,state);
			return             {
				...state,	
				feed: state.feed.map((post) =>
					post.id == action.payload.postId
						? { ...post, currentUserLike: action.payload.currentUserLike }
						: post
				),
			};
		case CLEAR_DATA:
			return initialState;
	}
	return state;
};
