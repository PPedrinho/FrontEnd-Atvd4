import React, { useState, FormEvent, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/tasks';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });
      
      login(response.data.token, {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email
      });
      
      toast.success('Login realizado com sucesso!');
      navigate(from);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email ou senha inválidos';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Entrar</h2>
      <form onSubmit={handleSubmit}>
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
        
        <button 
          type="submit" 
          className={`btn btn-block ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          {loading && <span className="loading-spinner"></span>}
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      
      <Link to="/register" className="form-link">
        Não tem uma conta? Registre-se
      </Link>
    </div>
  );
};

export default Login;
