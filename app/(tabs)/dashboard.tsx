import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Header } from '@react-navigation/elements';
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold, useFonts
} from "@expo-google-fonts/inter";
import { useFocusEffect } from 'expo-router';
import * as sqlite from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from '../languageContext';



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

    main: {
        paddingVertical: 8,
    },

    username: {
        fontFamily: 'Inter_400Regular',
        color: 'grey',
        fontSize: 20,
        // marginVertical: 12,
    },

    statsContainer: {
        backgroundColor: '#2A313C',
        paddingVertical: 12,
        display: 'flex',
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: 8,
        marginTop: 12,
    },

    statItem: {
        display: 'flex',
        flexDirection: 'column',
        width: '33%',
    },

    statHeader: {
        color: '#196175',
        fontSize: 26,
        fontFamily: "Inter_700Bold",
        textAlign: 'center'
    },

    statSub: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Inter_400Regular'
    },

    favoritesContainer: {
        // paddingVertical: 12,
        marginTop: 12,
        // backgroundColor: 'red',
    },

    subSectionTitle: {
        color: 'white',
        fontFamily: 'Inter_600SemiBold',
        fontSize: 18,
    },

    subcatsContainer: {
        marginTop: 12,
        // borderRadius: 8,
        overflow: 'hidden',
        // backgroundColor: 'red'
    },

    subcat: {
        width: '100%',
        backgroundColor: '#196175',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
    },

    subcatName: {
        color: 'white',
        fontFamily: "Inter_500Medium",
        fontSize: 15,
    },

    hr: {
        width: '100%',
        height: 1,
        backgroundColor: '#101720',
    },

    subcatSub: {
        marginTop: 4,
        color: 'white',
        fontFamily: "Inter_500Medium",
        opacity: 0.4,
        fontSize: 14,
    },

    cardCategory: {
        marginTop: 8,
        color: 'white',
        fontFamily: "Inter_500Medium",
        opacity: 0.4,
    },

    space: {
        display: 'none',
    }
});

