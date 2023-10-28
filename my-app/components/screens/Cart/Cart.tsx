import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../../context/UserContext";
import { useCart } from "../../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useQuantity } from "../../../context/QuantityContext";
import { useStock } from "../../../context/StockContext";
import { useNavigation } from "@react-navigation/native";

interface CartItem {
  totalPrice: number;
  stock: number;
  productId: number;
  brand: string;
  category: string;
  title: string;
  thumbnail: string;
  quantity: number;
  price: number;
}

const Cart: React.FC = () => {
  const baseUrl = "http://localhost:8000/cart";

  const { cart, removeFromCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { quantity, setQuantity } = useQuantity();
  const { stock, setStock } = useStock();
  const { user } = useUser();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          const response = await axios.get(baseUrl, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          setCartItems(response.data.cartItems);
          let productsCount = 0;
          let cartTotalPrice = 0;

          for (const product of response.data.cartItems) {
            productsCount += product.quantity; // Increment products count
            if (!isNaN(product.price) && !isNaN(product.quantity)) {
              cartTotalPrice += product.price * product.quantity; // Increment total price if valid numbers
            }
          }
          setTotalProducts(productsCount);
          setTotalPrice(cartTotalPrice);
        } else {
          Alert.alert("You are not authorized to access the Cart.");
        }
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };
    fetchCartProducts();
  }, [cart]);

  const removeItemFromCart = async (productId: number) => {
    const storedToken = await AsyncStorage.getItem("token");
    try {
      if (!storedToken) {
        console.error("Stored token is not valid");
        return;
      }
      await axios.delete(`http://localhost:8000/cart/${productId}/remove`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setCartItems((prevCart) =>
        prevCart.filter((item) => item.productId !== productId)
      );
      removeFromCart(productId);
      Alert.alert("Product removed successfully");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.log(
            "Error Response Status Code:",
            axiosError.response.status
          );
          console.log("Error Response Data:", axiosError.response.data);
        } else {
          console.error("Axios request failed without a response.");
        }
      } else {
        console.error("Non-Axios error:", error);
      }
    }
  };
  const removeAllItemsFromCart = async () => {
    const storedToken = AsyncStorage.getItem("token");
    try {
      if (!storedToken) {
        console.error("Token is not valid");
        return;
      }
      console.log(storedToken);
      await axios.delete(`http://localhost:8000/cart/remove`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setCartItems([]);
      setTotalProducts(0);
      setTotalPrice(0);
      Alert.alert("Products Removed");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.log(
            "Error Response Status Code:",
            axiosError.response.status
          );
          console.log("Error Response Data:", axiosError.response.data);
        } else {
          console.error("Axios request failed without a response.");
        }
      } else {
        console.error("Non-Axios error:", error);
      }
    }
  };
  const incrementQuantity = (product: CartItem) => {
    if (product.quantity < product.stock) {
      const updatedCart = cartItems.map((item) => {
        if (item.productId === product.productId) {
          item.quantity += 1;
          item.stock -= 1;
          setStock(item.stock);
          setQuantity(item.quantity);
          setTotalProducts(totalProducts + 1);
          setTotalPrice(totalPrice + item.price);
        }
        return item;
      });
      setCartItems(updatedCart);
    }
  };

  const decrementQuantity = (product: CartItem) => {
    if (product.quantity > 1) {
      const updatedCart = cartItems.map((item) => {
        if (item.productId === product.productId) {
          item.quantity -= 1;
          item.stock += 1;
          setStock(item.stock);
          setQuantity(item.quantity);
          setTotalProducts(totalProducts - 1);
          setTotalPrice(totalPrice - item.price);
        }
        return item;
      });
      setCartItems(updatedCart);
    }
  };
  const editCartProduct = async (
    product: CartItem,
    productId: number,
    stock: number
  ) => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        console.log(product.productId);
        const response = await axios.post(
          `http://localhost:8000/cart/${productId}/edit`,
          {
            productId: product.productId,
            quantity: quantity,
            stock: stock,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
        console.log("Quantity of the product is: " + quantity);
      } else {
        console.log("You are not authorized to edit the Item");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.log(
            "Error Response Status Code:",
            axiosError.response.status
          );
          console.log("Error Response Data:", axiosError.response.data);
        } else {
          console.error("Axios request failed without a response.");
        }
      } else {
        console.error("Non-Axios error:", error);
      }
    }
  };

  const goToCheckOut = () => {
    navigation.navigate("CheckOut" as never);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.headerContainer}>
        <View style={styles.headerContainerForCheckingOut}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <View style={styles.containerItemsAndPrice}>
          <View>
            <TouchableOpacity onPress={removeAllItemsFromCart}>
              <Ionicons name="trash" size={40} />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalPrice}>{totalPrice} $</Text>
          <View>
            <TouchableOpacity onPress={goToCheckOut}>
              <Ionicons name="cart" size={40} />
              {totalProducts > 0 && (
                <View style={styles.cartIconTotalProductsContainer}>
                  <Text style={styles.textForTotalProductsPosition}>
                    {totalProducts}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {cartItems.length > 0 ? (
          cartItems.map((product, index) => (
            <View key={index}>
              {/* Render product details */}
              <Image
                source={{ uri: product.thumbnail }}
                style={styles.thumbnail}
                accessibilityLabel="Product Thumbnail"
                onError={(e) =>
                  console.log("Error loading image:", e.nativeEvent.error)
                }
              />
              <TouchableOpacity
                style={styles.treshIconButton}
                onPress={() => removeItemFromCart(product.productId)}
              >
                <Ionicons name="remove-circle" size={35} />
              </TouchableOpacity>
              <View style={styles.productDetails}>
                <View>
                  <Text style={styles.productName}>{product.title}</Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productBrand}>
                    Brand: {product.brand}
                  </Text>
                  <Text style={styles.productStock}>
                    Stock: {product.stock}
                  </Text>
                  <Text style={styles.productStock}>
                    Price: {product.price}$
                  </Text>
                </View>
                <View style={styles.iconAndSaveButtonContainer}>
                  <View style={styles.iconsContainer}>
                    <TouchableOpacity
                      onPress={() => incrementQuantity(product)}
                      style={styles.iconButton}
                    >
                      <Ionicons name="add-circle-outline" size={40} />
                    </TouchableOpacity>
                    <Text style={styles.quantityNumber}>
                      {product.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        decrementQuantity(product);
                      }}
                      style={styles.iconButton}
                    >
                      <Ionicons name="remove-circle-outline" size={40} />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPressIn={() =>
                        editCartProduct(product, quantity, stock)
                      }
                      style={styles.saveButton}
                    >
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>No products in the cart.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "whitesmoke",
    paddingTop: 10, // Adjusted paddingTop
    height: "100%",
  },
  removeAllText: {
    color: "white",
    fontSize: 17,
  },
  cartIconTotalProductsContainer: {
    position: "absolute",
    top: 10, // Adjust the top value to position the text as desired
    right: 0, // Adjust the right value to position the text as desired
    justifyContent: "center",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "darkred",
  },
  textForTotalProductsPosition: {
    position: "absolute",
    fontSize: 24, // Adjust the font size as needed
    color: "red", // Adjust the text color as needed
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 4,
    textAlign: "center",
  },
  headerContainer: {
    marginTop: 40,
  },
  headerContainerForCheckingOut: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 20,
  },
  containerItemsAndPrice: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    paddingHorizontal: 70,
    alignItems: "center",
  },
  textInContainerForPriceAndProcuts: {
    fontWeight: "bold",
    fontSize: 20,
  },
  removeItemsFromCartButton: {
    padding: 25,
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 10,
    height: 40,
    backgroundColor: "darkred",
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    textAlign: "center",
  },
  container: {
    flex: 1,
    maxHeight: "70%",
    padding: 16,
  },
  productDetails: {
    marginBottom: 35, // Increased marginBottom
    justifyContent: "space-between",
    alignContent: "center",
  },
  iconAndSaveButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    width: 220,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    marginLeft: 8,
  },
  thumbnail: {
    width: "100%",
    height: 350,
    borderRadius: 14,
  },
  productName: {
    marginTop: 10,
    fontSize: 22,
    color: "black",
    fontWeight: "bold",
  },
  productCategory: {
    fontSize: 22,
    color: "black",
  },
  productStock: {
    fontSize: 22,
    color: "black",
    fontWeight: "bold",
  },
  productBrand: {
    fontSize: 22,
    color: "black",
  },
  treshIconButton: {
    position: "absolute",
    backgroundColor: "gray",
    opacity: 0.5,
    borderRadius: 10,
    padding: 5,
    right: 0,
    top: 0,
  },
  quantityNumber: {
    fontSize: 30,
  },
  saveButton: {
    backgroundColor: "transparent",
    width: 140,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  saveButtonText: {
    color: "darkred",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default Cart;
