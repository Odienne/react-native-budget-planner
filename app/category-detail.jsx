import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import {Link, router, useFocusEffect, useLocalSearchParams} from "expo-router";
import {collection, deleteDoc, doc, getDocs, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../utils/FirebaseConfig";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../utils/Colors";
import CategoryInfo from "./components/CategoryInfo";
import Toast from "react-native-toast-message";


function CategoryDetail() {
    const {categoryId} = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState(false);

    useEffect(() => {
        setLoading(true)
        const catRef = collection(db, "category");
        const q = query(catRef, where("id", "==", categoryId));


        const unSub = onSnapshot(q, (querySnapshot) => {
            setCategory(querySnapshot.docs[0]?.data())
            setLoading(false)
        });

        return () => {
            unSub();
        }
    }, [categoryId])

    const deleteCategory = () => {
        Alert.alert('Are you sure?', 'You are deleting this category', [
            {
                text: 'Cancel',
                onPress: () => {
                    console.log('Cancel Pressed')
                },
                style: 'cancel',
            },
            {
                text: 'OK', onPress: async () => {
                    const catRef = doc(db, 'category', category.id);
                    try {
                        await deleteDoc(catRef);
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Category removed!'
                        });
                        router.replace('/(tabs)')
                    } catch (err) {
                        console.log(err.message)
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: 'Unable to remove category: ' + err.message
                        });
                    }
                }
            },
        ]);
    }

    return (
        <ScrollView style={styles.container} >
            <View style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                <Ionicons onPress={() => router.back()} name="arrow-back-circle" size={40} color={Colors.black}/>
                <Link href={{pathname: "/add-new-category-item", params: {categoryId}}} style={styles.addButton}>
                    <Ionicons name="add-circle" size={40} color={Colors.primary}/>
                </Link>
            </View>
            <View style={{marginTop: 24}}>
                <CategoryInfo category={category} deleteCategory={deleteCategory}/>
            </View>
        </ScrollView>
    );

}

export default CategoryDetail;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: 40,
        padding: 24,
        backgroundColor: Colors.lightgrey
    },
})
