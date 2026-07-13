import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('token');
    
    try {
      await axios.post(`${API_URL}/auth/change-password`, 
        { new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Once changed, redirect to chat
      navigate('/chat');
    } catch (err) {
      setError('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-[520px] w-full bg-surface-container border border-outline-variant/30 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-error-container/20 text-error rounded-full flex items-center justify-center mx-auto mb-4 border border-error/30">
            <span className="material-symbols-outlined text-[32px]">shield_lock</span>
          </div>
          <h1 className="text-2xl font-headline-md font-bold text-on-surface">Cambio Obligatorio</h1>
          <p className="text-sm text-on-surface-variant mt-2">Por seguridad, debes establecer una nueva contraseña en tu primer inicio de sesión.</p>
        </div>
        
        {error && (
          <div className="bg-error-container/20 text-error p-3 rounded-lg mb-6 text-sm text-center border border-error/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-title-lg text-on-surface mb-1">Nueva Contraseña</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">lock_reset</span>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface pl-11 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-title-lg text-on-surface mb-1">Confirmar Contraseña</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">lock_reset</span>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface pl-11 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:brightness-110 text-on-primary font-title-lg font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 mt-6 disabled:opacity-70"
          >
            {loading ? 'Guardando...' : 'Guardar y Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
