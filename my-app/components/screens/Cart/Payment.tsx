import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCart } from "../../../context/CartContext";
import { useTheme } from "../../../context/ThemeContextProvider";
interface paymentInfo {
  method: string;
  cardNumber: number;
  cardHolderName: string;
  expirationDate: string;
  cvv: number;
}
interface userInfo {
  fullName: string;
  address: string;
  city: string;
  country: string;
  birth: string;
}
// document.dispatchEvent(new Event("visibilitychange"))
const Payment = () => {
  const [showCardInput, setShowCardInput] = useState(false);
  const [showCourierInput, setShowCourierInput] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const { cart, removeFromCart } = useCart();
  const navigation = useNavigation();
  // Payment details
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  // User inputs
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [birth, setBirth] = useState("");

  // Information from CheckOut
  const route = useRoute();
  const { theme } = useTheme();
  const { selectedProducts } = route.params as {
    selectedProducts: {
      productId: number;
      quantity: number;
      price: number;
      totalPrice: number;
      totalProducts: number;
      category: string;
      thumbnail: string;
      stock: number;
    }[];
  };

  const handleCardButtonClick = () => {
    setShowCardInput(!showCardInput);
    if (showCardInput) {
      setPaymentMethod("");
    } else {
      setPaymentMethod("card");
    }
  };

  const handleCourierButtonClick = () => {
    setShowCourierInput(!showCourierInput);
    if (showCourierInput) {
      setPaymentMethod("");
    } else {
      setPaymentMethod("courier");
    }
  };

  function goBack() {
    navigation.goBack();
  }

  const storingInfo = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedPaymentInfo: paymentInfo = {
        method: paymentMethod,
        cardNumber: Number(cardNumber),
        cardHolderName,
        expirationDate,
        cvv: Number(cvv),
      };
      const storedUserInfo: userInfo = {
        fullName,
        address,
        city,
        country,
        birth,
      };
      axios.post(
        "http://localhost:8000/cart/checkout",
        {
          paymentInformation: storedPaymentInfo,
          userInformation: storedUserInfo,
          products: selectedProducts,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      Alert.alert("Successfully ordered.");
      // navigation.navigate("Cart", { storedPaymentInfo });
    } catch (error) {
      console.error("Error storing information:", error);
    }
  };

  const handleOrderNow = () => {
    if (!paymentMethod) {
      Alert.alert("Please select a payment method");
      return;
    }

    if (
      paymentMethod === "card" &&
      (!cardNumber || !cardHolderName || !expirationDate || !cvv)
    ) {
      Alert.alert("Please fill in all card details");
      return;
    }

    if (
      paymentMethod === "courier" &&
      (!fullName || !address || !city || !country || !birth)
    ) {
      Alert.alert("Please fill in all courier details");
      return;
    }

    storingInfo();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={42} style={{ marginLeft: 40 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>
      <View style={styles.paymentContainer}>
        <TouchableOpacity
          style={showCardInput ? styles.activeButton : styles.button}
          onPress={handleCardButtonClick}
        >
          <Text style={styles.buttonText}>Card</Text>
        </TouchableOpacity>
        {showCardInput && (
          <View style={styles.cardInputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Card Number"
              placeholderTextColor="black"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Card Holder Name"
              placeholderTextColor="black"
              value={cardHolderName}
              onChangeText={setCardHolderName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Expiration Date"
              placeholderTextColor="black"
              value={expirationDate}
              onChangeText={setExpirationDate}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="CVV"
              placeholderTextColor="black"
              value={cvv}
              onChangeText={setCvv}
            />

            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Full Name"
              placeholderTextColor="black"
            />
            <TextInput
              value={birth}
              onChangeText={setBirth}
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Birth Date"
              placeholderTextColor="black"
            />
            <TextInput
              value={country}
              onChangeText={setCountry}
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Country"
              placeholderTextColor="black"
            />
            <TextInput
              value={city}
              onChangeText={setCity}
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="City"
              placeholderTextColor="black"
            />
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Address"
              placeholderTextColor="black"
            />
          </View>
        )}

        <TouchableOpacity
          style={showCourierInput ? styles.activeButton : styles.button}
          onPress={handleCourierButtonClick}
        >
          <Text style={styles.buttonText}>Courier</Text>
        </TouchableOpacity>
        {showCourierInput && (
          <View style={styles.cardInputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Full Name"
              placeholderTextColor="black"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Birth Date"
              placeholderTextColor="black"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Country"
              placeholderTextColor="black"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="City"
              placeholderTextColor="black"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background }]}
              placeholder="Address"
              placeholderTextColor="black"
            />
          </View>
        )}
      </View>
      <TouchableOpacity onPress={handleOrderNow} style={styles.orderNowButton}>
        <Text style={styles.orderNowButtonText}>Order Now</Text>
      </TouchableOpacity>
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
  paymentContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "lightblue",
    padding: 15,
    borderRadius: 5,
    margin: 10,
    width: 120,
  },
  activeButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    margin: 10,
    width: 120,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  cardInputContainer: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    padding: 10,
    width: 170,
  },

  orderNowButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  orderNowButton: {
    marginTop: 150,
    padding: 15,
    backgroundColor: "blue",
    borderRadius: 8,
    width: 150,
    alignSelf: "center",
  },
});

export default Payment;
