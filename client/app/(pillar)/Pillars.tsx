import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import allahImage from '../../assets/Pillars.png';
import { fontStyles, fontWeights } from '@/src/styles/fonts';

interface PillarDescription {
  english: string;
  urdu: string;
  hinglish: string;
}

interface Pillar {
  name: string;
  icon: string;
  description: PillarDescription;
}

const pillarsData: Pillar[] = [
  {
    name: 'Shahada',
    icon: 'pray',
    description: {
      english: 'Faith in the oneness of Allah and the prophethood of Muhammad (PBUH).',
      urdu: 'اللہ کی وحدانیت اور محمد (ﷺ) کی نبوت پر ایمان۔',
      hinglish: 'Allah ki wahdaniyat aur Muhammad (PBUH) ki nabuwat par imaan.',
    },
  },
  {
    name: 'Salah',
    icon: 'mosque',
    description: {
      english: 'Performing the five daily prayers.',
      urdu: 'پانچ وقت کی نماز ادا کرنا۔',
      hinglish: 'Paanch waqt ki namaz ada karna.',
    },
  },
  {
    name: 'Zakat',
    icon: 'hand-holding-heart',
    description: {
      english: 'Giving charity to those in need.',
      urdu: 'ضرورت مندوں کو زکوٰۃ دینا۔',
      hinglish: 'Zaroorat mandon ko zakat dena.',
    },
  },
  {
    name: 'Sawm',
    icon: 'utensils',
    description: {
      english: 'Fasting during the month of Ramadan.',
      urdu: 'رمضان کے مہینے میں روزہ رکھنا۔',
      hinglish: 'Ramzan ke mahine mein roza rakhna.',
    },
  },
  {
    name: 'Hajj',
    icon: 'kaaba',
    description: {
      english: 'Pilgrimage to Mecca for those who are able.',
      urdu: 'جو قابل ہیں ان کے لئے مکہ مکرمہ کا حج۔',
      hinglish: 'Jo qabil hain unke liye Makkah ka Hajj.',
    },
  },
];

const Pillars: React.FC = () => {
  const { width } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  const styles = createStyles(width);

  const openModal = (pillar: Pillar) => {
    setSelectedPillar(pillar);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={allahImage} style={styles.allahImage} />
      <View style={styles.pillarContainer}>
        {pillarsData.map((pillar, index) => (
          <TouchableOpacity
            key={index}
            style={styles.pillar}
            onPress={() => openModal(pillar)}
          >
            <FontAwesome5
              name={pillar.icon as any}
              size={Math.floor(width * 0.07)}
              color="white"
            />
            <Text style={[styles.pillarText, fontStyles.englishText]}>
              {pillar.name}
            </Text>
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
            {selectedPillar && (
              <>
                <Text style={[styles.modalTitle, fontStyles.englishText]}>
                  {selectedPillar.name}
                </Text>
                <Text style={[styles.modalText, fontStyles.englishText]}>
                  {selectedPillar.description.english}
                </Text>
                <Text style={[styles.modalText, fontStyles.urduText]}>
                  {selectedPillar.description.urdu}
                </Text>
                <Text style={[styles.modalText, fontStyles.englishText]}>
                  {selectedPillar.description.hinglish}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={[styles.closeText, fontStyles.englishText]}>
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

export default Pillars;

const createStyles = (deviceWidth: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1E293B',
      padding: deviceWidth * 0.05,
    },
    allahImage: {
      width: deviceWidth * 0.5,
      height: deviceWidth * 0.5,
      resizeMode: 'contain',
      marginBottom: deviceWidth * 0.07,
    },
    pillarContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    pillar: {
      backgroundColor: '#10B981',
      padding: deviceWidth * 0.03,
      borderRadius: deviceWidth * 0.02,
      alignItems: 'center',
      width: deviceWidth * 0.28,
      margin: deviceWidth * 0.015,
    },
    pillarText: {
      color: 'white',
      fontSize: deviceWidth * 0.045,
      marginTop: deviceWidth * 0.015,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      backgroundColor: 'white',
      padding: deviceWidth * 0.05,
      borderRadius: deviceWidth * 0.05,
      width: deviceWidth * 0.8,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: deviceWidth * 0.055,
      fontWeight: 'bold',
      marginBottom: deviceWidth * 0.03,
      color: '#000',
    },
    modalText: {
      fontSize: deviceWidth * 0.045,
      textAlign: 'center',
      marginBottom: deviceWidth * 0.02,
      color: '#000',
    },
    closeButton: {
      marginTop: deviceWidth * 0.04,
      backgroundColor: '#10B981',
      paddingVertical: deviceWidth * 0.03,
      paddingHorizontal: deviceWidth * 0.05,
      borderRadius: deviceWidth * 0.02,
    },
    closeText: {
      color: 'white',
      fontSize: deviceWidth * 0.045,
      fontWeight: 'bold',
    },
  });
