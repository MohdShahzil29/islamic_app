import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Animated, Easing } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer, MagnetometerMeasurement } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';

const MAGNETOMETER_ANGLE_OFFSET = 260;

const sanitizeCoordinate = (coord: number | string): number => {
  if (typeof coord === 'number') {
    return coord;
  }
  const trimmed = coord.trim();
  const parsed = parseFloat(trimmed);
  if (isNaN(parsed)) {
    console.error(`Failed to parse coordinate: ${trimmed}`);
    throw new Error(`Invalid coordinate value: ${trimmed}`);
  }
  return parsed;
};

const QiblaPage: React.FC = () => {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const arrowRotationAnim = useRef(new Animated.Value(0)).current;

  const requestLocationPermission = async (): Promise<void> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access location was denied');
      return;
    }
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      let { latitude, longitude } = location.coords;
      latitude = sanitizeCoordinate(latitude);
      longitude = sanitizeCoordinate(longitude);
      const qibla = calculateQiblaDirection(latitude, longitude);
      setQiblaDirection(qibla);
    } catch (err) {
      setError('Error getting location: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const calculateQiblaDirection = (userLat: number | string, userLon: number | string): number => {
    const lat = sanitizeCoordinate(userLat);
    const lon = sanitizeCoordinate(userLon);
    const meccaLat = 21.4225;
    const meccaLon = 39.8262;
    const toRadians = (deg: number): number => deg * (Math.PI / 180);
    const toDegrees = (rad: number): number => rad * (180 / Math.PI);
    const latUserRad = toRadians(lat);
    const lonUserRad = toRadians(lon);
    const latMeccaRad = toRadians(meccaLat);
    const lonMeccaRad = toRadians(meccaLon);
    const deltaLon = lonMeccaRad - lonUserRad;
    const qiblaRad = Math.atan2(
      Math.sin(deltaLon),
      Math.cos(latUserRad) * Math.tan(latMeccaRad) - Math.sin(latUserRad) * Math.cos(deltaLon)
    );
    let qiblaDeg = (toDegrees(qiblaRad) + 360) % 360;
    return qiblaDeg;
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    const subscription = Magnetometer.addListener((data: MagnetometerMeasurement) => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      angle = (angle + 360) % 360;
      angle = (angle + MAGNETOMETER_ANGLE_OFFSET) % 360;
      setDeviceHeading(angle);
    });
    return () => subscription && subscription.remove();
  }, []);

  const arrowRotation =
    qiblaDirection !== null
      ? ((qiblaDirection - deviceHeading) + 360) % 360
      : 0;

  useEffect(() => {
    Animated.timing(arrowRotationAnim, {
      toValue: arrowRotation,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [arrowRotation]);

  const interpolatedRotation = arrowRotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const angularDiff =
    qiblaDirection !== null
      ? Math.min(
          Math.abs(qiblaDirection - deviceHeading),
          360 - Math.abs(qiblaDirection - deviceHeading)
        )
      : 0;
  const isQiblaFound: boolean = qiblaDirection !== null && angularDiff < 10;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Qibla Direction</Text>
      {error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : qiblaDirection !== null ? (
        <View style={styles.contentContainer}>
          <View style={[styles.compassContainer, isQiblaFound && { borderColor: '#4CAF50' }]}>
            <View style={[styles.dial, { transform: [{ rotate: `-${deviceHeading}deg` }] }]}>
              <Text style={[styles.cardinal, styles.north]}>N</Text>
              <Text style={[styles.cardinal, styles.east]}>E</Text>
              <Text style={[styles.cardinal, styles.south]}>S</Text>
              <Text style={[styles.cardinal, styles.west]}>W</Text>
            </View>
            <Animated.View style={{ transform: [{ rotate: interpolatedRotation }] }}>
              <Ionicons
                name="arrow-up"
                size={80}
                color="#333"
                accessibilityLabel="Qibla direction arrow"
              />
            </Animated.View>
          </View>

          <Text style={styles.directionText}>
            Arrow Rotation: {arrowRotation.toFixed(2)}°{"\n"}
            Device Heading: {deviceHeading.toFixed(2)}°{"\n"}
            Qibla: {qiblaDirection.toFixed(2)}°
          </Text>
          {isQiblaFound && <Text style={styles.foundText}>Qibla Found!</Text>}

          {/* <View style={styles.photoContainer}>
            <Text style={styles.photoTitle}>Qibla Image</Text>
            <Image
              source={{ uri: '../../assets/transparent-icon-qibla-compass-icon-kaaba-icon-6066de725800d0.4997917216173543543605.png' }}
              style={styles.photo}
              resizeMode="contain"
            />
          </View> */}
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

export default QiblaPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#333", 
    marginBottom: 25,
    textShadowColor: '#ccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    alignItems: "center",
  },
  compassContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.05)", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dial: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardinal: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  north: {
    top: 10,
    alignSelf: "center",
  },
  south: {
    bottom: 10,
    alignSelf: "center",
  },
  east: {
    right: 10,
    top: "50%",
    marginTop: -10,
  },
  west: {
    left: 10,
    top: "50%",
    marginTop: -10,
  },
  directionText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  foundText: {
    marginTop: 15,
    fontSize: 20,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  error: {
    color: "#FF5252",
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
  photoContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  photoTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});
