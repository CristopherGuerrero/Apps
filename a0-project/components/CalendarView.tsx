import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DayData } from '../types/types';

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  calendarData: { [date: string]: DayData };
}

const CalendarView = ({ selectedDate, onSelectDate, calendarData }: CalendarViewProps) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  const today = new Date();
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();
  
  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Generate days array with empty spots for proper alignment
  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }
  
  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onSelectDate(newDate);
  };
  
  const goToPrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onSelectDate(newDate);
  };
  
  const handleDateSelect = (day: number) => {
    const newDate = new Date(year, month, day);
    onSelectDate(newDate);
  };
  
  const isDateSelected = (day: number) => {
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === month &&
           selectedDate.getFullYear() === year;
  };
  
  const isToday = (day: number) => {
    return today.getDate() === day &&
           today.getMonth() === month &&
           today.getFullYear() === year;
  };
  
  const getDayStatus = (day: number) => {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = calendarData[dateStr];
    
    if (!dayData || !dayData.tasks.length) return 'empty';
    if (dayData.completed === dayData.tasks.length) return 'completed';
    if (dayData.completed > 0) return 'partial';
    return 'pending';
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.navButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {months[month]} {year}
        </Text>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <Text key={index} style={styles.weekDay}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.daysContainer}>
        {days.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.emptyDay} />;
          }
          
          const dayStatus = getDayStatus(day);
          let statusStyle = styles.dayDefault;
          let statusIconName = '';
          
          if (dayStatus === 'completed') {
            statusStyle = styles.dayCompleted;
            statusIconName = 'check-circle';
          } else if (dayStatus === 'partial') {
            statusStyle = styles.dayPartial;
            statusIconName = 'circle-slice-6';
          } else if (dayStatus === 'pending') {
            statusStyle = styles.dayPending;
            statusIconName = 'circle-outline';
          }
          
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.day,
                isDateSelected(day) && styles.selectedDay,
                isToday(day) && styles.today,
              ]}
              onPress={() => handleDateSelect(day)}
            >
              <Text 
                style={[
                  styles.dayText,
                  isDateSelected(day) && styles.selectedDayText,
                  isToday(day) && styles.todayText,
                ]}
              >
                {day}
              </Text>
              
              {statusIconName && (
                <MaterialCommunityIcons 
                  name={statusIconName} 
                  size={10} 
                  color={statusStyle.color} 
                  style={styles.statusIcon}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 5,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDay: {
    backgroundColor: '#3498db',
    borderRadius: 20,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  today: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 20,
  },
  todayText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  statusIcon: {
    position: 'absolute',
    bottom: 4,
  },
  dayDefault: {
    color: 'transparent',
  },
  dayCompleted: {
    color: '#27ae60',
  },
  dayPartial: {
    color: '#f39c12',
  },
  dayPending: {
    color: '#e74c3c',
  },
});

export default CalendarView;