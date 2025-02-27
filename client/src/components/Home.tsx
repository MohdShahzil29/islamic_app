import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import QuranImage from "@/assets/Quran2.png";
import axios from 'axios';
import { router } from "expo-router";

const { width } = Dimensions.get("window");

interface Surah {
  _id: string;
  number: number;
  nameArabic: string;
  nameEnglish: string;
  revelationType: string;
  totalVerses: number;
}

export default function Home() {
  const [surah, setSurah] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAllSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`http://192.168.37.77:5000/api/surahs/get-all`);
      if (res.data.success && Array.isArray(res.data.data)) {
        setSurah(res.data.data);
      } else {
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch surahs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllSurah();
  }, []);

  return (
    <View style={styles.container}>
      {/* Greeting and User Name */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Asslamualaikum</Text>
      </View>

      {/* Last Read Section */}
      <View style={styles.lastReadContainer}>
        <View style={styles.lastReadTextContainer}>
          <Text style={styles.lastReadText}>Last Read</Text>
          <Text style={styles.surahName}>Al-Fatiah</Text>
          <Text style={styles.ayahNumber}>Ayah No: 1</Text>
        </View>
        <Image source={QuranImage} style={styles.quranImage} />
      </View>

      {/* Tabs */}
      {/* <View style={styles.tabsContainer}>
        <Text style={styles.activeTab}>Surah</Text>
        <Text style={styles.inactiveTab}>Para</Text>
        <Text style={styles.inactiveTab}>Page</Text>
        <Text style={styles.inactiveTab}>Hijb</Text>
      </View> */}

      {/* Scrollable Surah List */}
      <ScrollView style={styles.scrollContainer}>
        {loading ? (
          <Text style={styles.messageText}>Fetching Data...</Text>
        ) : error ? (
          <Text style={styles.messageText}>{error}</Text>
        ) : surah.length === 0 ? (
          <Text style={styles.messageText}>No surahs found</Text>
        ) : (
          surah.map((surahItem: Surah) => (
            <TouchableOpacity 
              key={surahItem._id} 
              style={styles.surahContainer}
              onPress={() => router.push({
                pathname: "/(details)/SurahDetails",
                params: { id: surahItem._id }
              })}
            >
              <View style={styles.surahInfo}>
                <View style={styles.surahNumberContainer}>
                  <Text style={styles.surahNumber}>{surahItem.number}</Text>
                </View>
                <View style={styles.surahTextContainer}>
                  <Text style={styles.surahName} numberOfLines={1}>{surahItem.nameEnglish}</Text>
                  <Text style={styles.surahDetails}>
                    {surahItem.revelationType} • {surahItem.totalVerses} Verses
                  </Text>
                </View>
              </View>
              <Text style={styles.arabicSurahName}>{surahItem.nameArabic}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6EE",
  },

  greetingContainer: {
    padding: 15,
    backgroundColor: "#F9F6EE",
  },
  greeting: {
    fontSize: 18,
    color: "#555",
    fontFamily: "Georgia",
  },
  lastReadContainer: {
    backgroundColor: "#8BC34A",
    padding: 15,
    borderRadius: 15,
    margin: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  lastReadTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  quranImage: {
    width: 125,
    height: 60,
    borderRadius: 10,
    // marginLeft: 10
  },
  lastReadText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Georgia",
  },
  surahName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Georgia",
    flexShrink: 1,
  },
  ayahNumber: {
    color: "white",
    fontSize: 16,
    fontFamily: "Georgia",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    paddingBottom: 10,
    backgroundColor: "#F9F6EE",
  },
  activeTab: {
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
    paddingBottom: 5,
    color: "#4CAF50",
    fontFamily: "Georgia",
  },
  inactiveTab: {
    color: "#777",
    fontFamily: "Georgia",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  surahContainer: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 15,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  surahInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  surahNumberContainer: {
    backgroundColor: "#8BC34A",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  surahNumber: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Georgia",
  },
  surahTextContainer: {
    flex: 1,
  },
  surahDetails: {
    color: "#777",
    fontSize: 14,
    fontFamily: "Georgia",
  },
  arabicSurahName: {
    color: "#4CAF50",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Georgia",
  },
  messageText: {
    fontSize: 18,
    color: "#555",
    fontFamily: "Georgia",
    textAlign: "center",
    padding: 20,
  },
});
