import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRememberMe } from "../../context/RememberMeContext";
import { useTheme } from "../../context/ThemeContextProvider";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { rememberMe, toggleRememberMe } = useRememberMe();
  const { theme, toggleTheme } = useTheme();

  function goBack() {
    navigation.goBack();
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons
            name="arrow-back"
            size={42}
            style={{ marginLeft: 40, color: theme.textColor }}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Settings
        </Text>
      </View>
      <View style={styles.switchContainer}>
        <View style={styles.switchItem}>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", color: theme.textColor }}
          >
            Remember Me
          </Text>
          <Switch value={rememberMe} onValueChange={toggleRememberMe} />
        </View>
        <View style={styles.switchItem}>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", color: theme.textColor }}
          >
            Dark Mode
          </Text>
          <Switch value={theme.darkMode} onValueChange={toggleTheme} />
        </View>
      </View>
    </View>
  );
};

SettingsScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    flex: 1,
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
  switchContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  switchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
});

export default SettingsScreen;
