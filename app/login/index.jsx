import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import loginBg from "./../../assets/images/loginBg.jpg";
import Colors from "../../utils/Colors";
import { useRouter } from "expo-router";
import services, { pickImage } from "../../utils/services/services";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../utils/FirebaseConfig";
import Toast from "react-native-toast-message";
import { doc, setDoc } from "firebase/firestore";

/**
 * This is the login page. It allows users to login or signin.
 * If the user is already logged in, it redirects him to the home page.
 * If the user is not logged in, it shows him the login form.
 * If the user clicks on the signin button, it shows him the signin form.
 * If the user clicks on the login button, it logs him in.
 * If the user clicks on the signin button, it creates an account for the user.
 */
function Index() {
  const placeholderImg = "https://placehold.co/600x400/orange/white.png";
  const [image, setImage] = useState(placeholderImg);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPwd, setSignupPwd] = useState("");
  const [signupUsername, setSignupUsername] = useState("");

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    // Password validation logic (e.g., minimum length, special characters)
    return password.length >= 8;
  };

  /**
   * This function is called when the user clicks on the signin button.
   * It creates an account for the user and logs him in.
   */
  const handleSignIn = async () => {
    setLoading(true);

    if (!validateEmail(signupEmail) || !validatePassword(signupPwd)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid email or password format",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPwd,
      );

      const data = {
        given_name: signupUsername,
        email: signupEmail,
        picture: image,
        id: response.user.uid,
      };

      await setDoc(doc(db, "users", signupEmail), data);
      Toast.show({
        type: "success",
        text1: "Welcome",
        text2: "Account created",
      });
      await services.storeData("login", signupEmail);
      router.replace("/");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * This function is called when the user clicks on the login button.
   * It logs him in.
   */
  const login = async () => {
    setLoading(true);

    if (!validateEmail(loginEmail) || !validatePassword(loginPwd)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid email or password format",
      });
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPwd);
      Toast.show({
        type: "success",
        text1: "Welcome",
        text2: "Successful login",
      });
      await services.storeData("login", loginEmail);
      router.replace("/");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * This function is called when the user clicks on the pick image button.
   * It allows the user to pick an image from the image library.
   */
  const handlePickImage = async () => {
    setLoading(true);
    const uploadedImg = await pickImage();
    if (uploadedImg) setImage(uploadedImg);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.flex}>
      <Image style={styles.bgImage} source={loginBg} />

      <ScrollView style={styles.main}>
        <Text style={styles.heading}>Personal Budget Planner</Text>
        <Text style={styles.subHeading}>
          Stay on track with your expenses !
        </Text>

        <View>
          <Text style={{ ...styles.heading, marginTop: 32 }}>Welcome back</Text>
          <View style={styles.flexInput}>
            <TextInput
              value={loginEmail}
              onChangeText={(text) => setLoginEmail(text)}
              style={styles.textInput}
              textContentType="text"
              placeholder="Email"
              name="email"
            />
          </View>
          <View style={styles.flexInput}>
            <TextInput
              value={loginPwd}
              onChangeText={(text) => setLoginPwd(text)}
              style={styles.textInput}
              textContentType="password"
              placeholder="Password"
              name="password"
            />
          </View>

          <TouchableOpacity onPress={login} style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>

          <Text style={styles.smallText}>
            * By login in or signin in, you agree to our terms and conditions of
            service
          </Text>
        </View>
        <View>
          <Text style={{ ...styles.heading, marginTop: 32 }}>
            Create account
          </Text>

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
          <View style={styles.flexInput}>
            <TextInput
              value={signupEmail}
              onChangeText={(text) => setSignupEmail(text)}
              style={styles.textInput}
              textContentType="text"
              placeholder="Email"
              name="email"
            />
          </View>
          <View style={styles.flexInput}>
            <TextInput
              value={signupUsername}
              onChangeText={(text) => setSignupUsername(text)}
              style={styles.textInput}
              textContentType="text"
              placeholder="Username"
              name="username"
            />
          </View>
          <View style={styles.flexInput}>
            <TextInput
              value={signupPwd}
              onChangeText={(text) => setSignupPwd(text)}
              style={styles.textInput}
              textContentType="password"
              placeholder="Password"
              name="password"
            />
          </View>
          <TouchableOpacity onPress={handleSignIn} style={styles.button}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.smallText}>
          * By login in or signin in, you agree to our terms and conditions of
          service
        </Text>
      </ScrollView>
    </ScrollView>
  );
}

export default Index;

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 16,
    alignSelf: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
  flexInput: {
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
  main: {
    backgroundColor: Colors.primary,
    width: "100%",
    padding: 24,
    paddingTop: 48,
  },
  bgImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  heading: {
    fontSize: 32,
    color: Colors.white,
    fontFamily: "Rubik-Bold",
    textAlign: "center",
  },
  subHeading: {
    fontSize: 16,
    color: Colors.white,
    marginTop: 24,
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: "Rubik-Regular",
  },
  button: {
    padding: 16,
    borderRadius: 32,
    marginTop: 18,
    backgroundColor: Colors.white,
    fontFamily: "Rubik-Regular",
  },
  buttonText: {
    textAlign: "center",
    color: Colors.primary,
  },
  smallText: {
    fontSize: 11,
    color: Colors.white,
    padding: 8,
  },
  textInput: {
    borderWidth: 0,
    flex: 1,
    padding: 8,
    fontSize: 16,
    fontFamily: "Rubik-Regular",
  },
});
