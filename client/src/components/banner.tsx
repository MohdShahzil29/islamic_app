import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, PixelRatio } from 'react-native';
import bannerImage from '../../assets/Mosque-01 1.png';
import { useTheme } from '@/src/context/ThemeContext';
import { fontStyles } from '@/src/styles/fonts';

// Get screen dimensions for responsive scaling
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;

// Normalize font sizes based on screen width
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const Banner = () => {
  const { isDarkMode, theme } = useTheme();

  return (
    <ImageBackground 
      source={bannerImage} 
      style={[styles.banner, { backgroundColor: theme.background }]} 
      resizeMode="cover"
    >
      {/* Semi-transparent overlay for better text contrast */}
      <View style={[styles.overlay, { backgroundColor: theme.translucent }]} />
      
      {/* Content on top of the banner */}
      <View style={styles.content}>
        <Text 
          style={[
            fontStyles.arabicText, 
            { color: theme.text, fontSize: normalize(22) }
          ]}
        >
          بسم الله الرحمن الرحيم
        </Text>
      </View>
    </ImageBackground>
  );
};

export default Banner;

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    aspectRatio: 16 / 9, // Ensures the banner scales proportionally
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
  },
});
