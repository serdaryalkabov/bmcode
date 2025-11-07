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
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from './languageContext';

export default function Index() {
    const {t, language, setLanguage} = useLanguage()
    //   async function initDB() {


    //   }

    //   useEffect(() => {
    //     initDB();
    //   }, [])

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
        view: {
            backgroundColor: '#101720',
        },

        body: {
            backgroundColor: '#101720',
            // backgroundColor: 'red',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 86,
        },

        title: {
            color: 'white',
            fontFamily: fontbold,
            fontSize: 30,
            textAlign: 'center',
        },

        container: {
            paddingHorizontal: 24,
        },

        input: {
            backgroundColor: '#373E47',
            padding: 10,
            marginTop: 8,
            borderRadius: 10,
            color: 'white'
        },

        inputContainer: {
            marginVertical: 12,
        },

        textField: {
            height: 100,
        },

        submitButton: {
            backgroundColor: '#196175',
            padding: 12,
            width: '100%',
            marginTop: 8,
            borderRadius: 10,
        },

        submitButtonText: {
            fontFamily: "Inter_500Medium",
            color: 'white',
            textAlign: 'center',
        },

        error: {
            paddingVertical: 4,
            color: 'red',
            fontFamily: 'Inter_500Medium'
        },

    })

    const [name, setName] = useState('');
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [feedbackContent, setFeedbackContent] = useState('')
    const [error, setError] = useState('')


    useEffect(() => {
        async function getName() {
            const name = await AsyncStorage.getItem('username');
            setName(name || '');
            console.log(name)
        }
        getName();
    }, [])
    //   const [storedName, setStoredName] = useState('');
    const router = useRouter();

    const sendData = async() => {
        if (fullName.length === 0 || email.length === 0 || feedbackContent.length === 0) {
            setError('Please, fill out all the fields')
            return
        } 
        if (feedbackContent.length < 20) {
            setError('The feedback must include at least 20 characters')
            return
        }
        if (feedbackContent.length < 20) {
            setError('The feedback must include less than 800 characters')
            return
        }
        if(!email.includes('@') || !email.includes('.')) {
            setError('Please, enter a valid email')
            return;
        }

        try{
            const response = await fetch("https://formspree.io/f/meoppnoz", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    fullName: fullName,
                    email: email,
                    feedbackContent: feedbackContent,
                })
            })
            
            if(response.ok) {
                Alert.alert('Thank you for your feedback!')
                router.replace('/(tabs)')
            }
        } catch(e) {
            Alert.alert("Something went wrong. Please, check your internet conneciton")
        }
    }


    return (
        <SafeAreaView style={styles.view}>
            <KeyboardAvoidingView>
                {/* <TouchableOpacity style={styles.backButton}><Text style={styles.backButtonText}>Back</Text></TouchableOpacity> */}
            <View style={styles.body}>
                <View style={styles.container}>
                    {/* <TouchableOpacity onPress={()=>{initDB()}}>
          <Text>Click me</Text>
        </TouchableOpacity> */}
                    <Text style={styles.title}>{name}, {t("feedbackTitle")}</Text>
                    <View style={styles.inputContainer}>
                        <TextInput value={fullName} onChangeText={setFullName} style={styles.input} placeholder={t("fullName")}></TextInput>
                        <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder={t("email")}></TextInput>
                        <TextInput value={feedbackContent} multiline onChangeText={setFeedbackContent} style={[styles.input, styles.textField]} placeholder={t("feedbackHolder")}></TextInput>
                        {error ? (
                            <Text style={styles.error}>{error}</Text>
                        ) : ''}
                        <TouchableOpacity activeOpacity={0.7} onPress={() => {sendData()}} style={styles.submitButton}><Text style={styles.submitButtonText}>{t("submit")}</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
