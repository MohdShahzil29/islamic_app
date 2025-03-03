import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useTheme } from "@/src/context/ThemeContext";

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
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const { isDarkMode, toggleTheme, theme } = useTheme();
  // console.log("Get serach data", searchQuery)

  // Get all surahs when no search query is provided
  const getAllSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`https://islamic-app-mf8e.onrender.com/api/surahs/get-all`);
      if (res.data.success && Array.isArray(res.data.data)) {
        setSurah(res.data.data);
      } else {
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch surahs");
    } finally {
      setLoading(false);
    }
  };

  // Call search API endpoint
  const searchSurahAPI = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`https://islamic-app-mf8e.onrender.com/api/surahs/search`, {
        params: { query },
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.data.success && Array.isArray(res.data.surahs)) {
        setSurah(res.data.surahs);
      } else {
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to search surahs");
    } finally {
      setLoading(false);
    }
  };
  

  // On mount, get the full list
  useEffect(() => {
    getAllSurah();
  }, []);

  // useEffect to handle dynamic search
  useEffect(() => {
    // If searchQuery is empty, fetch all surahs
    if (searchQuery.trim() === "") {
      getAllSurah();
    } else {
      // Debounce API call to reduce the number of requests
      const delayDebounceFn = setTimeout(() => {
        searchSurahAPI(searchQuery);
      }, 300); // 300ms delay

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery]);

  // Dynamic styles based on active theme (light/dark)
  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
          paddingTop: StatusBar.currentHeight || 20,
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 15,
        },
        greeting: {
          fontSize: 22,
          color: theme.text,
          fontFamily: "Georgia",
          fontWeight: "bold",
        },
        toggleButton: {
          backgroundColor: theme.card,
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 8,
        },
        toggleButtonText: {
          color: theme.text,
          fontSize: 16,
          fontFamily: "Georgia",
        },
        // New fancy search bar container
        searchContainer: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 25,
          paddingHorizontal: 15,
          paddingVertical: 8,
          marginHorizontal: 15,
          marginVertical: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 3,
        },
        searchInput: {
          flex: 1,
          fontSize: 16,
          color: "#5CE65C",
          fontFamily: "Georgia",
          marginLeft: 10,
        },
        scrollContainer: {
          flex: 1,
          paddingHorizontal: width * 0.05,
          marginBottom: 10,
        },
        surahContainer: {
          padding: 15,
          backgroundColor: theme.card,
          borderRadius: 15,
          marginVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          shadowColor: theme.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
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
          color: "#fff",
          fontWeight: "bold",
          fontSize: 16,
          fontFamily: "Georgia",
        },
        surahTextContainer: {
          flex: 1,
        },
        listSurahName: {
          color: theme.text,
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "Georgia",
          flexShrink: 1,
        },
        surahDetails: {
          color: theme.text,
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
          color: theme.text,
          fontFamily: "Georgia",
          textAlign: "center",
          padding: 20,
        },
      }),
    [theme]
  );

  return (
    <View style={dynamicStyles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {/* Header with greeting */}
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.greeting}>Surah list</Text>
      </View>

      {/* Fancy Search Bar Section */}
      <View style={dynamicStyles.searchContainer}>
        <Ionicons name="search" size={20} color="#5CE65C" />
        <TextInput
          style={dynamicStyles.searchInput}
          placeholder="Search Surahs"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Scrollable Surah List */}
      <ScrollView style={dynamicStyles.scrollContainer}>
        {loading ? (
          <Text style={dynamicStyles.messageText}>Fetching Data...</Text>
        ) : error ? (
          <Text style={dynamicStyles.messageText}>{error}</Text>
        ) : surah.length === 0 ? (
          <Text style={dynamicStyles.messageText}>No surahs found</Text>
        ) : (
          surah.map((surahItem: Surah) => (
            <TouchableOpacity
              key={surahItem._id}
              style={dynamicStyles.surahContainer}
              onPress={() =>
                router.push({
                  pathname: "/(details)/SurahDetails",
                  params: { id: surahItem._id },
                })
              }
            >
              <View style={dynamicStyles.surahInfo}>
                <View style={dynamicStyles.surahNumberContainer}>
                  <Text style={dynamicStyles.surahNumber}>
                    {surahItem.number}
                  </Text>
                </View>
                <View style={dynamicStyles.surahTextContainer}>
                  <Text style={dynamicStyles.listSurahName} numberOfLines={1}>
                    {surahItem.nameEnglish}
                  </Text>
                  <Text style={dynamicStyles.surahDetails}>
                    {surahItem.revelationType} • {surahItem.totalVerses} Verses
                  </Text>
                </View>
              </View>
              <Text style={dynamicStyles.arabicSurahName}>
                {surahItem.nameArabic}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
