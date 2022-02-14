import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import firebase from "firebase";
import { USER_FOLLOWING_STATE_CHANGED } from "../../store/constants/contants";
const Search = (props) => {
    	// const [userPosts, setUserPosts] = useState([]);

	const [users, setUsers] = useState([]);
	const fetchuser = (search) => {
		try {
			firebase
				.firestore()
				.collection("users")
                .where("name",">=",search)
				.get()
				.then((snapshot) => {
                    let user=snapshot.docs.map((doc)=>{
                        let data=doc.data()
                        let id=doc.id
                        return {id,...data}
                    })
                    setUsers(user)
				});
		} catch (e) {
			console.log(e);
		}
	};
useEffect(()=>{})
	// console.log(users);
	return (
		<View style={{ flex: 1 }}>
			<TextInput
				placeholder="Type here ..."
				style={{
					fontSize: 16,
					paddingVertical: 6,
					borderColor: "#ccc",
					borderWidth: 1,
					margin: 15,
                    borderRadius:20,
					paddingHorizontal: 10,
				}}
                
				onChangeText={(search) => fetchuser(search)}
			/>
			<View style={{ flex: 1 }}>
				<FlatList
					data={users}
					numColumns={1}
					renderItem={(itemData) => {
						return (
							<View>
								<TouchableOpacity
									style={{ marginHorizontal: 20, marginVertical: 10 }}
									onPress={() => {
										props.navigation.navigate("Profile", {
											id: itemData.item.id,
										});
									}}
								>
									<Text style={{ fontSize: 16, fontWeight: "600" }}>
										{itemData.item.name}
									</Text>
								</TouchableOpacity>
                                <View style={{borderColor:"#ccc",borderBottomWidth:1,marginHorizontal:15}}></View>
							</View>
						);
					}}
				/>
			</View>
		</View>
	);
};

export default Search;
