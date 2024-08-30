import React from 'react';
import {Stack} from "expo-router";

function HomeLayout() {
    return (
        <Stack
        screenOptions={{
            headerShown: false
        }}/>
    );
}

export default HomeLayout;
