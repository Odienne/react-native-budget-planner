import React from 'react';
import {Image, Linking, RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {collection, doc, getDoc, limit, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../../utils/FirebaseConfig";
import Colors from "../../utils/Colors";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import services from "../../utils/services/services";

function History() {
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState(null);
    const [items, setItems] = useState(null);

    const getUserData = async () => {
        const logged = await services.getData('login');
        const docRef = doc(db, "users", logged);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setEmail(logged);
        } else {
            setEmail(null);
        }
    }

    const openUrl = (url) => {
        Linking.openURL(url).catch(err => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Unable to open URL. ' + err.message
            });
        })
    }

    const calculateCategoryTotalCost = (category) => {
        let totalCost = 0;
        category.items.forEach(i => {
            totalCost += parseFloat(i.cost)
        })
        return totalCost;
    }

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        setLoading(true)
        const catRef = collection(db, "category");
        const q = query(catRef, where("createdBy", "==", email), limit(5));

        const unSub = onSnapshot(q, (querySnapshot) => {

            const categories = [];

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    categories.push(doc.data());
                });
            }
            categories.sort((a, b) => {
                let aTotalCost = calculateCategoryTotalCost(a);
                let bTotalCost = calculateCategoryTotalCost(b);
                return bTotalCost - aTotalCost;
            })
            setCategories(categories)

            const itemsData = [];
            categories.forEach(c =>
                c.items.map(i =>
                    itemsData.push(i)
                ));
            setItems(itemsData);
            setLoading(false)
        });

        return () => {
            unSub();
        }
    }, [email])


    return (
        <ScrollView style={{
            backgroundColor: Colors.lightgrey
        }}>
            <View style={styles.headerContainer}>
                <View><Text style={styles.title}>Expenses history</Text></View>
            </View>
            <View style={{...styles.card, margin: 24}}>
                {loading ?
                    <View style={{padding: 24}}><Text style={styles.title}>Loading data...</Text></View>
                    :
                    <View>
                        {items && items.map((item, index) => (
                            <View key={index} style={styles.expenseCard}>
                                <Image style={styles.image} source={{uri: item.image}}/>
                                <View style={{flex: 1, marginLeft: 16}}>
                                    <Text style={styles.subtitle}>{item.name} - {item.cost}€</Text>
                                    <Text style={{fontSize: 11}}>{item.desc}</Text>
                                </View>
                                <View style={{marginLeft: 32, gap: 16}}>
                                    {item.url &&
                                        <Ionicons onPress={() => openUrl(item.url)} name="open-outline" size={24}
                                                  color={Colors.red}/>
                                    }
                                </View>
                            </View>
                        ))}
                    </View>
                }
            </View>
        </ScrollView>
    );
}

export default History;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: 40,
        padding: 24,
    },
    legendTitle: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 8,
        alignItems: "center",
        gap: 8,
        fontFamily: 'Rubik-Regular'
    },
    headerContainer: {
        marginTop: 24,
        padding: 24,
        backgroundColor: Colors.primary,
        height: 150
    },
    subContainer: {
        marginTop: 8,
        display: "flex",
        flexDirection: "row",
        gap: 24
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
    title: {
        fontSize: 24,
        fontFamily: 'Rubik-Bold',
        marginBottom: 16,
        color: Colors.white
    },
    card: {
        marginTop: -80,
        backgroundColor: Colors.white,
        padding: 24,
        borderRadius: 16,
        elevation: 1,
    },
    cardContainer: {
        padding: 24
    },
    addButton: {
        position: "absolute",
        bottom: -64,
        right: 16,
        zIndex: 1
    },
    expenseCard: {
        marginBottom: 16,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    budgets: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24
    },
})

