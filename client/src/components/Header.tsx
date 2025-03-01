import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const router = useRouter()

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Bar */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={openMenu}>
          <Feather name="menu" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.headerText, { color: theme.text }]}>Hikam</Text>

        <TouchableOpacity onPress={toggleTheme}>
          <MaterialCommunityIcons 
            name={isDarkMode ? "weather-sunny" : "weather-night"} 
            size={30} 
            color={theme.text} 
          />
        </TouchableOpacity>
      </View>

      {/* Overlay (closes menu when clicked) */}
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={closeMenu} />
      )}

      {/* Side Menu */}
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }], backgroundColor: theme.card }]}>
      <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
        <Feather name="x" size={24} color={theme.text} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tab)/HomePage")}>
        <Text style={[styles.menuItem, { color: theme.text }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(mosque)/Mosque")}>
        <Text style={[styles.menuItem, { color: theme.text }]}>Mosque</Text>
      </TouchableOpacity>

      <Text style={[styles.menuItem, { color: theme.text }]}>Settings</Text>
      <Text style={[styles.menuItem, { color: theme.text }]}>About</Text>
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.75,
    height: Dimensions.get('window').height,
    padding: 15,
    zIndex: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  menuItem: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: Dimensions.get('window').height,
  },
});


