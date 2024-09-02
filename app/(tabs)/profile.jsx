import React from 'react';
import {Image, Linking, ScrollView, StyleSheet, Text, View} from "react-native";
import Header from "../components/Header";
import {useEffect, useState} from "react";
import services from "../../utils/services/services";
import {useRouter} from "expo-router";
import Colors from "../../utils/Colors";
import {Feather, Ionicons} from "@expo/vector-icons";
import {collection, doc, getDoc, limit, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../../utils/FirebaseConfig";
import Toast from "react-native-toast-message";

function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [highestExpenses, setHighestExpenses] = useState([]);
    const [maximalBudget, setMaximalBudget] = useState(0);
    const [currentBudget, setCurrentBudget] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(null);

    const getUserData = async () => {
        const logged = await services.getData('login');
        const docRef = doc(db, "users", logged);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUser(docSnap.data());
            setEmail(logged);
        } else {
            setUser(null);
            setEmail(null);
        }
    }

    const checkUserAuth = async () => {
        const logged = await services.getData('login');

        if (!logged) {
            router.replace('/login')
        }
    }

    const calculateCategoryTotalCost = (category) => {
        let totalCost = 0;
        category.items.forEach(i => {
            totalCost += parseFloat(i.cost)
        })
        return totalCost;
    }


    useEffect(() => {
        checkUserAuth().then(() => {
            getUserData();
        });
    }, []);

    useEffect(() => {
        let sum = 0;
        let maxSum = 0;

        if (!categories) return;

        categories.forEach(c => {
            maxSum += parseFloat(c.assignedBudget)
            c?.items?.map(item => {
                sum += parseFloat(item.cost);
            })
        });
        setCurrentBudget(sum);
        setMaximalBudget(maxSum);
        let percentage = sum === 0 ? 0 : (100 * sum / maxSum) + "%";
        if (parseFloat(percentage) > 100) percentage = '100%';
        setPercentage(percentage);
    }, [categories])

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
            itemsData.sort((a, b) => {
                return b.cost - a.cost;
            })
            setHighestExpenses(itemsData.slice(0, 3))
            setLoading(false)
        });

        return () => {
            unSub();
        }
    }, [email])

    const openUrl = (url) => {
        Linking.openURL(url).catch(err => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Unable to open URL. ' + err.message
            });
        })
    }

    return (
        <ScrollView style={{
            backgroundColor: Colors.lightgrey
        }}>
            <View style={styles.headerContainer}>
                <Header user={user}/>

                <View style={styles.budgets}>
                    <Text style={styles.amount}>Current: {currentBudget}€</Text>
                    <Text style={styles.amount}>Maximal budget: {maximalBudget}€</Text>
                </View>

                <View style={styles.progressBarContainer}>
                    <View style={{
                        ...styles.progressBarCurrent,
                        backgroundColor: Colors.black,
                        width: percentage
                    }}/>

                    {parseFloat(percentage) >= 100 &&
                        <View style={styles.overBudgetContainer}>
                            <Feather name="alert-triangle" size={16}
                                     color={Colors.red}/>
                        </View>
                    }
                </View>
            </View>

            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>Highest expenses</Text>

                    {highestExpenses.map((item, index) => (
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
            </View>
        </ScrollView>
    );
}

export default Profile;

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontFamily: 'Rubik-Bold',
        marginBottom: 16
    },
    headerContainer: {
        marginTop: 24,
        padding: 24,
        backgroundColor: Colors.primary,
        height: 180
    },
    card: {
        marginTop: -50,
        backgroundColor: Colors.white,
        padding: 24,
        borderRadius: 16,
        elevation: 1,
    },
    cardContainer: {
        padding: 24
    },
    amount: {
        fontSize: 12,
        fontFamily: 'Rubik-Bold'
    },
    overBudgetContainer: {
        position: "absolute",
        right: 0,
        top: -4,
        backgroundColor: "white",
        height: 24,
        width: 24,
        borderRadius: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
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
    progressBarContainer: {
        height: 16,
        backgroundColor: Colors.white,
        width: "100%",
        borderRadius: 8
    },
    progressBarCurrent: {
        height: 16,
        borderRadius: 8,
    },
})
