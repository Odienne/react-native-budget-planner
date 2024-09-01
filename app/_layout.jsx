import React from 'react';
import {Stack} from "expo-router";
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import Toast from 'react-native-toast-message';

function HomeLayout() {
    const [loaded, error] = useFonts({
        'Rubik-Regular': require('../assets/fonts/Rubik-Regular.ttf'),
        'Rubik-Bold': require('../assets/fonts/Rubik-Bold.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen name='(tabs)' options={
                    {
                        headerShown: false,
                    }
                }/>
                <Stack.Screen name="add-new-category" options={{
                    presentation: "modal",
                    headerShown: true,
                    headerTitle: "Add New Category"
                }}/>
                <Stack.Screen name="category-detail"/>
                <Stack.Screen name="add-new-category-item" options={{
                    presentation: "modal",
                    headerShown: true,
                    headerTitle: "Add New Item"
                }}/>
            </Stack>
            <Toast />
        </>
    );
}

export default HomeLayout;
