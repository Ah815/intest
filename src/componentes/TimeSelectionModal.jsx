import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Appearance,
  Platform,
  ScrollView,
} from 'react-native';

const TimeSelectionModal = ({ visible, date, onClose, onConfirm }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme() || 'light');
  const [is24Hour, setIs24Hour] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [period, setPeriod] = useState('AM');
  
  useEffect(() => {
    // Get device time format preference
    const getTimeFormatPreference = async () => {
      // This is simplified - in a real app, you'd get this from device settings
      // For Android: DateFormat.is24HourFormat(context)
      // For iOS: NSLocale.currentLocale.objectForKey(NSLocaleTimeFormat)
      
      // For demo, just use a default
      const use24HourFormat = Platform.OS === 'android' ? false : false;
      setIs24Hour(use24HourFormat);
    };
    
    getTimeFormatPreference();
    
    const themeSubscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || 'light');
    });
    
    return () => {
      themeSubscription.remove();
    };
  }, []);
  
  useEffect(() => {
    // Reset time to current time when modal opens
    if (visible) {
      const now = new Date();
      setSelectedHour(is24Hour ? now.getHours() : (now.getHours() % 12 || 12));
      setSelectedMinute(now.getMinutes());
      setPeriod(now.getHours() >= 12 ? 'PM' : 'AM');
    }
  }, [visible, is24Hour]);
  
  const colors = {
    background: theme === 'dark' ? '#242424' : 'white',
    text: theme === 'dark' ? '#e0e0e0' : '#333333',
    subText: theme === 'dark' ? '#a0a0a0' : '#666666',
    border: theme === 'dark' ? '#3d3d3d' : '#eeeeee',
    primaryColor: '#1890ff',
    selectedBackground: theme === 'dark' ? '#163e59' : '#e6f7ff',
    modalOverlay: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
    button: theme === 'dark' ? '#1890ff' : '#1890ff',
    buttonText: 'white',
    cancelButton: theme === 'dark' ? '#555555' : '#f5f5f5',
    cancelButtonText: theme === 'dark' ? '#e0e0e0' : '#333333',
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const generateHours = () => {
    const hours = [];
    const maxHour = is24Hour ? 23 : 12;
    const minHour = is24Hour ? 0 : 1;
    
    for (let i = minHour; i <= maxHour; i++) {
      hours.push(i);
    }
    
    return hours;
  };
  
  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      minutes.push(i);
    }
    return minutes;
  };
  
  const handleConfirm = () => {
    // Calculate the full hour in 24h format
    let hour24 = selectedHour;
    if (!is24Hour) {
      if (period === 'PM' && selectedHour < 12) {
        hour24 = selectedHour + 12;
      } else if (period === 'AM' && selectedHour === 12) {
        hour24 = 0;
      }
    }
    
    // Create new date with selected time
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hour24, selectedMinute, 0, 0);
    
    onConfirm(selectedDateTime);
  };
  
  const renderTimeWheel = (values, selectedValue, onValueChange, format = (val) => val) => (
    <ScrollView 
      style={styles.wheel}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.wheelContent}
    >
      {values.map((value) => (
        <TouchableOpacity
          key={value}
          style={[
            styles.wheelItem,
            selectedValue === value && { backgroundColor: colors.selectedBackground }
          ]}
          onPress={() => onValueChange(value)}
        >
          <Text style={[
            styles.wheelItemText,
            { color: colors.text },
            selectedValue === value && { fontWeight: 'bold', color: colors.primaryColor }
          ]}>
            {format(value)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Set Time for {formatDate(date)}
          </Text>
          
          <View style={styles.timePickerContainer}>
            {/* Hour selector */}
            <View style={styles.wheelContainer}>
              <Text style={[styles.wheelLabel, { color: colors.subText }]}>Hour</Text>
              {renderTimeWheel(
                generateHours(),
                selectedHour,
                setSelectedHour,
                value => value.toString().padStart(2, '0')
              )}
            </View>
            
            {/* Minute selector */}
            <View style={styles.wheelContainer}>
              <Text style={[styles.wheelLabel, { color: colors.subText }]}>Minute</Text>
              {renderTimeWheel(
                generateMinutes(),
                selectedMinute,
                setSelectedMinute,
                value => value.toString().padStart(2, '0')
              )}
            </View>
            
            {/* AM/PM selector (only for 12h format) */}
            {!is24Hour && (
              <View style={styles.wheelContainer}>
                <Text style={[styles.wheelLabel, { color: colors.subText }]}>Period</Text>
                <View style={styles.ampmContainer}>
                  <TouchableOpacity
                    style={[
                      styles.ampmButton,
                      period === 'AM' && { backgroundColor: colors.selectedBackground }
                    ]}
                    onPress={() => setPeriod('AM')}
                  >
                    <Text style={[
                      styles.ampmText,
                      { color: colors.text },
                      period === 'AM' && { fontWeight: 'bold', color: colors.primaryColor }
                    ]}>
                      AM
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.ampmButton,
                      period === 'PM' && { backgroundColor: colors.selectedBackground }
                    ]}
                    onPress={() => setPeriod('PM')}
                  >
                    <Text style={[
                      styles.ampmText,
                      { color: colors.text },
                      period === 'PM' && { fontWeight: 'bold', color: colors.primaryColor }
                    ]}>
                      PM
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.cancelButton }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.cancelButtonText }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.button }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>Set Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  wheelContainer: {
    alignItems: 'center',
    width: '30%',
  },
  wheelLabel: {
    fontSize: 14,
    marginBottom: 10,
  },
  wheel: {
    height: 150,
    width: '100%',
  },
  wheelContent: {
    paddingVertical: 60, // This creates space above and below for better UX
  },
  wheelItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  wheelItemText: {
    fontSize: 18,
  },
  ampmContainer: {
    width: '100%',
  },
  ampmButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 5,
  },
  ampmText: {
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  cancelButton: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TimeSelectionModal;