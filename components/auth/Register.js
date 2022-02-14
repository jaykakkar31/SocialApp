import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
// Initialize Cloud Firestore through Firebase
import firebase from "firebase";
import { container, form } from "../Styles";

import "firebase/firestore";
import { ScrollView } from "react-native";

// import * as firebase from 'firebase'
// const db = getFirestore();

// const firebaseConfig = {
// 	apiKey: "AIzaSyD-TD3MgxPP2irZqlIGGvZ4UpV0qXMOaRM",
// 	authDomain: "insta-9202e.firebaseapp.com",
// 	projectId: "insta-9202e",
// 	storageBucket: "insta-9202e.appspot.com",
// 	messagingSenderId: "1003132060239",
// 	appId: "1:1003132060239:web:039db30a1c30e386f2a03a",
// 	measurementId: "G-BTK001LKLR",
// };

const Register = (props) => {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState();
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
						setEmail("")
                        setPassword("")
                        setName("")
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
					if (name == "password") {
						if (text.trim().length < 6) {
							setValues((prev) => {
								return { ...prev, password: false };
							});
						} else {
							setValues((prev) => {
								return { ...prev, [name]: true };
							});
						}
					} else {
						setValues((prev) => {
							return { ...prev, [name]: true };
						});
					}
				}
			}
		},
		[values]
	);

	const signUpHandler = async () => {
		if (email.length != 0 && password.length != 0) {
			try {
				let resData;
				await firebase
					.auth()
					.createUserWithEmailAndPassword(email, password)
					.then((userCredential) => {
						// Signed in
						resData = userCredential.user;
					})
					.catch((e) => {
						setError(e.message);
					});
				firebase
					.firestore()
					.collection("users")
					.doc(firebase.auth().currentUser.uid)
					.set({
						name: name,
						email: email,
					})
					.then(function (response) {
						console.log(
							JSON.stringify(response, "SETTING IN FIRESTORE RESPONSE")
						);
					})
					.catch((e) => {
					});
				setEmail("");
				setName("");
				setPassword("");
			} catch (e) {
				console.log(e);
				throw e;
			}

			// if(response){

			// }
		} else {
			if (password.length < 0) {
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
			<View style={container.formCenter}>
				<TextInput
					style={form.textInput}
					placeholder="Name"
					onChangeText={(text) => {
						setName(text);
					}}
					value={name}
				/>
				<TextInput
					style={form.textInput}
					placeholder="Email"
					onFocus={() => {
						StateHandler(email, "email");
					}}
					keyboardType="email-address"
					autoCapitalize="none"
					textContentType="emailAddress"
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
					textContentType="password"
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
					color={"#005a00"}
					style={form.button}
					onPress={signUpHandler}
					title="Register"
				/>
			</View>

			<View style={form.bottomButton}>
				<Text
					style={{ color: "#005a00" }}
					onPress={() => props.navigation.navigate("Login")}
				>
					Already have an account? SignIn.
				</Text>
			</View>
		</View>

		// <View
		// 	style={{
		// 		flex: 1,
		// 		justifyContent: "center",
		// 		padding: 10,
		// 		paddingVertical: 0,
		// 		// marginVertical: 240,
		//         marginHorizontal:50,
		// 		// borderColor: "#0c8900",
		// 		// borderWidth: 3,
		// 		// margin: 20,
		// 		// borderRadius: 20,
		// 		// height: "100%",
		// 	}}
		// >
		// 	<View style={{ justifyContent: "center" }}>
		// 			<TextInput
		// 				style={{
		// 					borderColor: "#ccc",
		// 					borderWidth: 2,
		// 					paddingHorizontal: 10,
		// 					paddingVertical: 5,
		// 					marginHorizontal: 15,
		// 					borderRadius: 20,
		// 					borderColor: "#005a00",
		// 				}}
		// 				placeholder="Name"
		// 				onChangeText={(text) => {
		// 					setName(text);
		// 				}}
		// 				value={name}
		// 			/>
		// 			<TextInput
		// 				style={{
		// 					borderColor: "#ccc",
		// 					borderWidth: 2,
		// 					paddingHorizontal: 10,
		// 					paddingVertical: 5,
		// 					marginHorizontal: 15,
		// 					borderRadius: 20,
		// 					borderColor: "#005a00",
		// 					marginVertical: 15,
		// 				}}
		// 				placeholder="Email"
		// 				onFocus={() => {
		// 					StateHandler(email, "email");
		// 				}}
		// 				keyboardType="email-address"
		// 				autoCapitalize="none"
		// 				textContentType="emailAddress"
		// 				value={email}
		// 				onChangeText={(text) => {
		// 					StateHandler(text, "email");

		// 					setEmail(text);
		// 				}}
		// 			/>
		// 			<TextInput
		// 				style={{
		// 					borderColor: "#ccc",
		// 					borderWidth: 2,
		// 					paddingHorizontal: 10,
		// 					paddingVertical: 5,
		// 					marginHorizontal: 15,
		// 					borderRadius: 20,
		// 					borderColor: "#005a00",
		// 				}}
		// 				placeholder="Password"
		// 				secureTextEntry={true}
		// 				textContentType="password"
		// 				value={password}
		// 				onFocus={() => {
		// 					StateHandler(password, "password");
		// 				}}
		// 				onChangeText={(text) => {
		// 					StateHandler(text, "password");

		// 					setPassword(text);
		// 				}}
		// 			/>
		// 			<View style={{ borderRadius: 20, overflow: "hidden", marginTop: 15 }}>
		// 				<Button title="Sign up" color={"#005a00"} onPress={signUpHandler} />
		// 			</View>
		// 	</View>
		// </View>
	);
};

export default Register;
