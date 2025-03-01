import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ImageBackground, Animated, Easing } from 'react-native';

const ComingSoon = () => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1515169067865-5387d9e53982?auto=format&fit=crop&w=800&q=80',
        }}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <Animated.View style={[styles.overlay, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.title}>Coming Soon</Text>
          <Text style={styles.subtitle}>
            Our new mosque experience is launching shortly. Stay tuned!
          </Text>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ComingSoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(34, 49, 63, 0.8)', 
    paddingVertical: '12%',
    paddingHorizontal: '10%',
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: '10%',
    borderColor: '#B0BEC5',
    borderWidth: 2,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ECEFF1',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 20,
    color: '#ECEFF1',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
