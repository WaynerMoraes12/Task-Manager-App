import React from 'react';
import LoginScreen from '../components/Auth/LoginScreen';
import RegisterScreen from '../components/Auth/RegisterScreen';
import VerifyScreen from '../components/Auth/VerifyScreen';
import { useAuth } from '../contexts/AuthContext';

export default function AuthNavigator() {
  const { 
    authStep, 
    loginEmail, 
    setLoginEmail, 
    loginName, 
    setLoginName, 
    verificationCode, 
    setVerificationCode,
    handleLogin,
    handleRegister,
    handleVerifyCode,
    setAuthStep 
  } = useAuth();

  if (authStep === 'login') {
    return (
      <LoginScreen
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthStep('register')}
      />
    );
  }

  if (authStep === 'register') {
    return (
      <RegisterScreen
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginName={loginName}
        setLoginName={setLoginName}
        onRegister={handleRegister}
        onSwitchToLogin={() => setAuthStep('login')}
      />
    );
  }

  if (authStep === 'verify') {
    return (
      <VerifyScreen
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        onVerifyCode={handleVerifyCode}
        onBack={() => setAuthStep('login')}
      />
    );
  }

  return null;
}
