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

  const normalizeTask = (task) => {
    if (!task) return task;
    return {
      ...task,
      id: task.id || task._id,
    };
  };

  const normalizeList = (list) => {
    if (!list) return list;
    return {
      ...list,
      id: list.id || list._id,
      tasks: (list.tasks || []).map(normalizeTask),
    };
  };

  const normalizeBoard = (board) => {
    if (!board) return board;
    return {
      ...board,
      id: board.id || board._id,
      lists: (board.lists || []).map(normalizeList),
    };
  };

  useEffect(() => {
    if (currentUser) {
      loadBoards();
    } else {
      setBoards([]);
      setSelectedBoard(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const ensureDefaultBoard = async () => {
    if (!currentUser) return null;

    try {
      const response = await boardsAPI.createBoard(currentUser.id, 'Meu primeiro quadro');
      if (response.success) {
        const normalizedBoard = normalizeBoard(response.data);
        setBoards([normalizedBoard]);
        setSelectedBoard(normalizedBoard);
        return normalizedBoard;
      }
    } catch (error) {
      console.error('Erro ao criar quadro padrão:', error);
    }
    return null;
  };

  const loadBoards = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      let data = await boardsAPI.getBoards(currentUser.id);

      if (data.success) {
        let boardsData = data.data || [];

        if (boardsData.length === 0) {
          const defaultBoard = await ensureDefaultBoard();
          if (defaultBoard) {
            setLoading(false);
            return;
          }
        }

        const normalizedBoards = boardsData.map(normalizeBoard);
        setBoards(normalizedBoards);
        if (normalizedBoards.length > 0) {
          setSelectedBoard(normalizedBoards[0]);
        } else {
          setSelectedBoard(null);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar quadros:', error);
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    const trimmedTitle = formTitle.trim();

    let targetBoard = selectedBoard;

    if (!targetBoard) {
      const createdBoard = await ensureDefaultBoard();
      if (!createdBoard) {
        showAlert('Erro', 'Crie ou selecione um quadro antes de adicionar listas.');
        return false;
      }
      targetBoard = createdBoard;
    }

    const boardId = targetBoard.id || targetBoard._id;

    if (!boardId) {
      showAlert('Erro', 'Não foi possível identificar o quadro selecionado.');
      return false;
    }

    if (!trimmedTitle) {
      showAlert('Erro', 'Digite o nome da lista');
      return false;
    }

    setLoading(true);
    try {
      const data = await listsAPI.createList(boardId, trimmedTitle);

      if (data.success) {
        const updatedBoard = normalizeBoard(data.board);

        setSelectedBoard(updatedBoard);
        setBoards(prevBoards => {
          const exists = prevBoards.some(b => b.id === updatedBoard.id);
          if (!exists) {
            return [...prevBoards, updatedBoard];
          }
          return prevBoards.map(b => (b.id === updatedBoard.id ? updatedBoard : b));
        });
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

      const boardId = selectedBoard.id || selectedBoard._id;
      const listId = selectedList.id || selectedList._id;

      const data = await tasksAPI.createTask(boardId, listId, taskData);

      if (data.success) {
        const updatedBoard = normalizeBoard(data.board);
        setSelectedBoard(updatedBoard);
        setBoards(prevBoards => prevBoards.map(b => (b.id === updatedBoard.id ? updatedBoard : b)));
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
      const boardId = selectedBoard.id || selectedBoard._id;
      const data = await tasksAPI.updateTask(boardId, listId, taskId, { status: 'completed' });
      if (data.success) {
        const updatedTask = data.data;
        const updatedBoard = { ...selectedBoard };
        const listIndex = updatedBoard.lists.findIndex(list => list.id === listId);
        if (listIndex !== -1) {
          const taskIndex = updatedBoard.lists[listIndex].tasks.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            updatedBoard.lists[listIndex].tasks[taskIndex] = updatedTask;
            setSelectedBoard(updatedBoard);
            setBoards(prevBoards => prevBoards.map(b => (b.id === updatedBoard.id ? updatedBoard : b)));
          }
        }
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
        const boardId = selectedBoard.id || selectedBoard._id;
        const data = await tasksAPI.deleteTask(boardId, listId, taskId);
        console.log('deleteTask data:', JSON.stringify(data));

        if (data.success) {
          // Atualizar o estado local removendo a tarefa
          const updatedBoard = { ...selectedBoard };

          // Encontrar a lista que contém a tarefa
          const listIndex = updatedBoard.lists.findIndex(list => list.id === listId);
          if (listIndex !== -1) {
            // Remover a tarefa da lista
            updatedBoard.lists[listIndex].tasks = updatedBoard.lists[listIndex].tasks.filter(
              task => task.id !== taskId
            );

            // Atualizar os estados
            setSelectedBoard(updatedBoard);
            setBoards(prevBoards =>
              prevBoards.map(b => (b.id === updatedBoard.id ? updatedBoard : b))
            );
          }
        }
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
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
