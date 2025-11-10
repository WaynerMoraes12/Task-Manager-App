import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import styles from '../../styles/styles';

const TaskModal = ({
  visible,
  onClose,
  modalType,
  formTitle,
  setFormTitle,
  formDescription,
  setFormDescription,
  formDeadline,
  setFormDeadline,
  formResponsible,
  setFormResponsible,
  loading,
  onSubmit,
  currentUser
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {modalType === 'list' ? '➕ Nova Lista' : '➕ Nova Tarefa'}
          </Text>
          
          <TextInput 
            style={styles.input} 
            value={formTitle} 
            onChangeText={setFormTitle} 
            placeholder="Título" 
          />
          
          {modalType === 'task' && (
            <>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={formDescription} 
                onChangeText={setFormDescription} 
                placeholder="Descrição" 
                multiline 
                numberOfLines={3} 
              />
              <TextInput 
                style={styles.input} 
                value={formDeadline} 
                onChangeText={setFormDeadline} 
                placeholder="Prazo (AAAA-MM-DD)" 
              />
              <TextInput 
                style={styles.input} 
                value={formResponsible} 
                onChangeText={setFormResponsible} 
                placeholder={`Responsável`} 
              />
            </>
          )}
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary, loading && styles.buttonDisabled]} 
              onPress={onSubmit} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonTextPrimary}>Criar</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonSecondary]} 
              onPress={onClose}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TaskModal;