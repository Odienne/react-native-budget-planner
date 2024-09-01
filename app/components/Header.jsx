import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from "react-native";
import {client} from "../../utils/KindeConfig";
import Colors from "../../utils/Colors";
import {AntDesign, Ionicons} from "@expo/vector-icons"
import services from "../../utils/services/services";
import {router} from "expo-router";

function Header({user}) {
    const handleLogout = async () => {
        const loggedOut = await client.logout();
        if (loggedOut) {
            await services.storeData('login', 'false');
            router.replace('/login')
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Image style={styles.avatar} source={{uri: user?.picture}}/>
                <Text style={styles.welcome}>Welcome, {user?.given_name}.</Text>
            </View>

            <View style={styles.flex}>
                <Ionicons name="notifications" size={24} color={Colors.white} />
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <AntDesign name="logout" size={20} color={Colors.white}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Header;


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        justifyContent: "space-between"
    },
    avatar: {
        height: 48,
        width: 48,
        borderRadius: 48
    },
    welcome: {
        fontSize: 16,
        color: Colors.white,
        fontFamily: 'Rubik-Regular'
    },
    flex: {
        display: "flex",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        gap: 24
    }
})
