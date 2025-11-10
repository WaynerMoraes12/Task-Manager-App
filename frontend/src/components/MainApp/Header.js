import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/styles';

const Header = ({ currentUser, onLogout }) => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Tarefas</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>👤 {currentUser?.name}</Text>
      </View>
    </>
  );
};

export default Header;