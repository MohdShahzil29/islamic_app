import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { fontStyles } from '../styles/fonts';

interface BoxItem {
  id: number;
  title: string;
  route: string;
}

const boxes: BoxItem[] = [
  { id: 1, title: 'Quran', route: '(quran)/Quran' },
  { id: 2, title: 'Quran With Audio', route: '(quranaudio)/QuranAudio' },
  { id: 3, title: 'Allah Name', route: '(allah)/AllahName' },
  { id: 4, title: 'Surah', route: '(homelist)/Home' },
  { id: 5, title: 'Pillar of Islam', route: '(pillar)/Pillars' },
  { id: 6, title: 'Ramadan', route: '(ramzan)/Ramzan' },
];

const { width } = Dimensions.get('window');

const HomeLoading: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handlePress = (route: string) => {
    navigation.navigate(route as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, fontStyles.urduText, { color: theme.text }]}>
        اپنا انتخاب کریں
      </Text>
      <View style={styles.gridContainer}>
        {boxes.map((box) => (
          <Pressable
            key={box.id}
            onPress={() => handlePress(box.route)}
            style={({ pressed }) => [
              styles.box,
              { backgroundColor: theme.card, width: width * 0.45 },
              pressed && styles.pressedBox,
            ]}
          >
            <Text style={[styles.boxText, fontStyles.englishText, { color: theme.text }]}>
              {box.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default HomeLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  pressedBox: {
    opacity: 0.7,
  },
});
