// import LoadScreen from "@/src/components/LoadScreen";
import { Redirect } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
    <Redirect href={'/loadScreen'} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

