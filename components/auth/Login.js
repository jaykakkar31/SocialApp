import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, StatusBar, Text, TextInput, View } from "react-native";
import firebase from "firebase";
// import * as firebase from 'firebase'
import { container, form } from "../Styles";
const Login = (props) => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [password, setPassword] = useState("");
	const [values, setValues] = useState({
		email: true,
		password: true,
	});

	useEffect(() => {
		if (error) {
			Alert.alert("An Error Occured!", error, [
				{
					text: "Okay",
					style: "default",
					onPress: () => {
						setError(null);
						// setIsLoading(false);
						setEmail("");
						setPassword("");
						// setCred({ email: "", password: "" });
					},
				},
			]);
		}
	}, [error]);
	const StateHandler = useCallback(
		(text, name) => {
			if (text?.trim().length === 0) {
				setValues((prev) => {
					return { ...prev, [name]: false };
				});
			} else {
				if (name == "email") {
					const reg =
						/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					if (reg.test(text) == false) {
						setValues((prev) => {
							return { ...prev, email: false };
						});
					} else {
						setValues((prev) => {
							return { ...prev, email: true };
						});
					}
				} else {
					setValues((prev) => {
						return { ...prev, [name]: true };
					});
				}
			}
		},
		[values]
	);

	const signInHandler = async () => {
		if (email.length != 0 && password.length != 0) {
			firebase
				.auth()
				.signInWithEmailAndPassword(email.trim(), password.trim())
				.then((response) => {
					// console.log(response);
					// if (!response.ok) {
					// 	// 						const errorResData = await response.json();
					// 	// 						const errorId = errorResData.error.message;
					// 	let message = "Something went wrong!";
					// 	// 						if (errorId === "EMAIL_NOT_FOUND") {
					// 	// 							message = "This email could not be found!";
					// 	// 						} else if (errorId === "INVALID_PASSWORD") {
					// 	// 							message = "This password is not valid!";
					// 	// 						}
					// 	throw new Error(message);
					// }
				})
				.catch((e) => {
					// if (
					// 	e.message ==
					// 	"The password is invalid or the user does not have a password"
					// ) {
					// 	message = "The password is invalid";
					// }
					setError(e.message);
					// throw e;
				});

			setEmail("");
			setPassword("");
		} else {
			if (password.length < 6) {
				setValues((prev) => {
					return { ...prev, password: false };
				});
			}
			if (email.length == 0) {
				setValues((prev) => {
					return { ...prev, email: false };
				});
			}
		}
	};
	return (
		<View style={container.center}>
			{/* <StatusBar backgroundColor={"#005a00"} /> */}

			<View style={container.formCenter}>
				<TextInput
					style={form.textInput}
					placeholder="Email"
					onFocus={() => {
						StateHandler(email, "email");
					}}
					autoCapitalize="none"
					keyboardType={"email-address"}
					value={email}
					onChangeText={(text) => {
						StateHandler(text, "email");

						setEmail(text);
					}}
				/>
				{!values.email && (
					<View style={{ marginBottom: 10, marginHorizontal: 10 }}>
						<Text style={{ color: "red" }}>Please enter valid email</Text>
					</View>
				)}
				<TextInput
					style={form.textInput}
					placeholder="Password"
					secureTextEntry={true}
					value={password}
					onFocus={() => {
						StateHandler(password, "password");
					}}
					onChangeText={(text) => {
						StateHandler(text, "password");

						setPassword(text);
					}}
				/>
				{!values.password && (
					<View style={{ marginBottom: 10, marginHorizontal: 10 }}>
						<Text style={{ color: "red" }}>Plaese enter valid password </Text>
					</View>
				)}
				<Button
					style={form.button}
					color={"#005a00"}
					onPress={signInHandler}
					title="Sign In"
				/>
			</View>

			<View style={form.bottomButton}>
				<Text
					style={{ color: "#005a00" }}
					title="Register"
					onPress={() => props.navigation.navigate("Register")}
				>
					Don't have an account? SignUp.
				</Text>
			</View>
			<StatusBar backgroundColor={"#005a00"} />
		</View>
		// <View
		// 	style={{
		// 		flex: 1,
		// 		justifyContent: "center",
		// 		padding: 10,
		// 		paddingVertical: 0,
		// 		// marginVertical: 260,
		// 		marginHorizontal: 50,
		// 		// borderColor: "#0c8900",
		// 		// borderWidth: 3,
		// 		// margin: 20,
		// 		// borderRadius: 20,
		// 		height: "100%",
		// 	}}
		// >
		// 	<TextInput
		// 		style={{
		// 			borderColor: "#ccc",
		// 			borderWidth: 2,
		// 			paddingHorizontal: 10,
		// 			paddingVertical: 5,
		// 			marginHorizontal: 15,
		// 			borderRadius: 20,
		// 			borderColor: "#005a00",
		// 		}}
		// 		placeholder="Email"
		// 		onFocus={() => {
		// 			StateHandler(email, "email");
		// 		}}
		// 		value={email}
		// 		onChangeText={(text) => {
		// 			StateHandler(text, "email");

		// 			setEmail(text);
		// 		}}
		// 	/>
		// 	<TextInput
		// 		style={{
		// 			borderColor: "#ccc",
		// 			borderWidth: 2,
		// 			paddingHorizontal: 10,
		// 			paddingVertical: 5,
		// 			marginHorizontal: 15,
		// 			borderRadius: 20,
		// 			borderColor: "#005a00",
		// 			marginVertical: 15,
		// 		}}
		// 		placeholder="Password"
		// 		secureTextEntry={true}
		// 		value={password}
		// 		onFocus={() => {
		// 			StateHandler(password, "password");
		// 		}}
		// 		onChangeText={(text) => {
		// 			StateHandler(text, "password");

		// 			setPassword(text);
		// 		}}
		// 	/>
		// 	<View style={{ borderRadius: 20, overflow: "hidden", marginTop: 15 }}>
		// 		<Button title="Sign In" color={"#005a00"} onPress={signInHandler} />
		// 	</View>
		// </View>
	);
};

export default Login;
