import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { FontAwesome, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/context/ThemeContext";

const { width } = Dimensions.get("window");

export default function Footer() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();

  const dynamicStyles = StyleSheet.create({
    footer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: theme.background,
      paddingVertical: width * 0.03,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? "#444" : "#DDD",
      width: "100%",
    },
    icon: {
      textAlign: "center",
      fontSize: width * 0.07,
    },
  });

  return (
    <View style={dynamicStyles.footer}>
      <FontAwesome
        name="book"
        size={width * 0.07}
        style={dynamicStyles.icon}
        color="#4CAF50"
        onPress={() => router.push("/(tab)/HomePage")}
      />
      <MaterialCommunityIcons
        name="book"
        size={width * 0.07}
        style={dynamicStyles.icon}
        color="#8BC34A"
        onPress={() => router.push("/(hadith)/Hadith")}
      />
      <Entypo
        name="man"
        size={width * 0.07}
        style={dynamicStyles.icon}
        color="#4CAF50"
        onPress={() => router.push("/(qibla)/Qibla")}
      />
      <FontAwesome
        name="clock-o"
        size={width * 0.07}
        style={dynamicStyles.icon}
        color="#4CAF50"
        onPress={() => router.push("/(time)/Time")}
      />
    </View>
  );
}