export default function Dashboard() {
    const [username, setUsername] = useState('')
    const [total, setTotal] = useState(0)
    const [topics, setTopics] = useState(0)
    const [allCats, setAllCats] = useState([])
    const [allSubs, setAllSubs] = useState([])
    const [db, setDb] = useState(null)
    const [days, setDays] = useState(0)
    const [favoriteSubcats, setFavoriteSubcats] = useState(null)
    const [favoriteCards, setFavoriteCards] = useState(null)
    const [topCards, setTopCards] = useState(null)
    const { t, setLanguage, language } = useLanguage();
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    useEffect(() => {
        sqlite.openDatabaseAsync('flashcards.db').then(setDb)
    })


    useEffect(() => {
        async function getData() {
            const db = await sqlite.openDatabaseAsync('flashcards.db');
            const topics = await db.getFirstAsync(`SELECT COUNT(*) as count FROM categories WHERE isChosen = 1`)
            setTopics(topics.count);
            const name = await AsyncStorage.getItem('username');
            setUsername(name);
            const total = await AsyncStorage.getItem('totalReviewedCards');
            // console.log((total))
            setTotal(Number(total))
            const signInDate = Number(await AsyncStorage.getItem('signInDate'));
            const day = 24 * 60 * 60 * 1000;
            const difference = Date.now() - signInDate;
            setDays(difference / day)

            const all = await db.getAllAsync(`SELECT * FROM categories WHERE isChosen = 1`)
            setAllCats(all);
            const allSubs = await db.getAllAsync(`SELECT * FROM subcategories WHERE isChosen = 1`)
            setAllSubs(allSubs);

            // const favCards = await db.getAllAsync(`SELECT * FROM cards WHERE isFavorite = 1`)
            // setFavoriteCards(favCards)

            const allCards = await db.getAllAsync(`SELECT * FROM cards`)
            const favCards = allCards.filter((card) => card.isFavorite === 1)
            setFavoriteCards(favCards)
            allCards.sort(function (a, b) { return b.totalReviews - a.totalReviews })
            const topCards = allCards.filter((card) => card.totalReviews > 0).slice(0, 6)
            setTopCards(topCards)
            // setAllCards();
            // setAllCards(allCards.sort)
            // for (const cat of allCats) {
            //     console.log(cat.name)
            // }
            // console.log("All cats: " + allCats);
            for (const card of allCards) {
                console.log(card.question)
            }
        }
        getData();
    }, [])

    function getCatName(catUid) {
        const c = allCats.find(cat => cat.uid === catUid);
        // console.log("BBBBBBB" + c.name)
        const name = c.name;
        return name;
    }

    function getCatNameFromCard(card) {
        const c = allSubs.find(sub => sub.uid === card.subCatUid);
        const name = getCatName(c.catUid);
        return name;
    }

    // console.log(getCatName('js'))

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            async function loadFavorites() {
                const db = await sqlite.openDatabaseAsync('flashcards.db');
                const favs = await db.getAllAsync(`SELECT * FROM subcategories WHERE isFavorite = 1`);
                if (isActive) setFavoriteSubcats(favs);
            }
            loadFavorites();
            return () => { isActive = false; };
        }, [])
    );

    return (<SafeAreaProvider>
        <SafeAreaView style={styles.body}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.wrapper}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t("dashboard")}</Text>
                    </View>
                    <View style={styles.main}>
                        <Text style={styles.username}>{username}</Text>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statHeader}>{topics}</Text>
                                {language === 'en' ? (
                                    <Text style={styles.statSub}>topics</Text>
                                ) : ''}
                                {language === 'ru' ? (
                                    <Text style={styles.statSub}>тем{topics === 1 ? 'a' : (topics > 1 && topics < 5) ? 'ы' : ''}</Text>
                                ) : ''}
                                {language === 'tkm' ? (
                                    <Text style={styles.statSub}>tema</Text>
                                ) : ''}
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statHeader}>{total}</Text>
                                <Text style={styles.statSub}>{t("totalReviewed")}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statHeader}>{Math.round(days)}</Text>
                                {language === 'en' ? (
                                    <Text style={styles.statSub}>day{Math.round(days) !== 1 ? 's' : ''}</Text>
                                ) : ''}
                                {language === 'ru' ? (
                                    <Text style={styles.statSub}>{Math.round(days) === 1 ? 'день' : (Math.round(days) > 1 && Math.round(days) < 5) ? 'дня' : 'дней'}</Text>
                                ) : ''}
                                {language === 'tkm' ? (
                                    <Text style={styles.statSub}>gün</Text>
                                ) : ''}
                            </View>
                        </View>
                        {/* {favoriteSubcats.} */}

                        {allCats.length > 0 && favoriteSubcats?.length > 0 ? (
                            <View style={styles.favoritesContainer}>
                                <Text style={styles.subSectionTitle}>{t("yourFavoriteTopics")}</Text>
                                <View style={styles.subcatsContainer}>
                                    {favoriteSubcats?.map((fav) => {
                                        return <View key={fav.id}>
                                            <View key={fav.id} style={styles.subcat}>
                                                {/* <Text>{fav.name} – {getCatName(fav.catUid)}</Text> */}
                                                <Text style={styles.subcatName}>{getCatName(fav.catUid)} {language === 'en' ? fav.nameEn : language === 'ru' ? fav.nameRu : fav.nameTkm}</Text>
                                                {language === 'en' ? (
                                                    <Text style={styles.subcatSub}>
                                                        {fav.totalReviews} time{fav.totalReviews !== 1 ? 's' : ''} cards reviewed
                                                    </Text>
                                                ) : ''}
                                                {language === 'ru' ? (
                                                    <Text style={styles.subcatSub}>
                                                        повторено {fav.totalReviews} раз{fav.totalReviews > 1 && fav.totalReviews < 5 ? 'а' : ''}
                                                    </Text>
                                                ) : ''}
                                                {language === 'tkm' ? (
                                                    <Text style={styles.subcatSub}>
                                                        {fav.totalReviews} gezek gaýtalanan
                                                    </Text>
                                                ) : ''}
                                            </View>
                                            {/* <View style={styles.hr}></View> */}
                                        </View>
                                    })}

                                </View>
                            </View>
                        ) : <Text style={styles.space}>fsdf</Text>
                        }
                        {favoriteCards?.length > 0 ? (
                            <View style={styles.favoritesContainer}>
                                <Text style={styles.subSectionTitle}>{t("yourFavoriteCards")}</Text>


                                <View style={styles.subcatsContainer}>
                                    {favoriteCards?.map((fav) => {
                                        return <View key={fav.id}>
                                            <View key={fav.id} style={styles.subcat}>
                                                {/* <Text>{fav.name} – {getCatName(fav.catUid)}</Text> */}
                                                <Text style={styles.subcatName}>{language === 'en' ? fav.questionEn : language === 'ru' ? fav.questionRu : fav.questionTkm}</Text>
                                                <Text style={styles.cardCategory}>{getCatNameFromCard(fav)}</Text>
                                                {language === 'en' ? (
                                                    <Text style={styles.subcatSub}>
                                                        {fav.totalReviews} time{fav.totalReviews !== 1 ? 's' : ''} reviewed in total
                                                    </Text>
                                                ) : ''}
                                                {language === 'ru' ? (
                                                    <Text style={styles.subcatSub}>
                                                        повторено {fav.totalReviews} раз{fav.totalReviews > 1 && fav.totalReviews < 5 ? 'а' : ''}
                                                    </Text>
                                                ) : ''}
                                                {language === 'tkm' ? (
                                                    <Text style={styles.subcatSub}>
                                                        {fav.totalReviews} gezek gaýtalanan
                                                    </Text>
                                                ) : ''}
                                            </View>
                                            {/* <View style={styles.hr}></View> */}
                                        </View>
                                    })}

                                </View>
                            </View>) : <Text style={styles.space}>fsdfdsf</Text>
                        }
                        {topCards?.length > 0 ? (
                            <View style={styles.favoritesContainer}>
                                <Text style={styles.subSectionTitle}>{t("mostReviewedCards")}</Text>
                                <View style={styles.subcatsContainer}>
                                    {topCards?.map((fav) => {
                                        return <View key={fav.id}>
                                            <View key={fav.id} style={styles.subcat}>
                                                {/* <Text>{fav.name} – {getCatName(fav.catUid)}</Text> */}
                                                <Text style={styles.subcatName}>{language === 'en' ? fav.questionEn : language === 'ru' ? fav.questionRu : fav.questionTkm}</Text>
                                                <Text style={styles.cardCategory}>{getCatNameFromCard(fav)}</Text>
                                                {language === 'en' ? (
                                                    <Text style={styles.subcatSub}>
                                                        {fav.totalReviews} time{fav.totalReviews !== 1 ? 's' : ''} reviewed in total
                                                    </Text>
                                                ) : ''}
                                                {language === 'ru' ? (
                                                    <Text style={styles.subcatSub}>
                                                        повторено {fav.totalReviews} раз{fav.totalReviews > 1 && fav.totalReviews < 5 ? 'а' : ''}
                                                    </Text>
                                                ) : ''}
                                                {language === 'tkm' ? (
                                                    <Text style={styles.subcatSub}>
                                                        {fav.totalReviews} gezek gaýtalanan
                                                    </Text>
                                                ) : ''}
                                            </View>
                                            {/* <View style={styles.hr}></View> */}
                                        </View>
                                    })}
                                </View>
                            </View>) : <Text style={styles.space}></Text>
                        }

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    </SafeAreaProvider>
    );
}
