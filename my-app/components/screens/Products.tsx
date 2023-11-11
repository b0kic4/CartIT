import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions, // Import Dimensions
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContextProvider";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "./ProductDetail"; // Import RootStackParamList

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  thumbnail: string;
  images: string[];
};

const Products: React.FC = React.memo(() => {
  const [products, setProducts] = useState<Product[]>([]);
  const baseUrl = "http://localhost:8000/products";
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useUser();
  const { theme } = useTheme();

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
            const response = await axios.get(baseUrl, {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            });
            setProducts(response.data);
          } else {
            // Handle the case where the token is not available.
            Alert.alert("You are not authorized to access Product List");
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchProducts();
    } else {
      // User is logged out, clear the products
      setProducts([]);
    }
  }, [user]);

  function showProduct(productId: number) {
    navigate.navigate("ProductDetail", { productId: productId });
  }

  // Calculate the item width based on the screen width
  const itemWidth = Dimensions.get("window").width / 2 - 15; // Adjust margin as needed

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.title, { color: theme.textColor }]}>
          CartIT Products
        </Text>
        <View
          style={[
            styles.productsContainer,
            { backgroundColor: theme.background },
          ]}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <TouchableOpacity
                onPress={() => showProduct(product.id)}
                key={product.id}
                style={[
                  styles.product,
                  { width: itemWidth, backgroundColor: theme.primary },
                ]}
              >
                <View style={styles.productInfo}>
                  <Text style={[styles.productName]}>{product.title}</Text>
                  <Text
                    style={[styles.productPrice, { color: theme.textColor }]}
                  >
                    ${product.price.toFixed(2)}
                  </Text>
                </View>
                <Image
                  source={{ uri: product.thumbnail }}
                  style={styles.productThumbnail}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noProducts}>
              No products available, Please Login to see all the products
            </Text>
          )}
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: "3%",
    position: "relative",
    zIndex: -1,
    paddingHorizontal: "5%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "15%",
    height: "100%",
    maxHeight: "100%",
    width: "100%",
    backgroundColor: "white",
  },
  container: {
    maxHeight: "90%",
    margin: 18,
    borderRadius: 15,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "darkgray",
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    margin: -8, // Adjust margin to add spacing between items
  },
  product: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    flexDirection: "column",
  },
  productInfo: {
    flexDirection: "column",
    alignItems: "flex-start", // Adjust alignment as needed
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
    marginTop: 10,
  },
  productThumbnail: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "lightgrey",
  },
  noProducts: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Products;
