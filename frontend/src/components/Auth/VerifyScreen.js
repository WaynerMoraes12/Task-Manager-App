import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Platform } from 'react-native';
import styles from '../../styles/styles';

const VerifyScreen = ({ 
  verificationCode, 
  setVerificationCode, 
  loading, 
  onVerifyCode, 
  onBack 
}) => {
  return (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContent}>
        <View style={styles.authHeader}>
          <Text style={styles.authLogo}>🔐</Text>
          <Text style={styles.authTitle}>Verificação</Text>
          <Text style={styles.authSubtitle}>Digite o código enviado</Text>
        </View>
        
        <View style={styles.authForm}>
          <Text style={styles.formLabel}>Código</Text>
          <TextInput 
            style={[styles.authInput, styles.codeInput]} 
            value={verificationCode} 
            onChangeText={setVerificationCode} 
            placeholder="000000" 
            keyboardType="number-pad" 
            maxLength={6} 
          />
          
          <TouchableOpacity 
            style={[styles.authButton, loading && styles.buttonDisabled]} 
            onPress={onVerifyCode} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>✓ Verificar</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backLink} onPress={onBack}>
            <Text style={styles.backLinkText}>← Voltar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyScreen;