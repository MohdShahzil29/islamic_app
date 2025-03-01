import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import QuranImage from "@/assets/Quran.png";
import { LinearGradient } from "expo-linear-gradient";

const LoadScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>بِسْمِ ٱللَّٰهِ</Text>
        <Text style={styles.subtitle}>
          "Read! In the name of your Lord who created"
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={QuranImage}
          style={[styles.image, { opacity: fadeAnim }]}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(tab)/HomePage")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFD700",
    fontFamily: "Amiri-Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Amiri-Regular",
    marginTop: 10,
  },
  imageContainer: {
    width: "80%",
    aspectRatio: 1,
    marginBottom: 40,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Amiri-Bold",
  },
});

export default LoadScreen;
