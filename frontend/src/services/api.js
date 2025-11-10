import { API_URL, CHATBOT_URL } from '../utils/constants';

export const authAPI = {
  sendCode: async (email, name) => {
    const response = await fetch(`${API_URL}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    return response.json();
  },

  verifyCode: async (email, code) => {
    const response = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    return response.json();
  }
};

export const boardsAPI = {
  getBoards: async (userId) => {
    const response = await fetch(`${API_URL}/boards?userId=${userId}`);
    return response.json();
  },

  createBoard: async (userId, title) => {
    const response = await fetch(`${API_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title })
    });
    return response.json();
  },

  updateBoard: async (id, data) => {
    const response = await fetch(`${API_URL}/boards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

export const listsAPI = {
  createList: async (boardId, title) => {
    const response = await fetch(`${API_URL}/boards/${boardId}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    return response.json();
  }
};

export const tasksAPI = {
  createTask: async (boardId, listId, taskData) => {
    const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return response.json();
  },

  updateTask: async (boardId, listId, taskId, taskData) => {
    const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return response.json();
  },

  deleteTask: async (boardId, listId, taskId) => {
    const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

export const chatbotAPI = {
  sendMessage: async (message, userId) => {
    const response = await fetch(`${CHATBOT_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId })
    });
    return response.json();
  }
};