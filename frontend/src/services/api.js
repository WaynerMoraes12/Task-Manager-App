import { API_URL, CHATBOT_URL } from '../utils/constants';

export const authAPI = {
  register: async (email, name) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de registro:', error);
      throw error;
    }
  },

  login: async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de login:', error);
      throw error;
    }
  },

  sendCode: async (email, name) => {
    try {
      const response = await fetch(`${API_URL}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de send-code:', error);
      throw error;
    }
  },

  verifyCode: async (email, code) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de verify-code:', error);
      throw error;
    }
  }
};

export const boardsAPI = {
  getBoards: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/boards?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de getBoards:', error);
      throw error;
    }
  },

  createBoard: async (userId, title) => {
    try {
      const response = await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de createBoard:', error);
      throw error;
    }
  },

  updateBoard: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/boards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de updateBoard:', error);
      throw error;
    }
  }
};

export const listsAPI = {
  createList: async (boardId, title) => {
    try {
      const response = await fetch(`${API_URL}/boards/${boardId}/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de createList:', error);
      throw error;
    }
  }
};

export const tasksAPI = {
  createTask: async (boardId, listId, taskData) => {
    try {
      const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de createTask:', error);
      throw error;
    }
  },

  updateTask: async (boardId, listId, taskId, taskData) => {
    try {
      const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de updateTask:', error);
      throw error;
    }
  },

  deleteTask: async (boardId, listId, taskId) => {
    try {
      const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de deleteTask:', error);
      throw error;
    }
  }
};

export const chatbotAPI = {
  sendMessage: async (message, userId) => {
    try {
      const response = await fetch(`${CHATBOT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API de chatbot:', error);
      throw error;
    }
  }
};
