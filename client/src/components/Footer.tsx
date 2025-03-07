import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { FontAwesome, Entypo, FontAwesome5 } from "@expo/vector-icons";
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
    iconContainer: {
      alignItems: "center",
    },
    icon: {
      fontSize: width * 0.07,
    },
    iconLabel: {
      marginTop: 4,
      fontSize: 12,
      color: theme.text,
    },
  });

  return (
    <View style={dynamicStyles.footer}>
      <View style={dynamicStyles.iconContainer}>
        <FontAwesome
          name="home"
          size={width * 0.07}
          style={dynamicStyles.icon}
          color="#4CAF50"
          onPress={() => router.push("/(tab)/HomePage")}
        />
        <Text style={dynamicStyles.iconLabel}>Home</Text>
      </View>
      <View style={dynamicStyles.iconContainer}>
        <FontAwesome5
          name="quran"
          size={width * 0.07}
          style={dynamicStyles.icon}
          color="#8BC34A"
          onPress={() => router.push("/(hadith)/Hadith")}
        />
        <Text style={dynamicStyles.iconLabel}>Hadith</Text>
      </View>
      <View style={dynamicStyles.iconContainer}>
        <Entypo
          name="man"
          size={width * 0.07}
          style={dynamicStyles.icon}
          color="#4CAF50"
          onPress={() => router.push("/(qibla)/Qibla")}
        />
        <Text style={dynamicStyles.iconLabel}>Qibla</Text>
      </View>
      <View style={dynamicStyles.iconContainer}>
        <FontAwesome
          name="clock-o"
          size={width * 0.07}
          style={dynamicStyles.icon}
          color="#4CAF50"
          onPress={() => router.push("/(tasbih)/Tasbih")}
        />
        <Text style={dynamicStyles.iconLabel}>Time</Text>
      </View>
    </View>
  );
}
