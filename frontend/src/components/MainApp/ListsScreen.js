import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import TaskCard from '../Common/TaskCard';
import styles from '../../styles/styles';

const ListsScreen = ({ 
  selectedBoard, 
  loading, 
  onOpenModal, 
  onDeleteTask, 
  onCompleteTask 
}) => {
  if (loading) {
    return <ActivityIndicator size="large" color="#4a90e2" />;
  }

  return (
    <View style={styles.content}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>📋 {selectedBoard?.title || 'Tarefas'}</Text>
        <TouchableOpacity style={styles.addListButton} onPress={() => onOpenModal('list')}>
          <Text style={styles.addListButtonText}>+ Lista</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selectedBoard?.lists.map(list => (
          <View key={list.id} style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>{list.title}</Text>
              <TouchableOpacity 
                style={styles.listAddButton} 
                onPress={() => onOpenModal('task', list)}
              >
                <Text style={styles.listAddButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.taskList}>
              {list.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  list={list}
                  onDelete={onDeleteTask}
                  onComplete={onCompleteTask}
                  selectedBoard={selectedBoard}
                />
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ListsScreen;