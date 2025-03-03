import { Stack } from "expo-router";
import { ThemeProvider } from "@/src/context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
    <Stack>
      <Stack.Screen name="(tab)/HomePage" options={{ headerShown: false}}/>
      <Stack.Screen name="(tab)/Fatwa" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(details)/SurahDetails" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(qibla)/Qibla" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(hadith)/Hadith" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(time)/Time" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(mosque)/Mosque" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(quran)/Quran" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(pillar)/Pillars" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(hajj)/Pilgrimage" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(ramzan)/Ramzan" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(about)/About" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(quranaudio)/QuranAudio" options={{headerTransparent: true, headerTitle: "",}}/>
    </Stack>
    </ThemeProvider>
  );
}
