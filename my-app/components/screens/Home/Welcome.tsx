import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const Welcome = () => {
  const navigation = useNavigation();
  function login() {
    navigation.navigate("login" as never);
  }

  function register() {
    navigation.navigate("register" as never);
  }
  return (
    <ImageBackground
      style={styles.imageStyle}
      resizeMode="cover"
      source={require("my-app/assets/images/joel-abraham-8RRYJg26Wr4-unsplash.jpg")}
    >
      <View style={styles.positionContainer}>
        <View>
          <Text style={styles.welcomeTextStyles}>Welcome</Text>
          <Text style={styles.toMyTextStyles}>To My</Text>
          <Text style={styles.appNameTextStyle}>CartIT App</Text>
        </View>
      </View>
      <View style={styles.loginRegisterContainer}>
        <TouchableOpacity onPress={login} style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={register} style={styles.registerButton}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  positionContainer: {
    marginTop: 85,
    padding: 55,
    justifyContent: "center",
  },
  loginRegisterContainer: {
    marginTop: 250,
    marginRight: 250,
    padding: 50,
    justifyContent: "center",
    gap: 5,
  },
  loginButton: {
    width: 100,
    height: 50,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButton: {
    width: 150,
    height: 50,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  welcomeTextStyles: {
    fontSize: 50,
    fontWeight: "bold",
    color: "whitesmoke",
  },
  toMyTextStyles: {
    fontSize: 45,
    fontWeight: "bold",
    color: "whitesmoke",
  },
  appNameTextStyle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "red",
  },
});

export default Welcome;
