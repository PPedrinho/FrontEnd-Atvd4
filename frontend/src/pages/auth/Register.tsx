import React, { useState, FormEvent, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!name || !email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password
      });
      
      // Login automático após registro bem-sucedido
      login(response.data.token, {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email
      });
      
      toast.success('Registro realizado com sucesso!');
      navigate('/tasks');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao registrar. Tente novamente.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Criar Conta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nome</label>
          <input
            type="text"
            id="name"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-block ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          {loading && <span className="loading-spinner"></span>}
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
      
      <Link to="/login" className="form-link">
        Já tem uma conta? Faça login
      </Link>
    </div>
  );
};

export default Register;
