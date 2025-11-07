import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold, useFonts
} from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as sqlite from 'expo-sqlite';
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AdvancedCheckbox } from 'react-native-advanced-checkbox';
import DropDownPicker from "react-native-dropdown-picker";
import {
    SafeAreaProvider,
    SafeAreaView
} from 'react-native-safe-area-context';
import { useLanguage } from "../languageContext";
// import { allFlashcards } from "@/assets/data/flashcards/flashcardIndex";




export default function Index() {
    const { t, setLanguage, language } = useLanguage();

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const styles = StyleSheet.create({
        body: {
            backgroundColor: "#101720",
            flex: 1,
            width: '100%',
            height: '100%',
            //   paddingHorizontal: 16,
        },
        wrapper: {
            flex: 1,
            height: '100%',
            paddingVertical: 16,
            paddingHorizontal: 20,
        },

        header: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },

        title: {
            color: 'white',
            fontFamily: 'Inter_700Bold',
            fontSize: 32
        },

        editButton: {
            marginLeft: 'auto',
        },

        list: {
            display: 'flex',
            flexDirection: 'column',
            paddingVertical: 12,
            paddingTop: 24,
        },

        languageTitle: {
            // backgroundColor: '#2A313C',

            backgroundColor: '#196175',
            padding: 12,
            borderRadius: 8,
        },

        languageTitleText: {
            color: 'white',
            fontFamily: 'Inter_600SemiBold',
            fontSize: 16,
        },

        subCatList: {
            paddingVertical: 6,
            // paddingHorizontal: 8,
        },

        subCat: {
            backgroundColor: '#2A313C',
            paddingVertical: 12,
            paddingHorizontal: 12,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 8,
            borderRadius: 8,
            overflow: 'hidden',
        },

        subCatContainer1: {
            flex: 1,
        },
        subCatContainer2: {
            flex: 0.1,
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            // backgroundColor: 'red',
            height: '100%',
        },

        subCatTitle: {
            color: 'white',
            fontFamily: 'Inter_500Medium',
            fontSize: 18,
        },

        trashButton: {
            // height: '50%',
            // backgroundColor: 'red',
            width: 22,
            height: 25,
        },

        heart: {
            // height: '50%',
            // backgroundColor: 'red',
            width: 20,
            height: 25,
            marginRight: 2,
            bottom: 0,
        },

        subCatInfo: {
            color: '#A5A5A5',
            marginVertical: 8,
            fontFamily: 'Inter_400Regular',
        },

        subCatButtonContainer: {
            display: 'flex',
            flexDirection: 'row'
        },

        subCatButton: {
            backgroundColor: '#196175',
            padding: 8,
            borderRadius: 6,
            marginTop: 6,
            marginRight: 6,
        },

        subCatNeededButton: {
            // backgroundColor: '#196175',
            backgroundColor: '#212833',
            padding: 8,
            borderRadius: 6,
            marginTop: 6,
            marginRight: 6,
        },

        subCatButtonText: {
            color: 'white',
            fontFamily: 'Inter_500Medium',
        },

        subCatButtonNeededText: {
            color: 'white',
            fontFamily: 'Inter_500Medium',
        },


        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalView: {
            margin: 20,
            backgroundColor: '#3D444F',
            borderRadius: 10,
            padding: 16,
            // alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
        },
        button: {
            borderRadius: 20,
            padding: 10,
            elevation: 2,
        },
        buttonOpen: {
            backgroundColor: '#F194FF',
        },
        buttonClose: {
            padding: 8,
            marginVertical: 4,
        },
        textStyle: {
            color: 'white',
            fontFamily: 'Inter_500Medium',
            textAlign: 'center',
        },
        modalText: {
            // marginBottom: 15,
            marginVertical: 8,
            color: 'white',
            fontFamily: "Inter_400Regular",
            textAlign: 'left',
        },

        modalGoButton: {
            backgroundColor: '#196175',
            padding: 8,
            borderRadius: 6,
            marginTop: 8,
        },

        modalGoButtonText: {
            color: "white",
            fontFamily: 'Inter_500Medium',
            textAlign: 'center',
        },

        dropdown: {
            backgroundColor: '#323944',
            // padding: 12,
            // height: 24,
            borderRadius: 6,
            // width: 60,
            color: 'white',
            fontFamily: "Inter_400Regular",
            borderColor: 'rgba(0,0,0,0)',
            zIndex: 99,
        },

        arrowIcon: {
            tintColor: 'white'
        },

        dropdownContainer: {
            backgroundColor: '#323944',
            borderColor: 'rgba(0,0,0,0)',
            zIndex: 101,
            elevation: 101,
        },

        listItemLabel: {
            color: 'white',
            fontFamily: "Inter_400Regular"
        },

        selectedItemLabel: {
            color: 'white',
            // fontSize: 60,
        },

        dropdownPlaceholder: {
            color: 'white',
            fontFamily: "Inter_400Regular"
        },

        selectedItemContainer: {
            backgroundColor: '#474E59',
        },

        dropdownText: {
            color: 'red',
        },

        disabledButton: {
            opacity: 0.5
        },

        checkboxContainer: {
            marginTop: 12,
        },

        checkboxLabel: {
            color: 'white',
            fontFamily: "Inter_500Medium",
            fontSize: 14,
        }
    });

    const [userCategories, setUserCategories] = useState([]);
    const [userSubCategories, setUserSubCategories] = useState([]);
    const [cards, setCards] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [cardNumber, setCardNumbers] = useState(15);
    const [currentSubCat, setCurrentSubCat] = useState('');
    const [currentNeededOnly, setCurrenNeededOnly] = useState('');
    const [favoriteOnly, setFavoriteOnly] = useState(false)
    const [sortBy, setSortBy] = useState('level.asc')

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(
        Array.from({ length: 21 }, (_, i) => ({
            label: (i + 5).toString(),
            value: i + 5,
        }))
    );


    const [sortingOpen, setSortingOpen] = useState(false);
    const [sortingItems, setSortingItems] = useState([
        { label: t("diffAsc"), value: 'level.asc' },
        { label: t("diffDesc"), value: 'level.desc' },
        { label: t("dateAsc"), value: 'date.asc' },
        { label: t('dateDesc'), value: 'date.desc' },
    ]
    )
    
    const day = 24 * 60 * 60 * 1000;
    const now = Date.now()
    const [neededCards, setNeededCards] = useState([]);
    const router = useRouter();
    const goToCards = () => {
        router.replace('/study')
    }

    useEffect(() => {
        if (open) {
            setSortingOpen(false)
        }
        if (sortingOpen) {
            setOpen(false)
        }
    }, [open, sortingOpen])

    useEffect(() => {
        if (modalVisible) {
            setCardNumbers(15); // Reset default value when modal opens
        }
    }, [modalVisible]);

    useEffect(() => {
        async function getCats() {
            const db = await sqlite.openDatabaseAsync('flashcards.db');
            const cats = await db.getAllAsync(`SELECT * FROM categories WHERE isChosen = 1`)
            const subcats = await db.getAllAsync(`SELECT * FROM subcategories WHERE isChosen = 1`)
            const cards = await db.getAllAsync(`SELECT * FROM cards`)
            const neededCards = await db.getAllAsync(`SELECT * FROM cards WHERE lastReviewed is NULL OR (? - lastReviewed > ?)`, [now, 3 * day])
            // for (const card of cards) {
            //     console.log(card);
            // }
            // for (const cat of cats) {
            //     console.log(cat.name)
            // }
            setUserCategories(cats)
            setUserSubCategories(subcats);
            setCards(cards);
            setNeededCards(neededCards)
        }
        
        setSortingItems([
            { label: t("diffAsc"), value: 'level.asc' },
            { label: t("diffDesc"), value: 'level.desc' },
            { label: t("dateAsc"), value: 'date.asc' },
            { label: t('dateDesc'), value: 'date.desc' },
        ])

        async function getPackNumber() {
            const n = await AsyncStorage.getItem('packNumber');
            // console.log(n);
        }

        getPackNumber();

        getCats();
    }, [])

    function getCatSubs(catUid) {
        return userSubCategories.filter(subcat => subcat.catUid === catUid)
    }

    async function deleteSubCat(subCatUid, catUid) {
        const newSubCats = userSubCategories.filter(subcat => subcat.uid != subCatUid)
        setUserSubCategories(newSubCats)
        const remainingSubCats = userSubCategories.filter(subcat => subcat.catUid === catUid).length
        if (remainingSubCats === 1) {
            deleteCat(catUid);
        } else {
            console.log(userSubCategories.filter(subcat => subcat.catUid === catUid))
        }
        // console.log(remainingSubCats);
        const db = await sqlite.openDatabaseAsync('flashcards.db')
        await db.runAsync(`UPDATE subcategories SET isChosen = 0 WHERE uid = ?`, [subCatUid]);
    }

    async function deleteCat(catUid) {
        const newCats = userCategories.filter(cat => cat.uid != catUid);
        setUserCategories(newCats);
        const db = await sqlite.openDatabaseAsync('flashcards.db')
        await db.runAsync(`UPDATE categories SET isChosen = 0 WHERE uid = ?`, [catUid])
    }

    // useEffect(() => {
    //     async function saveChanges() {
    //         await AsyncStorage.setItem(
    //             "userSelections",
    //             JSON.stringify({ userCategories, userSubCategories })
    //         );
    //         console.log(userCategories);
    //         console.log(userSubCategories);
    //     }

    //     saveChanges();
    // }, [userCategories, userSubCategories])

    async function markFavorite(subCatUid) {
        const f = userSubCategories.find(subcat => subcat.uid === subCatUid)
        // if (!f) return;
        const newValue = f.isFavorite === 1 ? 0 : 1;
        f.isFavorite = newValue;
        console.log(f)
        const db = await sqlite.openDatabaseAsync('flashcards.db')
        await db.runAsync(`UPDATE subcategories SET isFavorite = ? WHERE uid = ?`, [newValue, subCatUid])

        // if (f.isFavorite === 0) {
        //     f.isFavorite = 1;
        //     console.log(f)
        //     const db = await sqlite.openDatabaseAsync('flashcards.db')
        //     await db.runAsync(`UPDATE subcategories SET isFavorite = 1 WHERE uid = ?`, [subCatUid])
        // } else {
        //     f.isFavorite = 0;
        //     console.log(f)
        //     const db = await sqlite.openDatabaseAsync('flashcards.db')
        //     await db.runAsync(`UPDATE subcategories SET isFavorite = 0 WHERE uid = ?`, [subCatUid])
        // }
        setUserSubCategories([...userSubCategories]);
    }

    function countCards(subCatUid) {
        return cards.filter(card => card.subCatUid === subCatUid).length;
    }

    function countNeededCards(subCatUid) {
        return neededCards.filter(card => card.subCatUid === subCatUid).length;
    }

    const isValidCardNumber = (n) => {
        if (n > 4 && n < 26) {
            return true;
        } else {
            return false
        }
    }

    const goToEdit = () => {
        router.push('/editCourse')
    }

    async function addToTotalReviews(subcatUid) {
        const db = await sqlite.openDatabaseAsync('flashcards.db')
        db.runAsync(`UPDATE subcategories SET totalReviews = totalReviews + 1 WHERE uid = ?`, [subcatUid])
    }
    // console.log(countCards('js-dom'))

    // const getCats = async () => {
    //     const db = await sqlite.openDatabaseAsync('flashcards.db')
    //     const cats = await db.getAllAsync(`SELECT * FROM categories`)

    //     // const data = AsyncStorage.getItem("userSelections")
    //     // .then((data) => {
    //     //   const parsed = data ? JSON.parse(data) : null;
    //     //   console.log(parsed); // ✅ Actual stored object
    //     // });
    //     // const parsed = JSON.parse(data)
    //     return cats
    // }
    // let categories;

    // getCats().then(cats => {
    //     categories = cats;
    // })

    // console.log(categories);

    // function ModalWindow(subCatUide) {
    //     return 
    // }

    return (<SafeAreaProvider>
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                    <Text style={styles.modalText}>{t("chooseCardNumber")}</Text>
                    <View style={{ zIndex: 1001, elevation: 1001 }}>
                        <DropDownPicker
                            open={open}
                            value={cardNumber}
                            items={items}
                            setOpen={setOpen}
                            setValue={setCardNumbers}
                            setItems={setItems}
                            // placeholder="Select a number"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            labelStyle={{ color: 'white', fontFamily: 'Inter_500Medium' }}
                            listItemContainerStyle={styles.listItemContainer}
                            listItemLabelStyle={styles.listItemLabel}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedItemLabelStyle={styles.selectedItemLabel}
                            selectedItemContainerStyle={styles.selectedItemContainer}
                            arrowIconStyle={styles.arrowIcon}
                            textStyle={styles.dropdownText}
                            tickIconStyle={{ tintColor: 'white' }}
                        />
                    </View>
                    <Text style={styles.modalText}>{t("sortBy")}</Text>
                    <View style={{ zIndex: 90 }}>
                        <DropDownPicker
                            open={sortingOpen}
                            value={sortBy}
                            items={[
                                { label: t("diffAsc"), value: 'level.asc' },
                                { label: t("diffDesc"), value: 'level.desc' },
                                { label: t("dateAsc"), value: 'date.asc' },
                                { label: t('dateDesc'), value: 'date.desc' },
                            ]}
                            setOpen={setSortingOpen}
                            setValue={setSortBy}
                            // setItems={setSortingItems}
                            textStyle={styles.dropdownText}
                            // placeholder="Select a number"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            labelStyle={{ color: 'white', fontFamily: 'Inter_500Medium' }}
                            listItemContainerStyle={styles.listItemContainer}
                            listItemLabelStyle={styles.listItemLabel}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedItemLabelStyle={styles.selectedItemLabel}
                            selectedItemContainerStyle={styles.selectedItemContainer}
                            arrowIconStyle={styles.arrowIcon}
                            tickIconStyle={{ tintColor: 'white' }}
                        />
                    </View>
                    {/* <BouncyCheckbox onPress={(favoriteOnly: boolean) => {}} /> */}
                    <AdvancedCheckbox
                        containerStyle={styles.checkboxContainer}
                        value={favoriteOnly}
                        onValueChange={setFavoriteOnly}
                        label={t("showOnlyFavorite")}
                        labelPosition="right"
                        checkedColor="#196175"
                        uncheckedColor="#6c757d"
                        size={20}
                        animationType="fade"
                        checkBoxStyle={{ borderRadius: 4 }}
                        labelStyle={styles.checkboxLabel}
                        testID="custom-checkbox"
                        accessibilityLabel="Toggle custom option"
                        accessibilityHint="Toggles the custom checkbox on or off"
                    />
                    <TouchableOpacity onPress={() => {
                        addToTotalReviews(currentSubCat, 1);
                        router.push({
                            pathname: "/study",
                            params: {
                                subcategoryId: currentSubCat,
                                offset: 0,
                                cardNumber: cardNumber,
                                sorting: sortBy,
                                neededOnly: currentNeededOnly,
                                passedCurrentIndex: 0,
                                favoriteOnly: String(favoriteOnly),
                                remaining: 0,
                            },
                        })
                        setModalVisible(false)
                    }} activeOpacity={isValidCardNumber(cardNumber) ? 0.5 : 0.4} style={isValidCardNumber(cardNumber) ? styles.modalGoButton : styles.modalGoButtonInactive}>
                        <Text style={styles.modalGoButtonText}>{t("letsgo")}</Text>
                    </TouchableOpacity>
                    <Pressable
                        style={styles.buttonClose}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>{t("close")}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
        <SafeAreaView style={styles.body}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.wrapper}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t("home")}</Text>
                        <TouchableOpacity style={styles.editButton} activeOpacity={0.5} onPress={() => { goToEdit() }}>
                            <MaterialIcons name="edit" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.list}>
                        {/* <TouchableOpacity style={{ padding: 20 }} onPress={() => { }}>
                        <Text>Get AsyncStorage</Text>
                    </TouchableOpacity> */}
                        {userCategories.map(cat => (
                            <View key={cat.id}>
                                <View style={styles.languageTitle}>
                                    <Text style={styles.languageTitleText}>{cat.name}</Text>
                                </View>
                                <View style={styles.subCatList}>
                                    {getCatSubs(cat.uid).map(subcat => (
                                        <View key={subcat.id} style={styles.subCat}>
                                            <View style={styles.subCatContainer1}>
                                                <Text style={styles.subCatTitle}>{language === 'en' ? subcat.nameEn : language === 'ru' ? subcat.nameRu : subcat.nameTkm}</Text>
                                                {language === 'en' ? (
                                                    <Text style={styles.subCatInfo}>
                                                        {countNeededCards(subcat.uid)}/{countCards(subcat.uid)} cards need{(countNeededCards(subcat.uid)) < 2 ? 's' : ''} review
                                                    </Text>
                                                ) : ''}
                                                {language === 'ru' ? (
                                                    <Text style={styles.subCatInfo}>
                                                        {countNeededCards(subcat.uid)}/{countCards(subcat.uid)} {countNeededCards(subcat.uid) === 1 ? 'карточку' : 'карточек'} нужно повторить
                                                    </Text>
                                                ) : ''}
                                                {language === 'tkm' ? (
                                                    <Text style={styles.subCatInfo}>
                                                        {countNeededCards(subcat.uid)}/{countCards(subcat.uid)} kart{countNeededCards(subcat.uid) > 1 ? 'lar' : ''}y gaýtalamaly
                                                    </Text>
                                                ) : ''}

                                                <View style={styles.subCatButtonContainer}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={styles.subCatButton}
                                                        onPress={() => {
                                                            setModalVisible((prev) => !prev);
                                                            setCurrentSubCat(subcat.uid)
                                                            setCurrenNeededOnly('false')
                                                        }
                                                        }
                                                    >
                                                        <Text style={styles.subCatButtonText}>{t("reviewAll")}</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        activeOpacity={countNeededCards(subcat.uid) > 0 ? 0.5 : 1}
                                                        style={styles.subCatNeededButton}
                                                        onPress={() => {
                                                            if (countNeededCards(subcat.uid) === 0) return;
                                                            setModalVisible((prev) => !prev);
                                                            setCurrentSubCat(subcat.uid)
                                                            setCurrenNeededOnly('true')
                                                        }
                                                        }
                                                    >
                                                        <Text style={countNeededCards(subcat.uid) > 0 ? styles.subCatButtonNeededText : [styles.subCatButtonNeededText, styles.disabledButton]}>{t("reviewNeeded")}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <View style={styles.subCatContainer2}>
                                                {/* <TouchableOpacity style={styles.trashButton} onPress={() => { deleteSubCat(subcat.uid, subcat.catUid) }}>
                                                    <Ionicons name='trash-outline' size={20} color='white' />
                                                </TouchableOpacity> */}
                                                <TouchableOpacity style={styles.heart} onPress={() => { markFavorite(subcat.uid) }}>
                                                    <Ionicons name={subcat.isFavorite === 1 ? 'heart' : "heart-outline"} size={20} color={subcat.isFavorite === 1 ? '#D50303' : 'white'} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}

                                </View>

                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    </SafeAreaProvider>
    );
}
