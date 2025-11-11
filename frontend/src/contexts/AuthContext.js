import React, { createContext, useState, useContext } from 'react';
import { showAlert } from '../utils/alerts';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authStep, setAuthStep] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!loginEmail.trim() || !loginName.trim()) {
      showAlert('Erro', 'Preencha seu nome e email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      showAlert('Erro', 'Digite um email válido');
      return false;
    }

    setLoading(true);
    try {
      console.log('Tentando registrar:', loginEmail, loginName);
      const data = await authAPI.register(loginEmail, loginName);
      
      if (data.success) {
        showAlert(
          '📧 Código Enviado!',
          `Enviamos um código de 6 dígitos para:\n${loginEmail}\n\nCódigo: ${data.code}`,
          () => setAuthStep('verify')
        );
        return true;
      } else {
        showAlert('Erro', data.message || 'Erro ao enviar código');
        return false;
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      showAlert(
        'Erro de Conexão', 
        'Não foi possível conectar ao servidor.\n\nCertifique-se de que:\n• O backend está rodando\n• A URL da API está correta\n• Não há problemas de rede'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail.trim()) {
      showAlert('Erro', 'Preencha seu email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      showAlert('Erro', 'Digite um email válido');
      return false;
    }

    setLoading(true);
    try {
      console.log('Tentando login:', loginEmail);
      const data = await authAPI.login(loginEmail);
      
      if (data.success) {
        showAlert(
          '📧 Código Enviado!',
          `Enviamos um código de 6 dígitos para:\n${loginEmail}\n\nCódigo: ${data.code}`,
          () => setAuthStep('verify')
        );
        return true;
      } else {
        showAlert('Erro', data.message || 'Erro ao enviar código');
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      showAlert(
        'Erro de Conexão', 
        'Não foi possível conectar ao servidor.\n\nCertifique-se de que:\n• O backend está rodando\n• A URL da API está correta\n• Não há problemas de rede'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      showAlert('Erro', 'Digite o código de verificação');
      return false;
    }

    if (verificationCode.length !== 6) {
      showAlert('Erro', 'O código deve ter 6 dígitos');
      return false;
    }

    setLoading(true);
    try {
      console.log('Verificando código:', verificationCode, 'para email:', loginEmail);
      const data = await authAPI.verifyCode(loginEmail, verificationCode);
      
      if (data.success) {
        setCurrentUser(data.user);
        setAuthStep('authenticated');
        setVerificationCode('');
        showAlert('Bem-vindo!', `Olá, ${data.user.name}! 🎉`);
        return true;
      } else {
        showAlert('Erro', data.message || 'Código inválido');
        return false;
      }
    } catch (error) {
      console.error('Erro na verificação:', error);
      showAlert('Erro', 'Não foi possível verificar o código');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthStep('login');
    setCurrentUser(null);
    setLoginEmail('');
    setLoginName('');
    setVerificationCode('');
  };

  const resetAuth = () => {
    setAuthStep('login');
    setLoginEmail('');
    setLoginName('');
    setVerificationCode('');
  };

  const value = {
    // States
    authStep,
    currentUser,
    loginEmail,
    loginName,
    verificationCode,
    loading,
    
    // Setters
    setAuthStep,
    setLoginEmail,
    setLoginName,
    setVerificationCode,
    
    // Actions
    handleRegister,
    handleLogin,
    handleVerifyCode,
    handleLogout,
    resetAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
