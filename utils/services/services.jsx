import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import upload from "../../lib/upload";
import { Linking } from "react-native";

/**
 * Asynchronously stores data in AsyncStorage with the provided key and value.
 *
 * @param {string} key - The key to identify the stored data in AsyncStorage.
 * @param {string} value - The data value to be stored.
 * @throws {Error} If an error occurs during the data storage process.
 */
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Error saving item" + e.message,
    });
  }
};

/**
 * Asynchronously retrieves data from AsyncStorage based on the provided key.
 *
 * @param {string} key - The key to identify the data in AsyncStorage.
 * @returns {Promise<string>} The retrieved data if it exists, otherwise null.
 * @throws {Error} If an error occurs during the data retrieval process.
 */
const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Error getting item" + e.message,
    });
  }
};

export const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 0.6,
  });

  if (!result.canceled) {
    return await upload(result.assets[0]);
  }

  return null;
};

const openUrl = (url) => {
  Linking.openURL(url).catch((err) => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Unable to open URL. " + err.message,
    });
  });
};

export default {
  storeData,
  getData,
  pickImage,
  openUrl,
};
