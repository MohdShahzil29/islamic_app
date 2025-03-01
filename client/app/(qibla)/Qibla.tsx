import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Animated, Easing, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer, MagnetometerMeasurement } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';

const { width } = Dimensions.get("window");
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
  const { theme } = useTheme();

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

  // Dynamic styles with dark mode and responsiveness
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: width * 0.05,
      justifyContent: "center",
      alignItems: "center",
    },
    heading: {
      fontSize: width * 0.075,
      fontWeight: "800",
      color: theme.text,
      marginBottom: width * 0.06,
      textShadowColor: '#ccc',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    contentContainer: {
      alignItems: "center",
    },
    compassContainer: {
      width: width * 0.65,
      height: width * 0.65,
      borderRadius: (width * 0.65) / 2,
      borderWidth: 3,
      borderColor: theme.text,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: width * 0.05,
      backgroundColor: "rgba(0,0,0,0.05)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: width * 0.03 },
      shadowOpacity: 0.1,
      shadowRadius: width * 0.03,
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
      fontSize: width * 0.05,
      fontWeight: "bold",
      color: theme.text,
    },
    north: {
      top: width * 0.04,
      alignSelf: "center",
    },
    south: {
      bottom: width * 0.04,
      alignSelf: "center",
    },
    east: {
      right: width * 0.04,
      top: "50%",
      marginTop: -width * 0.025,
    },
    west: {
      left: width * 0.04,
      top: "50%",
      marginTop: -width * 0.025,
    },
    directionText: {
      marginTop: width * 0.04,
      fontSize: width * 0.045,
      color: theme.text,
      textAlign: "center",
      lineHeight: width * 0.06,
    },
    foundText: {
      marginTop: width * 0.04,
      fontSize: width * 0.055,
      color: "#4CAF50",
      fontWeight: "bold",
    },
    error: {
      color: "#FF5252",
      fontSize: width * 0.045,
    },
    loadingText: {
      fontSize: width * 0.05,
      color: theme.text,
    },
  }), [theme]);

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.heading}>Qibla Direction</Text>
      {error ? (
        <Text style={dynamicStyles.error}>Error: {error}</Text>
      ) : qiblaDirection !== null ? (
        <View style={dynamicStyles.contentContainer}>
          <View style={[dynamicStyles.compassContainer, isQiblaFound && { borderColor: '#4CAF50' }]}>
            <View style={[dynamicStyles.dial, { transform: [{ rotate: `-${deviceHeading}deg` }] }]}>
              <Text style={[dynamicStyles.cardinal, dynamicStyles.north]}>N</Text>
              <Text style={[dynamicStyles.cardinal, dynamicStyles.east]}>E</Text>
              <Text style={[dynamicStyles.cardinal, dynamicStyles.south]}>S</Text>
              <Text style={[dynamicStyles.cardinal, dynamicStyles.west]}>W</Text>
            </View>
            <Animated.View style={{ transform: [{ rotate: interpolatedRotation }] }}>
              <Ionicons
                name="arrow-up"
                size={80}
                color={theme.text}
                accessibilityLabel="Qibla direction arrow"
              />
            </Animated.View>
          </View>

          <Text style={dynamicStyles.directionText}>
            Arrow Rotation: {arrowRotation.toFixed(2)}°{"\n"}
            Device Heading: {deviceHeading.toFixed(2)}°{"\n"}
            Qibla: {qiblaDirection.toFixed(2)}°
          </Text>
          {isQiblaFound && <Text style={dynamicStyles.foundText}>Qibla Found!</Text>}
        </View>
      ) : (
        <Text style={dynamicStyles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

export default QiblaPage;
