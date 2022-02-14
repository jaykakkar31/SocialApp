import { combineReducers,createStore ,applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import { usersReducer } from "./reducers/user";
import { usersState } from "./reducers/usersCheck";
const reducers = combineReducers({
	usersReducer: usersReducer,
    usersState:usersState
});

const store=createStore(reducers,applyMiddleware(thunk))
export default store