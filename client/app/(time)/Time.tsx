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
import { Audio } from 'expo-av'; 
import azanAudio from '../../assets/azan2.mp3';

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
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { theme } = useTheme();

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

  useEffect(() => {
    if (coords) {
      const date = new Date();
      const coordinates = new Coordinates(coords.latitude, coords.longitude);
      const params = CalculationMethod.MuslimWorldLeague();
      const pt = new PrayerTimes(coordinates, date, params);
      setPrayerTimes(pt);
    }
  }, [coords]);

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

  const formatTime = (dateObj: Date): string => {
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to play Azan
  const playAzan = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(azanAudio);
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false); // Hide Stop button when Azan ends
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to play Azan.');
    }
  };

  // Function to stop Azan
  const stopAzan = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const scheduleAlarm = async (prayerName: string, prayerTime: Date) => {
    const now = new Date();
    if (prayerTime <= now) {
      Alert.alert("Time Passed", `The time for ${prayerName} has already passed.`);
      return;
    }

    const triggerInSeconds = Math.floor((prayerTime.getTime() - now.getTime()) / 1000);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayerName} Alarm`,
          body: `It's time for ${prayerName} prayer.`,
          sound: 'default',
        },
        trigger: { seconds: triggerInSeconds, repeats: false },
      });

      // Play Azan when time arrives
      setTimeout(() => {
        playAzan();
      }, triggerInSeconds * 1000);

      Alert.alert("Alarm Set", `${prayerName} alarm has been set.`);
    } catch (error) {
      Alert.alert("Error", "Failed to set alarm.");
    }
  };

  // Create dynamic styles based on the current theme
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
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16 * scale,
      fontWeight: '500',
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
    clockContainer: {
      backgroundColor: '#008CBA',
      borderRadius: 10 * scale,
      paddingVertical: 20 * scale,
      paddingHorizontal: 30 * scale,
      marginVertical: 20 * scale,
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
    },
    clockText: {
      color: '#fff',
      fontSize: 36 * scale,
      fontWeight: 'bold',
    },
    stopButton: {
      backgroundColor: 'red',
      paddingVertical: 10 * scale,
      borderRadius: 5 * scale,
      marginTop: 20 * scale,
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
              <Text style={dynamicStyles.prayerName}>{prayer}:</Text>
              <Text style={dynamicStyles.prayerTime}>{formatTime(timeValue)}</Text>
            </View>
            <TouchableOpacity 
              style={dynamicStyles.button} 
              onPress={() => scheduleAlarm(prayer, timeValue)}
            >
              <Text style={dynamicStyles.buttonText}>Set Alarm</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {isPlaying && (
        <TouchableOpacity style={dynamicStyles.stopButton} onPress={stopAzan}>
          <Text style={dynamicStyles.buttonText}>Stop Azan</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default Time;
