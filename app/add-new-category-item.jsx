import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../utils/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { pickImage } from "../utils/services/services";

function AddNewCategoryItem() {
  const placeholderImg = "https://placehold.co/600x400/orange/white.png";
  const { categoryId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(placeholderImg);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");

  const handlePickImage = async () => {
    setLoading(true);
    const uploadedImg = await pickImage();
    if (uploadedImg) setImage(uploadedImg);
    setLoading(false);
  };

  const handlePress = async () => {
    setLoading(true);
    try {
      const itemData = {
        image,
        name,
        cost,
        url,
        desc,
        createdAt: new Date(),
        id: Date.now(),
      };

      const catRef = doc(db, "category", categoryId);
      await updateDoc(catRef, {
        items: arrayUnion(itemData),
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Item added!",
      });

      setImage(placeholderImg);
      setName("");
      setCost("");
      setUrl("");
      setDesc("");

      router.navigate({
        pathname: "/category-detail",
        params: {
          categoryId,
        },
      });
    } catch (err) {
      console.log(err.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to add item: " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity onPress={handlePickImage}>
            {loading ? (
              <View
                style={{
                  ...styles.image,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>Upload en cours...</Text>
              </View>
            ) : (
              <Image style={styles.image} source={{ uri: image }} />
            )}
          </TouchableOpacity>

          <View style={styles.flex}>
            <FontAwesome6 name="tag" size={24} color={Colors.black} />
            <TextInput
              value={name}
              onChangeText={(name) => setName(name)}
              placeholder="Name"
              style={styles.textInput}
            />
          </View>

          <View style={styles.flex}>
            <FontAwesome6 name="dollar-sign" size={24} color={Colors.black} />
            <TextInput
              value={cost}
              onChangeText={(cost) => setCost(cost)}
              placeholder="Cost"
              keyboardType="numeric"
              style={styles.textInput}
            />
          </View>

          <View style={styles.flex}>
            <FontAwesome6 name="link" size={24} color={Colors.black} />
            <TextInput
              value={url}
              onChangeText={(url) => setUrl(url)}
              placeholder="Url"
              style={styles.textInput}
            />
          </View>

          <View style={styles.flex}>
            <FontAwesome6 name="pencil" size={24} color={Colors.black} />
            <TextInput
              value={desc}
              onChangeText={(desc) => setDesc(desc)}
              placeholder="Note"
              style={styles.textInput}
              numberOfLines={4}
            />
          </View>
        </View>
        <TouchableOpacity
          disabled={!name || !cost || loading}
          onPress={handlePress}
          style={{
            ...styles.button,
            backgroundColor: !name || !cost ? Colors.lightgrey : Colors.black,
          }}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Create</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AddNewCategoryItem;

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 32,
    margin: 24,
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Rubik-Regular",
    textAlign: "center",
    color: Colors.white,
    fontSize: 16,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 16,
    marginBottom: 8,
    marginTop: 8,
    backgroundColor: "white",
    borderRadius: 16,
    borderColor: Colors.grey,
  },
  textInput: {
    borderWidth: 0,
    flex: 1,
    padding: 8,
    fontSize: 16,
    fontFamily: "Rubik-Regular",
  },
  input: {
    textAlign: "center",
    fontSize: 32,
    padding: 24,
    borderRadius: 60,
    color: Colors.white,
    marginTop: 40,
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    padding: 24,
  },
});
