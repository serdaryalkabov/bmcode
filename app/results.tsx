import { Inter_300Light } from '@expo-google-fonts/inter/300Light';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { Inter_900Black } from '@expo-google-fonts/inter/900Black';
import { useFonts } from '@expo-google-fonts/inter/useFonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from './languageContext';

export default function Results() {
    const {t, language, setLanguage} = useLanguage();
    const router = useRouter();
    let [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });
    const {subcategoryId, reviewedCards, remainingCards, cardNumber, sorting, neededOnly, passedCurrentIndex, favoriteOnly} = useLocalSearchParams();
    // console.log("SORTING" + sorting)
    // console.log("NEEDED ONLY" + neededOnly)
    // console.log(subcategoryId)
    console.log(reviewedCards)
    console.log(remainingCards)
    console.log("RESULTS. PASSEDCURRENTINDEX: " + passedCurrentIndex)
    const styles=StyleSheet.create({
        body: {
            backgroundColor: '#101720',
            display: 'flex',
            height: '100%',
            width: "100%",
            alignItems: 'center',
            justifyContent: 'center',
        },

        container: {
            backgroundColor: '#1C2632',
            padding: 16,
            maxWidth: '65%',
            borderRadius: 10,
        },

        infoText: {
            color: 'white',
            fontSize: 14,
            fontFamily: "Inter_400Regular"
        },

        title: {
            color: 'white',
            fontSize: 16,
            fontFamily: 'Inter_500Medium',
            textAlign: 'center',
        },

        infoBox: {
            paddingTop: 12,
        },

        outlineButton: {
            backgroundColor: 'transparent',
            borderColor: '#196175',
            borderWidth: 2,
            padding: 8,
            borderRadius: 10,
            flex: 0.5,
        },

        filledButton: {
            backgroundColor: '#196175',
            padding: 8,
            borderRadius: 7,
            marginLeft: 8,
            flex: 0.5,
        },

        buttonContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 12,
            width: '100%',
            // backgroundColor: 'red',
        },

        disappeared: {
            display: 'none',
        }
    })

    async function addToTotal(num) {
      const prevTotal = Number(await AsyncStorage.getItem('totalReviewedCards'));
      const newTotal = Number(prevTotal) + Number(num);
      await AsyncStorage.setItem('totalReviewedCards', String(newTotal))
    }



  return (
    <KeyboardAvoidingView>
      <View style={styles.body}>
        <View style={styles.container}>
            <Text style={styles.title}>{t("results")}</Text>
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>{t("reviewedCards")}: {reviewedCards}</Text>
                <Text style={styles.infoText}>{t("remaining")}: {remainingCards}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={async () => 
                    {
                        await addToTotal(reviewedCards);router.replace('/(tabs)')
                        // await addToTotalReviews(subcategoryId, reviewedCards);
                        }} style={Number(remainingCards) === 0 ? [styles.outlineButton, {flex: 1}] : styles.outlineButton}><Text style={[styles.infoText, {textAlign: 'center'}]}>{t("quit")}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    router.replace({
                        pathname: '/study',
                        params: {
                            subcategoryId: subcategoryId,
                            offset: reviewedCards,
                            sorting: sorting,
                            cardNumber: cardNumber,
                            neededOnly: neededOnly,
                            passedCurrentIndex: passedCurrentIndex,
                            favoriteOnly: favoriteOnly,
                        }
                    })
                }} style={Number(remainingCards) === 0 ? styles.disappeared : styles.filledButton }><Text style={[styles.infoText, {textAlign: 'center'}]}>{t("continue")}</Text></TouchableOpacity>
            </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
  
}
