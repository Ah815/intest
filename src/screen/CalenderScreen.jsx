import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Appearance,
  Dimensions,
  Alert,
} from 'react-native';
import TimeSelectionModal from '../componentes/TimeSelectionModal';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [theme, setTheme] = useState(Appearance.getColorScheme() || 'light');
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [orientation, setOrientation] = useState(
    dimensions.width > dimensions.height ? 'landscape' : 'portrait'
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [reminders, setReminders] = useState([]);
  
  useEffect(() => {
    const themeSubscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || 'light');
    });
    const dimensionsSubscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });
    
    return () => {
      themeSubscription.remove();
      if (typeof dimensionsSubscription?.remove === 'function') {
        dimensionsSubscription.remove();
      }
    };
  }, []);
  
 
  const calculateDaySize = () => {
    const screenWidth = dimensions.width;
    const horizontalPadding = 30; 
    const availableWidth = screenWidth - horizontalPadding;
    const minCellSize = 36; 
    const idealCellSize = Math.max(Math.floor(availableWidth / 7) - 4, minCellSize); 
    
    return {
      width: idealCellSize,
      height: idealCellSize,
      fontSize: idealCellSize * 0.4, 
    };
  };
  
  const daySize = calculateDaySize();
  

  const colors = {
    background: theme === 'dark' ? '#121212' : '#f5f5f5',
    card: theme === 'dark' ? '#242424' : 'white',
    text: theme === 'dark' ? '#e0e0e0' : '#333333',
    subText: theme === 'dark' ? '#a0a0a0' : '#666666',
    border: theme === 'dark' ? '#3d3d3d' : '#eeeeee',
    primaryColor: '#1890ff',
    todayBackground: theme === 'dark' ? '#163e59' : '#e6f7ff',
    navButton: theme === 'dark' ? '#3d3d3d' : '#f0f0f0',
    outsideMonthText: theme === 'dark' ? '#555555' : '#999999',
    reminderDot: '#f5222d',
  };

  const today = new Date();
  

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);
    
    const startDayOfWeek = firstDay.getDay();
    
    const daysInMonth = lastDay.getDate();
    
    const calendarDays = [];
    

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push({
        day: prevMonthLastDay - startDayOfWeek + i + 1,
        month: month - 1,
        year,
        currentMonth: false
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const dateString = currentDate.toDateString();
      
      calendarDays.push({
        day: i,
        month,
        year,
        currentMonth: true,
        isToday: 
          today.getDate() === i && 
          today.getMonth() === month && 
          today.getFullYear() === year,
        isSelected: 
          selectedDate && 
          selectedDate.getDate() === i && 
          selectedDate.getMonth() === month && 
          selectedDate.getFullYear() === year,
        hasReminder: reminders.some(r => new Date(r.dateTime).toDateString() === dateString)
      });
    }
    
    const remainingDays = 42 - calendarDays.length; 
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        day: i,
        month: month + 1,
        year,
        currentMonth: false
      });
    }
    
    return calendarDays;
  };
  
  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  

  const selectDate = (item) => {
    const newSelectedDate = new Date(item.year, item.month, item.day);
    setSelectedDate(newSelectedDate);
    
    if (item.month !== currentMonth.getMonth()) {
      setCurrentMonth(new Date(item.year, item.month, 1));
    }
    
    // Show time selection modal
    setModalVisible(true);
  };
  
  const handleModalClose = () => {
    setModalVisible(false);
  };
  
  const handleSetReminder = (dateTime) => {
    // Add the new reminder to state
    const newReminder = {
      id: Date.now().toString(), // Simple unique ID
      dateTime,
      title: 'Reminder',
    };
    
    setReminders([...reminders, newReminder]);
    setModalVisible(false);
    
    // Show confirmation
    Alert.alert(
      'Reminder Set',
      `Reminder set for ${dateTime.toLocaleString()}`,
      [{ text: 'OK' }]
    );
  };
  
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  const getWeekdayName = (dayIndex) => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekdays[dayIndex];
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
  
  const calendarDays = generateCalendarDays();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.calendarContainer, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPreviousMonth} style={[styles.navButton, { backgroundColor: colors.navButton }]}>
            <Text style={[styles.navButtonText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            {getMonthName(currentMonth)} {currentMonth.getFullYear()}
          </Text>
          
          <TouchableOpacity onPress={goToNextMonth} style={[styles.navButton, { backgroundColor: colors.navButton }]}>
            <Text style={[styles.navButtonText, { color: colors.text }]}>→</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.weekdayHeader, { borderBottomColor: colors.border }]}>
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <Text key={day} style={[styles.weekdayText, { color: colors.subText }]}>
              {getWeekdayName(day)}
            </Text>
          ))}
        </View>
        
        <View style={styles.calendarGrid}>
          {calendarDays.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                item.isToday && [styles.todayCell, { backgroundColor: colors.todayBackground, borderColor: colors.primaryColor }],
                item.isSelected && [styles.selectedCell, { backgroundColor: colors.primaryColor }],
                !item.currentMonth && styles.outsideMonthCell
              ]}
              onPress={() => selectDate(item)}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: colors.text },
                  item.isToday && styles.todayText,
                  item.isSelected && styles.selectedText,
                  !item.currentMonth && { color: colors.outsideMonthText }
                ]}
              >
                {item.day}
              </Text>
              
              {/* Reminder indicator */}
              {item.hasReminder && (
                <View style={[styles.reminderDot, { backgroundColor: colors.reminderDot }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={[styles.selectedDateContainer, { borderTopColor: colors.border }]}>
          <Text style={[styles.selectedDateText, { color: colors.text }]}>
            {selectedDate ? formatDate(selectedDate) : 'No date selected'}
          </Text>
        </View>
      </View>
      
      {/* Time Selection Modal */}
      <TimeSelectionModal
        visible={modalVisible}
        date={selectedDate}
        onClose={handleModalClose}
        onConfirm={handleSetReminder}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 20,
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
  },
  todayCell: {
    borderWidth: 1,
  },
  todayText: {
    color: '#1890ff',
    fontWeight: 'bold',
  },
  selectedCell: {
    backgroundColor: '#1890ff',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  outsideMonthCell: {
    opacity: 0.3,
  },
  selectedDateContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  reminderDot: {
    position: 'absolute',
    bottom: 3,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default CalendarScreen;