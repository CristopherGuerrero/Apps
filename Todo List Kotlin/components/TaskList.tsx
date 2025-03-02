import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Animated, 
  Easing,
  Keyboard 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../types/types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string) => void;
  onDeleteTask: (id: string) => void;
  selectedDate: Date;
  isAllCompleted: boolean;
}

const TaskList = ({ 
  tasks, 
  onToggleTask, 
  onAddTask, 
  onDeleteTask, 
  selectedDate,
  isAllCompleted 
}: TaskListProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const completionAnim = new Animated.Value(isAllCompleted ? 1 : 0);
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    };
    const formattedDate = date.toLocaleDateString('es-ES', options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };
  
  React.useEffect(() => {
    Animated.timing(completionAnim, {
      toValue: isAllCompleted ? 1 : 0,
      duration: 500,
      easing: Easing.elastic(1),
      useNativeDriver: true
    }).start();
  }, [isAllCompleted]);
  
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle);
      setNewTaskTitle('');
      Keyboard.dismiss();
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          {isToday(selectedDate) ? 'Tareas para hoy' : `Tareas para ${formatDate(selectedDate)}`}
        </Text>
        <Text style={styles.subtitle}>
          {tasks.filter(task => task.completed).length}/{tasks.length} completadas
        </Text>
      </View>
      
      {isAllCompleted && tasks.length > 0 && (
        <Animated.View 
          style={[
            styles.completionContainer,
            {
              transform: [
                { scale: completionAnim },
                { rotate: completionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-20deg', '0deg']
                })}
              ],
              opacity: completionAnim
            }
          ]}
        >
          <MaterialCommunityIcons name="check-circle" size={48} color="#27ae60" />
          <Text style={styles.completionText}>¡Todas las tareas completadas!</Text>
        </Animated.View>
      )}
      
      <View style={styles.taskList}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={48} color="#bbb" />
            <Text style={styles.emptyText}>No hay tareas para este día</Text>
            <Text style={styles.emptySubtext}>Agrega tareas usando el campo de abajo</Text>
          </View>
        ) : (
          tasks.map(task => (
            <View key={task.id} style={styles.taskItem}>
              <TouchableOpacity 
                style={styles.checkbox} 
                onPress={() => onToggleTask(task.id)}
              >
                <MaterialCommunityIcons 
                  name={task.completed ? "checkbox-marked" : "checkbox-blank-outline"} 
                  size={24} 
                  color={task.completed ? "#3498db" : "#666"} 
                />
              </TouchableOpacity>
              
              <Text style={[
                styles.taskText,
                task.completed && styles.completedTaskText
              ]}>
                {task.title}
              </Text>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => onDeleteTask(task.id)}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={22} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Agregar nueva tarea..."
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity 
          style={[
            styles.addButton,
            !newTaskTitle.trim() && styles.addButtonDisabled
          ]} 
          onPress={handleAddTask}
          disabled={!newTaskTitle.trim()}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  completionContainer: {
    backgroundColor: '#e6f7ef',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexDirection: 'row',
  },
  completionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 12,
  },
  taskList: {
    marginBottom: 16,
    minHeight: 50,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    marginRight: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 5,
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#b3d1e6',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default TaskList;