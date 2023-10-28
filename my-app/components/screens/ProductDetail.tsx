import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCart } from "../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../context/UserContext";
import { useQuantity } from "../../context/QuantityContext";
import { useStock } from "../../context/StockContext";

type Product = {
  id: number;
  title: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  thumbnail: string;
  images: string[];
  quantity: number;
  totalPrice: number;
};

type RootStackParamList = {
  ProductDetail: { productId: number }; // Define the route parameter here
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;
type ProductDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

export type ProductDetailProps = {
  route: ProductDetailRouteProp;
  navigation: ProductDetailNavigationProp;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ route, navigation }) => {
  const { productId } = route.params ?? {};
  const [product, setProduct] = useState<Product | null>(null);
  const { quantity, setQuantity } = useQuantity();
  const baseUrl = `http://localhost:8000/products/${productId}`;
  const { cart, addToCart } = useCart();
  const { stock, setStock } = useStock();
  const { user } = useUser();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(baseUrl);
        const productData = response.data;

        setProduct(productData);
        setQuantity(productData.quantity);

        const initialStock = productData.stock - productData.quantity;
        setStock(initialStock);
      } catch (error: any) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      }
    };

    fetchProduct();
  }, [productId, cart]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const incrementQuantity = () => {
    if (product && product.stock && quantity < product.stock) {
      setQuantity(quantity + 1);
      // Check if product exists before modifying its properties
      if (product.stock) {
        product.stock -= 1; // Decrement stock by 1
        setStock(product.stock);
      }
    }
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      // Check if product exists before modifying its properties
      if (product.stock) {
        product.stock += 1; // Increment stock by 1
        setStock(product.stock);
      }
    }
  };

  const addProductToCart = async () => {
    const storedToken = await AsyncStorage.getItem("token");

    if (user && storedToken) {
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
      try {
        if (!storedToken) {
          console.error("Stored token is null or empty.");
          return;
        }

        // Ensure productId is valid
        if (!product || !product.id) {
          console.error("Invalid product or product id.");
          return;
        }

        // Pass productId as a number
        const productIdAsNumber = product.id;

        // Send an API request to update the quantity in the database
        const response = await axios.post(
          "http://localhost:8000/cart/add",
          {
            productId: productIdAsNumber, // Pass productId as a number
            userId: user?.id,
            category: product.category,
            brand: product.brand,
            title: product.title,
            productName: product.title,
            productImages: product.images,
            stock: stock,
            price: product.price,
            description: product.description,
            thumbnail: product.thumbnail,
            quantity: quantity, // Use the locally modified quantity
          },
          {
            withCredentials: true,
          }
        );
        Alert.alert("Product added to Cart");
        addToCart(response.data);
        console.log("Quantity from the products details" + quantity);
      } catch (error: any) {
        if (error.isAxiosError) {
          const axiosError = error as AxiosError;

          // Now you can access properties like 'axiosError.message'
          console.error("Error adding product to cart:", axiosError.message);

          // Handle different error cases based on status codes
          if (axiosError.response?.status === 401) {
            console.error("Unauthorized: Invalid token");
          } else if (axiosError.response?.status === 404) {
            console.error("Product not found in cart");
          } else {
            console.error("Unknown error:", axiosError.message);
          }
        } else {
          // Handle non-Axios errors
          console.error("Unknown error:", error);
        }
      }
    }
  };
  function goBack() {
    navigation.goBack();
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Ionicons name="arrow-back-circle" onPress={goBack} size={37} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {product ? (
          <>
            {product.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
                onError={(error) => {
                  console.log(`Image ${index + 1} load error:`, error);
                }}
              />
            ))}
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.productBrand}>Brand: {product.brand}</Text>
            <Text style={styles.productPrice}>
              Price: ${product.price.toFixed(2)}
            </Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.productStock}>Stock: {stock}</Text>
            <Text style={styles.productStock}>
              Set Here How Many Products You Want to Pruchase
            </Text>
            <View style={styles.iconsContainer}>
              <TouchableOpacity onPress={incrementQuantity}>
                <Text>
                  <Ionicons
                    style={styles.quantityIcons}
                    name="add-circle-outline"
                  />
                </Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={decrementQuantity}>
                <Text>
                  <Ionicons
                    style={styles.quantityIcons}
                    name="remove-circle-outline"
                  />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={addProductToCart}
              >
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  mainContainer: {
    paddingTop: 50,
    height: "100%",
    backgroundColor: "lightgrey",
    paddingBottom: 50,
  },
  container: {
    padding: 16,
    backgroundColor: "lightgray", // Light gray background
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 10, // Rounded corners for images
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 18,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    color: "#007bff",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  productStock: {
    fontSize: 16,
    marginBottom: 16,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  quantityIcons: {
    fontSize: 40,
  },
  quantityText: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    fontSize: 30,
  },
  addToCartButton: {
    padding: 20,
    width: 115,
    height: 40,
    backgroundColor: "darkblue",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
  },
  addToCartText: {
    color: "white",
  },
});

export default ProductDetail;
