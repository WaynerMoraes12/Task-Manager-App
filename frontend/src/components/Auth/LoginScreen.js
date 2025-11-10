import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Platform } from 'react-native';
import styles from '../../styles/styles';

const LoginScreen = ({ 
  loginEmail, 
  setLoginEmail, 
  loginName, 
  setLoginName, 
  loading, 
  onSendCode 
}) => {
  return (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContent}>
        <View style={styles.authHeader}>
          <Text style={styles.authLogo}>📋</Text>
          <Text style={styles.authTitle}>Gerenciador de Tarefas</Text>
          <Text style={styles.authSubtitle}>Login com código por email</Text>
        </View>
        
        <View style={styles.authForm}>
          <Text style={styles.formLabel}>Nome</Text>
          <TextInput 
            style={styles.authInput} 
            value={loginName} 
            onChangeText={setLoginName} 
            placeholder="Seu nome" 
          />
          
          <Text style={styles.formLabel}>Email</Text>
          <TextInput 
            style={styles.authInput} 
            value={loginEmail} 
            onChangeText={setLoginEmail} 
            placeholder="seu@email.com" 
            keyboardType="email-address" 
            autoCapitalize="none" 
          />
          
          <TouchableOpacity 
            style={[styles.authButton, loading && styles.buttonDisabled]} 
            onPress={onSendCode} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>📧 Enviar Código</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;