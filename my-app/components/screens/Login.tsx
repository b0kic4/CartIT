import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Switch,
  ImageBackground,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRememberMe } from "../../context/RememberMeContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { rememberMe, toggleRememberMe } = useRememberMe();
  const { setUser } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    const loginUser = async () => {
      const baseUrl = "http://localhost:8000/login";
      try {
        // Check if there are saved credentials in AsyncStorage
        const savedCredentials = await AsyncStorage.getItem("savedCredentials");

        if (savedCredentials && rememberMe) {
          // If "Remember Me" is checked and saved credentials exist, use them to log in
          const { savedUsername, savedPassword } = JSON.parse(savedCredentials);
          setUsername(savedUsername);
          setPassword(savedPassword);

          const response = await axios.post(baseUrl, {
            username: savedUsername,
            password: savedPassword,
          });

          const userInfo = response.data;
          await AsyncStorage.setItem("token", userInfo.token);
          setUser(userInfo);

          // Add these console.log statements for debugging
          console.log("User information:", userInfo);
          console.log("Remember Me:", rememberMe);

          alert("Login successful");
          navigation.goBack();
        }
      } catch (error: any) {
        console.log("Error", error.message);
      }
    };

    loginUser(); // Call the function inside useEffect
  }, [setUser, navigation]);

  const saveCredentials = async () => {
    // Save user credentials in AsyncStorage
    if (rememberMe) {
      await AsyncStorage.setItem(
        "savedCredentials",
        JSON.stringify({ savedUsername: username, savedPassword: password })
      );
    } else {
      // If "Remember Me" is unchecked, remove saved credentials
      await AsyncStorage.removeItem("savedCredentials");
    }
  };

  const handleLogin = async () => {
    try {
      const baseUrl = "http://localhost:8000/login";
      const response = await axios.post(baseUrl, {
        username,
        password,
      });

      const userInfo = response.data;
      await AsyncStorage.setItem("token", userInfo.token);
      setUser(userInfo);

      // Save user credentials when the user logs in
      saveCredentials();

      // console.log("User information:", userInfo);
      // console.log("Remember Me:", rememberMe);

      alert("Login successful");
      navigation.goBack();
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        const errorData = error.response.data;
        if (errorData.message === "Invalid password") {
          Alert.alert("Invalid password");
        }
      } else if (error.request) {
        Alert.alert("User not found");
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    }
  };

  return (
    <ImageBackground
      source={require("my-app/assets/images/3d-geometric-abstract-hexagonal-wallpaper-background.jpg")}
      style={styles.imageBackground}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <TextInput
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="black"
          autoCapitalize="none"
        />
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.rememberMeContainer}>
          <Text style={styles.rememberMeText}>Remember Me</Text>
          <Switch value={rememberMe} onValueChange={toggleRememberMe} />
        </View>
      </KeyboardAvoidingView>
      <StatusBar style="light" />
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
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  loginButton: {
    width: 200,
    height: 50,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderColor: "white", // Add a border for better visibility
    alignItems: "center",
    justifyContent: "center", // Center text vertically
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "white", // Change border color for better visibility
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 20,
    color: "white", // Change text color to black
    textAlign: "center",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 40, // Add some margin for better alignment
  },
  rememberMeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default Login;
