import React from "react";
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useUser } from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import Welcome from "./Welcome";
import HomeScreen from "./HomeScreen";
import { StatusBar } from "expo-status-bar";

const Home: React.FC = () => {
  const { user } = useUser();

  return (
    <>
      <StatusBar style="auto" />
      {!user && <Welcome />}
      {user && <HomeScreen />}
    </>
  );
};

export default Home;
