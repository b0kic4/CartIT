import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/screens/Home/Home";
import Login from "./components/screens/Login";
import Register from "./components/screens/Register";
import { UserContextProvider, useUser } from "./context/UserContext";
import Profile from "./components/screens/Profile";
import SettingsScreen from "./components/screens/SettingsScreen";
import Cart from "./components/screens/Cart/Cart";
import ProductDetail from "./components/screens/ProductDetail";
import { CartProvider } from "./context/CartContext";
import TabNav from "./components/TabNav";
import Welcome from "./components/screens/Home/Welcome";
import { QuantityProvider } from "./context/QuantityContext";
import { StockProvider } from "./context/StockContext";
import CheckOut from "./components/screens/Cart/CheckOut";
import Payment from "./components/screens/Cart/Payment";
import { RememberMeProvider } from "./context/RememberMeContext";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserContextProvider>
      <CartProvider>
        <QuantityProvider>
          <StockProvider>
            <RememberMeProvider>
              <NavigationContainer>
                <Main />
                <StatusBar style="auto" />
              </NavigationContainer>
            </RememberMeProvider>
          </StockProvider>
        </QuantityProvider>
      </CartProvider>
    </UserContextProvider>
  );
}

function Main() {
  const user = useUser();
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabNav}
        options={{ headerShown: false }}
      />
      {!user && <Stack.Screen name="Welcome" component={Welcome} />}
      {user && (
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="CheckOut" component={CheckOut} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen
        name="ProductDetail"
        options={{ headerTitle: "Product", headerShown: false }}
      >
        {(props: { route: any; navigation: any }) => (
          <ProductDetail route={props.route} navigation={props.navigation} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
