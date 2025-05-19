import axios from 'axios';

// Configurar CORS no backend
const API_URL = 'http://localhost:5000/api';

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratar erros de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Limpar localStorage se o token expirou
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirecionar para login se necessário
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  
  login: async (userData: { email: string; password: string }) => {
    const response = await api.post('/users/login', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  }
};

// Serviços de tarefas
export const taskService = {
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  createTask: async (taskData: { title: string; description?: string }) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (id: string, taskData: { title?: string; description?: string; completed?: boolean }) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default api;
