import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { FatwaList } from '@/src/utils/fatwaData';

export default function Fatwa() {
  return (
    <ScrollView style={styles.container}>
    {/* Header Section */}
    <View style={styles.header}>
      <Text style={styles.mainTitle}>Fatawa Rizvia</Text>
      <Text style={styles.description}>
        Ahmad Raza Khan’s authoritative Islamic rulings guiding believers in resolving religious dilemmas.
      </Text>
    </View>

    {/* Cards Container */}
    <View style={styles.cardsContainer}>
      {FatwaList.map((fatwa) => (
        <Link
          key={fatwa.id}
          href={{ pathname: '/pdfViewer', params: { id: fatwa.id } }}
          asChild
        >
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>{fatwa.title}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5', 
  },
  header: {
    backgroundColor: '#4a90e2',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    color: '#f0f0f0',
    textAlign: 'center',
    fontFamily: 'Amiri-Regular'
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Shadow for Android
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});

export { FatwaList };
