import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import { getDeadlineStatus } from '../../../deadlineUtils';

const DashboardScreen = ({ boards }) => {
  const calculateDashboardData = () => {
    const allTasks = boards.flatMap(b => b.lists.flatMap(l => l.tasks));
    const overdue = allTasks.filter(t => getDeadlineStatus(t.deadline).status === 'overdue').length;
    const today = allTasks.filter(t => getDeadlineStatus(t.deadline).status === 'today').length;
    const soon = allTasks.filter(t => { 
      const s = getDeadlineStatus(t.deadline).status; 
      return s === 'tomorrow' || s === 'soon'; 
    }).length;
    const completed = allTasks.filter(t => t.status === 'completed').length;
    return { overdue, today, soon, completed, total: allTasks.length };
  };

  const data = calculateDashboardData();

  return (
    <ScrollView style={styles.content}>
      <Text style={styles.screenTitle}>📊 Dashboard</Text>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#fff' }]}>
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statNumber}>{data.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#ffebee' }]}>
          <Text style={styles.statIcon}>⚠️</Text>
          <Text style={[styles.statNumber, { color: '#e74c3c' }]}>{data.overdue}</Text>
          <Text style={styles.statLabel}>Atrasadas</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#fff3e0' }]}>
          <Text style={styles.statIcon}>⏰</Text>
          <Text style={[styles.statNumber, { color: '#f39c12' }]}>{data.today}</Text>
          <Text style={styles.statLabel}>Hoje</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#fff9c4' }]}>
          <Text style={styles.statIcon}>📅</Text>
          <Text style={[styles.statNumber, { color: '#f39c12' }]}>{data.soon}</Text>
          <Text style={styles.statLabel}>Próximos</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
          <Text style={styles.statIcon}>✓</Text>
          <Text style={[styles.statNumber, { color: '#27ae60' }]}>{data.completed}</Text>
          <Text style={styles.statLabel}>Concluídas</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;