import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getDeadlineStatus } from '../../../deadlineUtils';
import { showConfirm } from '../../utils/alerts';
import styles from '../../styles/styles';

const TaskCard = ({ task, list, onDelete, onComplete, selectedBoard }) => {
  const deadlineStatus = getDeadlineStatus(task.deadline);
  const isCompleted = task.status === 'completed';

  const handleDelete = () => {
    showConfirm('Confirmar', 'Deletar tarefa?', () => {
      onDelete(list.id, task.id, selectedBoard);
    });
  };

  return (
    <View key={task.id} style={[styles.taskCard, { 
      borderLeftColor: isCompleted ? '#999' : deadlineStatus.color, 
      opacity: isCompleted ? 0.6 : 1 
    }]}>
      <View style={styles.taskHeader}>
        <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>
          {task.title}
        </Text>
        <TouchableOpacity onPress={handleDelete}>
          <Text>🗑️</Text>
        </TouchableOpacity>
      </View>
      
      {task.description ? (
        <Text style={styles.taskDescription}>{task.description}</Text>
      ) : null}
      
      {task.deadline ? (
        <View style={[styles.deadlineBadge, { 
          backgroundColor: isCompleted ? '#e0e0e0' : deadlineStatus.color + '30' 
        }]}>
          <Text style={[styles.deadlineText, { 
            color: isCompleted ? '#666' : deadlineStatus.color 
          }]}>
            {task.deadline} - {deadlineStatus.label}
          </Text>
        </View>
      ) : null}
      
      {task.responsible ? (
        <Text style={styles.taskResponsible}>👤 {task.responsible}</Text>
      ) : null}
      
      {!isCompleted ? (
        <TouchableOpacity 
          style={styles.completeButton} 
          onPress={() => onComplete(list.id, task.id, selectedBoard)}
        >
          <Text style={styles.completeButtonText}>✓ Concluir</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓ Concluída</Text>
        </View>
      )}
    </View>
  );
};

export default TaskCard;