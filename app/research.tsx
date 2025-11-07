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
  
  error: {
    color: 'red',
    fontFamily: 'Inter_400Regular',
    marginTop: 6,
  }
});

export default function Index() {
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedSubCats, setSelectedSubCats] = useState([]);
  const [username, setUsername] = useState("");
  const [error, setError] = useState('')
  const router = useRouter();  
  const {t, setLanguage, language} = useLanguage();

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
        // console.log(name);

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
        if (selectedSubCats.length === 0) {
          setError('error6')
          return
        }
        const db = await sqlite.openDatabaseAsync('flashcards.db')
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
          <Text style={styles.catTitle}>{language === 'en' ? item.titleEn : language === 'ru' ? item.titleRu : item.titleTkm}</Text>
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
          {error ? (
            <Text style={styles.error}>{t(error)}</Text>
          ) : ''}
          <TouchableOpacity style={styles.submitButton} onPress={() => {submit()}}>
            <Text style={styles.submitButtonText}>{t("submit")}</Text>
          </TouchableOpacity>
          {/* </Link> */}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}





// import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Keyboard, TouchableOpacity, FlatList } from "react-native";
// import topics from '../assets/data/topics.json';
// import { useRouter } from "expo-router";
// import { useFonts } from '@expo-google-fonts/inter/useFonts';
// import { Inter_100Thin } from '@expo-google-fonts/inter/100Thin';
// import { Inter_200ExtraLight } from '@expo-google-fonts/inter/200ExtraLight';
// import { Inter_300Light } from '@expo-google-fonts/inter/300Light';
// import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
// import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
// import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
// import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
// import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
// import { Inter_900Black } from '@expo-google-fonts/inter/900Black';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';
// import { Inter_100Thin_Italic } from '@expo-google-fonts/inter/100Thin_Italic';
// import { Inter_200ExtraLight_Italic } from '@expo-google-fonts/inter/200ExtraLight_Italic';
// import { Inter_300Light_Italic } from '@expo-google-fonts/inter/300Light_Italic';
// import { Inter_400Regular_Italic } from '@expo-google-fonts/inter/400Regular_Italic';
// import { Inter_500Medium_Italic } from '@expo-google-fonts/inter/500Medium_Italic';
// import { Inter_600SemiBold_Italic } from '@expo-google-fonts/inter/600SemiBold_Italic';
// import { Inter_700Bold_Italic } from '@expo-google-fonts/inter/700Bold_Italic';
// import { Inter_800ExtraBold_Italic } from '@expo-google-fonts/inter/800ExtraBold_Italic';
// import { Inter_900Black_Italic } from '@expo-google-fonts/inter/900Black_Italic';
// import React, { use, useEffect, useState } from "react";





// const SubItem = ({ subcat }) => {
//     const [selectedSubCats, setSelectedSubCats] = useState([]);
//     const [selectedCats, setSelectedCats] = useState([]);
//     let isSel = false;

//     // useEffect(() => {
//     //     const loadData = async() => {
//     //         const data = await AsyncStorage.getItem('userSelections');
//     //         if (data) {
//     //             const parsedData = JSON.parse(data);
//     //             setSelectedSubCats(parsedData.selectedSubCats);
//     //             setSelectedCats(parsedData.selectedats);
//     //             isSel = selectedSubCats.includes(subcat.id);
//     //             console.log(subcat.name + " " + isSel);
//     //             // console.log(selectedSubCats);
//     //         }
//     //     }
//     //     loadData()
//     // }, [setSelectedCats])

//     // const handleToggle = async () => {
//     //     const updated = isSel
//     //       ? selectedSubCats.filter((id) => id !== subcat.id)
//     //       : [...selectedSubCats, subcat.id];
    
//     //     setSelectedSubCats(updated);
//     //     await AsyncStorage.setItem('userSelections', JSON.stringify({ selectedSubCats: updated }));
//     //   };

//     // Move this calculation here, after selectedSubCats might have been updated
//     // const isSel = selectedSubCats.includes(subcat.id);

//     const styles = StyleSheet.create({
//         catTitle: {
//             color: 'white',
//             marginLeft: 6,
//         },
//         opacity: {
//             backgroundColor: '#1D242D',
//             padding: 10,
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             paddingLeft: 24,
//             borderTopLeftRadius: 0,
//         }
//     })

//     return <TouchableOpacity style={styles.opacity} activeOpacity={0.7} onPress={() => {}}>
//         <Ionicons name={isSel ? 'remove-circle' : 'add-circle-outline'} size={20} color='white' />
//         <Text style={styles.catTitle}>
//             {subcat.name}
//         </Text>
//     </TouchableOpacity>
// }

// const Item = ({ cat }) => {
//     // const [isSelected, setIsSelected] = useState(false);

//     const styles = StyleSheet.create({
//         catTitle: {
//             color: 'white',
//             marginLeft: 6,
//         },

//         opacity: {
//             backgroundColor: '#1D242D',
//             padding: 10,
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             // borderRadius: 10,
//             borderBottomLeftRadius: 0,
//         }
//     })
//     const [selectedCats, setSelectedCats] = useState([]);
//     const [selectedSubCats, setSelectedSubCats] = useState([]);
    
