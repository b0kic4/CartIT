import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import axios from "axios";

const CheckOut = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  return (
    <View style={styles.container}>
      <Text>CheckOut</Text>
    </View>
  );
};

export const CreditCardMethod = () => {};

export default CheckOut;

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
  },
});
