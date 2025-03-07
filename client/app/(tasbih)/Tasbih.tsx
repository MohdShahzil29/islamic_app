import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';

interface TasbeehItem {
  id: string;
  title: string;
  description: string;
}

const tasbeehList: TasbeehItem[] = [
  { id: '1', title: 'سُبْحَانَ ٱللَّٰه', description: 'سُبْحَانَ ٱللَّٰه' },
  { id: '2', title: 'ٱلْحَمْدُ لِلَّٰهِ', description: 'ٱلْحَمْدُ لِلَّٰهِ' },
  { id: '3', title: 'ٱللَّهُ أَكْبَرُ', description: 'ٱللَّهُ أَكْبَرُ' },
  { id: '4', title: 'لَا إِلٰهَ إِلَّا اللَّهُ', description: 'لَا إِلٰهَ إِلَّا اللَّهُ' },
  { id: '5', title: 'أَسْتَغْفِرُ ٱللَّٰهَ', description: 'أَسْتَغْفِرُ ٱللَّٰهَ' },
  { id: '6', title: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', description: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ' },
  { id: '7', title: 'حَسْبُنَا ٱللَّٰهُ وَنِعْمَ ٱلْوَكِيلُ', description: 'حَسْبُنَا ٱللَّٰهُ وَنِعْمَ ٱلْوَكِيلُ' },
  { id: '8', title: 'رَضِيتُ بِٱللَّٰهِ رَبًّا وَبِٱلْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا', description: 'رَضِيتُ بِٱللَّٰهِ رَبًّا وَبِٱلْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا' },
  { id: '9', title: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ', description: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ' },
  { id: '10', title: 'سُبْحَانَ ٱللَّٰهِ وَٱلْحَمْدُ لِلَّٰهِ وَلَا إِلٰهَ إِلَّا اللَّهُ وَٱللَّهُ أَكْبَرُ', description: 'سُبْحَانَ ٱللَّٰهِ وَٱلْحَمْدُ لِلَّٰهِ وَلَا إِلٰهَ إِلَّا اللَّهُ وَٱللَّهُ أَكْبَرُ' },
  { id: '11', title: 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ ٱلظَّالِمِينَ', description: 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ ٱلظَّالِمِينَ' },
  { id: '12', title: 'ٱللَّهُمَّ إِنِّي أَسْأَلُكَ ٱلْعَفْوَ وَٱلْعَافِيَةَ فِي ٱلدُّنْيَا وَٱلْآخِرَةِ', description: 'ٱللَّهُمَّ إِنِّي أَسْأَلُكَ ٱلْعَفْوَ وَٱلْعَافِيَةَ فِي ٱلدُّنْيَا وَٱلْآخِرَةِ' },
  { id: '13', title: 'ٱللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا عَمِلْتُ وَمِنْ شَرِّ مَا لَمْ أَعْمَلْ', description: 'ٱللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا عَمِلْتُ وَمِنْ شَرِّ مَا لَمْ أَعْمَلْ' },
  { id: '14', title: 'ٱللَّهُمَّ إِنِّي أَسْأَلُكَ ٱلثَّبَاتَ فِي ٱلْأَمْرِ وَالْعَزِيمَةَ عَلَى الرُّشْدِ', description: 'ٱللَّهُمَّ إِنِّي أَسْأَلُكَ ٱلثَّبَاتَ فِي ٱلْأَمْرِ وَالْعَزِيمَةَ عَلَى الرُّشْدِ' },
  { id: '15', title: 'ٱللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ ٱلْهَمِّ وَٱلْحَزَنِ وَٱلْعَجْزِ وَٱلْكَسَلِ', description: 'ٱللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ ٱلْهَمِّ وَٱلْحَزَنِ وَٱلْعَجْزِ وَٱلْكَسَلِ' },
];


const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Tasbih: React.FC = () => {
  const { theme } = useTheme();
  const [selectedTasbeeh, setSelectedTasbeeh] = useState<TasbeehItem | null>(null);
  const [counter, setCounter] = useState<number>(0);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const openTasbeeh = (tasbeeh: TasbeehItem) => {
    setSelectedTasbeeh(tasbeeh);
  };

  const closeCounterView = () => {
    setSelectedTasbeeh(null);
    setCounter(0);
  };

  const handleIncrement = () => {
    setCounter(counter + 1);

    // Start Glow Animation
    Animated.parallel([
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 200, // Glow in
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 400, // Glow out
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fff', '#FFD700'], // White to Golden Glow
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>التسبيح والأذكار اليومية</Text>
      <FlatList
        data={tasbeehList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]} onPress={() => openTasbeeh(item)}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={!!selectedTasbeeh}
        transparent={false}
        animationType="slide"
        onRequestClose={closeCounterView}
      >
        <View style={[styles.counterContainer, { backgroundColor: theme.background }]}>
          {selectedTasbeeh && (
            <>
              <Text style={[styles.tasbeehTitle, { color: theme.text }]}>{selectedTasbeeh.title}</Text>
              <Text style={[styles.tasbeehDescription, { color: theme.text }]}>{selectedTasbeeh.description}</Text>

              <Animated.Text
                style={[
                  styles.counterText,
                  { color: theme.text, textShadowColor: glowColor, textShadowRadius: 10, transform: [{ scale: scaleAnim }] },
                ]}
              >
                العدد: {counter}
              </Animated.Text>

              <View style={styles.buttonGroup}>
                <View style={styles.rowButtons}>
                  <TouchableOpacity style={[styles.button, styles.incrementButton]} onPress={handleIncrement}>
                    <FontAwesome name="plus" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Increment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={() => setCounter(0)}>
                    <FontAwesome name="refresh" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Reset</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={closeCounterView}>
                  <FontAwesome name="close" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default Tasbih;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
  },
  header: {
    fontSize: windowWidth * 0.07,
    fontWeight: 'bold',
    marginBottom: '5%',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: '5%',
  },
  card: {
    borderRadius: 10,
    padding: windowWidth * 0.05,
    marginVertical: windowHeight * 0.0125,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: windowWidth * 0.05,
    fontWeight: '500',
    textAlign: 'center',
  },
  counterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: windowWidth * 0.05,
  },
  tasbeehTitle: {
    fontSize: windowWidth * 0.07,
    fontWeight: 'bold',
    marginBottom: windowHeight * 0.015,
    textAlign: 'center',
  },
  tasbeehDescription: {
    fontSize: windowWidth * 0.05,
    marginBottom: windowHeight * 0.025,
    textAlign: 'center',
  },
  counterText: {
    fontSize: windowWidth * 0.06,
    marginBottom: windowHeight * 0.025,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: 150,
  },
  incrementButton: {
    backgroundColor: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
  closeButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#fff',
  },
});
