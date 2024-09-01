import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from "react-native";
import {client} from "../../utils/KindeConfig";
import Colors from "../../utils/Colors";
import {AntDesign, Ionicons} from "@expo/vector-icons"
import services from "../../utils/services/services";
import {router} from "expo-router";

function ColorPicker({selectedColor, handleChangeColor}) {
    return (
        <View style={styles.container}>
            {Colors.colorList.map((color, index) => (
                <TouchableOpacity onPress={() => handleChangeColor(color)} key={index} style={{...styles.colorItem, backgroundColor: color, borderWidth: (selectedColor === color ? 3 : 0)}}>

                </TouchableOpacity>
            ))}
        </View>
    );
}

export default ColorPicker;


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        justifyContent: "space-between",
        marginTop: 40
    },
    colorItem: {
        height: 30,
        width: 30,
        borderRadius: 30,
        borderColor: Colors.black
    }
})
