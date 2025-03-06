// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import axios from 'axios';

// const API_VERSION = '1';
// const BASE_URL = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@${API_VERSION}`;

// interface Edition {
//   id: string;
//   name: string;
// }

// const fetchDataWithFallback = async (minUrl: string, fallbackUrl: string): Promise<{ [key: string]: any }> => {
//   try {
//     const response = await axios.get(minUrl);
//     console.log("Data from minified URL:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching minified URL:", error);
//     const response = await axios.get(fallbackUrl);
//     console.log("Data from fallback URL:", response.data);
//     return response.data;
//   }
// };

// const Hadith: React.FC = () => {
//   const router = useRouter();
//   const [editions, setEditions] = useState<Edition[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const loadEditions = async () => {
//       const minUrl = `${BASE_URL}/editions.min.json`;
//       const fallbackUrl = `${BASE_URL}/editions.json`;
//       try {
//         const data = await fetchDataWithFallback(minUrl, fallbackUrl);
//         // Convert the object into an array of editions (using the API key and the display name)
//         const editionList: Edition[] = Object.entries(data).map(
//           ([key, edition]) => ({ id: key, name: edition.name })
//         );
//         setEditions(editionList);
//       } catch (error) {
//         console.error("Error fetching editions:", error);
//         Alert.alert("Error", "Failed to fetch editions.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadEditions();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // Prompt the user to select a language when a book is pressed.
//   const onBookPress = (item: Edition) => {
//     Alert.alert(
//       "Select Language",
//       "Which language would you prefer?",
//       [
//         {
//           text: "English",
//           onPress: () =>
//             router.push({
//               pathname: "/(tab)/HadithsDetials",
//               params: { editionId: item.id, lang: "eng" },
//             }),
//         },
//         {
//           text: "Arabic",
//           onPress: () =>
//             router.push({
//               pathname: "/(tab)/HadithsDetials",
//               params: { editionId: item.id, lang: "ara" },
//             }),
//         },
//         {
//           text: "Urdu",
//           onPress: () =>
//             router.push({
//               pathname: "/(tab)/HadithsDetials",
//               params: { editionId: item.id, lang: "urd" },
//             }),
//         },
//         { text: "Cancel", style: "cancel" },
//       ]
//     );
//   };

//   const renderItem = ({ item }: { item: Edition }) => (
//     <TouchableOpacity style={styles.itemContainer} onPress={() => onBookPress(item)}>
//       <Text style={styles.itemText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Hadith Books</Text>
//       <FlatList data={editions} keyExtractor={(item) => item.id} renderItem={renderItem} />
//     </View>
//   );
// };

// export default Hadith;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   itemContainer: {
//     padding: 12,
//     backgroundColor: "#eee",
//     marginBottom: 8,
//     borderRadius: 4,
//   },
//   itemText: { fontSize: 16 },
// });
