import React, { useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { PrayerTimes, CalculationMethod, Coordinates } from 'adhan';
import { useTheme } from '@/src/context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

interface CoordinatesType {
  latitude: number;
  longitude: number;
}

const Time: React.FC = () => {
  const [coords, setCoords] = useState<CoordinatesType | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { theme } = useTheme();

  // Request location permission and fetch current position
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // Calculate prayer times based on current location and date
  useEffect(() => {
    if (coords) {
      const date = new Date();
      const coordinates = new Coordinates(coords.latitude, coords.longitude);
      const params = CalculationMethod.MuslimWorldLeague();
      const pt = new PrayerTimes(coordinates, date, params);
      setPrayerTimes(pt);
    }
  }, [coords]);

  // Request notification permissions
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Please enable notifications to use alarm features.'
        );
      }
    })();
  }, []);

  // Helper function to format the time display
  const formatTime = (dateObj: Date): string => {
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Schedule alarm using native notifications so it works even if the app is closed.
  const scheduleAlarm = async (prayerName: string, prayerTime: Date) => {
    const now = new Date();
    if (prayerTime <= now) {
      Alert.alert("Time Passed", `The time for ${prayerName} has already passed.`);
      return;
    }

    // Calculate delay in seconds from now until prayer time.
    const triggerInSeconds = Math.floor((prayerTime.getTime() - now.getTime()) / 1000);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayerName} Alarm`,
          body: `It's time for ${prayerName} prayer.`,
          // Custom sound: For iOS, include the sound file in your app bundle.
          // For Android, ensure the file is placed in res/raw and named in lowercase.
          sound: 'azan2.mp3',
        },
        trigger: { seconds: triggerInSeconds, repeats: false },
      });
      Alert.alert("Alarm Set", `${prayerName} alarm has been set.`);
    } catch (error) {
      Alert.alert("Error", "Failed to set alarm.");
    }
  };

  // Dynamic styles based on the current theme.
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.background,
      paddingHorizontal: '5%',
      alignItems: 'center',
      marginTop: 20 * scale,
      marginBottom: 20 * scale,
    },
    center: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: '5%',
    },
    title: {
      fontSize: 28 * scale,
      marginVertical: 20 * scale,
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
    },
    prayerContainer: {
      width: '100%',
      backgroundColor: theme.card,
      borderRadius: 10 * scale,
      padding: 15 * scale,
      marginBottom: 15 * scale,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 * scale },
      shadowOpacity: 0.1,
      shadowRadius: 5 * scale,
      elevation: 3,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    prayerName: {
      fontSize: 20 * scale,
      fontWeight: '600',
      color: theme.text,
    },
    prayerTime: {
      fontSize: 18 * scale,
      color: theme.text,
    },
    button: {
      backgroundColor: '#008CBA',
      paddingVertical: 10 * scale,
      borderRadius: 5 * scale,
      marginTop: 10 * scale,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16 * scale,
      fontWeight: '500',
      marginLeft: 5 * scale,
    },
    loadingText: {
      marginTop: 10 * scale,
      fontSize: 16 * scale,
      color: '#008CBA',
    },
    errorText: {
      fontSize: 18 * scale,
      color: 'red',
    },
    icon: {
      marginRight: 10 * scale,
    },
  }), [theme]);

  if (errorMsg) {
    return (
      <View style={dynamicStyles.center}>
        <Text style={dynamicStyles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!coords || !prayerTimes) {
    return (
      <View style={dynamicStyles.center}>
        <ActivityIndicator size="large" color="#008CBA" />
        <Text style={dynamicStyles.loadingText}>Loading prayer times...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Namaz Times</Text>
      {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => {
        let timeValue: Date;
        switch (prayer) {
          case 'Fajr': timeValue = prayerTimes.fajr; break;
          case 'Dhuhr': timeValue = prayerTimes.dhuhr; break;
          case 'Asr': timeValue = prayerTimes.asr; break;
          case 'Maghrib': timeValue = prayerTimes.maghrib; break;
          case 'Isha': timeValue = prayerTimes.isha; break;
          default: timeValue = new Date();
        }
        return (
          <View key={prayer} style={dynamicStyles.prayerContainer}>
            <View style={dynamicStyles.row}>
              <Icon name="mosque" size={24} style={dynamicStyles.icon} />
              <Text style={dynamicStyles.prayerName}>{prayer}:</Text>
              <Text style={dynamicStyles.prayerTime}>{formatTime(timeValue)}</Text>
            </View>
            <TouchableOpacity
              style={dynamicStyles.button}
              onPress={() => scheduleAlarm(prayer, timeValue)}
            >
              <Icon name="alarm" size={20} color="#fff" style={dynamicStyles.icon} />
              <Text style={dynamicStyles.buttonText}>Set Alarm</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Time;
