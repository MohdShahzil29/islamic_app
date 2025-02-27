import { StyleSheet } from 'react-native';

export const fontStyles = StyleSheet.create({
  arabicText: {
    fontFamily: 'Scheherazade',
    fontSize: 22,
    lineHeight: 36,
    textAlign: 'right',
  },
  urduText: {
    fontFamily: 'Jameel Noori Nastaleeq',
    fontSize: 20,
    lineHeight: 32,
    textAlign: 'right',
  },
  englishText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
  },
});

// Font weights
export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};
