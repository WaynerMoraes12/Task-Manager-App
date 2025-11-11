import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/styles';

export default function RegisterScreen() {
  const {
    loginEmail,
    setLoginEmail,
    loginName,
    setLoginName,
    loading,
    handleRegister,
    setAuthStep
  } = useAuth();

  return (
    <KeyboardAvoidingView 
      style={styles.authContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.authContent}>
        <View style={styles.authHeader}>
          <Text style={styles.authLogo}>📋</Text>
          <Text style={styles.authTitle}>Criar Conta</Text>
          <Text style={styles.authSubtitle}>Cadastre-se para começar a usar o TaskManager</Text>
        </View>

        <View style={styles.authForm}>
          <Text style={styles.formLabel}>Nome completo</Text>
          <TextInput
            style={styles.authInput}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#999"
            value={loginName}
            onChangeText={setLoginName}
            editable={!loading}
            autoCapitalize="words"
          />

          <Text style={styles.formLabel}>Email</Text>
          <TextInput
            style={styles.authInput}
            placeholder="seu@email.com"
            placeholderTextColor="#999"
            value={loginEmail}
            onChangeText={setLoginEmail}
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          
          <TouchableOpacity 
            style={[styles.authButton, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>Cadastrar e Enviar Código</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backLink}
            onPress={() => setAuthStep('login')}
            disabled={loading}
          >
            <Text style={styles.backLinkText}>← Voltar para o Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
