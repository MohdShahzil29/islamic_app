import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { FontAwesome, MaterialCommunityIcons, Entypo, Feather, 
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
export default function Footer() {
  const router = useRouter();
  return (
    <View style={styles.footer}>
      <FontAwesome name="book" size={width * 0.07} style={styles.icon} color="#4CAF50" />
      <MaterialCommunityIcons name="book" size={width * 0.07} style={styles.icon} color="#8BC34A" 
      onPress={() => router.push("/(hadith)/Hadith")}
      />
      <Entypo name="man" size={width * 0.07} style={styles.icon} color="#4CAF50" 
      onPress={() => router.push("/(qibla)/Qibla")}
      />
      <FontAwesome name="clock-o" size={width * 0.07} style={styles.icon} color="#4CAF50" 
      onPress={() => router.push("/(time)/Time")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F9F6EE",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    width: "100%",
  },
  icon: {
    textAlign: "center",
    fontSize: width * 0.07,
  },
});
