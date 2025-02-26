import React from 'react';
import { View, StyleSheet } from 'react-native';
import Home from '@/src/components/Home';
import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Home />
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
