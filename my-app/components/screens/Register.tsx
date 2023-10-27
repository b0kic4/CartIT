import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
} from "react-native";
import axios, { AxiosError } from "axios";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function registerUser() {
    if (confirmPassword !== password) {
      alert("Passwords do not match");
      return;
    }

    const baseUrl = "http://localhost:8000/register";

    try {
      const response = await axios.post(baseUrl, {
        name: name,
        username: username,
        email: email,
        password: password,
      });

      if (response.status === 200) {
        console.log("Registration successful");
        console.log(response.data);
        const navigate = useNavigation();
        navigate.navigate("Home" as never);
      } else if (response.status === 409) {
        alert("Email is already in use");
      } else {
        console.error("Unexpected response: ", response);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error(
            "Server Error Status Code:",
            axiosError.response.status
          );
          console.error(
            "Server Error Response Data:",
            axiosError.response.data
          );
        } else if (axiosError.request) {
          console.error("Network Error:", axiosError.request);
        } else {
          console.error("Request Error:", axiosError.message);
        }
      } else {
        console.error("Unknown Error:", error);
      }
    }
  }

  return (
    <ImageBackground
      style={styles.imageBackground}
      source={require("my-app/assets/images/3d-geometric-abstract-hexagonal-wallpaper-background.jpg")}
    >
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Full Name"
            placeholderTextColor="white"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholder="Username"
            placeholderTextColor="white"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            placeholderTextColor="white"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            placeholderTextColor="white"
            secureTextEntry={true}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            placeholder="Confirm Password"
            placeholderTextColor="white"
            autoCapitalize="none"
            secureTextEntry={true}
          />
          <Button title="Register" onPress={registerUser} />
        </KeyboardAvoidingView>
        <StatusBar style="light" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "transparent",
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "whitesmoke",
    borderWidth: 0.5,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
});

export default Register;
