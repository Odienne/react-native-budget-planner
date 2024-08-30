import React, {useEffect} from 'react';
import {Text, View, StyleSheet, Button, TouchableOpacity} from "react-native";
import {Link, useRouter} from "expo-router";
import services from "../utils/services/services";
import {client} from "../utils/KindeConfig";
import Colors from "../utils/Colors";

function Home() {
    const router = useRouter();


    const checkUserAuth = async () => {
        const logged = await services.getData('login');

        if (!logged) {
            router.replace('/login')
        }
    }

    const handleLogout = async () => {
        const loggedOut = await client.logout();
        if (loggedOut) {
            await services.storeData('login', 'false');
            router.replace('/login')
        }
    };

    useEffect(() => {
        checkUserAuth();
    }, []);


    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    button: {
        padding: 16,
        borderRadius: 32,
        marginTop: 100,
        backgroundColor: Colors.white
    },
    buttonText: {
        textAlign: 'center',
        color: Colors.primary,
    },
})

