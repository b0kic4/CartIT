import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
// Context and Assets
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContextProvider";
import { Theme, lightTheme, darkTheme } from "../../assets/themes/themes";

import axios, { AxiosError } from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";
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
  totalItems: number;
}

type ImageInfo = {
  fileName: string | null;
  fileSize: number | null;
  uri: string | null;
  width: number | null;
  height: number | null;
  type?: string | null;
};

const Profile = () => {
  const { user } = useUser();
  const [purchasedItems, setPurchasedItems] = useState<productItem[]>([]);
  const [showItems, setShowItems] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageUrlFromBackend, setImageUrlFromBackend] = useState<string | null>(
    null
  );
  const navigation = useNavigation();
  const { theme } = useTheme();
  const storedToken = AsyncStorage.getItem("token");
  const fetchUserData = async () => {
    try {
      const userId = user?.id;
      const response = await axios.get(`http://localhost:8000/user/${userId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setPurchasedItems(response.data.purchasedItems);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserData();
        await getUserImage();
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [user]);

  const togglePurchasedItems = () => {
    setShowItems(!showItems);
  };
  function goBack() {
    navigation.goBack();
  }

  const pickImageAsync = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("Sorry, we need your permissions");
      }

      const result: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.cancelled) {
        return;
      }

      const selectedAsset = result.assets[0];

      setSelectedImage({
        uri: selectedAsset.uri,
        width: selectedAsset.width || null,
        height: selectedAsset.height || null,
        type: selectedAsset.type || null,
        fileSize: selectedAsset.fileSize || null,
        fileName: selectedAsset.filename || null,
      });

      const localUri = selectedAsset.uri;
      const fileName = localUri.split("/").pop();
      const formData = new FormData();
      formData.append("file", {
        uri: selectedAsset.uri,
        type: "image/jpeg",
        name: fileName || "image.jpg",
      } as any);
      await deleteImage();
      await postImage(formData);
    } catch (error) {
      console.error("Error in pickImageAsync:", error);
    }
  };

  const postImage = async (formData: FormData) => {
    try {
      await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log("Upload Response:", response.data);
    } catch (error) {
      console.error("Error in postImage:", error);
    }
  };
  // Function for deleting previously uploaded image from database
  const deleteImage = async () => {
    try {
      // Check if the user has an existing image to delete
      if (imageUrlFromBackend) {
        const storedToken = await AsyncStorage.getItem("token");
        const response = await axios.delete(
          `http://localhost:8000/user/profile-image-delete/${user?.id}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        console.log("Image deleted:", response.data);
      }
    } catch (error) {
      console.error("Error deleting user image:", error);
    }
  };
  const getUserImage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/user/profile-image/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      if (response && response.data) {
        setImageUrlFromBackend(response.data.imageUrl);
      } else {
        console.log("No user image found");
      }
    } catch (error) {
      console.error("Error in getUserImage:", error);
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={42} style={{ marginLeft: 40 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.firstSectionMainContainer}>
        <View style={styles.uploadingPhotoContainer}>
          <TouchableOpacity onPress={pickImageAsync}>
            <View style={styles.uploadingPhotoContainer}>
              {selectedImage || image || imageUrlFromBackend ? (
                <>
                  <Image
                    source={{
                      uri: selectedImage?.uri || imageUrlFromBackend || "",
                    }}
                    style={{ width: 200, height: 200 }}
                  />
                  <TouchableOpacity
                    onPress={getUserImage}
                    style={styles.uploadBtnContainer}
                  >
                    <Text style={styles.uploadBtn}>Update image</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.uploadBtnContainer}>
                  <Text style={styles.uploadBtn}>Tap to select image</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 5 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Welcome, {user?.username}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.secoundSectionMainContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: 15,
            backgroundColor: "white",
            width: 186,
            borderRadius: 10,
          }}
          onPress={togglePurchasedItems}
        >
          <Text
            style={{
              backgroundColor: theme.background,

              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            Show Purchased Items
          </Text>
        </TouchableOpacity>
        {showItems ? (
          <Swiper
            style={styles.wrapper}
            loop={false}
            paginationStyle={styles.paginationStyle}
          >
            {purchasedItems.map((item, index) => (
              <View key={index} style={styles.carouselItem}>
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.imageThumbnail}
                  onError={() => console.log("Error loading image")}
                />
                <Text style={styles.productTitle}>{item.title}</Text>
                <View>
                  <Text style={styles.productTitle}>
                    Category: {item.category}
                  </Text>
                  <Text style={styles.productTitle}>
                    Quantity: {item.quantity}
                  </Text>
                  <Text style={styles.productTitle}>Price: ${item.price}</Text>
                  <Text style={styles.productTitle}>
                    Total Items: {item.totalItems}
                  </Text>
                  <Text style={styles.productTitle}>
                    Total Price: ${item.totalPrice}
                  </Text>
                </View>
              </View>
            ))}
          </Swiper>
        ) : null}
      </View>
    </View>
  );
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
  firstSectionMainContainer: {
    marginTop: 25,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  uploadingPhotoContainer: {
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: "#efefef",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "25%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  secoundSectionMainContainer: {
    height: "60%",
    marginTop: 20,
  },
  wrapper: {},

  // STYLES
  carouselItem: {
    marginBottom: 120,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageThumbnail: {
    width: 350,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productDetails: {
    alignItems: "center",
  },
  brand: {
    marginTop: 5,
  },
  category: {
    marginTop: 5,
  },

  price: {
    marginTop: 5,
    fontWeight: "bold",
  },
  paginationStyle: {
    position: "absolute",
    bottom: 190,
    width: "100%",
    height: "40%",
    alignItems: "center",
  },
});

export default Profile;
