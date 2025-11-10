import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/styles';

const Navigation = ({ currentScreen, setCurrentScreen }) => {
  return (
    <View style={styles.navigation}>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'lists' && styles.navButtonActive]} 
        onPress={() => setCurrentScreen('lists')}
      >
        <Text style={styles.navButtonIcon}>📝</Text>
        <Text style={[styles.navButtonText, currentScreen === 'lists' && styles.navButtonTextActive]}>
          Listas
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'chatbot' && styles.navButtonActive]} 
        onPress={() => setCurrentScreen('chatbot')}
      >
        <Text style={styles.navButtonIcon}>💬</Text>
        <Text style={[styles.navButtonText, currentScreen === 'chatbot' && styles.navButtonTextActive]}>
          ChatBot
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'dashboard' && styles.navButtonActive]} 
        onPress={() => setCurrentScreen('dashboard')}
      >
        <Text style={styles.navButtonIcon}>📊</Text>
        <Text style={[styles.navButtonText, currentScreen === 'dashboard' && styles.navButtonTextActive]}>
          Dashboard
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navigation;