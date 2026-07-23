import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';

// ── Modal: Nuevo Paciente ──────────────────────────────────────────────────────
function NewPatientModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ full_name: '', dni: '', birth_date: '', gender: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/patients/', form);
      onCreated(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear el paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-md sm:p-lg shadow-2xl w-full max-w-[520px] mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar animate-fadeIn">
        <header className="mb-lg flex items-center justify-between">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">Registro de Paciente</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Complete los datos para crear la ficha clínica.</p>
          </div>
          <button onClick={onClose} className="p-xs hover:bg-surface-variant rounded-full transition-colors text-outline-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {error && <div className="mb-sm text-error bg-error-container/20 p-sm rounded-lg border border-error/50 text-body-md">{error}</div>}

        <form onSubmit={submit} className="space-y-sm">
          {[
            { name: 'full_name', label: 'Nombre y Apellido', icon: 'person', type: 'text', required: true, placeholder: 'Ej. Juan Pérez' },
            { name: 'dni', label: 'DNI', icon: 'badge', type: 'text', required: false, placeholder: '00.000.000' },
            { name: 'birth_date', label: 'Fecha de nacimiento', icon: 'calendar_today', type: 'date', required: false },
            { name: 'gender', label: 'Sexo', icon: 'wc', type: 'text', required: false, placeholder: 'Masculino, Femenino, Otro' },
            { name: 'phone', label: 'Teléfono', icon: 'phone', type: 'tel', required: false, placeholder: '+54 000 000 000' },
          ].map(({ name, label, icon, type, required, placeholder }) => (
            <div key={name} className="flex flex-col gap-xs">
              <label className="text-sm text-on-surface font-medium">{label}</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">{icon}</span>
                <input
                  name={name} type={type} required={required} placeholder={placeholder}
                  value={form[name]} onChange={handle}
                  className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-11 pr-4 py-3 text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                />
              </div>
            </div>
          ))}

          <div className="flex gap-sm pt-md">
            <button type="button" onClick={onClose} className="flex-1 px-lg py-3 rounded-lg border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-highest transition-colors active:scale-[0.98]">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-lg py-3 rounded-lg bg-primary text-on-primary text-sm font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal: Contexto del Paciente ─────────────────────────────────────────────
function PatientContextModal({ patient, lastSummary, onClose }) {
  if (!patient) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-md sm:p-lg shadow-2xl w-full max-w-[600px] mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar animate-fadeIn relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-xs hover:bg-surface-variant rounded-full transition-colors text-outline-variant">
          <span className="material-symbols-outlined">close</span>
        </button>
        <header className="mb-md pr-8 border-b border-outline-variant/20 pb-sm">
          <h2 className="font-headline-md text-headline-md font-bold text-primary">{patient.full_name}</h2>
          {patient.dni && <p className="text-label-sm text-outline">DNI: {patient.dni}</p>}
        </header>
        <div className="mb-md">
          <span className="text-label-sm font-bold text-on-surface uppercase tracking-wider block mb-1">Cuadro General del Paciente</span>
          <p className="text-body-md text-on-surface-variant">{patient.notes || 'No hay notas o diagnósticos generales registrados.'}</p>
        </div>
        {lastSummary && (
          <div className="border-t border-outline-variant/20 pt-sm mt-xs">
            <span className="text-label-sm font-bold text-primary block mb-1">Resumen Última Sesión</span>
            <p className="text-body-md text-on-surface-variant italic">{lastSummary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Modal: Editar Consulta ─────────────────────────────────────────────────────
function EditConsultationModal({ consultation, onClose, onSaved }) {
  const [form, setForm] = useState({
    reason: consultation?.reason || '',
    observations: consultation?.observations || '',
    diagnosis: consultation?.diagnosis || '',
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch(`/consultations/${consultation.id}`, form);
      onSaved(data);
      onClose();
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-md sm:p-lg shadow-2xl w-full max-w-[560px] mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <header className="mb-lg flex items-center justify-between">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">Datos de la Consulta</h2>
            <p className="text-body-md text-on-surface-variant">Puede completar estos campos durante o después de la consulta.</p>
          </div>
          <button onClick={onClose} className="p-xs hover:bg-surface-variant rounded-full transition-colors text-outline-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        <form onSubmit={submit} className="space-y-sm">
          {[
            { name: 'reason', label: 'Motivo de consulta', rows: 2 },
            { name: 'observations', label: 'Observaciones clínicas', rows: 3 },
            { name: 'diagnosis', label: 'Diagnóstico', rows: 2 },
          ].map(({ name, label, rows }) => (
            <div key={name} className="flex flex-col gap-xs">
              <label className="text-sm text-on-surface font-medium">{label}</label>
              <textarea
                name={name} rows={rows}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
              />
            </div>
          ))}
          <div className="flex gap-sm pt-md">
            <button type="button" onClick={onClose} className="flex-1 px-lg py-3 rounded-lg border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-highest transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-lg py-3 rounded-lg bg-primary text-on-primary text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal: Historial de Sesiones ─────────────────────────────────────────────
function SessionsHistoryModal({ patientId, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState(null);

  const fetchSessions = useCallback(async () => {
    try {
      const { data } = await api.get(`/consultations/?patient_id=${patientId}`);
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-md sm:p-lg shadow-2xl w-full max-w-[800px] max-h-[90vh] h-[80vh] flex flex-col mx-4">
        <header className="mb-md flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">Historial de Sesiones</h2>
            <p className="text-body-md text-on-surface-variant">Revisión de sesiones previas del paciente.</p>
          </div>
          <button onClick={onClose} className="p-xs hover:bg-surface-variant rounded-full transition-colors text-outline-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-md">
          {loading ? (
            <p className="text-center text-outline-variant mt-10">Cargando...</p>
          ) : sessions.length === 0 ? (
            <p className="text-center text-outline-variant mt-10">No hay sesiones registradas.</p>
          ) : (
            sessions.map(session => (
              <div key={session.id} className="border border-outline-variant/30 rounded-xl p-md bg-surface-container-low">
                <div className="flex justify-between items-start mb-sm">
                  <span className="text-label-lg font-bold text-on-surface">
                    Fecha: {new Date(session.date).toLocaleString()}
                  </span>
                  <div className="flex gap-sm">
                    <span className="text-label-sm px-xs py-1 bg-surface-variant rounded text-on-surface-variant" title="Archivos adjuntos">
                      <span className="material-symbols-outlined text-[16px] align-middle mr-1">attach_file</span>{session.files_count || 0}
                    </span>
                    <span className="text-label-sm px-xs py-1 bg-surface-variant rounded text-on-surface-variant" title="Notas de voz">
                      <span className="material-symbols-outlined text-[16px] align-middle mr-1">mic</span>{session.transcripts_count || 0}
                    </span>
                  </div>
                </div>
                {session.summary && (
                  <div className="mb-sm">
                    <span className="text-label-sm font-bold text-primary block mb-1">Resumen (IA):</span>
                    <p className="text-body-md text-on-surface-variant italic border-l-2 border-primary/50 pl-2">{session.summary}</p>
                  </div>
                )}

                {editingSession === session.id ? (
                  <EditConsultationModal
                    consultation={session}
                    onClose={() => setEditingSession(null)}
                    onSaved={() => {
                      setEditingSession(null);
                      fetchSessions();
                    }}
                  />
                ) : (
                  <div className="mt-sm flex gap-sm">
                    <button
                      onClick={() => setEditingSession(session.id)}
                      className="text-label-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span> Editar Diagnóstico / Notas
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Bubble de Chat ─────────────────────────────────────────────────────────────
function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  
  let displayContent = msg.content || '';
  if (isUser) {
    if (displayContent.startsWith('**Archivo subido:')) {
      const parts = displayContent.split('\n\n');
      if (parts.length > 1) {
        const header = parts[0];
        let body = parts.slice(1).join('\n\n');
        // Unir líneas/palabras rotas del PDF: si no hay puntuación al final, unir con espacio
        body = body.replace(/([^.:;!?>\]*])\n+(?![*-]\s|\d+\.\s)/g, '$1 ');
        displayContent = `${header}\n\n${body}`;
      }
    } else if (!displayContent.startsWith('**Transcripción')) {
      // Convertir saltos simples tipeados por el usuario a saltos markdown (2 espacios + \n)
      displayContent = displayContent.replace(/([^\n])\n([^\n])/g, '$1  \n$2');
    }
  }

  return (
    <div className={`flex gap-xs sm:gap-md w-full items-start ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px]">psychology</span>
        </div>
      )}
      <div className={`max-w-[88%] sm:max-w-[80%] p-sm sm:p-md ${isUser ? 'bg-primary/10 border border-primary/40 rounded-2xl rounded-tr-none' : 'glass-panel rounded-2xl rounded-tl-none'}`}>
        <div className="prose prose-invert prose-sm max-w-none text-on-surface text-body-md sm:text-body-lg leading-relaxed overflow-x-auto">
          <ReactMarkdown>{displayContent}</ReactMarkdown>
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary-container/20 border border-secondary-container/30 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-secondary text-[18px] sm:text-[20px]">medical_information</span>
        </div>
      )}
    </div>
  );
}

// ── Página Principal: Chat ─────────────────────────────────────────────────────
export default function Chat() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [activePatient, setActivePatient] = useState(null);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showEditConsultation, setShowEditConsultation] = useState(false);
  const [showSessionsHistory, setShowSessionsHistory] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [recording, setRecording] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [lastSummary, setLastSummary] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => setCurrentUser(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (patientId) {
      setShowContextModal(true);
      api.get(`/consultations/?patient_id=${patientId}`).then(res => {
         const closedSession = res.data.find(s => s.summary);
         if (closedSession) setLastSummary(closedSession.summary);
         else setLastSummary('');
      }).catch(err => console.error(err));
    }
  }, [patientId]);

  // Load patients list
  const loadPatients = useCallback(async (q = '') => {
    try {
      const { data } = await api.get('/patients/', { params: q ? { search: q } : {} });
      setPatients(data);
    } catch {
      // token expired → interceptor redirects to login
    }
  }, []);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  useEffect(() => {
    const debounce = setTimeout(() => loadPatients(search), 300);
    return () => clearTimeout(debounce);
  }, [search, loadPatients]);

  // Load patient + consultation when patientId changes
  useEffect(() => {
    if (!patientId) {
      setActivePatient(null);
      setActiveConsultation(null);
      setMessages([]);
      return;
    }
    (async () => {
      try {
        const { data: patient } = await api.get(`/patients/${patientId}`);
        setActivePatient(patient);

        // Trigger a dummy chat call that auto-creates or fetches the active consultation
        // We do GET consultations first to find an active one
        const { data: consList } = await api.get('/consultations/', { params: { patient_id: patientId } });
        if (consList.length > 0) {
          const latest = consList[0];
          setActiveConsultation(latest);
          setMessages(latest.chat_log || []);
        } else {
          setActiveConsultation(null);
          setMessages([]);
        }
      } catch {
        navigate('/chat');
      }
    })();
  }, [patientId, navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Send message to Gemini
  const sendMessage = async () => {
    const text = inputMsg.trim();
    if (!text || chatLoading || !patientId) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setChatLoading(true);

    try {
      const { data } = await api.post('/chat/', { patient_id: patientId, message: text });
      setMessages(data.chat_log);
      // Update active consultation after first message (auto-created)
      if (!activeConsultation) {
        const { data: consList } = await api.get('/consultations/', { params: { patient_id: patientId } });
        if (consList.length > 0) setActiveConsultation(consList[0]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: `⚠️ Error al obtener respuesta: ${err.response?.data?.detail || err.message}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // File upload to Gemini extractor
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !patientId) return;
    setFileUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patientId);
    if (activeConsultation) formData.append('consultation_id', activeConsultation.id);

    try {
      const { data } = await api.post('/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (!activeConsultation && data.consultation_id) {
        setActiveConsultation({ id: data.consultation_id, chat_log: [] });
      }
      
      if (data.patient_notes) {
        setActivePatient(prev => prev ? { ...prev, notes: data.patient_notes } : prev);
      }
      
      if (data.chat_log) {
        setMessages(data.chat_log);
      } else {
        // Show extracted content inline in chat as a system message
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            content: `**Archivo subido: ${data.original_name}**\n\n${data.content_text}`,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: `⚠️ Error al procesar el archivo: ${err.response?.data?.detail || err.message}` },
      ]);
    } finally {
      setFileUploading(false);
      e.target.value = '';
    }
  };

  // Audio recording (WebRTC MediaRecorder → Groq Whisper)
  const toggleRecording = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        formData.append('patient_id', patientId);
        if (activeConsultation) formData.append('consultation_id', activeConsultation.id);

        setMessages((prev) => [...prev, { role: 'user', content: 'Transcribiendo audio...' }]);
        try {
          const { data } = await api.post('/transcriptions/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (!activeConsultation && data.consultation_id) {
            setActiveConsultation({ id: data.consultation_id, chat_log: [] });
          }
          
          if (data.patient_notes) {
            setActivePatient(prev => prev ? { ...prev, notes: data.patient_notes } : prev);
          }
          
          if (data.chat_log) {
            setMessages(data.chat_log);
          } else {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'user',
                content: `**Transcripción de audio:**\n\n${data.transcript}`,
              };
              return updated;
            });
          }
        } catch (err) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'model',
              content: `⚠️ Error en la transcripción: ${err.response?.data?.detail || err.message}`,
            };
            return updated;
          });
        }
      };

      mediaRecorder.start(500);
      setRecording(true);
    } catch {
      alert('No se pudo acceder al micrófono. Verifique los permisos del navegador.');
    }
  };

  const filteredPatients = patients;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden animate-fadeIn"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-[280px] h-full bg-surface-container border-r border-outline-variant/30 flex flex-col p-md shrink-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="mb-lg flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <img src="/logo.png" alt="Mediario Logo" className="w-10 h-10 object-cover rounded-full shrink-0" />
            <h1 className="text-title-lg font-title-lg text-on-surface">Mediario</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-xs hover:bg-surface-variant rounded-full text-outline-variant transition-colors"
            title="Cerrar menú"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-sm px-xs">
          <h2 className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Pacientes</h2>
        </div>

        <nav className="flex-1 flex flex-col gap-xs overflow-y-auto custom-scrollbar">
          <button
            onClick={() => {
              setShowNewPatient(true);
              setSidebarOpen(false);
            }}
            className="flex items-center gap-sm bg-primary text-on-primary font-body-md text-body-md px-sm py-xs rounded-xl hover:opacity-90 transition-all scale-98-active mb-md"
          >
            <span className="material-symbols-outlined">add</span>
            Nuevo paciente
          </button>

          <div className="flex items-center gap-xs px-sm py-xs bg-surface-container-lowest rounded-lg border border-outline-variant/20 mb-sm">
            <span className="material-symbols-outlined text-outline text-[18px]">search</span>
            <input
              type="text" placeholder="Buscar..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-body-md text-on-surface w-full outline-none"
            />
          </div>

          {filteredPatients.length === 0 && (
            <p className="text-outline text-body-md px-sm mt-sm">No hay pacientes registrados.</p>
          )}

          {filteredPatients.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                navigate(`/chat/${p.id}`);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-sm w-full text-left px-sm py-xs rounded-lg transition-colors ${p.id === patientId ? 'sidebar-active' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-body-md text-body-md font-medium text-on-surface truncate">{p.full_name}</p>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-[11px] text-outline truncate">DNI: {p.dni || 'S/D'}</span>
                  <span className="text-[10px] text-outline-variant whitespace-nowrap ml-1">{p.last_message_date ? new Date(p.last_message_date).toLocaleDateString() : ''}</span>
                </div>
              </div>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-outline-variant/20 pt-md px-xs">
          <div className="flex items-center gap-sm p-sm rounded-xl bg-surface-container-lowest justify-between">
            <div className="flex items-center gap-sm overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-secondary-container text-[18px]">account_circle</span>
              </div>
              <p className="font-label-sm text-[12px] text-on-surface truncate">
                {currentUser?.full_name || currentUser?.email?.split('@')[0] || 'Mi cuenta'}
              </p>
            </div>
            <button onClick={handleLogout} title="Cerrar sesión" className="hover:text-primary text-outline-variant transition-colors shrink-0">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden w-full">
        {/* Top Bar */}
        <header className="sticky top-0 w-full h-16 flex items-center justify-between px-sm sm:px-md md:px-lg bg-surface border-b border-outline-variant/30 z-10 shrink-0">
          <div className="flex items-center gap-xs sm:gap-md overflow-hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-xs text-on-surface hover:bg-surface-variant rounded-lg md:hidden shrink-0"
              title="Abrir menú de pacientes"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {activePatient ? (
              <div className="overflow-hidden">
                <div className="flex items-center gap-xs">
                  <h2 className="font-headline-md text-title-lg sm:text-headline-md font-bold text-on-surface leading-tight truncate max-w-[140px] sm:max-w-[240px] md:max-w-none">
                    {activePatient.full_name}
                  </h2>
                  <button onClick={() => setShowContextModal(true)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors shrink-0" title="Información del paciente">
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px]">info</span>
                  </button>
                </div>
                {activePatient.dni && (
                  <p className="text-label-sm text-outline truncate">DNI: {activePatient.dni}</p>
                )}
              </div>
            ) : (
              <h2 className="font-headline-md text-title-lg sm:text-headline-md font-bold text-on-surface truncate">Seleccione un paciente</h2>
            )}
          </div>

          <div className="flex items-center gap-xs sm:gap-sm shrink-0">
            {activePatient && (
              <>
                <button
                  onClick={() => setShowSessionsHistory(true)}
                  className="flex items-center gap-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant p-xs sm:px-sm sm:py-xs rounded-lg transition-colors"
                  title="Sesiones"
                >
                  <span className="material-symbols-outlined text-[20px] sm:text-[24px]">history</span>
                  <span className="text-body-md hidden md:block">Sesiones</span>
                </button>
                <button
                  onClick={() => navigate(`/patient/${patientId}/files`)}
                  className="flex items-center gap-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant p-xs sm:px-sm sm:py-xs rounded-lg transition-colors"
                  title="Archivos"
                >
                  <span className="material-symbols-outlined text-[20px] sm:text-[24px]">folder</span>
                  <span className="text-body-md hidden md:block">Archivos</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Chat Messages */}
        <section className="flex-1 overflow-y-auto py-md sm:py-lg px-xs sm:px-md md:px-xl custom-scrollbar flex flex-col">
          <div className="max-w-[960px] mx-auto w-full flex flex-col gap-md sm:gap-lg pb-36 sm:pb-40 flex-1">
            {!patientId && (
              <div className="flex flex-col items-center justify-center h-full my-auto text-center px-sm">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-primary/20 flex items-center justify-center mb-md overflow-hidden shadow-lg">
                  <img src="/logo.png" alt="Mediario Logo" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Bienvenido a Mediario</h3>
                <p className="text-body-md sm:text-body-lg text-outline-variant max-w-md mx-auto">Seleccione un paciente en la barra lateral para comenzar a chatear con el asistente de IA.</p>
              </div>
            )}

            {patientId && messages.length === 0 && !chatLoading && (
              <div className="flex flex-col items-center justify-center mt-16 text-center px-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-primary text-4xl">psychology</span>
                </div>
                <p className="text-body-lg text-outline-variant">Escribe el primer mensaje para iniciar la sesión clínica con IA.</p>
              </div>
            )}

            {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}

            {chatLoading && (
              <div className="flex gap-xs sm:gap-md items-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px]">psychology</span>
                </div>
                <div className="glass-panel rounded-2xl rounded-tl-none p-sm sm:p-md flex items-center gap-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-body-md text-outline">Procesando...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </section>

        {/* Input Bar */}
        {patientId && (
          <footer className="absolute bottom-0 left-0 w-full p-2 sm:p-md md:p-lg bg-gradient-to-t from-background via-background/95 to-transparent">
            <div className="max-w-[960px] mx-auto">
              {fileUploading && (
                <div className="mb-xs sm:mb-sm flex items-center gap-xs text-body-md text-primary px-sm">
                  <span className="material-symbols-outlined text-[18px] animate-pulse">upload_file</span>
                  Procesando archivo con IA...
                </div>
              )}
              {recording && (
                <div className="mb-xs sm:mb-sm flex items-center gap-xs text-body-md text-error px-sm">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse inline-block" />
                  Grabando... Haz clic en el micrófono para detener
                </div>
              )}
              <div className="glass-panel rounded-2xl flex items-center gap-xs sm:gap-sm p-xs sm:p-sm shadow-xl">
                {/* File upload */}
                <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={fileUploading}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-surface-variant transition-colors text-outline-variant disabled:opacity-40 shrink-0"
                  title="Adjuntar archivo (PDF texto o JPG escaneado)"
                >
                  <span className="material-symbols-outlined text-[20px] sm:text-[24px]">attach_file</span>
                </button>

                <input
                  type="text"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm sm:text-body-lg text-on-surface placeholder:text-outline/60 outline-none min-w-0"
                  placeholder="Escribe un mensaje..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  disabled={chatLoading}
                />

                <div className="flex items-center gap-xs shrink-0">
                  {/* Mic / Stop Recording */}
                  <button
                    onClick={toggleRecording}
                    className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-colors ${recording ? 'bg-error/20 text-error hover:bg-error/30' : 'hover:bg-surface-variant text-outline-variant'}`}
                    title={recording ? 'Detener grabación' : 'Grabar audio de la consulta'}
                  >
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px]">{recording ? 'stop_circle' : 'mic'}</span>
                  </button>

                  {/* Send */}
                  <button
                    onClick={sendMessage}
                    disabled={chatLoading || !inputMsg.trim()}
                    className="bg-primary text-on-primary p-xs sm:p-sm rounded-xl scale-98-active transition-all flex items-center justify-center disabled:opacity-40 w-9 h-9 sm:w-10 sm:h-10"
                  >
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px]">send</span>
                  </button>
                </div>
              </div>
            </div>
          </footer>
        )}
      </main>

      {/* ── Modals ── */}
      {showNewPatient && (
        <NewPatientModal
          onClose={() => setShowNewPatient(false)}
          onCreated={(patient) => {
            setPatients((prev) => [patient, ...prev]);
            navigate(`/chat/${patient.id}`);
          }}
        />
      )}

      {showSessionsHistory && patientId && (
        <SessionsHistoryModal
          patientId={patientId}
          onClose={() => setShowSessionsHistory(false)}
        />
      )}

      {showContextModal && activePatient && (
        <PatientContextModal
          patient={activePatient}
          lastSummary={lastSummary}
          onClose={() => setShowContextModal(false)}
        />
      )}

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px]" />
      </div>
    </div>
  );
}
