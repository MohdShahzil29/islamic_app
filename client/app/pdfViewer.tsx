import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { FatwaList } from '../src/utils/fatwaData';

export default function PdfViewer() {
  const { id } = useLocalSearchParams();

  // Find the fatwa document based on the ID
  const selectedFatwa = FatwaList.find(
    (fatwa) => fatwa.id === parseInt(id as string)
  );

  if (!selectedFatwa) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>PDF not found</Text>
      </View>
    );
  }

  // Log the URL to ensure it's a string
  console.log("Selected Fatwa URL:", selectedFatwa?.url);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: selectedFatwa.url }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
