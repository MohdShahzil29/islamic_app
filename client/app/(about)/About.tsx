import { useTheme } from '@/src/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const About = () => {
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const titleColor = isDarkMode ? '#fff' : '#2C3E50';
  const bodyColor = isDarkMode ? '#ccc' : '#34495E';
  const footerColor = isDarkMode ? '#aaa' : '#7F8C8D';

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: titleColor }]}>Welcome to Hikam</Text>

      <Text style={[styles.body, { color: bodyColor }]}>
        Hikam is your comprehensive Islamic companion app, dedicated to guiding you on your spiritual journey.
      </Text>

      <Text style={[styles.body, { color: bodyColor }]}>
        Here, you can access a wealth of knowledge including authentic Hadith and Quran surahs, along with a built-in Qibla finder to help you locate the direction for prayer. Our app also features precise Namaz timings, an alarm system to keep you punctual, and educational resources to deepen your understanding of Islam.
      </Text>

      <Text style={[styles.body, { color: bodyColor }]}>
        With continuous updates, we’re always working to bring you new features and improvements to enhance your experience.
      </Text>

      <Text style={[styles.footer, { color: footerColor }]}>
        Founded by Mohd Shahzil, Hikam is built with passion and dedication to serve the Muslim community. We extend our heartfelt thanks to all the API providers and contributors who made this journey possible.
      </Text>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 10,
    textAlign: 'justify',
    width: width * 0.9,
  },
  footer: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
