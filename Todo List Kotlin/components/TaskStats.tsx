import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TaskStatsProps {
  weeklyStats: {
    completed: number;
    total: number;
  };
  monthlyStats: {
    completed: number;
    total: number;
  };
}

const TaskStats = ({ weeklyStats, monthlyStats }: TaskStatsProps) => {
  const calculatePercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };
  
  const weeklyPercentage = calculatePercentage(weeklyStats.completed, weeklyStats.total);
  const monthlyPercentage = calculatePercentage(monthlyStats.completed, monthlyStats.total);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estadísticas de Cumplimiento</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Esta Semana</Text>
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={['#3498db', '#2ecc71']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBar,
                { width: `${weeklyPercentage}%` }
              ]}
            />
          </View>
          <View style={styles.statsInfo}>
            <Text style={styles.percentage}>{weeklyPercentage}%</Text>
            <Text style={styles.taskCount}>
              {weeklyStats.completed}/{weeklyStats.total} tareas
            </Text>
          </View>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Este Mes</Text>
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={['#9b59b6', '#e74c3c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBar,
                { width: `${monthlyPercentage}%` }
              ]}
            />
          </View>
          <View style={styles.statsInfo}>
            <Text style={styles.percentage}>{monthlyPercentage}%</Text>
            <Text style={styles.taskCount}>
              {monthlyStats.completed}/{monthlyStats.total} tareas
            </Text>
          </View>
        </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  statsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskCount: {
    fontSize: 12,
    color: '#666',
  },
});

export default TaskStats;