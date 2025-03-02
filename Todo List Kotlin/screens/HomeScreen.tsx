import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarView from '../components/CalendarView';
import TaskList from '../components/TaskList';
import TaskStats from '../components/TaskStats';
import { Task, DayData } from '../types/types';
import { generateInitialData } from '../utils/dataUtils';

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<{ [date: string]: DayData }>(generateInitialData());
  
  const dateString = selectedDate.toISOString().split('T')[0];
  const currentDayData = calendarData[dateString] || { tasks: [], completed: 0 };
  
  const handleToggleTask = (taskId: string) => {
    setCalendarData(prevData => {
      const updatedDayData = { ...prevData[dateString] };
      const taskIndex = updatedDayData.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        const updatedTasks = [...updatedDayData.tasks];
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          completed: !updatedTasks[taskIndex].completed
        };
        
        const completedCount = updatedTasks.filter(task => task.completed).length;
        
        return {
          ...prevData,
          [dateString]: {
            ...updatedDayData,
            tasks: updatedTasks,
            completed: completedCount
          }
        };
      }
      
      return prevData;
    });
  };

  const addTask = (taskTitle: string) => {
    if (!taskTitle.trim()) return;
    
    setCalendarData(prevData => {
      const dayData = prevData[dateString] || { tasks: [], completed: 0 };
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        completed: false
      };
      
      return {
        ...prevData,
        [dateString]: {
          ...dayData,
          tasks: [...dayData.tasks, newTask]
        }
      };
    });
  };

  const deleteTask = (taskId: string) => {
    setCalendarData(prevData => {
      const updatedDayData = { ...prevData[dateString] };
      const updatedTasks = updatedDayData.tasks.filter(task => task.id !== taskId);
      const completedCount = updatedTasks.filter(task => task.completed).length;
      
      return {
        ...prevData,
        [dateString]: {
          ...updatedDayData,
          tasks: updatedTasks,
          completed: completedCount
        }
      };
    });
  };
  
  // Calculate stats
  const getWeeklyStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    let completed = 0;
    let total = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (calendarData[dateStr]) {
        completed += calendarData[dateStr].completed;
        total += calendarData[dateStr].tasks.length;
      }
    }
    
    return { completed, total };
  };
  
  const getMonthlyStats = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    let completed = 0;
    let total = 0;
    
    Object.entries(calendarData).forEach(([dateStr, data]) => {
      const date = new Date(dateStr);
      if (date.getFullYear() === year && date.getMonth() === month) {
        completed += data.completed;
        total += data.tasks.length;
      }
    });
    
    return { completed, total };
  };
  
  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CalendarView 
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          calendarData={calendarData}
        />
        
        <TaskStats 
          weeklyStats={weeklyStats}
          monthlyStats={monthlyStats}
        />
        
        <TaskList 
          tasks={currentDayData.tasks}
          onToggleTask={handleToggleTask}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          selectedDate={selectedDate}
          isAllCompleted={currentDayData.tasks.length > 0 && currentDayData.completed === currentDayData.tasks.length}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  }
});