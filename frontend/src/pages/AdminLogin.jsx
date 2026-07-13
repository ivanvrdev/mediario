import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password
      });
      localStorage.setItem('adminToken', response.data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-[520px] w-full bg-surface-container border border-outline-variant/30 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-headline-md font-bold text-primary text-center mb-6">Panel de Administrador</h1>
        
        {error && (
          <div className="bg-error-container/20 border border-error/50 text-error p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-title-lg text-on-surface mb-1">Correo Electrónico</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">mail</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface pl-11 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-title-lg text-on-surface mb-1">Contraseña</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">lock</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface pl-11 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:brightness-110 text-on-primary font-title-lg font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 mt-4 disabled:opacity-70"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
