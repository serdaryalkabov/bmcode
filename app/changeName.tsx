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
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLanguage } from './languageContext';

export default function Index() {
  const {t, language, setLanguage} = useLanguage()

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
      marginTop: 48,
      borderRadius: 10,
      color: 'white',
    }
  })

  const [name, setName] = useState('');

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

  const saveName = async () => {
    if (name.trim() === '') return
    await AsyncStorage.setItem('username', name);
    router.replace('/(tabs)')
  }


  return (
    <KeyboardAvoidingView>
      <View style={styles.body}>
        <View style={styles.container}>
          {/* <TouchableOpacity onPress={()=>{initDB()}}>
          <Text>Click me</Text>
        </TouchableOpacity> */}
          <Text style={styles.title}>{t("nameHolder")}</Text>
          <TextInput value={name} onChangeText={setName} onSubmitEditing={saveName} returnKeyType="send" style={styles.input}></TextInput>
        </View>
      </View></KeyboardAvoidingView>
  );
}
