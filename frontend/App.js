import React, { useState, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { showAlert, showConfirm } from './src/utils/alerts';
import { authAPI, boardsAPI, listsAPI, tasksAPI, chatbotAPI } from './src/services/api';
import LoginScreen from './src/components/Auth/LoginScreen';
import VerifyScreen from './src/components/Auth/VerifyScreen';
import Header from './src/components/MainApp/Header';
import Navigation from './src/components/MainApp/Navigation';
import ListsScreen from './src/components/MainApp/ListsScreen';
import ChatBotScreen from './src/components/MainApp/ChatBotScreen';
import DashboardScreen from './src/components/MainApp/DashboardScreen';
import TaskModal from './src/components/Common/TaskModal';
import styles from './src/styles/styles';

export default function App() {
  const [authStep, setAuthStep] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('lists');
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('list');
  const [selectedList, setSelectedList] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formResponsible, setFormResponsible] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (authStep === 'authenticated' && currentUser) {
      loadBoards();
    }
  }, [authStep, currentUser]);

  const handleSendCode = async () => {
    if (!loginEmail.trim() || !loginName.trim()) {
      showAlert('Erro', 'Preencha seu nome e email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      showAlert('Erro', 'Digite um email válido');
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.sendCode(loginEmail, loginName);
      
      if (data.success) {
        showAlert(
          '📧 Código Enviado!',
          `Código: ${data.code}\n\nDigite este código na próxima tela`,
          () => setAuthStep('verify')
        );
      } else {
        showAlert('Erro', data.message);
      }
    } catch (error) {
      showAlert('Erro', 'Backend não está rodando! Inicie: cd backend && npm run dev');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      showAlert('Erro', 'Digite o código');
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.verifyCode(loginEmail, verificationCode);
      
      if (data.success) {
        setCurrentUser(data.user);
        setAuthStep('authenticated');
        setVerificationCode('');
        showAlert('Bem-vindo!', `Olá, ${data.user.name}! 🎉`);
      } else {
        showAlert('Erro', data.message);
      }
    } catch (error) {
      showAlert('Erro', 'Não foi possível verificar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadBoards = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const data = await boardsAPI.getBoards(currentUser.id);
      
      if (data.success) {
        setBoards(data.data);
        if (data.data.length > 0) {
          setSelectedBoard(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar quadros:', error);
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    if (!formTitle.trim() || !selectedBoard) {
      showAlert('Erro', 'Digite o nome da lista');
      return;
    }

    setLoading(true);
    try {
      const data = await listsAPI.createList(selectedBoard.id, formTitle);
      
      if (data.success) {
        setSelectedBoard(data.board);
        setBoards(boards.map(b => b.id === data.board.id ? data.board : b));
        closeModal();
        showAlert('Sucesso', 'Lista criada!');
      }
    } catch (error) {
      showAlert('Erro', 'Não foi possível criar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!formTitle.trim() || !selectedList || !selectedBoard) {
      showAlert('Erro', 'Preencha o título');
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title: formTitle,
        description: formDescription,
        deadline: formDeadline,
        responsible: formResponsible || currentUser?.name || 'Você'
      };

      const data = await tasksAPI.createTask(selectedBoard.id, selectedList.id, taskData);
      
      if (data.success) {
        setSelectedBoard(data.board);
        setBoards(boards.map(b => b.id === data.board.id ? data.board : b));
        closeModal();
        showAlert('Sucesso', 'Tarefa criada!');
      }
    } catch (error) {
      showAlert('Erro', 'Não foi possível criar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markTaskAsCompleted = async (listId, taskId) => {
    if (!selectedBoard) return;

    setLoading(true);
    try {
      const data = await tasksAPI.updateTask(selectedBoard.id, listId, taskId, { status: 'completed' });
      
      if (data.success) {
        setSelectedBoard(data.board);
        setBoards(boards.map(b => b.id === data.board.id ? data.board : b));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (listId, taskId) => {
    if (!selectedBoard) return;

    showConfirm('Confirmar', 'Deletar tarefa?', async () => {
      setLoading(true);
      try {
        const data = await tasksAPI.deleteTask(selectedBoard.id, listId, taskId);
        
        if (data.success) {
          setSelectedBoard(data.board);
          setBoards(boards.map(b => b.id === data.board.id ? data.board : b));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !currentUser) return;

    const userMessage = chatInput;
    setChatMessages([...chatMessages, { text: userMessage, sender: 'user' }]);
    setChatInput('');

    try {
      const data = await chatbotAPI.sendMessage(userMessage, currentUser.id);
      
      if (data.success) {
        setChatMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        text: 'Chatbot não está rodando! Inicie: cd chatbot && python chatbot.py', 
        sender: 'bot' 
      }]);
      console.error(error);
    }
  };

  const handleLogout = () => {
    showConfirm('Confirmar', 'Deseja sair?', () => {
      setAuthStep('login');
      setCurrentUser(null);
      setLoginEmail('');
      setLoginName('');
      setVerificationCode('');
      setBoards([]);
      setSelectedBoard(null);
      setCurrentScreen('lists');
      setChatMessages([]);
    });
  };

  const openModal = (type, list) => { 
    setModalType(type); 
    if (list) setSelectedList(list); 
    setModalVisible(true); 
  };
  
  const closeModal = () => { 
    setModalVisible(false); 
    setFormTitle(''); 
    setFormDescription(''); 
    setFormDeadline(''); 
    setFormResponsible(''); 
    setSelectedList(null); 
  };

  const handleModalSubmit = () => {
    if (modalType === 'list') {
      createList();
    } else {
      createTask();
    }
  };

  // Renderização condicional baseada no estado de autenticação
  if (authStep === 'login') {
    return (
      <LoginScreen
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginName={loginName}
        setLoginName={setLoginName}
        loading={loading}
        onSendCode={handleSendCode}
      />
    );
  }

  if (authStep === 'verify') {
    return (
      <VerifyScreen
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        loading={loading}
        onVerifyCode={handleVerifyCode}
        onBack={() => setAuthStep('login')}
      />
    );
  }

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