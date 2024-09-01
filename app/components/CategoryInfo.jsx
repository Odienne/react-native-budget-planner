import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Alert,
    Linking
} from "react-native";
import {Feather, Ionicons} from "@expo/vector-icons";
import {Link, router} from "expo-router";
import Colors from "../../utils/Colors";
import {db} from "../../utils/FirebaseConfig";
import {arrayUnion, deleteDoc, doc, updateDoc} from "firebase/firestore";
import Toast from "react-native-toast-message";

function CategoryInfo(props) {
    const {category, deleteCategory} = props;

    const [currentBudget, setCurrentBudget] = useState(0);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        let sum = 0;
        category?.items?.map(item => {
            sum += parseFloat(item.cost);
        })
        setCurrentBudget(sum);
        let percentage = sum === 0 ? 0 : (100 * sum / category.assignedBudget) + "%";
        if (parseFloat(percentage) > 100) percentage = '100%';
        setPercentage(percentage);
    }, [category])

    const deleteCategoryItem = (itemId) => {
        Alert.alert('Are you sure?', 'You are deleting this item', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: async () => {
                    const catRef = doc(db, 'category', category.id);
                    try {
                        const field = category.items.filter(i => i.id === itemId);
                        const indexOf = category.items.indexOf(field[0]);

                        if (indexOf === -1) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Unable to remove item, try later'
                            });
                            return;
                        }

                        const items = category.items;
                        items.splice(indexOf, 1);
                        await updateDoc(catRef, {
                            items
                        });
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Item removed!'
                        });
                    } catch (err) {
                        console.log(err.message)
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: 'Unable to remove item: ' + err.message
                        });
                    }
                }
            },
        ]);
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

    return (
        <ScrollView contentContainerStyle={{marginBottom: 24}}>
            {category &&
                <View>
                    <View style={{...styles.category}}
                          key={category.id}>
                        <Text style={{
                            ...styles.categoryIcon,
                            backgroundColor: category.color
                        }}>{category.icon}</Text>
                        <View style={{flex: 1}}>
                            <Text style={styles.categoryName}>{category.name}</Text>
                            <Text>{category?.items?.length} items</Text>
                        </View>
                        <Ionicons onPress={() => deleteCategory(category)} name="trash" size={24} color={Colors.red}/>
                    </View>
                    <View>
                        <View style={styles.budgets}>
                            <Text style={styles.amount}>Current: {currentBudget}€</Text>
                            <Text style={styles.amount}>Assigned budget: {category.assignedBudget}€</Text>
                        </View>

                        <View style={styles.progressBarContainer}>
                            <View style={{
                                ...styles.progressBarCurrent,
                                backgroundColor: category.color,
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

                    <View style={{marginTop: 40}}>
                        <Text style={styles.title}>Expenses</Text>
                        {category?.items && category?.items.map((item, index) => (
                            <View key={index} style={styles.expenseCard}>
                                <Image style={styles.image} source={{uri: item.image}}/>
                                <View style={{flex: 1, marginLeft: 16}}>
                                    <Text style={styles.subtitle}>{item.name} - {item.cost}€</Text>
                                    <Text style={{fontSize: 11}}>{item.desc}</Text>
                                </View>
                                <View style={{marginLeft: 32, gap: 16}}>
                                    <Ionicons onPress={() => deleteCategoryItem(item.id)} name="trash" size={24}
                                              color={Colors.red}/>
                                    {item.url &&
                                        <Ionicons onPress={() => openUrl(item.url)} name="open-outline" size={24}
                                                  color={Colors.red}/>
                                    }
                                </View>
                            </View>
                        ))}
                    </View>
                </View>}
        </ScrollView>
    );
}

export default CategoryInfo;

const styles = StyleSheet.create({
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
        width: 100,
        height: 100,
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
    categories: {
        display: "flex",
        flexDirection: "column",
        gap: 16

    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Rubik-Bold',
    },
    categoryName: {
        fontSize: 24,
        fontFamily: 'Rubik-Bold'
    },
    amount: {
        fontSize: 12,
        fontFamily: 'Rubik-Bold'
    },
    categoryIcon: {
        padding: 16,
        borderRadius: 8,
        fontSize: 24
    },
    category: {
        borderRadius: 8,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 32,
        backgroundColor: Colors.white,
        padding: 12
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 24,
    },
    flex: {
        display: "flex",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        gap: 24
    },
    title: {
        fontSize: 24,
        fontFamily: 'Rubik-Bold',
        marginBottom: 16
    },
})
