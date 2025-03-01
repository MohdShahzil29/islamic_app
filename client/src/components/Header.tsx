import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

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
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openMenu}>
          <Feather name="menu" size={24} color="#4CAF50" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Quran App</Text>

        <Feather name="search" size={24} color="#4CAF50" />
      </View>

      {/* Overlay (closes menu when clicked) */}
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={closeMenu} />
      )}

      {/* Side Menu */}
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.menuItem}>Home</Text>
        <Text style={styles.menuItem}>Bookmarks</Text>
        <Text style={styles.menuItem}>Settings</Text>
        <Text style={styles.menuItem}>About</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    //   flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      backgroundColor: '#F9F6EE',
      borderBottomWidth: 1,
      borderBottomColor: '#DDD',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#4CAF50',
      fontFamily: 'Georgia',
    },
    menu: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: width * 0.75,
      height: Dimensions.get('window').height,
      backgroundColor: '#4CAF50',
      padding: 15,
      zIndex: 10,
    },
    closeButton: {
      alignSelf: 'flex-end',
      marginBottom: 20,
    },
    menuItem: {
      fontSize: 18,
      color: 'white',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'white',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: Dimensions.get('window').height,
      backgroundColor: 'rgba(0,0,0,0.5)', 
    },
  });
  

