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

export default function LoginScreen() {
  const {
    loginEmail,
    setLoginEmail,
    loading,
    handleLogin,
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
          <Text style={styles.authTitle}>Bem-vindo de volta!</Text>
          <Text style={styles.authSubtitle}>Digite seu email para entrar no TaskManager</Text>
        </View>

        <View style={styles.authForm}>
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
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>Enviar Código de Acesso</Text>
            )}
          </TouchableOpacity>

          <View style={styles.authFooter}>
            <Text style={styles.footerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => setAuthStep('register')}>
              <Text style={styles.footerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
