import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      localStorage.setItem('token', response.data.access_token);
      if (response.data.is_first_login) {
        navigate('/change-password');
      } else {
        navigate('/chat');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    }
  };

  return (
    <main className="form-container px-sm md:px-lg flex flex-col items-center justify-center min-h-screen bg-background w-full">
      <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-md md:p-lg shadow-2xl w-full max-w-[520px]">
        <header className="mb-lg">
          <div className="flex items-center gap-3 mb-xs justify-center md:justify-start">
            <img src="/logo.png" alt="Mediario Logo" className="w-10 h-10 object-cover rounded-full shadow-sm" />
            <h1 className="font-headline-md text-headline-md text-primary">Bienvenido a Mediario</h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant text-center md:text-left">Inicie sesión para acceder a sus pacientes.</p>
        </header>

        {error && <div className="mb-sm text-error bg-error-container/20 p-sm rounded-lg border border-error/50">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-sm">
          <div className="flex flex-col gap-xs">
            <label className="font-title-lg text-title-lg text-on-surface text-sm" htmlFor="email">Correo electrónico</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">mail</span>
              <input 
                id="email" 
                type="email" 
                className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-11 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                placeholder="doctor@ejemplo.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className="font-title-lg text-title-lg text-on-surface text-sm" htmlFor="password">Contraseña</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">lock</span>
              <input 
                id="password" 
                type="password" 
                className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-11 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-md">
            <button type="submit" className="w-full px-lg py-3 rounded-lg bg-primary text-on-primary font-title-lg text-sm font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              Iniciar Sesión
            </button>
          </div>
          
          <div className="mt-md text-center">
             <Link to="/" className="text-primary hover:underline text-body-md">Volver al inicio</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
