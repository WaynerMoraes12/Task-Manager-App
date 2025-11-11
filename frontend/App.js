import React, { useState, useEffect } from 'react';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainApp from './src/components/MainApp/MainApp';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AppProvider, useApp } from './src/contexts/AppContext';

function AppContent() {
  const { authStep, currentUser } = useAuth();

  // Se não está autenticado, mostra o fluxo de autenticação
  if (authStep !== 'authenticated' || !currentUser) {
    return <AuthNavigator />;
  }

  // Se está autenticado, mostra o app principal
  return <MainApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}