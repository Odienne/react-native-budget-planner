import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal, Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Colors from "../utils/Colors";
import {FontAwesome6, MaterialIcons} from "@expo/vector-icons";
import {db} from "../utils/FirebaseConfig";
import {doc, setDoc, collection} from "firebase/firestore";
import Toast from "react-native-toast-message";
import {router, useLocalSearchParams} from "expo-router";
import ColorPicker, {Panel1, Swatches, Preview, OpacitySlider, HueSlider} from 'reanimated-color-picker';
import {PreviewText} from "reanimated-color-picker/lib/src/components/PreviewText";
import EmojiPicker, {emojiFromUtf16} from "rn-emoji-picker"
import {emojis} from "rn-emoji-picker/dist/data"

function AddNewCategory() {
    const params = useLocalSearchParams();
    const {email} = params;
    const [loading, setLoading] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [selectedColor, setSelectedColor] = useState(Colors.primary);
    const [categoryName, setCategoryName] = useState(null);
    const [totalBudget, setTotalBudget] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handlePress = async () => {
        setLoading(true);
        try {
            const docData = {
                name: categoryName,
                color: selectedColor,
                icon: selectedIcon,
                assignedBudget: totalBudget,
                createdAt: new Date(),
                createdBy: email,
                items: []
            };

            const catRef = collection(db, 'category');
            const newCatRef = doc(catRef);
            await setDoc(newCatRef, {...docData, id: newCatRef.id});

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Category created!'
            });

            router.replace({
                pathname: 'category-detail', params: {categoryId: newCatRef.id}
            })
        } catch (err) {
            console.log(err.message)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Unable to create category: ' + err.message
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView>
            <ScrollView contentContainerStyle={styles.centeredView}>
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <EmojiPicker
                                emojis={emojis} // emojis data source see data/emojis
                                darkMode={false}
                                defaultCategory={'food'}
                                perLine={6}
                                onSelect={emoji => {
                                    setModalVisible(!modalVisible);
                                    setSelectedIcon(emoji.emoji);
                                }}/>
                        </View>
                    </View>
                </Modal>
                <Pressable
                    style={[styles.button, {backgroundColor: selectedColor}]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.textStyle}>{selectedIcon}</Text>
                </Pressable>
            </ScrollView>

            <View style={styles.container}>

                <View style={styles.pickerContainer}>
                    <ColorPicker
                        value={selectedColor}
                        sliderThickness={25}
                        thumbSize={24}
                        thumbShape='circle'
                        onChange={(color) => setSelectedColor(color.hex)}
                        boundedThumb
                    >
                        <Panel1 style={styles.panelStyle}/>
                        <HueSlider style={styles.sliderStyle}/>
                        <OpacitySlider style={styles.sliderStyle}/>
                        <View style={styles.previewTxtContainer}>
                            <PreviewText style={{color: '#707070'}}/>
                        </View>
                    </ColorPicker>
                </View>
            </View>

            <View style={styles.flex}>
                <MaterialIcons name="local-offer" size={24} color={Colors.black}/>
                <TextInput onChangeText={(text) => setCategoryName(text)} placeholder="Category name"
                           style={styles.textInput}/>
            </View>

            <View style={styles.flex}>
                <FontAwesome6 name="dollar-sign" size={24} color={Colors.black}/>
                <TextInput onChangeText={(budget) => setTotalBudget(budget)} placeholder="Total budget"
                           keyboardType="numeric" style={styles.textInput}/>
            </View>

            <TouchableOpacity disabled={!categoryName || !totalBudget || loading} onPress={handlePress}
                              style={{
                                  ...styles.sendButton,
                                  backgroundColor: (!categoryName || !totalBudget ? Colors.disabled : selectedColor),
                              }}>
                {loading ?
                    <ActivityIndicator color={Colors.white}/>
                    :
                    <Text style={styles.buttonText}>Create</Text>
                }
            </TouchableOpacity>
        </ScrollView>
    );
}

export default AddNewCategory;

const styles = StyleSheet.create({
    sendButton: {
        padding: 16,
        borderRadius: 32,
        margin: 24,
        marginTop: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        height: 120,
        width: 120,
        borderRadius: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontFamily: "Rubik-Regular",
        textAlign: "center",
        color: Colors.white,
        fontSize: 16
    },
    flex: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        padding: 16,
        margin: 24,
        marginBottom: 8,
        backgroundColor: "white",
        borderRadius: 16,
        borderColor: Colors.grey,
    },
    textInput: {
        borderWidth: 0,
        flex: 1,
        padding: 8,
        fontSize: 16,
        fontFamily: "Rubik-Regular"
    },
    input: {
        textAlign: "center",
        fontSize: 32,
        padding: 24,
        borderRadius: 60,
        color: Colors.white,
        marginTop: 40
    },
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    pickerContainer: {
        alignSelf: 'center',
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    panelStyle: {
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    sliderStyle: {
        borderRadius: 20,
        marginTop: 20,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    previewTxtContainer: {
        paddingTop: 20,
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#bebdbe',
    },
    swatchesContainer: {
        paddingTop: 20,
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#bebdbe',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: 10,
    },
    swatchStyle: {
        borderRadius: 20,
        height: 30,
        width: 30,
        margin: 0,
        marginBottom: 0,
        marginHorizontal: 0,
        marginVertical: 0,
    },
    openButton: {
        width: '100%',
        borderRadius: 20,
        paddingHorizontal: 40,
        paddingVertical: 10,
        backgroundColor: '#fff',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        bottom: 10,
        borderRadius: 20,
        paddingHorizontal: 40,
        paddingVertical: 10,
        alignSelf: 'center',
        backgroundColor: '#fff',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        padding: 35,
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 40
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})
