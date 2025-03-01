import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tab)/HomePage" options={{ headerShown: false}}/>
      <Stack.Screen name="(tab)/Fatwa" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(details)/SurahDetails" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(qibla)/Qibla" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(hadith)/Hadith" options={{headerTransparent: true, headerTitle: "",}}/>
      <Stack.Screen name="(time)/Time" options={{headerTransparent: true, headerTitle: "",}}/>
    </Stack>
  );
}
