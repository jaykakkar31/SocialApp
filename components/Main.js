import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchUser,
	fetchUserFollowing,
	fetchUserPosts,
	clearData,
	reload,
} from "../store/actions/userActions";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import firebase from "firebase";
import Feed from "./main/Feed";
import { Entypo } from "@expo/vector-icons";
import Profile from "./main/Profile";
import Add from "./main/Add";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Search from "./main/Search";

const Main = () => {
	const users = useSelector((state) => state.usersReducer);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(reload());
	}, [dispatch]);
	const Tab = createMaterialBottomTabNavigator();
	const empty = () => {
		return <View></View>;
	};
	return (
		<Tab.Navigator
			initialRouteName="Feed"
			labeled={true}
			tabBarOptions={{
				showIcon: true,
				showLabel: true,
				indicatorStyle: {
					opacity: 0,
				},
			}}
			shifting={true}
		>
			<Tab.Screen
				name="Feed"
				component={Feed}
				options={{
					tabBarIcon: ({ color }) => {
						return <Entypo name="home" size={26} color={"#fff"} />;
					},
					tabBarColor: "#005a00",
				}}
			/>
			<Tab.Screen
				name="Search"
				component={Search}
				options={{
					tabBarIcon: ({ color }) => {
						return <FontAwesome name="search" size={24} color={"#fff"} />;
					},
					tabBarColor: "#005a00",
				}}
			/>

			<Tab.Screen
				name="MainAdd"
				component={Add}
				listeners={({ navigation }) => ({
					tabPress: (event) => {
						event.preventDefault();
						navigation.navigate("Add")
					},
				})}
				options={{
					tabBarIcon: ({ color }) => {
						return <Entypo name="squared-plus" size={24} color={"#fff"} />;
					},
					tabBarColor: "#005a00",
				}}
			/>
			<Tab.Screen
				name="Profile"
				listeners={({ navigation }) => ({
					tabPress: (event) => {
						event.preventDefault();
						navigation.navigate("Profile", {
							id: firebase.auth().currentUser.uid,
						});
					},
				})}
				component={Profile}
				options={{
					tabBarIcon: ({ color }) => {
						return (
							<MaterialIcons name="account-circle" size={26} color={"#fff"} />
						);
					},
					tabBarColor: "#005a00",
					// headerTitle:"Hello"
				}}
			/>
			{/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
		</Tab.Navigator>
	);
};

export default Main;
