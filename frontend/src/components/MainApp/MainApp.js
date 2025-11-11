import React from 'react';
import { SafeAreaView } from 'react-native';
import Header from './Header';
import Navigation from './Navigation';
import ListsScreen from './ListsScreen';
import ChatBotScreen from './ChatBotScreen';
import DashboardScreen from './DashboardScreen';
import TaskModal from '../Common/TaskModal';
import styles from '../../styles/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

export default function MainApp() {
  const { currentUser, handleLogout } = useAuth();
  const {
    currentScreen,
    setCurrentScreen,
    selectedBoard,
    loading,
    openModal,
    deleteTask,
    markTaskAsCompleted,
    boards,
    modalVisible,
    closeModal,
    modalType,
    formTitle,
    setFormTitle,
    formDescription,
    setFormDescription,
    formDeadline,
    setFormDeadline,
    formResponsible,
    setFormResponsible,
    handleModalSubmit,
    chatMessages,
    chatInput,
    setChatInput,
    handleChatSend
  } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <Navigation 
        currentScreen={currentScreen} 
        setCurrentScreen={setCurrentScreen} 
      />
      
      {currentScreen === 'lists' && (
        <ListsScreen
          selectedBoard={selectedBoard}
          loading={loading}
          onOpenModal={openModal}
          onDeleteTask={deleteTask}
          onCompleteTask={markTaskAsCompleted}
        />
      )}
      
      {currentScreen === 'chatbot' && (
        <ChatBotScreen
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          onSendMessage={handleChatSend}
        />
      )}
      
      {currentScreen === 'dashboard' && (
        <DashboardScreen boards={boards} />
      )}
      
      <TaskModal
        visible={modalVisible}
        onClose={closeModal}
        modalType={modalType}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
        formDeadline={formDeadline}
        setFormDeadline={setFormDeadline}
        formResponsible={formResponsible}
        setFormResponsible={setFormResponsible}
        loading={loading}
        onSubmit={handleModalSubmit}
        currentUser={currentUser}
      />
    </SafeAreaView>
  );
}
