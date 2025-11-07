import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold, useFonts
} from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as sqlite from 'expo-sqlite';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import topics from "../assets/data/topics.json";
import { useLanguage } from "./languageContext";
  
  // Move styles outside component to prevent recreation on every render
  const styles = StyleSheet.create({
    body: {
      backgroundColor: "#101720",
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 24,
    },
    title: {
      color: "white",
      fontFamily: "Inter_700Bold",
      fontSize: 30,
      textAlign: "center",
      marginBottom: 16,
      marginTop: 80,
    },
    sectionHeader: {
      backgroundColor: "#1D242D",
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: "#2A313C",
    },
    subItem: {
      backgroundColor: "#2A313C",
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 40,
    },
    catTitle: {
      color: "white",
      marginLeft: 8,
      fontFamily: "Inter_500Medium",
    },
    list: {
      flex: 0.85,
      marginTop: 12,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: "#2A313C",
    },
    submitButton: {
      backgroundColor: "#196175",
      padding: 12,
      borderRadius: 12,
      marginTop: 12,
    },
    submitButtonText: {
      color: "white",
      textAlign: "center",
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  });
  
  export default function EditCourse() {
    const {t, language, setLanguage} = useLanguage()
    const [selectedCats, setSelectedCats] = useState([]);
    const [selectedSubCats, setSelectedSubCats] = useState([]);
    const [username, setUsername] = useState("");
    const router = useRouter();
  
    // Load saved data once on mount
    useEffect(() => {
      const loadData = async () => {
        try {
          const db = await sqlite.openDatabaseAsync('flashcards.db')
          const chosenCats = await db.getAllAsync(`SELECT * FROM categories WHERE isChosen = 1`)
          const chosenSubCats = await db.getAllAsync(`SELECT * FROM subcategories WHERE isChosen = 1`)
  
          for (const cat of chosenCats) {
            console.log(cat)
          }
          for (const cat of chosenSubCats) {
            console.log(cat)
          }
  
          setSelectedCats(chosenCats.map((cat) => cat.uid))
          setSelectedSubCats(chosenSubCats.map((subcat) => subcat.uid))
          console.log(selectedCats)
          console.log(selectedSubCats)
          // const [saved, name] = await Promirse.all([
          //   AsyncStorage.getItem("userSelections"),
          //   AsyncStorage.getItem("username"),
          // ]);
          const [name] = await Promise.all([AsyncStorage.getItem('username')])
  
          // if (saved) {
          //   const parsed = JSON.parse(saved);
          //   setSelectedCats(parsed.selectedCats || []);
          //   setSelectedSubCats(parsed.selectedSubCats || []);
          // }
          setUsername(name || "");
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };
      loadData();
    }, []);
  
    // Memoize toggle handlers to prevent recreation
    const onToggleCat = useCallback((cat) => {
      setSelectedCats((prevCats) => {
        const isSelected = prevCats.includes(cat.id);
        if (isSelected) {
          setSelectedSubCats((prevSubCats) =>
            prevSubCats.filter(
              (id) => !cat.subcategories.some((sub) => sub.id === id)
            )
          );
          return prevCats.filter((id) => id !== cat.id);
        } else {
          setSelectedSubCats((prevSubCats) => [
            ...new Set([
              ...prevSubCats,
              ...cat.subcategories.map((sub) => sub.id),
            ]),
          ]);
          return [...prevCats, cat.id];
        }
      });
    }, []);
  
    const onToggleSubCat = useCallback((cat, subcatId) => {
      setSelectedSubCats((prevSubCats) => {
        const isSelected = prevSubCats.includes(subcatId);
        const newSubCats = isSelected
          ? prevSubCats.filter((id) => id !== subcatId)
          : [...prevSubCats, subcatId];
    
        const allSubIds = cat.subcategories.map((s) => s.id);
        const someSelected = allSubIds.some((id) => newSubCats.includes(id)); // <- at least one
    
        setSelectedCats((prevCats) => {
          if (someSelected) {
            return prevCats.includes(cat.id) ? prevCats : [...prevCats, cat.id];
          } else {
            return prevCats.filter((id) => id !== cat.id);
          }
        });
    
        return newSubCats;
      });
    }, []);
  
    const submit = useCallback(async () => {
        // await AsyncStorage.setItem(
        //   "userSelections",
        //   JSON.stringify({ selectedCats, selectedSubCats })
        // );
        // const initDb = async() => {
          const db = await sqlite.openDatabaseAsync('flashcards.db')
          await db.runAsync(`UPDATE subcategories SET isChosen = 0`)
          await db.runAsync(`UPDATE categories SET isChosen = 0`)
          for (const subcat of selectedSubCats) {
            await db.runAsync(`UPDATE subcategories SET isChosen = 1 WHERE uid = ?`, [subcat])
          }
          for (const cat of selectedCats) {
            await db.runAsync(`UPDATE categories SET isChosen = 1 WHERE uid = ?`, [cat])
          }
          router.replace('/(tabs)')
        // }
  
        // initDb();r
        // console.log(selectedSubCats);
        // router.replace('/(tabs)')
      // try {</TouchableOpacity>
      //   await AsyncStorage.setItem(
      //     "userSelections",
      //     JSON.stringify({ selectedCats, selectedSubCats })
      //   );
      //   // Small delay to ensure state is saved
      //   setTimeout(() => {
      //     router.replace("/(tabs)");
      //   }, 100);
      // } catch (error) {
      //   console.error("Error saving selections:", error);
      // }
    }, [selectedCats, selectedSubCats, router]);
  
    const [fontsLoaded] = useFonts({
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
    });
  
    // Memoize sections to prevent recalculation
    const sections = useMemo(
      () =>
        topics.categories.map((cat) => ({
          title: cat.name,
          id: cat.id,
          subcategories: cat.subcategories,
          data: cat.subcategories,
        })),
      []
    );
  
    // Memoize render functions
    const renderSectionHeader = useCallback(
      ({ section }) => {
        const isSelected = selectedCats.includes(section.id);
        return (
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() =>
              onToggleCat({
                id: section.id,
                subcategories: section.subcategories,
              })
            }
          >
            <Ionicons
              name={isSelected ? "remove-circle" : "add-circle-outline"}
              size={20}
              color="white"
            />
            <Text style={styles.catTitle}>{section.title}</Text>
          </TouchableOpacity>
        );
      },
      [selectedCats, onToggleCat]
    );
  
    const renderItem = useCallback(
      ({ item, section }) => {
        const isSelected = selectedSubCats.includes(item.id);
        return (
          <TouchableOpacity
            style={styles.subItem}
            onPress={() => onToggleSubCat(section, item.id)}
          >
            <Ionicons
              name={isSelected ? "remove-circle" : "add-circle-outline"}
              size={20}
              color="white"
            />
            <Text style={styles.catTitle}>{item.name}</Text>
          </TouchableOpacity>
        );
      },
      [selectedSubCats, onToggleSubCat]
    );
  
    const keyExtractor = useCallback((item) => item.id, []);
  
    if (!fontsLoaded) return null;
  
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.body}>
          <View style={styles.container}>
            <Text style={styles.title}>
              {username}, {t("researchTitle")}
            </Text>
            <View style={styles.list}>
              <SectionList
                sections={sections}
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={5}
              />
            </View>
            {/* <TouchableOpacity
              activeOpacity={0.7}
              style={styles.submitButton}
              onPress={() => {submit()}}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity> */}
            {/* <Link style={styles.submitButton} onPress={() => {submit()}} href={'/(tabs)'}> */}
            <TouchableOpacity style={styles.submitButton} onPress={() => {submit()}}>
              <Text style={styles.submitButtonText}>{t("submit")}</Text>
            </TouchableOpacity>
            {/* </Link> */}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
  
  
  