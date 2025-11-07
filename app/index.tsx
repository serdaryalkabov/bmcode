import jsData from '@/assets/data/flashcards/cpp.json';
import topics from "@/assets/data/topics.json";
import { Inter_300Light } from '@expo-google-fonts/inter/300Light';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { Inter_900Black } from '@expo-google-fonts/inter/900Black';
import { useFonts } from '@expo-google-fonts/inter/useFonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import * as sqlite from 'expo-sqlite';
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLanguage } from './languageContext';

export default function Index() {
  const {t, language, setLanguage} = useLanguage();
  async function initDB() {
    const db = await sqlite.openDatabaseAsync('flashcards.db');
    await db.execAsync('PRAGMA journal_mode = WAL');
    await db.execAsync('PRAGMA foreign_keys = OFF');
    await db.execAsync(`DROP TABLE IF EXISTS categories;`);
    await db.execAsync(`DROP TABLE IF EXISTS subcategories;`);
    await db.execAsync(`DROP TABLE IF EXISTS cards;`);
    await db.execAsync(`CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT UNIQUE, name TEXT NOT NULL, isChosen INTEGER);`);
    await db.execAsync(`CREATE TABLE IF NOT EXISTS subcategories (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT UNIQUE, nameEn TEXT, nameRu TEXT, nameTkm TEXT, isChosen INTEGER, isFavorite INTEGER, totalReviews INTEGER, catUid TEXT, FOREIGN KEY (catUid) REFERENCES categories(uid))`);
    await db.execAsync(`CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT UNIQUE, questionEn TEXT, questionRu TEXT, questionTkm TEXT, answerEn TEXT, answerRu TEXT, answerTkm TEXT, example TEXT, subCatUid TEXT, lastReviewed INTEGER, level INTEGER, isPremium INTEGER, totalReviews INTEGER, isFavorite INTEGER)`)

    const insertTopics = async () => {
      // topics.categories.forEach(cat => {
      //   // console.log(cat.id);
      //   db.runAsync(`INSERT INTO categories (uid, name) VALUES (?, ?);`, [cat.id, cat.name])
      // })
      for (const cat of topics.categories) {
        await db.runAsync(`INSERT INTO categories (uid, name, isChosen) VALUES (?, ?, ?)`, [cat.id, cat.name, 0]);
      }


    }


    await insertTopics()

    // // const allRows = await db.getAllAsync(`SELECT * FROM categories`)
    // // console.log("DB: ");
    // // for (const row of allRows) {
    // //   console.log(row.uid + row.name)
    // // }

    for (const cat of topics.categories) {
      for (const subcat of cat.subcategories) {
        await db.runAsync(`INSERT INTO subcategories (uid, nameEn, nameRu, nameTkm, isChosen, isFavorite, totalReviews, catUid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [subcat.id, subcat.titleEn, subcat.titleRu, subcat.titleTkm, 0, 0, 0, cat.id])
      }
    }

    for (const subcat of jsData.flashcards) {
      for (const card of subcat.cards) {
        const level = card.level === ''
        await db.runAsync(`INSERT INTO cards (uid, questionEn, questionRu, questionTkm, answerEn, answerRu, answerTkm, example, subCatUid, lastReviewed, level, isPremium, totalReviews, isFavorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [card.id, card.questionEn, card.questionRu, card.questionTkm, card.answerEn, card.answerRu, card.answerTkm, card.example, subcat.id, null, card.level, card.isPremium, 0, 0])
      }
    }

  }

  useEffect(() => {
    initDB();
  }, [])

  let [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const [fontlight, fontreg, fontmed, fontsemi, fontbold, fontexbold, fontblack] = [
    'Inter_300Light',
    'Inter_400Regular',
    'Inter_500Medium',
    'Inter_600SemiBold',
    'Inter_700Bold',
    'Inter_800ExtraBold',
    'Inter_900Black',]


  const styles = StyleSheet.create({
    body: {
      backgroundColor: '#101720',
      // backgroundColor: 'red',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 120,
    },

    title: {
      color: 'white',
      fontFamily: fontbold,
      fontSize: 30,
      textAlign: 'center',
    },

    container: {
      paddingHorizontal: 24,
      width: '100%',
    },

    input: {
      backgroundColor: '#373E47',
      padding: 12,
      marginTop: 48,
      borderRadius: 10,
      color: 'white'
    },

    languageContainer: {
      marginTop: 12,
    },

    languageOption: {
      padding: 12,
      // paddingHorizontal: 2,
      borderRadius: 8,
    },

    languageProp: {
      color: 'white',
      fontFamily: 'Inter_500Medium',
    },

    chooseLanguage: {
      marginTop: 12,
      color: 'white',
      fontFamily: "Inter_500Medium",
    },

    error: {
      color: 'red',
      fontFamily: "Inter_400Regular",
      marginTop: 6,
    }
  })

  const [name, setName] = useState('');
  const [storedName, setStoredName] = useState('');
  const [error, setError] = useState('')
  const router = useRouter();
  // const { t, setLanguage, language } = useLanguage();
  // console.log(language)

  const saveName = async () => {
    if (name.trim() === '') return
    if (name.length < 4) {
      setError(t("error5"))
      return
    }
    await AsyncStorage.setItem('username', name);
    await AsyncStorage.setItem('totalReviewedCards', '0');
    await AsyncStorage.setItem('signInDate', String(Date.now()));
    // await AsyncStorage.setItem('packNumber', '15');
    const n = await AsyncStorage.getItem('username')
    // console.log(n);

    if (name) {
      router.replace('/research')
    }
  }


  return (
    <KeyboardAvoidingView>
      <View style={styles.body}>
        <View style={styles.container}>
          {/* <TouchableOpacity onPress={()=>{initDB()}}>
          <Text>Click me</Text>
        </TouchableOpacity> */}
          <Text style={styles.title}>{t("indexTitle")}</Text>
          {/* <Text style={styles.title}>Welcome to bmcode, let's get to know each other</Text> */}
          <TextInput value={name} onChangeText={setName} onSubmitEditing={saveName} returnKeyType="send" placeholder={t("nameHolder")} style={styles.input}></TextInput>
          {error ? (
            <Text style={styles.error}>{t('error5')}</Text>
          ) : ''}
          <Text style={styles.chooseLanguage}>{t("chooseLanguage")}</Text>
          <View style={styles.languageContainer}>
                <TouchableOpacity onPress={() => setLanguage('en')} activeOpacity={0.7} style={[styles.languageOption, language === 'en' ? { backgroundColor: '#196175' } : '']}>
                  <Text style={[styles.languageProp, language !== 'en' ? { color: 'grey' } : '']}>{t("english")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLanguage('ru')} activeOpacity={0.7} style={[styles.languageOption, language === 'ru' ? { backgroundColor: '#196175' } : '']}>
                  <Text style={[styles.languageProp, language !== 'ru' ? { color: 'grey' } : '']}>{t("russian")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLanguage('tkm')} activeOpacity={0.7} style={[styles.languageOption, language === 'tkm' ? { backgroundColor: '#196175' } : '']}>
                  <Text style={[styles.languageProp, language !== 'tkm' ? { color: 'grey' } : '']}>{t("turkmen")}</Text>
                </TouchableOpacity>
              </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
