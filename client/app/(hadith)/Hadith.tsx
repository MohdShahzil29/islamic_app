import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { fontStyles } from '../../src/styles/fonts';

const { width, height } = Dimensions.get('window');

interface Hadith {
  id: number;
  hadithNumber: string;
  englishNarrator: string;
  hadithEnglish: string;
  hadithUrdu: string;
  urduNarrator: string;
  hadithArabic: string;
  headingArabic: string | null;
  headingUrdu: string | null;
  headingEnglish: string | null;
  chapterId: string;
  bookSlug: string;
  volume: string;
  status: string;
  book: {
    id: number;
    bookName: string;
    writerName: string;
    aboutWriter: string | null;
    writerDeath: string;
    bookSlug: string;
  };
  chapter: {
    id: number;
    chapterNumber: string;
    chapterEnglish: string;
    chapterUrdu: string;
    chapterArabic: string;
    bookSlug: string;
  };
}

interface Pagination {
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

const HadithBook: React.FC = () => {
  const { bookSlug } = useLocalSearchParams<{ bookSlug: string }>();
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // Only English, Urdu, and Arabic are supported.
  const [selectedLanguage, setSelectedLanguage] = useState<'urdu' | 'english' | 'arabic'>('english');
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
  });

  useEffect(() => {
    fetchHadiths(pagination.current_page);
  }, [pagination.current_page]);

  const fetchHadiths = async (page: number) => {
    try {
      const response = await axios.get<{ hadiths: { data: Hadith[], current_page: number, last_page: number, next_page_url: string | null, prev_page_url: string | null } }>(
        `https://hadithapi.com/api/hadiths/?apiKey=$2y$10$bwLjjpIaC5FCMZIy4w9hBIvRBzxbALx9SPjCSwohfceOM2kb3X&page=${page}`
      );
    //   console.log("API Response:", response.data);
      if (response.data.hadiths) {
        setHadiths(response.data.hadiths.data);
        setPagination({
          current_page: response.data.hadiths.current_page,
          last_page: response.data.hadiths.last_page,
          next_page_url: response.data.hadiths.next_page_url,
          prev_page_url: response.data.hadiths.prev_page_url,
        });
      }
    } catch (error) {
      console.error('Error fetching hadiths:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (hadith: Hadith) => {
    setSelectedHadith(hadith);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedHadith(null);
    setModalVisible(false);
  };

  // Updated to use the selected language for the title.
  const getHadithTitle = (hadith: Hadith) => {
    if (selectedLanguage === 'english' && hadith.headingEnglish) return hadith.headingEnglish;
    if (selectedLanguage === 'urdu' && hadith.headingUrdu) return hadith.headingUrdu;
    if (selectedLanguage === 'arabic' && hadith.headingArabic) return hadith.headingArabic;
    // Fallback: if all title fields are null, return the first three words of the hadith description.
    return hadith.hadithEnglish.split(' ').slice(0, 3).join(' ');
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= pagination.last_page) {
      setLoading(true);
      setPagination((prev) => ({ ...prev, current_page: page }));
    }
  };

  const getHadithText = (hadith: Hadith) => {
    switch (selectedLanguage) {
      case 'urdu':
        return hadith.hadithUrdu;
      case 'arabic':
        return hadith.hadithArabic;
      case 'english':
      default:
        return hadith.hadithEnglish;
    }
  };

  // Helper function to return the appropriate text style based on language.
  const getTextStyle = () => {
    switch (selectedLanguage) {
      case 'urdu':
        return fontStyles.urduText;
      case 'arabic':
        return fontStyles.arabicText;
      case 'english':
      default:
        return fontStyles.englishText;
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, fontStyles.englishText]}>📖 Hadiths</Text>

      <FlatList
        data={hadiths}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
            <Text style={[styles.title, fontStyles.englishText]}>{getHadithTitle(item)}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.pagination}>
        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => goToPage(pagination.current_page - 1)}
          disabled={pagination.current_page <= 1}
        >
          <Text style={[styles.pageButtonText, fontStyles.englishText]}>Previous</Text>
        </TouchableOpacity>
        <Text style={[styles.pageInfo, fontStyles.englishText]}>
          Page {pagination.current_page} of {pagination.last_page}
        </Text>
        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => goToPage(pagination.current_page + 1)}
          disabled={pagination.current_page >= pagination.last_page}
        >
          <Text style={[styles.pageButtonText, fontStyles.englishText]}>Next</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              {selectedHadith && (
                <>
                  <Text style={[styles.modalTitle, getTextStyle()]}>
                    {getHadithTitle(selectedHadith)}
                  </Text>
                  <View style={styles.languageButtons}>
                    <TouchableOpacity
                      style={[styles.languageButton, selectedLanguage === 'urdu' && styles.selectedLanguageButton]}
                      onPress={() => setSelectedLanguage('urdu')}
                    >
                      <Text style={[styles.languageButtonText, fontStyles.urduText]}>Urdu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.languageButton, selectedLanguage === 'english' && styles.selectedLanguageButton]}
                      onPress={() => setSelectedLanguage('english')}
                    >
                      <Text style={[styles.languageButtonText, fontStyles.englishText]}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.languageButton, selectedLanguage === 'arabic' && styles.selectedLanguageButton]}
                      onPress={() => setSelectedLanguage('arabic')}
                    >
                      <Text style={[styles.languageButtonText, fontStyles.arabicText]}>Arabic</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.modalText, getTextStyle()]}>
                    {getHadithText(selectedHadith)}
                  </Text>
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={[styles.closeButtonText, fontStyles.englishText]}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HadithBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A202C',
    marginBottom: height * 0.03,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: width * 0.05,
    marginVertical: height * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  pageButton: {
    padding: width * 0.03,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  pageButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: width * 0.045,
    color: '#718096',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    maxHeight: height * 0.8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalScroll: {
    padding: width * 0.05,
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  modalText: {
    fontSize: width * 0.045,
    marginBottom: height * 0.02,
  },
  closeButton: {
    marginTop: height * 0.02,
    padding: width * 0.03,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.02,
  },
  languageButton: {
    padding: width * 0.03,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  selectedLanguageButton: {
    backgroundColor: '#4A90E2',
  },
  languageButtonText: {
    fontWeight: 'bold',
  },
});
