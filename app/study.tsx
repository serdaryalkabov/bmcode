import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold, useFonts
} from "@expo-google-fonts/inter";
import {
  RobotoMono_400Regular,
  RobotoMono_500Medium,
  RobotoMono_600SemiBold,
  RobotoMono_700Bold
} from "@expo-google-fonts/roboto-mono";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as sqlite from 'expo-sqlite';
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "./languageContext";

const { width, height } = Dimensions.get("window");

export default function StudyScreen() {
  const {t, language, setLanguage} = useLanguage();
  const router = useRouter();
  const { subcategoryId, offset, cardNumber, sorting, neededOnly, passedCurrentIndex, favoriteOnly } = useLocalSearchParams();
  const [cards, setCards] = useState([]);
  const [reviewedCards, setReviewedCards] = useState(Number(passedCurrentIndex) + 1)
  const [remainingCards, setRemainingCards] = useState(0)
  const sortingCriteria = sorting.includes('level') ? 'level' : 'date'
  const sortingType = sorting.includes('asc') ? 'ASC' : 'DESC'
  // console.log(sortingCriteria)
  // console.log(sortingType)
  // console.log(subcategoryId)
  // console.log(offset)
  // console.log(cardNumber)
  // console.log(sorting)
  // console.log(neededOnly)

  // function shuffle(array) {
  //   let currentIndex = array.length;

  //   // While there remain elements to shuffle...
  //   while (currentIndex != 0) {

  //     // Pick a remaining element...
  //     let randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex--;

  //     // And swap it with the current element.
  //     [array[currentIndex], array[randomIndex]] = [
  //       array[randomIndex], array[currentIndex]];
  //   }
  // }

  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    RobotoMono_400Regular,
    RobotoMono_500Medium,
    RobotoMono_600SemiBold,
    RobotoMono_700Bold
  });

  useEffect(() => {
    // if (passedCurrentIndex) {
    //   setCurrentIndex(passe)
    // }

    if (!subcategoryId) return
    const day = 24 * 60 * 60 * 1000;
    async function fetchData() {
      const db = await sqlite.openDatabaseAsync('flashcards.db')
      // const cards = await db.getAllAsync(`SELECT * FROM cards`)
      // const threshold = Date.now() - 3 * day;
      const query = `SELECT * FROM cards WHERE subCatUid = ? ${favoriteOnly === 'true' ? 'AND isFavorite = 1' : ''} ${neededOnly === 'true' ? `AND (lastReviewed is NULL OR (${Date.now()} - lastReviewed > ${3 * day}))` : ``} ORDER BY ${sortingCriteria} ${sortingType}`
      // const query = `SELECT * FROM cards WHERE subCatUid = ? ${neededOnly === 'true' ? `AND (lastReviewed is NULL OR (${Date.now()} - lastReviewed > ${3 * day}))` : ``} ORDER BY ${sortingCriteria} ${sortingType} LIMIT ? OFFSET ?`
      // const testquery = `SELECT * FROM cards WHERE subCatUid = ? ${neededOnly === 'true' ? `AND (lastReviewed is NULL OR (${Date.now()} - lastReviewed > ${3 * day}))` : ``} ORDER BY ${sortingCriteria} ${sortingType} LIMIT ${cardNumber} OFFSET ${offset}`
      console.log(query)
      const cards = await db.getAllAsync(query, [subcategoryId])
      setCards(cards);
      // if (Number(passedCurrentIndex) === 0) {
      setRemainingCards(cards.length - 1 - Number(passedCurrentIndex))
      // }

      // async function getRemainingCards() {
      //   const db = await sqlite.openDatabaseAsync('flashcards.db')
      //   const query = `SELECT * FROM cards WHERE subCatUid = ? ${neededOnly === 'true' ? `AND (lastReviewed is NULL OR (${Date.now()} - lastReviewed > ${3 * day}))` : ``} ORDER BY ${sortingCriteria} ${sortingType} LIMIT 10000 OFFSET ?`
      //   const remainingCards = await db.getFirstAsync(query, [subcategoryId, reviewedCards])
      //   console.log("REMAINING CARDS LENGTH: " + remainingCards.length)
      //   return remainingCards.length
      // }
      // getRemainingCards()
    }
    fetchData();
    // console.log("Cards: \n")
    // console.log(cards)
    // for (const card of cards) {
    //   console.log(card)
    // }
  }, [subcategoryId, offset, sorting, neededOnly])
  const flashcards = cards;

  const [currentIndex, setCurrentIndex] = useState(Number(passedCurrentIndex));
  const [showAnswer, setShowAnswer] = useState(false);

  // let remaining = 0;


  async function markCardsReviewed(cardUid) {
    const db = await sqlite.openDatabaseAsync('flashcards.db')
    await db.runAsync(`UPDATE cards SET lastReviewed = ? WHERE uid = ?`, [Date.now(), cardUid])
  }

  const currentCard = flashcards[currentIndex];

  const handleNextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
      const remaining = flashcards.length - (currentIndex + 2);
      setReviewedCards((prev) => prev + 1);
      setRemainingCards(remaining)
    } else {
      router.replace("/(tabs)"); // End of session
    }
  };

  const showResults = () => {
    // getRemainingCards()
    // console.log('SORTING PARAMETER: ' + sorting)
    router.replace({
      pathname: "/results",
      params: {
        subcategoryId: subcategoryId,
        reviewedCards: reviewedCards,
        remainingCards: remainingCards,
        sorting: sorting,
        neededOnly: neededOnly,
        cardNumber: cardNumber,
        passedCurrentIndex: currentIndex + 1,
        favoriteOnly: favoriteOnly,
      }
    })
  }

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowAnswer(false);
    }
  };

  async function toggleFavorite(card) {
    const newValue = card.isFavorite === 1 ? 0 : 1;
    const db = await sqlite.openDatabaseAsync('flashcards.db')
    await db.runAsync(`UPDATE cards SET isFavorite = ? WHERE uid = ?`, [newValue, card.uid])
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.uid === card.uid ? { ...c, isFavorite: newValue } : c
      ))
  }

  const [db, setDb] = useState(null);

  // useEffect(() => {
  //   sqlite.openDatabaseAsync('flashcards.db').then(setDb)
  // })

  async function addToTotalReviews(cardUid) {
    const db = await sqlite.openDatabaseAsync('flashcards.db')
    await db.runAsync(`UPDATE cards SET totalReviews = totalReviews + 1 WHERE uid = ?`, [cardUid])
  }

  if (favoriteOnly === 'true' && cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white", fontFamily: "Inter_500Medium" }}>{t("noFavs")}</Text>
        <TouchableOpacity onPress={() => { router.replace('/(tabs)') }} style={styles.backHomeButton}>
          <Text style={styles.backHomeButtonText}>{t("back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentCard) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white", fontFamily: "Inter_500Medium" }}>Loading...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={[styles.levelIndicator, {backgroundColor: currentCard.level === '0' ? '#1B9B1B' : currentCard.level === '1' ? '#EB9100' : '#D50303'}]}></View>
        <TouchableOpacity onPress={() => { toggleFavorite(currentCard); }} style={styles.heartIcon}>
          <Ionicons name={currentCard.isFavorite === 1 ? 'heart' : 'heart-outline'} size={24} color={currentCard.isFavorite === 0 ? '#CCCCCC' : '#D50303'} />
        </TouchableOpacity>
        <View style={styles.centered}>
          <Text style={styles.question}>{language === 'en' ? currentCard.questionEn : language === 'ru' ? currentCard.questionRu : currentCard.questionTkm}</Text>

          {showAnswer && (
            <>
              <Text style={styles.answer}>{language === 'en' ? currentCard.answerEn : language === 'ru' ? currentCard.answerRu : currentCard.answerTkm}</Text>
              <View style={styles.exampleContainer}>
                <Text style={styles.example}>{currentCard.example}</Text>
              </View>
            </>
          )}

          {!showAnswer && (
            <TouchableOpacity activeOpacity={0.5} style={styles.showButton} onPress={() => setShowAnswer(true)}>
              <Text style={styles.showButtonText}>{t("show")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>


      <View style={styles.bottomBar}>
        <TouchableOpacity activeOpacity={0.5}
          style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
          onPress={handlePrevCard}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>{t("back")}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5} style={styles.quitButton} onPress=
          {async () => {
            await addToTotalReviews(currentCard.uid)
            await markCardsReviewed(currentCard.uid);
            showResults();
          }}>
          <Text style={styles.quitButtonText}>{t("quit")}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5}
          style={[styles.navButton, (currentIndex === flashcards.length - 1 || Number(passedCurrentIndex) + Number(cardNumber) === currentIndex + 1) && styles.disappearedButton]}
          onPress={async () => {
            await addToTotalReviews(currentCard.uid)
            await markCardsReviewed(currentCard.uid);
            handleNextCard();
          }}
          disabled={(currentIndex === flashcards.length - 1 || Number(passedCurrentIndex) + Number(cardNumber) === currentIndex + 1)}
        >
          <Text style={styles.navButtonText}>{t("next")}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}
          onPress={async () => {
            addToTotalReviews(currentCard.uid)
            await markCardsReviewed(currentCard.uid);
            showResults();
          }}
          style={(currentIndex === flashcards.length - 1 || Number(passedCurrentIndex) + Number(cardNumber) === currentIndex + 1) ? styles.navButton : styles.disappearedButton}
        >
          <Text style={styles.navButtonText}>{t("finish")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101720",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#1C2632",
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    overflow: 'hidden',
  },
  centered: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.4,
    // height: '100%'
  },
  question: {
    color: "white",
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  answer: {
    color: "#BDBDBD",
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  exampleContainer: {
    padding: 12,
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#16202C',
  },
  example: {
    color: "#00AEEF",
    fontFamily: "RobotoMono_400Regular",
    fontSize: 12,
    // textAlign: "center",
  },
  showButton: {
    marginTop: 20,
    backgroundColor: "#196175",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  showButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  bottomBar: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  navButton: {
    backgroundColor: "#196175",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  navButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: 'Inter_500Medium'
  },
  disabledButton: {
    opacity: 0.5,
  },
  disappearedButton: {
    display: 'none',
  },
  quitButton: {
    backgroundColor: "#2A313C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  quitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  endContainer: {
    flex: 1,
    backgroundColor: "#101720",
    alignItems: "center",
    justifyContent: "center",
  },
  heartIcon: {
    marginLeft: 'auto',
  },
  backHomeButton: {
    backgroundColor: '#196175',
    padding: 8,
    marginVertical: 12,
    borderRadius: 8,
  },

  levelIndicator: {
    // backgroundColor: 'red',
    width: '120%',
    height: 8,
    position: "absolute",
  },

  backHomeButtonText: {
    color: 'white',
    fontFamily: "Inter_500Medium"
  }
});
