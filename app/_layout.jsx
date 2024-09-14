import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";

/**
 * Functional component representing the layout for the home screen.
 * Loads fonts and handles splash screen visibility based on font loading status.
 * Renders a stack navigator with specific screens and a toast message component.
 */
function HomeLayout() {
  const [loaded, error] = useFonts({
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().then();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-new-category"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "Add New Category",
          }}
        />
        <Stack.Screen name="category-detail" />
        <Stack.Screen
          name="add-new-category-item"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "Add New Item",
          }}
        />
      </Stack>
      <Toast />
    </>
  );
}

export default HomeLayout;
