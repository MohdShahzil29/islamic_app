import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  Modal,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/src/context/ThemeContext';
import { fontStyles } from '@/src/styles/fonts';

const API_VERSION = '1';
const BASE_URL = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@${API_VERSION}`;

// Create a normalize function to adjust sizes based on screen width
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // 375 is our base width
const normalize = (size) => Math.round(scale * size);

// Helper: Try the minified URL first, then fallback.
const fetchDataWithFallback = async (minUrl, fallbackUrl) => {
  try {
    const response = await fetch(minUrl);
    if (!response.ok) throw new Error('Min URL failed');
    return await response.json();
  } catch {
    const response = await fetch(fallbackUrl);
    if (!response.ok) throw new Error('Fallback URL also failed');
    return await response.json();
  }
};

// Returns the appropriate alignment style for modal search input (language-dependent)
const getModalAlignmentStyle = (lang) => {
  if (lang === 'ar' || lang === 'ara' || lang === 'ur' || lang === 'urd') {
    return { textAlign: 'right' };
  }
  return { textAlign: 'left' };
};

const getModalSearchPlaceholder = (lang) => {
  if (lang === 'ar' || lang === 'ara') return 'ابحث عن الحديث...';
  if (lang === 'ur' || lang === 'urd') return 'حدیث تلاش کریں...';
  return 'Search hadith...';
};

const getModalSearchButtonText = (lang) => {
  if (lang === 'ar' || lang === 'ara') return 'بحث';
  if (lang === 'ur' || lang === 'urd') return 'تلاش کریں';
  return 'Search';
};

/* ----------------------------------
   SECTION LIST (vertical list)
---------------------------------- */
const SectionListComp = ({ sections, onSelect, selectedSection, theme, lang }) => {
  const data = Object.entries(sections)
    .filter(([, name]) => !!name)
    .map(([key, name]) => ({ key, name }));

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.key}
      contentContainerStyle={{ paddingVertical: normalize(8) }}
      renderItem={({ item }) => {
        const isSelected = selectedSection === item.key;
        return (
          <TouchableOpacity
            onPress={() => onSelect(item.key)}
            style={[
              styles.sectionItem,
              { backgroundColor: theme.card },
              isSelected && styles.selectedSectionItem,
            ]}
          >
            {/* Left icon */}
            <Icon
              name="book-open-page-variant"
              size={normalize(24)}
              color={theme.text}
              style={{ marginRight: normalize(10) }}
            />

            {/* Text container with flex: 1 to allow wrapping */}
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.text },
                  fontStyles.englishText,
                ]}
                numberOfLines={2}      // Limit text to two lines
                ellipsizeMode="tail"   // Truncate with an ellipsis
              >
                {item.name}
              </Text>
            </View>

            {/* Check icon if selected */}
            {isSelected && (
              <Icon
                name="check-circle"
                size={normalize(22)}
                color="#008CBA"
                style={{ marginLeft: normalize(10) }}
              />
            )}
          </TouchableOpacity>
        );
      }}
    />
  );
};

/* ----------------------------------
   HADITH LIST
---------------------------------- */
const HadithList = ({ hadiths, theme, lang }) => {
  const backgroundColor = theme.card;
  const textColor = theme.text;
  const titleColor = theme.text;

  return (
    <View style={styles.hadithListContainer}>
      {hadiths.map((hadith) => (
        <View key={hadith.hadithnumber} style={[styles.hadithItem, { backgroundColor }]}>
          <Text
            style={[
              styles.hadithNumber,
              { color: titleColor },
              fontStyles.englishText,
            ]}
          >
            Hadith {hadith.hadithnumber}
          </Text>
          <Text
            style={[
              styles.hadithText,
              { color: textColor },
              lang === 'ar' || lang === 'ara'
                ? { ...fontStyles.arabicText, ...getModalAlignmentStyle(lang) }
                : lang === 'ur' || lang === 'urd'
                ? { ...fontStyles.urduText, ...getModalAlignmentStyle(lang) }
                : { ...fontStyles.englishText, ...getModalAlignmentStyle(lang) },
            ]}
          >
            {hadith.text}
          </Text>
          <Text
            style={[
              styles.hadithGrades,
              { color: textColor },
              (lang === 'ar' || lang === 'ara' || lang === 'ur' || lang === 'urd')
                ? { textAlign: 'right' }
                : { textAlign: 'left' },
              lang === 'ar' || lang === 'ara'
                ? { ...fontStyles.arabicText, ...getModalAlignmentStyle(lang) }
                : lang === 'ur' || lang === 'urd'
                ? { ...fontStyles.urduText, ...getModalAlignmentStyle(lang) }
                : { ...fontStyles.englishText, ...getModalAlignmentStyle(lang) },
            ]}
          >
            {hadith.grades.map((grade) => `${grade.name}: ${grade.grade}`).join(', ')}
          </Text>
        </View>
      ))}
    </View>
  );
};

/* ----------------------------------
   SECTION HADITH MODAL
---------------------------------- */
const SectionHadithModal = ({
  visible,
  onClose,
  sectionName,
  hadiths,
  theme,
  lang,
  loadingSection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHadiths = hadiths.filter(
    (hadith) =>
      hadith.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hadith.hadithnumber.toString().includes(searchQuery)
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={styles.modalHeader}>
          <Text
            style={[
              styles.modalTitle,
              { color: theme.text },
              lang === 'ar' || lang === 'ara'
                ? { ...fontStyles.arabicText, ...getModalAlignmentStyle(lang) }
                : lang === 'ur' || lang === 'urd'
                ? { ...fontStyles.urduText, ...getModalAlignmentStyle(lang) }
                : { ...fontStyles.englishText, ...getModalAlignmentStyle(lang) },
            ]}
          >
            {sectionName}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={normalize(28)} color={theme.text} />
          </TouchableOpacity>
        </View>

        {loadingSection ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.text} />
          </View>
        ) : (
          <>
            <View style={[styles.modalSearchContainer, { backgroundColor: theme.card }]}>
              <TextInput
                style={[
                  styles.modalSearchInput,
                  { color: theme.text },
                  getModalAlignmentStyle(lang),
                ]}
                placeholder={getModalSearchPlaceholder(lang)}
                placeholderTextColor={theme.text}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.modalSearchButton}>
                <Text style={styles.modalSearchButtonText}>
                  {getModalSearchButtonText(lang)}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }}>
              {filteredHadiths.length > 0 ? (
                <HadithList hadiths={filteredHadiths} theme={theme} lang={lang} />
              ) : (
                <Text style={{ color: theme.text, padding: normalize(16) }}>
                  No hadith found.
                </Text>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
};

/* ----------------------------------
   MAIN COMPONENT
---------------------------------- */
const HadithDetails = () => {
  const { editionId, lang } = useLocalSearchParams();
  const [hadithData, setHadithData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedHadith, setSearchedHadith] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionHadiths, setSectionHadiths] = useState(null);
  const [loadingSection, setLoadingSection] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { theme } = useTheme();
  const langPrefix = lang || 'eng';
  const apiEndpoint =
    editionId && editionId.startsWith(`${langPrefix}-`)
      ? editionId
      : `${langPrefix}-${editionId}`;
  const encodedEndpoint = apiEndpoint ? encodeURIComponent(apiEndpoint) : '';

  useEffect(() => {
    const loadHadithData = async () => {
      if (!editionId) {
        Alert.alert('Error', 'Edition ID is missing.');
        setLoading(false);
        return;
      }
      const minUrl = `${BASE_URL}/editions/${encodedEndpoint}.min.json`;
      const fallbackUrl = `${BASE_URL}/editions/${encodedEndpoint}.json`;
      try {
        const data = await fetchDataWithFallback(minUrl, fallbackUrl);
        setHadithData(data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch hadith details.');
      } finally {
        setLoading(false);
      }
    };
    loadHadithData();
  }, [editionId, lang, encodedEndpoint]);

  const searchHadith = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Input Required', 'Please enter a hadith number.');
      return;
    }
    const hadithNo = searchQuery.trim();
    const minUrl = `${BASE_URL}/editions/${encodedEndpoint}/${hadithNo}.min.json`;
    const fallbackUrl = `${BASE_URL}/editions/${encodedEndpoint}/${hadithNo}.json`;
    try {
      const data = await fetchDataWithFallback(minUrl, fallbackUrl);
      setSearchedHadith(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch hadith with the given number.');
    }
  };

  const handleSelectSection = async (sectionKey) => {
    setSelectedSection(sectionKey);
    setSectionHadiths(null);
    // Open the modal immediately so the spinner can be shown inside it
    setModalVisible(true);
    setLoadingSection(true);

    const minUrl = `${BASE_URL}/editions/${encodedEndpoint}/sections/${sectionKey}.min.json`;
    const fallbackUrl = `${BASE_URL}/editions/${encodedEndpoint}/sections/${sectionKey}.json`;
    try {
      const data = await fetchDataWithFallback(minUrl, fallbackUrl);
      setSectionHadiths(data.hadiths || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch hadith for the selected section.');
    } finally {
      setLoadingSection(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {editionId?.toString().toUpperCase()} ({lang || 'English'})
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Icon name="magnify" size={normalize(26)} color={theme.text} />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
          <Icon
            name="magnify"
            size={normalize(20)}
            color={theme.text}
            style={{ marginRight: normalize(8) }}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Enter hadith number..."
            placeholderTextColor={theme.text}
            keyboardType="numeric"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchHadith}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flex: 1 }}>
        {hadithData?.metadata?.sections && !searchedHadith && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeaderText, { color: theme.text }]}>
              Sections
            </Text>
            <SectionListComp
              sections={hadithData.metadata.sections}
              onSelect={handleSelectSection}
              selectedSection={selectedSection}
              theme={theme}
              lang={lang}
            />
          </View>
        )}

        {searchedHadith && (
          <View style={{ flex: 1, marginTop: normalize(10) }}>
            {searchedHadith.hadiths ? (
              <ScrollView style={{ flex: 1 }}>
                <HadithList hadiths={searchedHadith.hadiths} theme={theme} lang={lang} />
              </ScrollView>
            ) : (
              <Text style={{ color: theme.text, padding: normalize(16) }}>
                No results found for hadith number {searchQuery}.
              </Text>
            )}
          </View>
        )}

        {!selectedSection && !searchedHadith && (
          <View style={styles.placeholderContainer}>
            <Text style={{ color: theme.text, textAlign: 'center' }}>
              Select a section above or search for a hadith number.
            </Text>
          </View>
        )}
      </View>

      {modalVisible && (
        <SectionHadithModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          sectionName={hadithData?.metadata?.sections[selectedSection]}
          hadiths={sectionHadiths || []}
          theme={theme}
          lang={lang}
          loadingSection={loadingSection}
        />
      )}
    </View>
  );
};

/* ----------------------------------
   STYLES
---------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingTop: normalize(12),
    paddingBottom: normalize(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    elevation: 2,
  },
  headerTitleContainer: { flex: 1 },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: normalize(10),
    borderRadius: normalize(8),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(8),
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: normalize(16),
    padding: 0,
  },
  searchButton: {
    backgroundColor: '#008CBA',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(6),
    marginLeft: normalize(8),
  },
  searchButtonText: { color: '#fff', fontWeight: '600' },
  sectionContainer: { marginTop: normalize(10), flexShrink: 1 },
  sectionHeaderText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginLeft: normalize(12),
    marginBottom: normalize(6),
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: normalize(10),
    marginVertical: normalize(5),
    borderRadius: normalize(8),
    padding: normalize(12),
    elevation: 2,
  },
  selectedSectionItem: {
    borderWidth: 1,
    borderColor: '#008CBA',
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hadithListContainer: {
    marginBottom: normalize(20),
  },
  hadithItem: {
    marginHorizontal: normalize(10),
    marginVertical: normalize(5),
    borderRadius: normalize(8),
    padding: normalize(12),
    elevation: 2,
  },
  hadithNumber: {
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  hadithText: {
    fontSize: normalize(14),
    marginVertical: normalize(4),
    flexWrap: 'wrap',
    width: '100%',
  },
  hadithGrades: {
    fontSize: normalize(12),
    fontStyle: 'italic',
    marginTop: normalize(4),
    flexWrap: 'wrap',
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    padding: normalize(16),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(8),
    borderRadius: normalize(8),
    marginBottom: normalize(12),
    elevation: 2,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: normalize(16),
    padding: 0,
  },
  modalSearchButton: {
    backgroundColor: '#008CBA',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(6),
    marginLeft: normalize(8),
  },
  modalSearchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default HadithDetails;
