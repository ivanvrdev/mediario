import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const RequestDemo = () => {
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    cuil: '',
    email: '',
    phone: '',
    specialty: '',
    license_number: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API_URL}/public/demo-request`, formData);
      setStatus({ 
        type: 'success', 
        message: 'Solicitud enviada exitosamente. Pronto será revisada por un administrador.' 
      });
      setFormData({ last_name: '', first_name: '', cuil: '', email: '', phone: '', specialty: '', license_number: '' });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.detail || 'Error al enviar la solicitud. Intente nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Info Banner */}
        <div className="md:col-span-2 bg-surface-container border border-outline-variant/30 rounded-2xl p-8 shadow-xl flex flex-col justify-center">
          <h2 className="text-2xl font-headline-md text-primary mb-6">¿Cómo funciona?</h2>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/30">1</div>
              <p className="text-on-surface-variant text-sm mt-1">Completa el formulario con tus datos profesionales verdaderos.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/30">2</div>
              <p className="text-on-surface-variant text-sm mt-1">Nuestro equipo validará tu identidad como profesional de la salud.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/30">3</div>
              <p className="text-on-surface-variant text-sm mt-1">Si es aprobada, te enviaremos una <strong className="text-on-surface">contraseña temporal</strong> genérica.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/30">4</div>
              <p className="text-on-surface-variant text-sm mt-1">Al iniciar sesión por primera vez, el sistema te obligará a establecer una nueva contraseña de tu elección por seguridad.</p>
            </li>
          </ul>
          <Link to="/" className="mt-12 text-sm text-primary hover:text-primary-container transition-colors underline">
            &larr; Volver al inicio
          </Link>
        </div>

        {/* Form */}
        <div className="md:col-span-3 bg-surface-container-high border border-outline-variant/30 rounded-2xl p-8 shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-headline-md text-primary">Solicitar Demo</h1>
            <p className="text-on-surface-variant text-sm mt-2">Ingresa tus datos para comenzar a usar la plataforma.</p>
          </div>

          {status.message && (
            <div className={`p-4 rounded-lg mb-6 text-sm font-medium border ${status.type === 'success' ? 'bg-secondary-container/20 text-secondary border-secondary/50' : 'bg-error-container/20 text-error border-error/50'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-title-lg text-on-surface mb-1">Nombre</label>
                <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-title-lg text-on-surface mb-1">Apellido</label>
                <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-title-lg text-on-surface mb-1">Correo Electrónico</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-title-lg text-on-surface mb-1">CUIL / CUIT</label>
                <input required type="text" name="cuil" value={formData.cuil} onChange={handleChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-title-lg text-on-surface mb-1">Teléfono</label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-title-lg text-on-surface mb-1">Especialidad</label>
                <input required type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-title-lg text-on-surface mb-1">Matrícula (Nac. o Prov.)</label>
                <input required type="text" name="license_number" value={formData.license_number} onChange={handleChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 bg-primary hover:brightness-110 text-on-primary font-title-lg font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestDemo;
