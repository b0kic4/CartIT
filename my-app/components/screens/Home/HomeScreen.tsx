import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const HomeScreen = () => {
  const { user, setUser } = useUser();
  const navigation = useNavigation();
  const baseUrl = "http://localhost:8000/products";
  function redirectToProducts() {
    navigation.navigate("Products" as never);
  }
  async function logout() {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  }
  function redirectToCart() {
    navigation.navigate("Cart" as never);
  }
  function redirectToProfile() {
    navigation.navigate("Profile" as never);
  }
  useEffect(() => {
    if (user) {
      // User is logged in, fetch products
      axios.interceptors.request.use(
        async (config) => {
          const storedToken = (await AsyncStorage.getItem("token")) || "";

          if (storedToken) {
            config.headers.Authorization = storedToken;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      const fetchProducts = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("token");

          if (storedToken) {
            await axios.get(baseUrl, {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            });
          } else {
            // Handle the case where the token is not available.
            Alert.alert("You are not authorized to access Product List");
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchProducts();
    }
  }, [user]);
  return (
    <ImageBackground
      source={require("my-app/assets/images/taopaodao-EgL0EtzL0Wc-unsplash.jpg")}
      style={styles.imageStyle}
    >
      <StatusBar style="auto" />
      <View style={styles.headerContainer}>
        <Text style={styles.usernameTextStyle}>
          <Ionicons name="person-outline" size={15} color="lightgray" />{" "}
          {user?.username}
        </Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={{ color: "lightgray", fontWeight: "bold" }}>LogOut</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productsContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.buttonAndTitleContainer}>
            <Text style={styles.title}>Discover Latest Products</Text>
            <Text style={styles.description}>
              {"\n"}For more information about the products available Click on
              the button below
            </Text>
            <TouchableOpacity
              onPress={redirectToProducts}
              style={styles.getStartedButtonStyle}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.goToCartContainer}>
            <Text style={styles.cartText}>Check your cart products</Text>
            <TouchableOpacity
              onPress={redirectToCart}
              style={styles.cartButtonStyles}
            >
              <Text style={styles.getStartedButtonText}>Go to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
  },
  headerContainer: {
    justifyContent: "space-around",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingTop: 60,
    minHeight: 50, // Define a minimum height for the header container
    flexDirection: "row", // Align text in a row (horizontally)
    alignItems: "flex-end", // Align text at the bottom of the header container
    paddingHorizontal: 20,
  },
  usernameTextStyle: {
    color: "lightgrey",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  logoutButton: {
    backgroundColor: "darkred",
    borderRadius: 15,
    alignItems: "center",
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    height: 25,
    width: 80,
  },
  infoContainer: {
    marginTop: 20,
  },

  newProductsContainer: {
    paddingTop: 45,
    flex: 1,
    alignContent: "center",
  },
  productsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  // Container for the button and text for cart
  // Updated styles for your HomeScreen component
  goToCartContainer: {
    marginTop: 20,
    backgroundColor: "transparent",
    padding: 20,
    justifyContent: "center",
    alignContent: "center",
    height: "40%",
    borderRadius: 20,
    flexDirection: "column", // Set the direction to column
    alignItems: "center", // Center children horizontally
  },
  // Updated styles for the text
  cartText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    padding: 10,
    marginBottom: 20, // Add margin to separate the text and button
    textAlign: "center",
  },
  // Updated styles for the button
  cartButtonStyles: {
    padding: 20,
    width: 130,
    height: 50,
    backgroundColor: "darkred",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    padding: 10,
    paddingHorizontal: 30,
  },
  description: {
    fontSize: 16,
    color: "white",
    paddingHorizontal: 10,
    textAlign: "center",
  },
  buttonAndTitleContainer: {
    gap: 2,
  },
  getStartedButtonStyle: {
    padding: 20,
    width: 130,
    height: 50,
    backgroundColor: "darkblue",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    textAlign: "center",
  },
  getStartedButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  profileContainer: {
    backgroundColor: "transparent",
    alignContent: "center",
    height: "40%",
    borderRadius: 20,
    flexDirection: "column",
    alignItems: "center",
  },
});

export default HomeScreen;