//     useEffect(() => {
//         const loadSelections = async () => {
//           try {
//             const saved = await AsyncStorage.getItem('userSelections');
//             if (saved) {
//               const parsed = JSON.parse(saved);
//               setSelectedCats(parsed.selectedLanguages || []);
//               setSelectedSubCats(parsed.selectedSubcategories || []);
//             }
//           } catch (error) {
//             console.log('Error loading selections:', error);
//           }
//         };
//         loadSelections();
//       }, []);

//     //   let isCurrentSelected;
    
//       useEffect(() => {
//         const saveSelections = async () => {
//           try {
//             const data = JSON.stringify({
//               selectedCats,
//               selectedSubCats,
//             });
//             await AsyncStorage.setItem('userSelections', data);
//             console.log(await AsyncStorage.getItem('userSelections'))
//           } catch (error) {
//             console.log('Error saving selections:', error);
//           }
//         };
//         saveSelections();
//         // isCurrentSelected = selectedCats.includes(cat.id);
//       }, [selectedCats, selectedSubCats]);

//       const isCurrentSelected = selectedCats.includes(cat.id)

//       const handleLanguagePress = (language) => {
//         const alreadySelected = selectedCats.includes(language.id);
    
//         if (alreadySelected) {
//           setSelectedCats(selectedCats.filter((id) => id !== language.id));
//           setSelectedSubCats(
//             selectedSubCats.filter(
//               (id) => !language.subcategories.some((sub) => sub.id === id)
//             )
//           );
//         } else {
//           setSelectedCats([...selectedCats, language.id]);
//           setSelectedSubCats([
//             ...selectedSubCats,
//             ...language.subcategories.map((sub) => sub.id),
//           ]);
//         }
//       };

//     return <View><TouchableOpacity style={styles.opacity} activeOpacity={0.7} onPress={() => { handleLanguagePress(cat) }}>

//         <Ionicons name={isCurrentSelected? 'remove-circle' : 'add-circle-outline' } size={20} color='white' />
//         <Text style={styles.catTitle}>
//             {cat.name}
//         </Text>
//     </TouchableOpacity>

//     </View>
// }

// export default function Index() {

//     const getUsername = async () => {
//         const username = await AsyncStorage.getItem('username');
//         if (!username) return
//         return username
//     }

//     let [fontsLoaded] = useFonts({
//         Inter_300Light,
//         Inter_400Regular,
//         Inter_500Medium,
//         Inter_600SemiBold,
//         Inter_700Bold,
//         Inter_800ExtraBold,
//         Inter_900Black,
//     });

//     const [fontlight, fontreg, fontmed, fontsemi, fontbold, fontexbold, fontblack] = [
//         'Inter_300Light',
//         'Inter_400Regular',
//         'Inter_500Medium',
//         'Inter_600SemiBold',
//         'Inter_700Bold',
//         'Inter_800ExtraBold',
//         'Inter_900Black',]

//     const styles = StyleSheet.create({
//         body: {
//             backgroundColor: '#101720',
//             width: '100%',
//             height: '100%',
//             // display: 'flex',
//             // alignItems: 'center',
//             // justifyContent: 'center',
//         },

//         title: {
//             color: 'white',
//             fontFamily: fontbold,
//             fontSize: 30,
//             textAlign: 'center',
//             marginBottom: 16,
//             marginTop: 180,
//         },

//         container: {
//             paddingHorizontal: 24,
//         },

//         list: {
//             display: 'flex',
//             flexDirection: 'column',
//             borderRadius: 10,
//             overflow: 'hidden',
//         }
//     })

//     const handleLanguagePress = (language) => {
//         const alreadySelected = selectedCats.includes(language.id);
    
//         if (alreadySelected) {
//           // Unselect
//           setSelectedCats(selectedCats.filter((id) => id !== language.id));
//           setSelectedSubCats(
//             selectedSubCats.filter(
//               (id) => !language.subcategories.some((sub) => sub.id === id)
//             )
//           );
//         } else {
//           // Select all
//           setSelectedCats([...selectedCats, language.id]);
//           setSelectedSubCats([
//             ...selectedSubCats,
//             ...language.subcategories.map((sub) => sub.id),
//           ]);
//         }
//       };

//     return (
//         <KeyboardAvoidingView>
//             <View style={styles.body}>
//                 <View style={styles.container}>
//                     <Text style={styles.title}>{getUsername()}, what would you like to study?</Text>
//                     <View style={styles.list}>
//                         <FlatList
//                             data={topics.categories}
//                             keyExtractor={(item) => item.id}
//                             renderItem={({item}) => {
//                                 return <>
//                                     <Item cat={item}></Item>
//                                     <FlatList
//                                         data={item.subcategories}
//                                         keyExtractor={(subcat) => subcat.id}
//                                         renderItem={({item:subcat}) => {
//                                             return <SubItem subcat={subcat}></SubItem>
//                                         }}
//                                     >

//                                     </FlatList>
//                                 </>

//                             }}>

//                         </FlatList>
//                     </View>
//                 </View>
//             </View>
//         </KeyboardAvoidingView>
//     );
// }
