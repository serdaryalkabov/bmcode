import { Stack } from "expo-router";
import { LanguageProvider } from "./languageContext";

export default function RootLayout() {
  return (<LanguageProvider>
     <Stack screenOptions={{ headerShown: false }} />
  </LanguageProvider>)
}
