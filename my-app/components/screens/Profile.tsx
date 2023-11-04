import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ImageURISource,
  ImageProps as DefaultImageProps,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import axios, { AxiosError } from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import {
  ImagePickerCanceledResult,
  ImagePickerResult,
  ImagePickerSuccessResult,
} from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";

type ImageSize = {
  width: number;
  height: number;
};

type ImageProps = DefaultImageProps & {
  source: ImageURISource;
};

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
  uri: string | null;
  width: number | null;
  height: number | null;
  type?: string | null;
};

const Profile = () => {
  const { user } = useUser();
  const [purchasedItems, setPurchasedItems] = useState<productItem[]>([]);
  const [showItems, setShowItems] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageFromBackend, setImageFromBackend] = useState<string | null>(null);
  const navigation = useNavigation();
  const fetchUserData = async () => {
    try {
      const userId = user?.id;
      const response = await axios.get(`http://localhost:8000/user/${userId}`);
      setPurchasedItems(response.data.purchasedItems);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserData();

        // Check if imageFromBackend exists and is non-empty before fetching
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

      const result: ImagePickerResult =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
        });
      // console.log("Result in pickImageAsync:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setSelectedImage(selectedImage); // Update the selected image state
        console.log("Selected image:", selectedImage);
        await postImage(selectedImage);
      }
    } catch (error) {
      console.error("Error in pickImageAsync:", error);
    }
  };

  const postImage = async (selectedImage: {
    uri: string | null;
    assetId?: string | null | undefined;
    width?: number;
    height?: number;
    type?: "image" | "video" | undefined;
    fileName?: string | null | undefined;
    fileSize?: number | undefined;
    exif?: Record<string, any> | null | undefined;
    base64?: string | null | undefined;
    duration?: number | null | undefined;
  }) => {
    try {
      if (selectedImage && selectedImage.uri && selectedImage.fileName) {
        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();
        const fileUri = selectedImage.uri;

        const getExtensionFromUri = (uri: string) => {
          const uriParts = uri.split(".");
          return uriParts[uriParts.length - 1]; // Extract the file extension
        };

        // Assuming selectedImage.uri holds the file URI
        const imageExtension = getExtensionFromUri(selectedImage.uri);
        const contentType = `image/${
          imageExtension === "jpg" ? "jpeg" : imageExtension
        }`;

        const formData = new FormData();
        formData.append("fileName", selectedImage.fileName);
        formData.append("uri", fileUri);
        formData.append("type", contentType);
        const storedToken = await AsyncStorage.getItem("token");
        const axiosConfig = {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        };

        const uploadResponse = await axios.post(
          "http://localhost:8000/user/images",
          formData,
          axiosConfig
        );

        console.log("Upload Reponse: ", uploadResponse.data);
        return uploadResponse.data.imageName;
      } else {
        throw new Error("Image URI not found");
      }
    } catch (error) {
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
  const getUserImage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/user/profile-image/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      console.log("Response Data: ", response.data);
      if (response && response.data) {
        const imageUrl = response.data.name; // Update this line according to the response structure
        setImageFromBackend(imageUrl);
        console.log("imageUrl from backend: " + imageUrl);
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
    <View style={styles.container}>
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
              {selectedImage || image ? (
                <>
                  <Image
                    source={{
                      uri: selectedImage?.uri || imageFromBackend || "",
                    }}
                    style={{ width: 200, height: 200 }}
                  />
                  <TouchableOpacity
                    onPress={getUserImage}
                    style={styles.uploadBtnContainer}
                  >
                    <Text style={styles.uploadBtn}>Update</Text>
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
            <TouchableOpacity onPress={getUserImage}>
              <Text>Get Image</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
      <View style={styles.secoundSectionMainContainer}>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: 15,
            backgroundColor: "white",
            width: "35%",
            height: "5%",
            borderRadius: 10,
          }}
          onPress={togglePurchasedItems}
        >
          <Text>Show Purchased Items</Text>
        </TouchableOpacity>
        {showItems ? (
          <Swiper
            style={styles.wrapper} // Ensure 'styles.wrapper' has the necessary Swiper styles
            loop={false}
            paginationStyle={styles.paginationStyle} // Ensure this style is defined
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
                    Price: ${item.totalItems}
                  </Text>
                  <Text style={styles.productTitle}>
                    Price: ${item.totalPrice}
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
