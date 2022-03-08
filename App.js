import React, { useEffect, useState } from "react";
import {
	getFocusedRouteNameFromRoute,
	NavigationContainer,
} from "@react-navigation/native";
// import { useDispatch } from "react-redux";
// import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "./components/auth/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { initializeApp } from "firebase/app";
import * as firebase from "firebase";
import { ActivityIndicator, LogBox, SafeAreaView, StatusBar, View } from "react-native";
import { Provider, useDispatch } from "react-redux";
import store from "./store/store";
import MainScreen from "./components/Main";
import Add from "./components/main/Add";
import Profile from "./components/main/Profile";
import { enableScreens } from "react-native-screens";
import Save from "./components/main/Save";
import Search from "./components/main/Search";
import Comment from "./components/main/Comment";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const firebaseConfig = {
	apiKey: "AIzaSyD-TD3MgxPP2irZqlIGGvZ4UpV0qXMOaRM",
	authDomain: "insta-9202e.firebaseapp.com",
	projectId: "insta-9202e",
	storageBucket: "insta-9202e.appspot.com",
	messagingSenderId: "1003132060239",
	appId: "1:1003132060239:web:039db30a1c30e386f2a03a",
	measurementId: "G-BTK001LKLR",
};

enableScreens();
const Stack = createStackNavigator();

export default function App() {
	// firebaseConfig
	LogBox.ignoreLogs(["Warning: ..."]);
	LogBox.ignoreAllLogs();
    // const dispatch=useDispatch()
	const [isLoading, setIsLoading] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);
	useEffect(() => {
		if (firebase.apps.length === 0) {
			firebase.initializeApp(firebaseConfig);
		}
		firebase?.auth().onAuthStateChanged((user) => {
			if (!user) {
                // dispatch(clearData())
				setLoggedIn(false);

				setIsLoading(false);
			} else {
				setLoggedIn(true);
				setIsLoading(false);
			}
		});
	});
	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator color={"#000"} size={"large"} />
			</View>
		);
	}
	if (!loggedIn) {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Landing">
					
                    <Stack.Screen
						name="Login"
						component={Login}
						options={{
							headerStyle: {
								backgroundColor: "#005a00",
							},
							headerTintColor: "white",
						}}/>
					<Stack.Screen
						name="Register"
						component={Register}
						options={{
							headerStyle: {
								backgroundColor: "#005a00",
							},
							headerTintColor: "white",
						}}
					/>
					
				</Stack.Navigator>
			</NavigationContainer>
		);
	}

	return (
		<Provider store={store}>
        <StatusBar backgroundColor={"#005a00"}/>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Main">
					<Stack.Screen
						name="Main"
						component={MainScreen}
						// options={{
						// 	headerStyle: {
						// 		backgroundColor: "#005a00",
						// 	},
						// 	headerTintColor: "white",
						// }}
						options={({ route, headerStyle, headerTintColor }) => {
							const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";
							console.log(routeName, "ROUTe");
							switch (routeName) {
								case "Add": {
									return {
                                        
										headerTitle: "Camera",
										headerStyle: {
											backgroundColor: "#005a00",
										},
										headerTintColor: "white",
									};
								}

								case "Profile": {
									return {
										headerTitle: "Profile",
										headerStyle: {
											backgroundColor: "#005a00",
										},
										headerTintColor: "white",
									};
								}
								case "Search": {
									return {
										headerTitle: "Search",
										headerStyle: {
											backgroundColor: "#005a00",
										},
										headerTintColor: "white",
									};
								}
								case "Feed":
								default: {
									return {
										headerTitle: "SocialApp",
										headerStyle: {
											backgroundColor: "#005a00",
										},
										headerTintColor: "white",
									};
								}
							}
						}}

						// options={{
						// 	headerStyle: {
						// 		backgroundColor: "#005a00",
						// 	},
						// 	headerTintColor: "white",
						// }}
					/>
					<Stack.Screen
						name="Add"
						component={Add}
						options={{
							headerStyle: {
								backgroundColor: "#005a00",
							},
							headerTintColor: "white",
						}}
					/>
					<Stack.Screen
						name="Profile"
						component={Profile}
						options={{
							headerStyle: {
								backgroundColor: "#005a00",
							},
							headerTintColor: "white",
						}}
						// options={{ headerTitle:"Fe" }}
					/>
					<Stack.Screen
						name="Save"
						component={Save}
						options={{
							headerStyle: {
								backgroundColor: "#005a00",
							},
							headerTintColor: "white",
						}}
						// options={{ headerShown: true }}
					/>
					<Stack.Screen
						name="Search"
						component={Search}
						options={{
							headerStyle: {
								backgroundColor: "#005a00",
							},
							headerTintColor: "white",
						}}
						// options={{ headerShown: true }}
					/>
					<Stack.Screen
						name="Comments"
						component={Comment}
						options={{
							headerStyle: {
								backgroundColor: "#005a00",
							},
							headerTintColor: "white",
						}}
						// options={{ headerShown: true }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}
