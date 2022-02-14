import {
	CLEAR_DATA,
	USER_FOLLOWING_STATE_CHANGED,
	USER_POST_STATE_CHANGED,
	USER_STATE_CHANGED,
} from "../constants/contants";

const initialState = {
	currentUser: null,
	posts: [],
	following: [],
};

export const usersReducer = (state = initialState, action) => {
	switch (action.type) {
		case USER_STATE_CHANGED:
			return { ...state, currentUser: action.payload.currentUser };
		case USER_POST_STATE_CHANGED:
			return { ...state, posts: action.payload.posts };
		case USER_FOLLOWING_STATE_CHANGED:
			return { ...state, following: action.payload.following };
		case CLEAR_DATA:
			return initialState;
	}
	return state;
};
