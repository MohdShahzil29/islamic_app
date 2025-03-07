import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerTimes, CalculationMethod, Coordinates } from 'adhan';
import { useTheme } from '@/src/context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

interface CoordinatesType {
  latitude: number;
  longitude: number;
}

interface AlarmsType {
  [key: string]: string | null;
}

const Time: React.FC = () => {
  const [coords, setCoords] = useState<CoordinatesType | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Store notification ID per prayer; if null, no alarm is set
  const [alarms, setAlarms] = useState<AlarmsType>({});
  const { theme } = useTheme();

  // Refs for current state
  const alarmsRef = useRef<AlarmsType>(alarms);
  const prayerTimesRef = useRef<PrayerTimes | null>(prayerTimes);

  useEffect(() => {
    alarmsRef.current = alarms;
  }, [alarms]);

  useEffect(() => {
    prayerTimesRef.current = prayerTimes;
  }, [prayerTimes]);

  // Load alarms from storage on mount
  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const savedAlarms = await AsyncStorage.getItem('setAlarms');
        if (savedAlarms) {
          setAlarms(JSON.parse(savedAlarms));
        }
      } catch (error) {
        console.error('Failed to load alarms:', error);
      }
    };
    loadAlarms();
  }, []);

  // Save alarms to storage whenever they change
  useEffect(() => {
    const saveAlarms = async () => {
      try {
        await AsyncStorage.setItem('setAlarms', JSON.stringify(alarms));
      } catch (error) {
        console.error('Failed to save alarms:', error);
      }
    };
    saveAlarms();
  }, [alarms]);

  // Request location permissions and get coordinates
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

  // Calculate prayer times based on coordinates
  useEffect(() => {
    if (coords) {
      const date = new Date();
      const coordinates = new Coordinates(coords.latitude, coords.longitude);
      const params = CalculationMethod.MuslimWorldLeague();
      const pt = new PrayerTimes(coordinates, date, params);
      setPrayerTimes(pt);
    }
  }, [coords]);

  // Configure notifications
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Please enable notifications to use alarm features.'
        );
      }
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    })();
  }, []);

  // Format time to hh:mm format
  const formatTime = (dateObj: Date): string => {
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Schedule a one-time notification using an absolute date trigger
  const scheduleAlarm = async (prayerName: string, prayerTime: Date) => {
    const now = new Date();
    let scheduledTime = new Date(prayerTime);
  
    // Calculate difference in seconds between the prayer time and now
    let diffSeconds = (scheduledTime.getTime() - now.getTime()) / 1000;
  
    // If the prayer time is in the past, schedule for the next occurrence
    if (diffSeconds < 0) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
      diffSeconds = (scheduledTime.getTime() - now.getTime()) / 1000;
    }
  
    // If the prayer time is within 60 seconds, inform the user
    if (diffSeconds < 60) {
      return Alert.alert(
        'Immediate Notification',
        `The time for ${prayerName} is too close. The notification will be immediate.`
      );
    }
  
    const triggerInSeconds = Math.floor(diffSeconds);
  
    console.log('Now:', now.toString());
    console.log('Prayer time:', prayerTime.toString());
    console.log('Scheduled time:', scheduledTime.toString());
    console.log('Seconds until alarm:', triggerInSeconds);
  
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayerName} Alarm`,
          body: `It's time for ${prayerName} prayer.`,
          data: { prayerName },
        },
        trigger: { seconds: triggerInSeconds, repeats: false },
      });
      setAlarms((prev) => ({ ...prev, [prayerName]: notificationId }));
      Alert.alert(
        "Alarm Set",
        `${prayerName} alarm set for ${scheduledTime.toLocaleTimeString()}.`
      );
    } catch (error) {
      console.error("Failed to set alarm:", error);
      Alert.alert("Error", "Failed to set alarm.");
    }
  };
  

  // Cancel the scheduled notification for a prayer
  const cancelAlarm = async (prayerName: string) => {
    const notificationId = alarms[prayerName];
    if (notificationId && typeof notificationId === 'string') {
      try {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        const isScheduled = scheduled.some(item => item.identifier === notificationId);
        if (isScheduled) {
          await Notifications.cancelScheduledNotificationAsync(notificationId);
        }
        setAlarms((prev) => ({ ...prev, [prayerName]: null }));
        Alert.alert("Alarm Stopped", `${prayerName} alarm has been stopped.`);
      } catch (error) {
        console.error("Error cancelling alarm:", error);
        setAlarms((prev) => ({ ...prev, [prayerName]: null }));
        Alert.alert("Alarm Stopped", `${prayerName} alarm has been stopped.`);
      }
    } else {
      setAlarms((prev) => ({ ...prev, [prayerName]: null }));
      Alert.alert("Alarm Stopped", `${prayerName} alarm has been stopped.`);
    }
  };

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
      {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => {
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
            {alarms[prayer] ? (
              <TouchableOpacity
                style={dynamicStyles.button}
                onPress={() => cancelAlarm(prayer)}
              >
                <Icon name="alarm-off" size={20} color="#fff" style={dynamicStyles.icon} />
                <Text style={dynamicStyles.buttonText}>Stop Alarm</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={dynamicStyles.button}
                onPress={() => scheduleAlarm(prayer, timeValue)}
              >
                <Icon name="alarm" size={20} color="#fff" style={dynamicStyles.icon} />
                <Text style={dynamicStyles.buttonText}>Set Alarm</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Time;
