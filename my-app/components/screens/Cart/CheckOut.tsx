import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useCart } from "../../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";
import { StatusBar } from "expo-status-bar";
interface productItem {
  productId: number;
  title: string;
  brand: string;
  category: string;
  totalPrice: number;
  thumbnail: string;
  stock: number;
  quantity: number;
  price: number;
  totalProducts: number;
}

const CheckOut = () => {
  const { cart } = useCart();
  const [products, setProducts] = useState<productItem[]>([]);
  const navigation = useNavigation();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          const response = await axios.get("http://localhost:8000/cart", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          setProducts(response.data.cartItems);
          let productsCount = 0;
          let cartTotalPrice = 0;

          for (const product of response.data.cartItems) {
            productsCount += product.quantity;
            if (!isNaN(product.price) && !isNaN(product.quantity)) {
              cartTotalPrice += product.price * product.quantity;
            }
          }
          setTotalProducts(productsCount);
          setTotalPrice(cartTotalPrice);
        } else {
          Alert.alert("You are not authorized to access the Payment.");
        }
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };
    fetchCartProducts();
  }, [cart]);

  function goBack() {
    navigation.goBack();
  }
  async function goToPayment() {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const selectedProducts = products.map((item) => {
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          category: item.category,
          thumbnail: item.thumbnail,
          stock: item.stock,
        };
      });
      if (selectedProducts.length > 0) {
        navigation.navigate("Payment", { selectedProducts });
      } else {
        return Alert.alert("No products selected");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      // Handle error, show an alert, or perform other actions
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons
            name="arrow-back-circle"
            size={42}
            style={{ marginLeft: 40 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <View style={styles.mainContainer}>
        <Swiper
          style={styles.wrapper}
          loop={false}
          paginationStyle={styles.paginationStyle}
        >
          {products.map((item, index) => (
            <View key={index} style={styles.carouselItem}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.imageThumbnail}
                onError={() => console.log("Error loading image")}
              />
              <Text style={styles.productTitle}>{item.title}</Text>
              <View style={styles.productDetails}>
                <Text style={styles.brand}>Brand: {item.brand}</Text>
                <Text style={styles.category}>Category: {item.category}</Text>
                <Text style={styles.price}>Quantity: {item.quantity}</Text>
                <Text style={styles.price}>Price: ${item.price}</Text>
              </View>
            </View>
          ))}
        </Swiper>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.brand}>Total Items: {totalProducts}</Text>
        <Text style={styles.brand}>Total Price: {totalPrice}$</Text>
        <TouchableOpacity onPress={goToPayment} style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: "whitesmoke",
    paddingBottom: 50,
  },
  headerContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginRight: 85,
  },
  mainContainer: {
    marginTop: 20,
    height: "55%",
  },
  wrapper: {},
  paginationStyle: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    height: "40%",
    alignItems: "center",
  },
  carouselItem: {
    alignItems: "center",
  },
  imageThumbnail: {
    width: 300,
    height: 300,
    borderRadius: 14,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  productDetails: {
    flexDirection: "column",
    marginTop: 10,
    gap: 2,
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 16, fontWeight: "bold" },
  footerContainer: {
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  paymentButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});

export default CheckOut;
