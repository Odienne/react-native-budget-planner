import React, {useEffect} from 'react';
import {Text, View, StyleSheet, Button, Image, TouchableOpacity} from "react-native";
import loginBg from "./../../assets/images/loginBg.jpg";
import Colors from "../../utils/Colors";
import {useRouter} from "expo-router";
import {client} from "../../utils/KindeConfig";
import services from "../../utils/services/services";

function Index() {

    const router = useRouter();


    const handleSignIn = async () => {
        const token = await client.login();

        if (token) {
            await services.storeData('login', 'true')
            router.replace("/");
        }
    };

    return (
        <View style={styles.flex}>
            <Image style={styles.bgImage} source={loginBg}/>

            <View style={styles.main}>
                <Text style={styles.heading}>Personal Budget Planner</Text>
                <Text style={styles.subHeading}>Stay on track with your expenses !</Text>

                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>Login/Signup</Text>
                </TouchableOpacity>

                <Text style={styles.smallText}>* By login in or signin in, you agree to our terms and conditions of
                    service</Text>
            </View>
        </View>
    );
}

export default Index;

const styles = StyleSheet.create({
    flex: {
        display: 'flex',
        alignItems: 'center'
    },
    main: {
        backgroundColor: Colors.primary,
        width: "100%",
        height: "100%",
        marginTop: -60,
        borderRadius: 32,
        padding: 24
    },
    bgImage: {
        width: "100%",
        height: "30%",
    },
    heading: {
        fontSize: 32,
        color: Colors.white,
        fontWeight: "bold",
        textAlign: 'center'
    },
    subHeading: {
        fontSize: 16,
        color: Colors.white,
        marginTop: 24,
        textAlign: 'center'
    },
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
    smallText: {
        fontSize: 11,
        color: Colors.white,
        padding: 8
    }
})
