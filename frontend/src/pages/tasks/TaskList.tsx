import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Configurar axios com token
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  // Buscar tarefas
  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        logout();
        navigate('/login');
      } else {
        toast.error('Erro ao buscar tarefas');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Adicionar tarefa
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('O título da tarefa é obrigatório');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/tasks', { title, description });
      setTasks([response.data, ...tasks]);
      setTitle('');
      setDescription('');
      toast.success('Tarefa adicionada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao adicionar tarefa');
    } finally {
      setLoading(false);
    }
  };

  // Alternar status da tarefa
  const toggleTaskStatus = async (id: string, completed: boolean) => {
    try {
      const response = await api.put(`/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map(task => 
        task._id === id ? { ...task, completed: !completed } : task
      ));
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
    }
  };

  // Excluir tarefa
  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Tarefa removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover tarefa');
    }
  };

  // Fazer logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <div className="header">
        <h1 className="header-title">Lista de Tarefas</h1>
        <div>
          <span>Olá, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Sair
          </button>
        </div>
      </div>

      <div className="task-container">
        <form onSubmit={addTask} className="task-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Título</label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">Descrição (opcional)</label>
            <input
              type="text"
              id="description"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição da tarefa"
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn btn-block ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Adicionando...' : 'Adicionar Tarefa'}
          </button>
        </form>

        <h2>Minhas Tarefas</h2>
        
        {fetchLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="loading-spinner" style={{ borderTopColor: '#4a6da7' }}></div>
            <p>Carregando tarefas...</p>
          </div>
        ) : tasks.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>
            Nenhuma tarefa encontrada. Adicione uma nova tarefa acima.
          </p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <div className={`task-title ${task.completed ? 'task-completed' : ''}`}>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => toggleTaskStatus(task._id, task.completed)}
                    className={`btn ${task.completed ? 'btn-secondary' : 'btn'}`}
                  >
                    {task.completed ? 'Reabrir' : 'Concluir'}
                  </button>
                  <button 
                    onClick={() => deleteTask(task._id)}
                    className="btn btn-danger"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskList;
