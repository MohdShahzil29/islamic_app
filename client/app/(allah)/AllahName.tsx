import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Easing,
} from 'react-native';
import { fontStyles } from '@/src/styles/fonts';
import { useTheme } from '@/src/context/ThemeContext';

type AllahNameItem = {
  number: number;
  name: string;
  meaning_en: string;
  meaning_ur: string;
};

const allAllahNames: AllahNameItem[] = [
  { number: 1,  name: "Ar-Rahman",   meaning_en: "The Most Gracious",           meaning_ur: "نہایت مہربان" },
  { number: 2,  name: "Ar-Rahim",    meaning_en: "The Most Merciful",           meaning_ur: "نہایت رحم کرنے والا" },
  { number: 3,  name: "Al-Malik",    meaning_en: "The King",                    meaning_ur: "بادشاہ" },
  { number: 4,  name: "Al-Quddus",   meaning_en: "The Holy",                    meaning_ur: "پاکیزہ" },
  { number: 5,  name: "As-Salam",    meaning_en: "The Source of Peace",         meaning_ur: "سلامتی دینے والا" },
  { number: 6,  name: "Al-Mu'min",   meaning_en: "The Granter of Security",     meaning_ur: "امن دینے والا" },
  { number: 7,  name: "Al-Muhaymin", meaning_en: "The Protector",               meaning_ur: "نگہبان" },
  { number: 8,  name: "Al-Aziz",     meaning_en: "The Almighty",                meaning_ur: "عزیز" },
  { number: 9,  name: "Al-Jabbar",   meaning_en: "The Compeller",               meaning_ur: "زبردست" },
  { number: 10, name: "Al-Mutakabbir", meaning_en: "The Supreme",              meaning_ur: "بڑائی والا" },
  { number: 11, name: "Al-Khaliq",   meaning_en: "The Creator",                 meaning_ur: "پیدا کرنے والا" },
  { number: 12, name: "Al-Bari'",    meaning_en: "The Maker",                   meaning_ur: "تخلیق کرنے والا" },
  { number: 13, name: "Al-Musawwir", meaning_en: "The Fashioner",               meaning_ur: "صورت دینے والا" },
  { number: 14, name: "Al-Ghaffar",  meaning_en: "The Great Forgiver",          meaning_ur: "بہت بخش دینے والا" },
  { number: 15, name: "Al-Qahhar",   meaning_en: "The Subduer",                 meaning_ur: "قاہر" },
  { number: 16, name: "Al-Wahhab",   meaning_en: "The Bestower",                meaning_ur: "عطا کرنے والا" },
  { number: 17, name: "Ar-Razzaq",   meaning_en: "The Provider",                meaning_ur: "رزق دینے والا" },
  { number: 18, name: "Al-Fattah",   meaning_en: "The Opener",                  meaning_ur: "کھولنے والا" },
  { number: 19, name: "Al-'Alim",   meaning_en: "The All-Knowing",             meaning_ur: "سب کچھ جاننے والا" },
  { number: 20, name: "Al-Qabid",   meaning_en: "The Withholder",              meaning_ur: "روکنے والا" },
  { number: 21, name: "Al-Basit",   meaning_en: "The Expander",                meaning_ur: "وسیع کرنے والا" },
  { number: 22, name: "Al-Khafid",  meaning_en: "The Abaser",                  meaning_ur: "نیچا کرنے والا" },
  { number: 23, name: "Ar-Rafi'",   meaning_en: "The Exalter",                 meaning_ur: "بلند کرنے والا" },
  { number: 24, name: "Al-Mu'izz",  meaning_en: "The Honourer",                meaning_ur: "عزت دینے والا" },
  { number: 25, name: "Al-Mudhill", meaning_en: "The Humiliator",              meaning_ur: "ذلیل کرنے والا" },
  { number: 26, name: "As-Sami'",   meaning_en: "The All-Hearing",             meaning_ur: "سننے والا" },
  { number: 27, name: "Al-Basir",   meaning_en: "The All-Seeing",              meaning_ur: "دیکھنے والا" },
  { number: 28, name: "Al-Hakam",   meaning_en: "The Judge",                   meaning_ur: "فیصلہ کرنے والا" },
  { number: 29, name: "Al-'Adl",    meaning_en: "The Just",                    meaning_ur: "انصاف کرنے والا" },
  { number: 30, name: "Al-Latif",   meaning_en: "The Subtle One",              meaning_ur: "نرم دل" },
  { number: 31, name: "Al-Khabir",  meaning_en: "The All-Aware",               meaning_ur: "خبردار" },
  { number: 32, name: "Al-Halim",   meaning_en: "The Forbearing",              meaning_ur: "بردبار" },
  { number: 33, name: "Al-Azim",    meaning_en: "The Magnificent",             meaning_ur: "عظیم" },
  { number: 34, name: "Al-Ghafur",  meaning_en: "The Great Forgiver",          meaning_ur: "معاف کرنے والا" },
  { number: 35, name: "Ash-Shakur", meaning_en: "The Appreciative",            meaning_ur: "شکر گزار" },
  { number: 36, name: "Al-Aliyy",   meaning_en: "The Most High",               meaning_ur: "بلند" },
  { number: 37, name: "Al-Kabir",   meaning_en: "The Most Great",              meaning_ur: "بڑا" },
  { number: 38, name: "Al-Hafiz",   meaning_en: "The Preserver",               meaning_ur: "محافظ" },
  { number: 39, name: "Al-Muqit",   meaning_en: "The Nourisher",               meaning_ur: "توانائی دینے والا" },
  { number: 40, name: "Al-Hasib",   meaning_en: "The Reckoner",                meaning_ur: "حساب کرنے والا" },
  { number: 41, name: "Al-Jalil",   meaning_en: "The Majestic",                meaning_ur: "جلیل" },
  { number: 42, name: "Al-Karim",   meaning_en: "The Generous",                meaning_ur: "کریم" },
  { number: 43, name: "Ar-Raqib",   meaning_en: "The Watchful",                meaning_ur: "نگران" },
  { number: 44, name: "Al-Mujib",   meaning_en: "The Responsive",              meaning_ur: "جواب دینے والا" },
  { number: 45, name: "Al-Wasi'",   meaning_en: "The All-Encompassing",         meaning_ur: "وسیع" },
  { number: 46, name: "Al-Hakim",   meaning_en: "The Wise",                    meaning_ur: "دانشمند" },
  { number: 47, name: "Al-Wadud",   meaning_en: "The Loving",                  meaning_ur: "محبت کرنے والا" },
  { number: 48, name: "Al-Majid",   meaning_en: "The Most Glorious",           meaning_ur: "جلیل" },
  { number: 49, name: "Al-Ba'ith",  meaning_en: "The Resurrector",             meaning_ur: "زندہ کرنے والا" },
  { number: 50, name: "Ash-Shahid", meaning_en: "The Witness",                 meaning_ur: "گواہ" },
  { number: 51, name: "Al-Haqq",    meaning_en: "The Truth",                   meaning_ur: "حق" },
  { number: 52, name: "Al-Wakil",   meaning_en: "The Trustee",                 meaning_ur: "موکل" },
  { number: 53, name: "Al-Qawiyy",  meaning_en: "The Strong",                  meaning_ur: "طاقتور" },
  { number: 54, name: "Al-Matin",   meaning_en: "The Firm",                    meaning_ur: "مضبوط" },
  { number: 55, name: "Al-Wali",    meaning_en: "The Protecting Friend",       meaning_ur: "ولی" },
  { number: 56, name: "Al-Hamid",   meaning_en: "The Praiseworthy",            meaning_ur: "تعریف والا" },
  { number: 57, name: "Al-Muhsi",   meaning_en: "The Accounter",               meaning_ur: "حساب دینے والا" },
  { number: 58, name: "Al-Mubdi'",  meaning_en: "The Originator",              meaning_ur: "ابتداء کرنے والا" },
  { number: 59, name: "Al-Mu'id",   meaning_en: "The Restorer",                meaning_ur: "بحال کرنے والا" },
  { number: 60, name: "Al-Muhyi",   meaning_en: "The Giver of Life",           meaning_ur: "زندگی دینے والا" },
  { number: 61, name: "Al-Mumit",   meaning_en: "The Taker of Life",           meaning_ur: "موت دینے والا" },
  { number: 62, name: "Al-Hayy",    meaning_en: "The Ever-Living",             meaning_ur: "ہمیشہ زندہ" },
  { number: 63, name: "Al-Qayyum",  meaning_en: "The Self-Subsisting",         meaning_ur: "خود کفیل" },
  { number: 64, name: "Al-Wajid",   meaning_en: "The Finder",                  meaning_ur: "دریافت کرنے والا" },
  { number: 65, name: "Al-Wahid",   meaning_en: "The One",                     meaning_ur: "واحد" },
  { number: 66, name: "As-Samad",   meaning_en: "The Eternal",                 meaning_ur: "سب کا محتاج نہیں" },
  { number: 67, name: "Al-Qadir",   meaning_en: "The All-Powerful",            meaning_ur: "قدرت والا" },
  { number: 68, name: "Al-Muqtadir",meaning_en: "The Determiner",              meaning_ur: "قرار دینے والا" },
  { number: 69, name: "Al-Muqaddim",meaning_en: "The Expediter",               meaning_ur: "آگے بڑھانے والا" },
  { number: 70, name: "Al-Mu'akhkhir",meaning_en: "The Delayer",              meaning_ur: "پیچھے کرنے والا" },
  { number: 71, name: "Al-Awwal",   meaning_en: "The First",                   meaning_ur: "اول" },
  { number: 72, name: "Al-Akhir",   meaning_en: "The Last",                    meaning_ur: "آخر" },
  { number: 73, name: "Az-Zahir",   meaning_en: "The Evident",                 meaning_ur: "ظاہر" },
  { number: 74, name: "Al-Batin",   meaning_en: "The Hidden",                  meaning_ur: "باطن" },
  { number: 75, name: "Al-Muta'ali",meaning_en: "The Most Exalted",            meaning_ur: "سب سے بلند" },
  { number: 76, name: "Al-Barr",    meaning_en: "The Benefactor",              meaning_ur: "نیک" },
  { number: 77, name: "At-Tawwab",  meaning_en: "The Accepter of Repentance",  meaning_ur: "توبہ قبول کرنے والا" },
  { number: 78, name: "Al-Muntaqim",meaning_en: "The Avenger",                 meaning_ur: "انتقام لینے والا" },
  { number: 79, name: "Al-'Afuww",  meaning_en: "The Pardoner",                meaning_ur: "معاف کرنے والا" },
  { number: 80, name: "Ar-Ra'uf",   meaning_en: "The Compassionate",           meaning_ur: "رحم کرنے والا" },
  { number: 81, name: "Malik-ul-Mulk", meaning_en: "The Owner of All Sovereignty", meaning_ur: "حاکم" },
  { number: 82, name: "Dhul-Jalal wal-Ikram", meaning_en: "The Possessor of Majesty and Honour", meaning_ur: "جلال و کرم والا" },
  { number: 83, name: "Al-Muqsit",  meaning_en: "The Equitable",             meaning_ur: "انصاف کرنے والا" },
  { number: 84, name: "Al-Jami'",   meaning_en: "The Gatherer",              meaning_ur: "جمع کرنے والا" },
  { number: 85, name: "Al-Ghani",   meaning_en: "The Rich",                  meaning_ur: "غنی" },
  { number: 86, name: "Al-Mughni",  meaning_en: "The Enricher",              meaning_ur: "امیر کرنے والا" },
  { number: 87, name: "Al-Mani'",   meaning_en: "The Preventer",             meaning_ur: "روکنے والا" },
  { number: 88, name: "Ad-Darr",    meaning_en: "The Harmer",                meaning_ur: "ضرر دینے والا" },
  { number: 89, name: "An-Nafi'",   meaning_en: "The Benefactor",            meaning_ur: "فائدہ دینے والا" },
  { number: 90, name: "An-Nur",     meaning_en: "The Light",                 meaning_ur: "نور" },
  { number: 91, name: "Al-Hadi",    meaning_en: "The Guide",                 meaning_ur: "رہنما" },
  { number: 92, name: "Al-Badi'",   meaning_en: "The Incomparable",          meaning_ur: "بدیع" },
  { number: 93, name: "Al-Baqi'",   meaning_en: "The Everlasting",           meaning_ur: "ابدی" },
  { number: 94, name: "Al-Warith",  meaning_en: "The Heir",                  meaning_ur: "وارث" },
  { number: 95, name: "Ar-Rashid",  meaning_en: "The Guide to the Right Path", meaning_ur: "راستہ دکھانے والا" },
  { number: 96, name: "As-Sabur",   meaning_en: "The Patient",               meaning_ur: "صابر" },
  { number: 97, name: "Al-Ahad",    meaning_en: "The Unique (The One)",      meaning_ur: "یکتا" },
  { number: 98, name: "Al-Muqsir",  meaning_en: "The Reconciler",            meaning_ur: "صلح کرنے والا" },
  { number: 99, name: "Al-Murabbi", meaning_en: "The Nurturer",              meaning_ur: "پرورش دینے والا" }
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const AllahName = () => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const position = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [scale]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_evt, gestureState) => {
      position.setValue({ x: gestureState.dx, y: 0 });
    },
    onPanResponderRelease: (_evt, gestureState) => {
      if (gestureState.dx > 120) {
        // Swipe right for previous name
        Animated.timing(position, {
          toValue: { x: SCREEN_WIDTH, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          position.setValue({ x: 0, y: 0 });
          setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? allAllahNames.length - 1 : prevIndex - 1
          );
        });
      } else if (gestureState.dx < -120) {
        // Swipe left for next name
        Animated.timing(position, {
          toValue: { x: -SCREEN_WIDTH, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          position.setValue({ x: 0, y: 0 });
          setCurrentIndex((prevIndex) => (prevIndex + 1) % allAllahNames.length);
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const cardStyle = {
    ...position.getLayout(),
    transform: [{ scale }],
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  };

  const currentName = allAllahNames[currentIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={cardStyle} {...panResponder.panHandlers}>
        <Text style={[fontStyles.arabicText, styles.arabicText, { color: theme.text }]}>
          {currentName.name}
        </Text>
        <Text style={[fontStyles.englishText, styles.englishText, { color: theme.text }]}>
          {currentName.meaning_en}
        </Text>
        <Text style={[fontStyles.urduText, styles.urduText, { color: theme.text }]}>
          {currentName.meaning_ur}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AllahName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 36,
    marginBottom: 15,
    textAlign: 'center',
  },
  englishText: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
  },
  urduText: {
    fontSize: 26,
    textAlign: 'center',
  },
});
