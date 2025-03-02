import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import { fontStyles } from '@/src/styles/fonts';

interface RamzanItemDescription {
  arabic: string;
  urdu: string;
  english: string;
  reference?: string;
}

interface RamzanItem {
  title: string;
  icon: string;
  description: RamzanItemDescription;
}

const ramzanItems: RamzanItem[] = [
  {
    title: 'Importance of Ramzan',
    icon: 'star',
    description: {
      arabic:
        'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذُنُوبِهِ',
      urdu:
        'جو کوئی ایمان اور جزا کے ساتھ رمضان کا روزہ رکھتا ہے، اس کے پچھلے گناہ معاف کر دیے جاتے ہیں۔',
      english:
        'Whoever fasts during Ramadan out of faith and in expectation of reward, his previous sins will be forgiven.',
      reference:
        'Reference: Sahih al-Bukhari, Book 30, Hadith 1, Narrated by Abu Huraira',
    },
  },
  {
    title: 'Observe the Fast',
    icon: 'moon',
    description: {
      arabic: 'الصِّيَامُ جُنَّةٌ',
      urdu: 'روزہ ایک ڈھال ہے',
      english: 'Fasting is a shield.',
      reference:
        'Reference: Sahih Muslim, Book 13, Hadith 7, Narrated by Abu Huraira',
    },
  },
  {
    title: 'Read the Quran',
    icon: 'book',
    description: {
      arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
      urdu: 'آپ میں سے بہترین وہ ہے جو قرآن سیکھے اور پڑھائے',
      english:
        'The best among you are those who learn the Quran and teach it.',
      reference:
        "Reference: Sahih al-Bukhari, Book 66, Hadith 49, Narrated by Abdullah ibn Mas'ud",
    },
  },
  {
    title: 'Perform Tarawih Prayers',
    icon: 'mosque',
    description: {
      arabic: 'أَدِّ صَلاَةَ التَّرَاوِيحِ بِخُشُوعٍ',
      urdu: 'تراؤیح کی نماز خضوع کے ساتھ ادا کریں',
      english: 'Perform Tarawih prayers with devotion.',
    },
  },
  {
    title: 'Give Charity (Zakat)',
    icon: 'hand-holding-heart',
    description: {
      arabic:
        'الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ',
      urdu:
        'صدقت گناہوں کو اس طرح مٹا دیتی ہے جیسے پانی آگ کو بجھا دیتا ہے',
      english:
        'Charity extinguishes sin as water extinguishes fire.',
      reference: 'Reference: Sunan Ibn Majah, Hadith 1740',
    },
  },
  {
    title: 'Attend Iftar Gatherings',
    icon: 'users',
    description: {
      arabic: 'تَجَمَّعُوا لِلإِفْطَارِ',
      urdu: 'افطار کی محفلوں میں شرکت کریں',
      english:
        'Attend Iftar gatherings to break the fast together.',
    },
  },
  {
    title: 'Seek Laylat al-Qadr',
    icon: 'search',
    description: {
      arabic: 'ابْحَثُوا عَنْ لَيْلَةِ الْقَدْرِ',
      urdu: 'لیلة القدر تلاش کریں',
      english:
        'Seek the Night of Decree (Laylat al-Qadr).',
    },
  },
  {
    title: 'Practice Self-Control',
    icon: 'brain',
    description: {
      arabic: 'تَحَكَّمُوا فِي أَنْفُسِكُمْ',
      urdu: 'اپنی نفس پر قابو پائیں',
      english:
        'Practice self-control and patience.',
    },
  },
];

const { width } = Dimensions.get('window');

const createStyles = (theme: typeof import('@/src/context/ThemeContext').lightTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.text,
      marginBottom: 20,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      padding: 15,
      borderRadius: 8,
      marginVertical: 8,
    },
    itemText: {
      fontSize: 18,
      color: theme.text,
      marginLeft: 15,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      width: width * 0.8,
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.text,
    },
    modalText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 8,
      color: theme.text,
    },
    referenceText: {
      fontSize: 14,
      fontStyle: 'italic',
      textAlign: 'center',
      color: theme.text,
      marginTop: 10,
    },
    closeButton: {
      marginTop: 15,
      backgroundColor: '#10B981',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    closeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

const Ramzan: React.FC = () => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<RamzanItem | null>(null);
  const styles = createStyles(theme);

  const openModal = (item: RamzanItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.header, fontStyles.englishText]}>Ramzan</Text>
      {ramzanItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => openModal(item)}
        >
          <FontAwesome5 name={item.icon as any} size={24} color="#10B981" />
          <Text style={[styles.itemText, fontStyles.englishText]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {selectedItem && (
              <>
                <Text style={[styles.modalTitle, fontStyles.englishText]}>
                  {selectedItem.title}
                </Text>
                <Text style={[styles.modalText, fontStyles.arabicText]}>
                  {selectedItem.description.arabic}
                </Text>
                <Text style={[styles.modalText, fontStyles.urduText]}>
                  {selectedItem.description.urdu}
                </Text>
                <Text style={[styles.modalText, fontStyles.englishText]}>
                  {selectedItem.description.english}
                </Text>
                {selectedItem.description.reference && (
                  <Text style={[styles.referenceText, fontStyles.englishText]}>
                    {selectedItem.description.reference}
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.closeButtonText, fontStyles.englishText]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Ramzan;
