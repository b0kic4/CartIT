import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Home from "./screens/Home/Home";
import Profile from "./screens/Profile";
import Cart from "./screens/Cart/Cart";
import SettingsScreen from "./screens/SettingsScreen";
import Products from "./screens/Products";
import { useUser } from "../context/UserContext";
import { View, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const TabNav: React.FC = () => {
  const { user } = useUser();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 70, // Increase the height to accommodate the borderRadius
          width: "100%",
          paddingHorizontal: 5,
          marginBottom: 25,
          backgroundColor: "transparent",
          position: "absolute",
          borderTopWidth: 0,
          borderRadius: 80,
        },
        tabBarLabel: () => null,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string | null | undefined;

          if (route.name === "Home") {
            iconName = focused ? "planet" : "planet-outline";
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          } else if (route.name === "Products") {
            iconName = focused ? "list" : "list-outline";
          }

          // Provide a default icon name if iconName is undefined
          if (!iconName) {
            iconName = "planet"; // Change this to your desired default icon
          }

          return (
            <View
              style={[
                styles.iconContainer,
                { borderColor: color }, // Set border color to icon color
              ]}
            >
              <Ionicons
                name={iconName}
                size={size}
                color={color}
                style={{ fontSize: 30 }}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      {user && (
        <>
          <Tab.Screen
            name="Products"
            component={Products}
            options={{ headerShown: false }}
          />

          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Cart"
            component={Cart}
            options={{ headerShown: false }}
          />
        </>
      )}
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginTop: 30,
    alignItems: "center", // Center the icons horizontally
    justifyContent: "center", // Center the icons vertically
    borderWidth: 2, // Add a border
    width: 64, // Set the width of the icon container
    height: 64, // Set the height of the icon container
    borderRadius: 32, // Make the icon container circular
  },
});

export default TabNav;
