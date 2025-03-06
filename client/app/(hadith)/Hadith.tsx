import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useTheme } from "@/src/context/ThemeContext";
import { AntDesign } from "@expo/vector-icons";

const API_VERSION = "1";
const BASE_URL = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@${API_VERSION}`;

interface Edition {
  id: string;
  name: string;
}

const { width } = Dimensions.get("window");
const scale = width / 375; // Base width for scaling

const fetchDataWithFallback = async (
  minUrl: string,
  fallbackUrl: string
): Promise<{ [key: string]: any }> => {
  try {
    const response = await axios.get(minUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching minified URL:", error);
    const response = await axios.get(fallbackUrl);
    return response.data;
  }
};

const darkTheme = {
  background: "#121212",
  text: "#E0E0E0",
  card: "#1E1E1E",
  border: "#333333",
};

const lightTheme = {
  background: "#F5F5F5",
  text: "#212121",
  card: "#FFFFFF",
  border: "#CCCCCC",
};

const Hadith: React.FC = () => {
  const router = useRouter();
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isDarkMode } = useTheme();
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: isDarkMode ? darkTheme.background : lightTheme.background,
        },
        header: {
          marginHorizontal: 16 * scale,
          marginTop: 16 * scale,
          paddingVertical: 20 * scale,
          paddingHorizontal: 16 * scale,
          backgroundColor: isDarkMode ? darkTheme.card : lightTheme.card,
          // Larger top border radii to mimic a curved roof
          borderTopLeftRadius: 50 * scale,
          borderTopRightRadius: 50 * scale,
          // More subtle rounding at the bottom
          borderBottomLeftRadius: 20 * scale,
          borderBottomRightRadius: 20 * scale,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 * scale },
          shadowOpacity: 0.3,
          shadowRadius: 4 * scale,
          elevation: 5,
        },
        headerText: {
          fontSize: 26 * scale,
          fontWeight: "700",
          color: isDarkMode ? darkTheme.text : lightTheme.text,
          letterSpacing: 1,
        },
        headerDescription: {
          fontSize: 16 * scale,
          color: isDarkMode ? darkTheme.text : lightTheme.text,
          textAlign: "center",
          marginTop: 8 * scale,
          fontStyle: "italic",
          lineHeight: 22 * scale,
        },
        list: {
          padding: 16 * scale,
        },
        itemContainer: {
          backgroundColor: isDarkMode ? darkTheme.card : lightTheme.card,
          padding: 16 * scale,
          borderRadius: 8,
          marginBottom: 12 * scale,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 * scale },
          shadowOpacity: 0.25,
          shadowRadius: 3.84 * scale,
          elevation: 5,
        },
        itemText: {
          fontSize: 18 * scale,
          color: isDarkMode ? darkTheme.text : lightTheme.text,
        },
        center: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDarkMode ? darkTheme.background : lightTheme.background,
        },
        modalContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
        modalContent: {
          backgroundColor: isDarkMode ? darkTheme.card : lightTheme.card,
          padding: 20 * scale,
          borderRadius: 10,
          width: "80%",
          alignItems: "center",
        },
        modalTitle: {
          fontSize: 20 * scale,
          fontWeight: "bold",
          color: isDarkMode ? darkTheme.text : lightTheme.text,
          marginBottom: 20 * scale,
        },
        modalButton: {
          backgroundColor: "#007BFF",
          padding: 12 * scale,
          borderRadius: 5,
          width: "100%",
          alignItems: "center",
          marginBottom: 10 * scale,
        },
        modalButtonText: {
          color: "#FFF",
          fontSize: 16 * scale,
          fontWeight: "bold",
        },
        closeIcon: {
          position: "absolute",
          top: 10 * scale,
          right: 10 * scale,
        },
      }),
    [isDarkMode]
  );

  useEffect(() => {
    const loadEditions = async () => {
      const minUrl = `${BASE_URL}/editions.min.json`;
      const fallbackUrl = `${BASE_URL}/editions.json`;
      try {
        const data = await fetchDataWithFallback(minUrl, fallbackUrl);
        const editionList: Edition[] = Object.entries(data).map(([key, edition]) => ({
          id: key,
          name: edition.name,
        }));
        setEditions(editionList);
      } catch (error) {
        console.error("Error fetching editions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEditions();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={isDarkMode ? darkTheme.text : lightTheme.text} />
      </View>
    );
  }

  const openLanguageModal = (item: Edition) => {
    setSelectedEdition(item);
    setModalVisible(true);
  };

  const selectLanguage = (lang: string) => {
    if (selectedEdition) {
      router.push({
        pathname: "/(tab)/HadithsDetials",
        params: { editionId: selectedEdition.id, lang },
      });
    }
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Edition }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => openLanguageModal(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hadith Books</Text>
        <Text style={styles.headerDescription}>
        Explore authentic hadith that echo timeless wisdom and guide your journey.
        </Text>
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={editions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      {/* Language Selection Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <AntDesign
                name="closecircle"
                size={24 * scale}
                color={isDarkMode ? "#E0E0E0" : "#333"}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => selectLanguage("eng")}>
              <Text style={styles.modalButtonText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => selectLanguage("ara")}>
              <Text style={styles.modalButtonText}>Arabic</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => selectLanguage("urd")}>
              <Text style={styles.modalButtonText}>Urdu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Hadith;
