import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

export default function PatientFiles() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // for preview modal
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!patientId) return;
    api.get(`/patients/${patientId}`).then(({ data }) => setPatient(data)).catch(() => {});
    loadFiles();
  }, [patientId]);

  const loadFiles = async () => {
    try {
      const { data } = await api.get('/files/', { params: { patient_id: patientId } });
      setFiles(data);
    } catch {}
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patientId);

    try {
      await api.post('/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await loadFiles();
    } catch (err) {
      alert(`Error al subir: ${err.response?.data?.detail || err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface border-b border-outline-variant/30">
        <div className="flex items-center gap-sm">
          <Link to={`/chat/${patientId}`} className="p-xs hover:bg-surface-variant/50 transition-colors rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary leading-tight">Archivos Clínicos</h1>
            {patient && <p className="font-label-sm text-[11px] text-outline">{patient.full_name}</p>}
          </div>
        </div>
      </header>

      <main className="mt-16 flex-1 flex justify-center p-lg">
        <div className="w-full max-w-[960px] space-y-lg">

          {/* Patient Info */}
          {patient && (
            <section className="glass-panel rounded-xl p-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {[
                  { label: 'Nombre y Apellido', value: patient.full_name },
                  { label: 'DNI', value: patient.dni || '—' },
                  { label: 'Teléfono', value: patient.phone || '—' },
                  { label: 'Fecha de nacimiento', value: patient.birth_date ? formatDate(patient.birth_date) : '—' },
                  { label: 'Sexo', value: patient.gender || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-base">
                    <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">{label}</p>
                    <p className="font-title-lg text-title-lg text-on-surface">{value}</p>
                  </div>
                ))}
              </div>
              {patient.notes && (
                <div className="mt-md pt-md border-t border-outline-variant/20">
                  <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-xs">Notas Clínicas Generales</p>
                  <p className="text-body-lg text-on-surface">{patient.notes}</p>
                </div>
              )}
            </section>
          )}

          {/* Files Section */}
          <section className="space-y-sm">
            <div className="flex items-center justify-between px-xs">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Archivos subidos</h2>
                <p className="text-body-md text-outline">{files.length} archivo{files.length !== 1 ? 's' : ''} en total</p>
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg" onChange={handleUpload} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-primary text-on-primary px-sm py-xs rounded-lg hover:brightness-110 flex items-center gap-xs transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">{uploading ? 'hourglass_top' : 'upload'}</span>
                  {uploading ? 'Procesando...' : 'Subir Archivo'}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              {files.length === 0 && !uploading && (
                <div className="text-center py-xl text-outline-variant">
                  <span className="material-symbols-outlined text-5xl mb-md">folder_open</span>
                  <p className="text-body-lg">No hay archivos cargados para este paciente.</p>
                  <p className="text-body-md mt-xs">Suba un PDF (texto) o JPG (escaneado) para que la IA lo analice.</p>
                </div>
              )}

              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-sm rounded-lg border border-outline-variant/20 bg-surface-container-low hover:bg-surface-variant/30 transition-all group"
                >
                  <div className="flex items-center gap-sm overflow-hidden">
                    <div className={`w-10 h-10 flex items-center justify-center rounded shrink-0 ${file.source_type === 'pdf' ? 'bg-primary/10 text-primary' : file.source_type === 'audio' ? 'bg-tertiary-container/20 text-tertiary-container' : 'bg-secondary/10 text-secondary'}`}>
                      <span className="material-symbols-outlined">{file.source_type === 'pdf' ? 'description' : file.source_type === 'audio' ? 'mic' : 'image'}</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-on-surface font-body-lg text-body-lg truncate">{file.original_name}</p>
                      <p className="text-on-surface-variant font-label-sm text-label-sm">
                        {file.source_type === 'audio' ? 'TRANSCRIPCIÓN DE AUDIO' : file.source_type.toUpperCase()} • Subido el {formatDate(file.uploaded_at)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedFile(file)}
                    className="shrink-0 flex items-center gap-xs text-outline-variant group-hover:text-primary transition-colors px-sm py-xs rounded-lg hover:bg-surface-variant"
                    title="Ver contenido extraído"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                    <span className="text-body-md hidden md:block">Ver</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-md">
          <div className="bg-surface-container border border-outline-variant/30 rounded-2xl w-full max-w-[720px] max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-md border-b border-outline-variant/20 shrink-0">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface">{selectedFile.original_name}</h3>
                <p className="text-body-md text-outline">Contenido extraído por IA</p>
              </div>
              <button onClick={() => setSelectedFile(null)} className="p-xs hover:bg-surface-variant rounded-full transition-colors text-outline-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="overflow-y-auto p-md custom-scrollbar">
              <pre className="text-body-md text-on-surface-variant whitespace-pre-wrap font-mono text-[13px] leading-relaxed">
                {selectedFile.content_text}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
