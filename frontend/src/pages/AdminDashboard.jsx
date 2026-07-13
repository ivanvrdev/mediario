import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests'); // requests | stats
  const [requests, setRequests] = useState([]);
  const [usersStats, setUsersStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    first_name: '', last_name: '', cuil: '', email: '', phone: '', specialty: '', license_number: '', password: ''
  });
  const [createLoading, setCreateLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState({ full_name: '', email: '', phone: '', is_first_login: true, password: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [token, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'requests') {
        const res = await axios.get(`${API_URL}/admin/demo-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } else {
        const res = await axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsersStats(res.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/admin/demo-requests/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGeneratedPassword(res.data.generated_password);
      fetchData();
    } catch (error) {
      alert("Error al aceptar solicitud");
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm('¿Seguro que deseas rechazar esta solicitud?')) return;
    try {
      await axios.put(`${API_URL}/admin/demo-requests/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert("Error al rechazar solicitud");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleCreateUserChange = (e) => {
    const { name, value } = e.target;
    setCreateUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreateUserForm(prev => ({ ...prev, password: pass }));
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(createUserForm.password);
    alert('Contraseña copiada al portapapeles');
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if(!createUserForm.password) {
      alert("Debes generar una contraseña primero");
      return;
    }
    setCreateLoading(true);
    try {
      const res = await axios.post(`${API_URL}/admin/users`, createUserForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGeneratedPassword(res.data.generated_password);
      setIsCreateModalOpen(false);
      setCreateUserForm({ first_name: '', last_name: '', cuil: '', email: '', phone: '', specialty: '', license_number: '', password: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || "Error al crear usuario");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditUserClick = (user) => {
    setEditUserForm({ 
      full_name: user.full_name, 
      email: user.email, 
      phone: user.phone || '',
      is_first_login: user.is_first_login,
      password: ''
    });
    setEditingUserId(user.id);
    setIsEditModalOpen(true);
  };

  const handleEditUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditUserForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleGenerateEditPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEditUserForm(prev => ({ ...prev, password: pass }));
  };

  const handleCopyEditPassword = () => {
    if (!editUserForm.password) return;
    navigator.clipboard.writeText(editUserForm.password);
    alert('Nueva contraseña copiada al portapapeles');
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await axios.put(`${API_URL}/admin/users/${editingUserId}`, editUserForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditModalOpen(false);
      setEditingUserId(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || "Error al actualizar usuario");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface">
      <header className="bg-surface-container-high border-b border-outline-variant/30 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Mediario Logo" className="w-8 h-8 object-cover rounded-full" />
          <h1 className="text-xl font-headline-md font-bold text-primary">Admin Panel - Mediario</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsCreateModalOpen(true)} className="text-sm bg-primary hover:brightness-110 text-on-primary px-4 py-2 rounded-lg transition-colors font-title-lg flex items-center gap-2 shadow-sm shadow-primary/20">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Crear Usuario
          </button>
          <button onClick={handleLogout} className="text-sm bg-surface-variant hover:bg-outline-variant/50 px-4 py-2 rounded-lg transition-colors text-on-surface font-title-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-outline-variant/30 pb-2">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 font-title-lg text-sm transition-colors flex items-center gap-2 ${activeTab === 'requests' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[18px]">inbox</span>
            Solicitudes de Demo
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 font-title-lg text-sm transition-colors flex items-center gap-2 ${activeTab === 'stats' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[18px]">bar_chart</span>
            Estadísticas de Usuarios
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-on-surface-variant flex items-center justify-center gap-2">
             <span className="material-symbols-outlined animate-spin">refresh</span>
             Cargando datos...
          </div>
        ) : (
          <div className="bg-surface-container rounded-xl shadow-lg border border-outline-variant/30 overflow-hidden">
            {activeTab === 'requests' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-on-surface-variant">
                  <thead className="bg-surface-container-high text-on-surface border-b border-outline-variant/30 font-title-lg">
                    <tr>
                      <th className="p-4 font-semibold">Nombre</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Especialidad</th>
                      <th className="p-4 font-semibold">Estado</th>
                      <th className="p-4 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr><td colSpan="5" className="p-4 text-center">No hay solicitudes</td></tr>
                    ) : requests.map(req => (
                      <tr key={req.id} className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-variant/50 transition-colors">
                        <td className="p-4 font-medium text-on-surface">{req.first_name} {req.last_name}</td>
                        <td className="p-4">{req.email}</td>
                        <td className="p-4">{req.specialty}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-title-lg border ${
                            req.status === 'pending' ? 'bg-tertiary-container/20 text-tertiary border-tertiary/30' :
                            req.status === 'accepted' ? 'bg-secondary-container/20 text-secondary border-secondary/30' : 'bg-error-container/20 text-error border-error/30'
                          }`}>
                            {req.status === 'pending' ? 'Pendiente' : req.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
                          </span>
                        </td>
                        <td className="p-4">
                          {req.status === 'pending' && (
                            <div className="flex gap-4">
                              <button onClick={() => handleAccept(req.id)} className="text-secondary hover:text-secondary-fixed-dim font-title-lg text-sm flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span> Aceptar
                              </button>
                              <button onClick={() => handleReject(req.id)} className="text-error hover:text-error-container font-title-lg text-sm flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">cancel</span> Rechazar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-on-surface-variant">
                  <thead className="bg-surface-container-high text-on-surface border-b border-outline-variant/30 font-title-lg">
                    <tr>
                      <th className="p-4 font-semibold">Usuario</th>
                      <th className="p-4 font-semibold text-center">Pacientes</th>
                      <th className="p-4 font-semibold text-center">Audios</th>
                      <th className="p-4 font-semibold text-center">Imágenes</th>
                      <th className="p-4 font-semibold text-center">PDFs</th>
                      <th className="p-4 font-semibold text-center">Total Archivos</th>
                      <th className="p-4 font-semibold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersStats.length === 0 ? (
                      <tr><td colSpan="7" className="p-4 text-center">No hay usuarios</td></tr>
                    ) : usersStats.map(user => (
                      <tr key={user.id} className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-variant/50 transition-colors">
                        <td className="p-4">
                          <div className="font-title-lg text-on-surface">{user.full_name}</div>
                          <div className="text-xs">{user.email}</div>
                        </td>
                        <td className="p-4 text-center font-title-lg text-on-surface">{user.patients_count}</td>
                        <td className="p-4 text-center">{user.audios_count}</td>
                        <td className="p-4 text-center">{user.images_count}</td>
                        <td className="p-4 text-center">{user.pdfs_count}</td>
                        <td className="p-4 text-center font-title-lg text-primary">{user.files_count}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleEditUserClick(user)} className="text-primary hover:text-primary-container font-title-lg text-sm flex items-center justify-center gap-1 transition-colors mx-auto">
                            <span className="material-symbols-outlined text-[18px]">edit</span> Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-container-high rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-outline-variant/30 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline-md font-bold text-on-surface">Crear Nuevo Usuario</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-title-lg text-on-surface mb-1">Nombre</label>
                  <input required type="text" name="first_name" value={createUserForm.first_name} onChange={handleCreateUserChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-title-lg text-on-surface mb-1">Apellido</label>
                  <input required type="text" name="last_name" value={createUserForm.last_name} onChange={handleCreateUserChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-title-lg text-on-surface mb-1">Correo Electrónico</label>
                <input required type="email" name="email" value={createUserForm.email} onChange={handleCreateUserChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-title-lg text-on-surface mb-1">CUIL / CUIT (Opcional)</label>
                  <input type="text" name="cuil" value={createUserForm.cuil} onChange={handleCreateUserChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-title-lg text-on-surface mb-1">Teléfono (Opcional)</label>
                  <input type="text" name="phone" value={createUserForm.phone} onChange={handleCreateUserChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-title-lg text-on-surface mb-1">Especialidad (Opcional)</label>
                  <input type="text" name="specialty" value={createUserForm.specialty} onChange={handleCreateUserChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-title-lg text-on-surface mb-1">Matrícula (Opcional)</label>
                  <input type="text" name="license_number" value={createUserForm.license_number} onChange={handleCreateUserChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-title-lg text-on-surface mb-1">Contraseña</label>
                <div className="flex gap-2">
                  <input readOnly required type="text" name="password" value={createUserForm.password} className="flex-1 bg-surface-variant border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg outline-none font-mono" placeholder="Genera una contraseña..." />
                  <button type="button" onClick={handleGeneratePassword} className="bg-secondary hover:brightness-110 text-on-secondary px-4 py-2 rounded-lg transition-colors font-title-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">key</span> Generar
                  </button>
                  <button type="button" onClick={handleCopyPassword} disabled={!createUserForm.password} className="bg-surface-variant hover:bg-outline-variant/50 disabled:opacity-50 text-on-surface px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-outline-variant/30">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors font-title-lg">
                  Cancelar
                </button>
                <button type="submit" disabled={createLoading} className="bg-primary hover:brightness-110 text-on-primary font-title-lg font-bold px-6 py-2 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed">
                  {createLoading ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-container-high rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-outline-variant/30 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline-md font-bold text-on-surface">Editar Usuario</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-title-lg text-on-surface mb-1">Nombre Completo</label>
                  <input required type="text" name="full_name" value={editUserForm.full_name} onChange={handleEditUserChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-title-lg text-on-surface mb-1">Correo Electrónico</label>
                  <input required type="email" name="email" value={editUserForm.email} onChange={handleEditUserChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-title-lg text-on-surface mb-1">Teléfono (Opcional)</label>
                  <input type="text" name="phone" value={editUserForm.phone} onChange={handleEditUserChange} className="w-full bg-background border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-title-lg text-on-surface mb-1">Contraseña</label>
                  <div className="flex gap-2">
                    <input readOnly type="password" name="password" value={editUserForm.password} className="flex-1 bg-surface-variant border border-outline-variant/50 text-on-surface px-4 py-2 rounded-lg outline-none font-mono" placeholder="Oculta (No se modifica)" />
                    <button type="button" onClick={handleGenerateEditPassword} className="bg-secondary hover:brightness-110 text-on-secondary px-3 py-2 rounded-lg transition-colors font-title-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">key</span>
                    </button>
                    <button type="button" onClick={handleCopyEditPassword} disabled={!editUserForm.password} className="bg-surface-variant hover:bg-outline-variant/50 disabled:opacity-50 text-on-surface px-3 py-2 rounded-lg transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="is_first_login" checked={editUserForm.is_first_login} onChange={handleEditUserChange} className="w-5 h-5 text-primary bg-background border-outline-variant/50 rounded focus:ring-primary" />
                  <span className="text-sm font-title-lg text-on-surface">El usuario debe cambiar la contraseña al iniciar sesión</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-outline-variant/30">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors font-title-lg">
                  Cancelar
                </button>
                <button type="submit" disabled={editLoading} className="bg-primary hover:brightness-110 text-on-primary font-title-lg font-bold px-6 py-2 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed">
                  {editLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Generated Password Modal */}
      {generatedPassword && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-surface-container-high rounded-2xl shadow-2xl p-8 max-w-[520px] w-full text-center border border-outline-variant/30">
            <div className="w-16 h-16 bg-secondary-container/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary/30">
              <span className="material-symbols-outlined text-[32px]">task_alt</span>
            </div>
            <h3 className="text-xl font-headline-md font-bold text-on-surface mb-2">¡Usuario Creado!</h3>
            <p className="text-on-surface-variant mb-6 text-sm">La solicitud fue aceptada. Por favor, envía esta contraseña temporal al médico. Se le pedirá que la cambie al ingresar.</p>
            <div className="bg-surface-container p-4 rounded-lg font-label-sm text-2xl tracking-widest text-primary mb-6 border border-outline-variant/50 user-select-all">
              {generatedPassword}
            </div>
            <button 
              onClick={() => setGeneratedPassword(null)}
              className="bg-primary hover:brightness-110 text-on-primary font-title-lg font-bold px-6 py-2 rounded-lg transition-all shadow-lg shadow-primary/20 w-full"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
