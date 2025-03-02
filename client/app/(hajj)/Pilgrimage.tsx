import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import HajjImage from '../../assets/Hajj.png';
import { useTheme } from '@/src/context/ThemeContext';
import { fontStyles } from '@/src/styles/fonts';

interface RitualDescription {
  english: string;
  urdu: string;
  hinglish: string;
}

interface Ritual {
  title: string;
  icon: string;
  description: RitualDescription;
}

const rituals: Ritual[] = [
  {
    title: 'Tawaf',
    icon: 'sync',
    description: {
      english: 'Circumambulation of the Kaaba in a slow, reverent manner.',
      urdu: 'کعبہ کے گرد آہستہ اور عقیدت سے طواف کرنا۔',
      hinglish: 'Kaaba ke gird ahista aur iqdeet se tawaf karna.',
    },
  },
  {
    title: "Sa'i",
    icon: 'walking',
    description: {
      english: 'Walking briskly between the hills of Safa and Marwah.',
      urdu: 'صفا اور مروہ کے پہاڑوں کے درمیان تیز چلنا۔',
      hinglish: 'Safa aur Marwah ke paharon ke darmiyan tezz chalna.',
    },
  },
  {
    title: 'Wuquf at Arafat',
    icon: 'sun',
    description: {
      english: 'Standing in earnest supplication at Arafat.',
      urdu: 'عرفات میں دل سے دعا کرنا۔',
      hinglish: 'Arafat par dil se dua karna.',
    },
  },
  {
    title: 'Rami al-Jamarat',
    icon: 'bullseye',
    description: {
      english: 'Stoning the symbolic pillars representing evil.',
      urdu: 'برائی کے نمائندہ ستونوں پر کنکریاں پھینکنا۔',
      hinglish: 'Burai ke numainda stunon par stone phenkna.',
    },
  },
  {
    title: 'Halq/Taqsir',
    icon: 'cut',
    description: {
      english: 'Shaving or cutting hair as a sign of spiritual renewal.',
      urdu: 'تجدید روح کے نشان کے طور پر بال کاٹنا یا شیو کرانا۔',
      hinglish: 'Tajdeed-e-rooh ke nishan ke taur par baal kaatna ya shave karwana.',
    },
  },
];

const Pilgrimage: React.FC = () => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);

  const styles = createStyles(theme, width);

  const openModal = (ritual: Ritual) => {
    setSelectedRitual(ritual);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={HajjImage} style={styles.image} />
      <Text style={[styles.title, fontStyles.englishText]}>Pilgrimage</Text>
      <Text style={[styles.description, fontStyles.englishText]}>
        During the pilgrimage of Hajj, Muslims perform a variety of rituals.
      </Text>
      <View style={styles.ritualsContainer}>
        {rituals.map((ritual, index) => (
          <TouchableOpacity
            key={index}
            style={styles.ritual}
            onPress={() => openModal(ritual)}
          >
            <FontAwesome5 name={ritual.icon as any} size={24} color="#10B981" />
            <View style={styles.ritualTextContainer}>
              <Text style={[styles.ritualTitle, fontStyles.englishText]}>
                {ritual.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {selectedRitual && (
              <>
                <Text style={[styles.modalTitle, fontStyles.englishText]}>
                  {selectedRitual.title}
                </Text>
                <Text style={[styles.modalText, fontStyles.englishText]}>
                  {selectedRitual.description.english}
                </Text>
                <Text style={[styles.modalText, fontStyles.urduText]}>
                  {selectedRitual.description.urdu}
                </Text>
                <Text style={[styles.modalText, fontStyles.englishText]}>
                  {selectedRitual.description.hinglish}
                </Text>
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

const createStyles = (
  theme: typeof import('@/src/context/ThemeContext').lightTheme,
  deviceWidth: number
) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      padding: deviceWidth * 0.05,
      backgroundColor: theme.background,
    },
    image: {
      width: deviceWidth * 0.9,
      height: deviceWidth * 0.5,
      resizeMode: 'contain',
      marginBottom: deviceWidth * 0.05,
    },
    title: {
      fontSize: deviceWidth * 0.06,
      fontWeight: 'bold',
      marginBottom: deviceWidth * 0.03,
      color: theme.text,
    },
    description: {
      fontSize: deviceWidth * 0.045,
      textAlign: 'center',
      marginBottom: deviceWidth * 0.05,
      color: theme.text,
    },
    ritualsContainer: {
      width: '100%',
    },
    ritual: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      padding: deviceWidth * 0.04,
      marginVertical: deviceWidth * 0.02,
      borderRadius: deviceWidth * 0.02,
      elevation: 2,
    },
    ritualTextContainer: {
      marginLeft: deviceWidth * 0.04,
      flex: 1,
    },
    ritualTitle: {
      fontSize: deviceWidth * 0.045,
      fontWeight: 'bold',
      color: theme.text,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      width: deviceWidth * 0.8,
      backgroundColor: theme.background,
      borderRadius: deviceWidth * 0.05,
      padding: deviceWidth * 0.05,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: deviceWidth * 0.055,
      fontWeight: 'bold',
      marginBottom: deviceWidth * 0.03,
      color: theme.text,
    },
    modalText: {
      fontSize: deviceWidth * 0.045,
      textAlign: 'center',
      marginBottom: deviceWidth * 0.02,
      color: theme.text,
    },
    closeButton: {
      marginTop: deviceWidth * 0.04,
      backgroundColor: '#10B981',
      paddingVertical: deviceWidth * 0.03,
      paddingHorizontal: deviceWidth * 0.05,
      borderRadius: deviceWidth * 0.02,
    },
    closeButtonText: {
      color: '#FFFFFF',
      fontSize: deviceWidth * 0.045,
      fontWeight: 'bold',
    },
  });

export default Pilgrimage;
