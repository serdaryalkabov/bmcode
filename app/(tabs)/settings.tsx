import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_500Medium_Italic,
  Inter_600SemiBold,
  Inter_700Bold, useFonts
} from "@expo-google-fonts/inter";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../languageContext";



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

  optionsContainer: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },

  settingOption: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#2A313C',
    padding: 12,
  },

  settingProp: {
    color: 'white',
    fontFamily: "Inter_400Regular",
  },

  settingVal: {
    color: 'white',
    opacity: 0.5,
    marginLeft: 'auto',
    fontFamily: "Inter_500Medium",
  },

  arrowRight: {
    opacity: 0.5,
  },

  secretTextContainer: {
    marginVertical: 8,
  },

  secretText: {
    color: 'white',
    fontFamily: "Inter_500Medium_Italic",
  },

  hiddenInput: {
    height: 28,
    color: 'white'
    // backgroundColor: 'red'
  }
});

export default function Settings() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secretTextVisible, setSecretTextVisible] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_500Medium_Italic,
  });

  const checkPassword = () => {
    if (password === '016175') {
      setSecretTextVisible(true);
    }
  }

  const getUserSelections = async () => {
    const name = await AsyncStorage.getItem('username');
    setUsername(name || '')
  }
  getUserSelections();

  return (<SafeAreaProvider>

    <SafeAreaView style={styles.body}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("settings")}</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.optionsContainer}>
            <TouchableOpacity activeOpacity={0.7} style={styles.settingOption} onPress={() => { router.push('/changeName') }}>
              <Text style={styles.settingProp}>{t("name")}</Text>
              <Text style={styles.settingVal}>{username}</Text>
              <MaterialIcons style={styles.arrowRight} name="keyboard-arrow-right" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.settingOption} onPress={() => { setShowLanguages((prev) => !prev) }}>
              <Text style={styles.settingProp}>{t("language")}</Text>
              <Text style={styles.settingVal}>{language === 'en' ? t("english") : language === 'ru' ? t("russian") : language === 'tkm' ? t('turkmen') : ''}</Text>
              <MaterialIcons style={styles.arrowRight} name="keyboard-arrow-down" size={18} color="white" />
            </TouchableOpacity>
            {showLanguages ? (
              <View>
                <TouchableOpacity onPress={() => setLanguage('en')} activeOpacity={0.7} style={[styles.settingOption, language === 'en' ? { backgroundColor: '#196175' } : '']}>
                  <Text style={[styles.settingProp, { paddingLeft: 8, fontFamily: 'Inter_500Medium' }, language !== 'en' ? { color: 'grey' } : '']}>{t("english")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLanguage('ru')} activeOpacity={0.7} style={[styles.settingOption, language === 'ru' ? { backgroundColor: '#196175' } : '']}>
                  <Text style={[styles.settingProp, { paddingLeft: 8, fontFamily: 'Inter_500Medium' }, language !== 'ru' ? { color: 'grey' } : '']}>{t("russian")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLanguage('tkm')} activeOpacity={0.7} style={[styles.settingOption, language === 'tkm' ? { backgroundColor: '#196175' } : '']}>
                  <Text style={[styles.settingProp, { paddingLeft: 8, fontFamily: 'Inter_500Medium' }, language !== 'tkm' ? { color: 'grey' } : '']}>{t("turkmen")}</Text>
                </TouchableOpacity>
              </View>
            ) : ''}
            <TouchableOpacity activeOpacity={1.0} style={styles.settingOption}>
              <Text style={styles.settingProp}>{t("version")}</Text>
              <Text style={styles.settingVal}>1.0</Text>
              {/* <MaterialIcons style={styles.arrowRight} name="keyboard-arrow-right" size={18} color="white" /> */}
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.settingOption} onPress={() => { router.push('/feedback') }}>
              <Text style={styles.settingProp}>{t("feedback")}</Text>
              <Text style={styles.settingVal}></Text>
              <MaterialIcons style={styles.arrowRight} name="keyboard-arrow-right" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.settingOption} onPress={() => setShowInfo((prev) => !prev)}>
              <Text style={styles.settingProp}>{t("about")}</Text>
              <Text style={styles.settingVal}></Text>
              <MaterialIcons style={styles.arrowRight} name={showInfo ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={18} color="white" />
            </TouchableOpacity>
            {showInfo ? (
              <View>
                <TouchableOpacity activeOpacity={1.0} style={styles.settingOption}>
                  <Text style={[styles.settingProp, { paddingLeft: 8, }]}>{t("organization")}</Text>
                  <Text style={styles.settingVal}>BrightMint Ltd</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1.0} style={styles.settingOption}>
                  <Text style={[styles.settingProp, { paddingLeft: 8, }]}>{t("founder")}</Text>
                  <Text style={styles.settingVal}>Serdar Yalkabov</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1.0} style={styles.settingOption}>
                  <Text style={[styles.settingProp, { paddingLeft: 8, }]}>{t("location")}</Text>
                  <Text style={styles.settingVal}>London, the UK</Text>
                </TouchableOpacity>
              </View>
            ) : ''}

          </View>
          <TextInput returnKeyType="done" style={styles.hiddenInput} value={password} onChangeText={setPassword} onSubmitEditing={checkPassword}>

          </TextInput>
          {/* <AdMobBanner
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-8529107551723149~8799256846" // replace with your Ad Unit ID
        servePersonalizedAds={true} // true or false
        onDidFailToReceiveAdWithError={(error) => console.log(error)}
      /> */}
          {secretTextVisible ?
            (<View style={styles.secretTextContainer}>
              <Text style={styles.secretText}>{t("secretText")}</Text>
            </View>) :
            <View></View>
          }

        </View>
      </View>
    </SafeAreaView>
  </SafeAreaProvider>
  );
}
