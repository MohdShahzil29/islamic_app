import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
// import Home from '@/app/(homelist)/Home';
import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import Banner from '../../src/components/banner'
import HomeLoading from '@/src/components/HomeLoading';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Banner />
        <HomeLoading />
        {/* <Home /> */}
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
