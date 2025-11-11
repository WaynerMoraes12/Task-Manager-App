import React, { createContext, useState, useContext, useEffect } from 'react';
import { showAlert, showConfirm } from '../utils/alerts';
import { boardsAPI, listsAPI, tasksAPI, chatbotAPI } from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { currentUser } = useAuth();
  
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
    if (currentUser) {
      loadBoards();
    }
  }, [currentUser]);

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
      return false;
    }

    setLoading(true);
    try {
      const data = await listsAPI.createList(selectedBoard.id, formTitle);
      
      if (data.success) {
        setSelectedBoard(data.board);
        setBoards(boards.map(b => b.id === data.board.id ? data.board : b));
        closeModal();
        showAlert('Sucesso', 'Lista criada!');
        return true;
      }
    } catch (error) {
      showAlert('Erro', 'Não foi possível criar');
      console.error(error);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const createTask = async () => {
    if (!formTitle.trim() || !selectedList || !selectedBoard) {
      showAlert('Erro', 'Preencha o título');
      return false;
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
        return true;
      }
    } catch (error) {
      showAlert('Erro', 'Não foi possível criar');
      console.error(error);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const markTaskAsCompleted = async (listId, taskId) => {
    if (!selectedBoard) return false;

    setLoading(true);
    try {
      const data = await tasksAPI.updateTask(selectedBoard.id, listId, taskId, { status: 'completed' });
      
      if (data.success) {
        setSelectedBoard(data.board);
        setBoards(boards.map(b => b.id === data.board.id ? data.board : b));
        return true;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    return false;
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
      return createList();
    } else {
      return createTask();
    }
  };

  const value = {
    // States
    loading,
    currentScreen,
    boards,
    selectedBoard,
    modalVisible,
    modalType,
    selectedList,
    formTitle,
    formDescription,
    formDeadline,
    formResponsible,
    chatMessages,
    chatInput,

    // Setters
    setLoading,
    setCurrentScreen,
    setSelectedBoard,
    setFormTitle,
    setFormDescription,
    setFormDeadline,
    setFormResponsible,
    setChatInput,
    setChatMessages,

    // Actions
    loadBoards,
    openModal,
    closeModal,
    handleModalSubmit,
    markTaskAsCompleted,
    deleteTask,
    handleChatSend,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
