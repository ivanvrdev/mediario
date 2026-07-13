import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 md:py-24 flex flex-col items-center text-center">
        <nav className="w-full flex justify-between items-center mb-16 md:mb-24">
          <div className="text-2xl font-headline-md font-bold tracking-tighter text-primary flex items-center gap-2">
            <img src="/logo.png" alt="Mediario" className="w-8 h-8 object-cover rounded-full" />
            Mediario
          </div>
          <Link to="/admin/login" className="text-sm font-medium text-primary hover:text-primary-container transition-colors">
            Administrador
          </Link>
        </nav>

        <main className="max-w-4xl flex flex-col items-center">
          <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wide mb-6 backdrop-blur-sm">
            Desarrollado por Iván V.
          </span>
          <h1 className="text-5xl md:text-7xl font-display-lg font-extrabold tracking-tight mb-8 leading-tight">
            El asistente inteligente para <br className="hidden md:block"/> 
            <span className="text-primary">
              profesionales de la salud.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant mb-12 max-w-2xl leading-relaxed">
            Optimiza tus consultas, gestiona historias clínicas con IA, analiza resultados y transcribe audios automáticamente en un entorno seguro y diseñado exclusivamente para médicos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              to="/request-demo" 
              className="px-8 py-4 rounded-xl bg-primary text-on-primary font-title-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 text-center"
            >
              Solicitar Demo
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-title-lg font-semibold backdrop-blur-md hover:bg-surface-variant hover:scale-105 transition-all duration-300 text-center"
            >
              Iniciar Sesión
            </Link>
          </div>
        </main>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30 backdrop-blur-sm hover:bg-surface-variant transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-[24px]">mic</span>
            </div>
            <h3 className="text-xl font-title-lg font-bold mb-2 text-on-surface">Transcripción de Audios</h3>
            <p className="text-on-surface-variant text-sm">Convierte tus notas de voz en texto estructurado al instante con alta precisión.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30 backdrop-blur-sm hover:bg-surface-variant transition-colors">
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-secondary text-[24px]">description</span>
            </div>
            <h3 className="text-xl font-title-lg font-bold mb-2 text-on-surface">Análisis de Archivos</h3>
            <p className="text-on-surface-variant text-sm">Sube PDFs e imágenes. Nuestra IA extrae los datos clave y te ayuda a analizarlos.</p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30 backdrop-blur-sm hover:bg-surface-variant transition-colors">
            <div className="w-12 h-12 rounded-lg bg-tertiary/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-tertiary text-[24px]">smart_toy</span>
            </div>
            <h3 className="text-xl font-title-lg font-bold mb-2 text-on-surface">Asistente Virtual 24/7</h3>
            <p className="text-on-surface-variant text-sm">Interactúa con un chat inteligente que conoce el historial de tus pacientes.</p>
          </div>
        </div>

        {/* ¿Por qué Mediario? Section */}
        <div className="mt-32 w-full max-w-5xl text-left relative z-10">
          <h2 className="text-3xl md:text-4xl font-display-lg font-bold text-primary mb-12 text-center">¿Por qué Mediario?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
              <h3 className="text-2xl font-title-lg font-bold text-on-surface mb-4">Pensado para Argentina</h3>
              <p className="text-on-surface-variant leading-relaxed text-base md:text-lg">
                Comprende el español utilizado en la práctica médica cotidiana. Nos adaptamos a cómo hablas y escribes en tu consultorio.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/20 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-500"></div>
              <h3 className="text-2xl font-title-lg font-bold text-on-surface mb-4">Hecho para consultorios reales</h3>
              <p className="text-on-surface-variant leading-relaxed text-base md:text-lg">
                Cada función nace de necesidades observadas en el trabajo diario con profesionales de la salud. Soluciones reales a problemas cotidianos.
              </p>
            </div>
          </div>
        </div>

        {/* Seguridad y Privacidad */}
        <div className="mt-32 w-full max-w-5xl text-left relative z-10">
          <div className="p-10 md:p-12 rounded-3xl bg-surface-container border border-primary/20 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-display-lg font-bold text-on-surface mb-6">Seguridad y Privacidad</h2>
                <p className="text-xl text-primary font-medium mb-6">La confianza es fundamental en medicina.</p>
                <p className="text-on-surface-variant mb-8 leading-relaxed text-lg">
                  Por eso Mediario se desarrolla siguiendo principios de:
                </p>
                <ul className="space-y-4 mb-8">
                  {['Privacidad', 'Confidencialidad', 'Seguridad', 'Transparencia', 'Uso responsable de Inteligencia Artificial'].map((item, index) => (
                    <li key={index} className="flex items-center gap-4 text-on-surface text-lg font-medium">
                      <span className="material-symbols-outlined text-secondary text-2xl">verified_user</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 inline-block">
                  <p className="text-primary font-medium text-lg">El médico mantiene siempre el control sobre la información y las decisiones clínicas.</p>
                </div>
              </div>
              <div className="hidden md:flex w-72 h-72 rounded-full bg-surface-container-highest border border-outline-variant/30 items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-[spin_12s_linear_infinite]"></div>
                <div className="absolute inset-4 rounded-full border-4 border-secondary/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                <span className="material-symbols-outlined text-8xl text-primary">shield_locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desarrollado en Formosa */}
        <div className="mt-32 w-full max-w-5xl relative z-10">
          <div className="p-10 md:p-16 rounded-3xl bg-surface-container-low border border-tertiary/20 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-tertiary/10 via-transparent to-transparent pointer-events-none"></div>
             
             <h2 className="text-3xl md:text-5xl font-display-lg font-extrabold text-on-surface mb-6 relative z-10">Desarrollado en Formosa</h2>
             <h3 className="text-xl md:text-2xl font-title-lg font-medium text-tertiary mb-8 relative z-10">Tecnología creada desde el norte argentino</h3>
             <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto mb-8 leading-relaxed relative z-10">
               Mediario nace en Formosa con un objetivo muy claro: <span className="text-on-surface font-bold">Acercar herramientas de Inteligencia Artificial útiles, prácticas y accesibles a los profesionales de la salud.</span>
             </p>
             <p className="text-lg md:text-xl text-on-surface relative z-10 font-medium">
               Conocemos la realidad del sistema sanitario local porque formamos parte de él.
             </p>
          </div>
        </div>

        {/* Sobre el desarrollador */}
        <div className="mt-32 w-full max-w-5xl mb-24 relative z-10">
          <h2 className="text-3xl md:text-4xl font-display-lg font-bold text-primary mb-16 text-center">Sobre el desarrollador</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start bg-surface-container-low border border-outline-variant/30 p-8 md:p-12 rounded-3xl">
            <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-56 h-56 rounded-[2rem] bg-surface-container-highest border border-outline-variant/30 overflow-hidden mb-6 flex items-center justify-center shadow-xl">
                 <img src="/desarrollador.jpeg" alt="Iván Vázquez" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-3xl font-display-lg font-bold text-on-surface mb-2">Iván Vázquez</h3>
              <p className="text-primary text-lg font-medium mb-4">Desarrollador de software formoseño</p>
              <div className="w-16 h-1.5 bg-primary/50 rounded-full mb-6 mx-auto md:mx-0"></div>
              <p className="text-base text-on-surface-variant">Especializado en soluciones para el sector salud.</p>
            </div>
            <div className="md:col-span-3 space-y-6 text-on-surface-variant leading-relaxed text-lg">
              <p>
                Trabajo hace más de cuatro años en el Centro de Medicina Nuclear y Radioterapia de Formosa, participando en el desarrollo y mantenimiento de sistemas utilizados por profesionales de distintas áreas médicas.
              </p>
              <p>
                Esa experiencia me permitió conocer de primera mano cómo trabajan médicos, técnicos y personal administrativo, entendiendo cuáles son los procesos que consumen más tiempo y dónde la tecnología puede generar un impacto real.
              </p>
              <div className="p-8 rounded-2xl bg-surface-container border-l-4 border-l-primary italic shadow-lg">
                "Mediario surge justamente de esa experiencia. No fue pensado desde un escritorio ni inspirado únicamente por la Inteligencia Artificial. Fue construido a partir de necesidades reales observadas todos los días dentro de una institución de salud."
              </div>
              <p className="text-on-surface font-semibold text-xl pt-4">
                Mi objetivo es desarrollar herramientas que permitan a los médicos dedicar menos tiempo a tareas administrativas y más tiempo a sus pacientes.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;
