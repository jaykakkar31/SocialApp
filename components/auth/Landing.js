import React from "react";
import { Button, View } from "react-native";

const Landing = ({ navigation }) => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
			}}
		>
			<View
				style={{
					marginVertical: 10,
					borderRadius: 20,
					overflow: "hidden",
					width: "60%",
				}}
			>
				<Button
					title="Register"
					color={"#005a00"}
					onPress={() => navigation.navigate("Register")}
				/>
			</View>
			<View
				style={{
					marginVertical: 10,
					borderRadius: 20,
					overflow: "hidden",
					width: "60%",
				}}
			>
				<Button
					title="Login"
					color={"#005a00"}
					onPress={() => navigation.navigate("Login")}
				/>
			</View>
		</View>
	);
};

export default Landing;
