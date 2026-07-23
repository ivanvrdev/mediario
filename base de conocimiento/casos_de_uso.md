# Diagrama de Casos de Uso (Basado en Código Implementado)

A continuación se detalla el diagrama de casos de uso del sistema **Chat Asistente Médico**, reflejando exactamente lo que se encuentra implementado en el código fuente actual (Frontend y Backend).

## Actores del Sistema

- **Administrador:** Actor que gestiona el alta de los médicos al sistema, aprueba solicitudes de ingreso y visualiza las métricas de uso globales.
- **Médico (Usuario):** Actor que utiliza la aplicación para registrar a sus pacientes, crear consultas, subir archivos médicos, y utilizar el chat para interactuar con la IA. El acceso a los datos está fuertemente aislado a sus propios pacientes.
- **Asistente IA / Backend:** Sistema interno que procesa las solicitudes como OCR, extracción de texto en PDFs, transcripción de voz a texto y generación de respuestas usando LLM.

## Diagrama UML

```mermaid
flowchart LR
    %% Estilos de los actores
    classDef actorStyle fill:#f4f4f4,stroke:#333,stroke-width:2px,color:#000;
    
    %% Actores
    Admin((🛠️ Administrador)):::actorStyle
    Medico((👤 Médico)):::actorStyle
    IA((🤖 Asistente IA)):::actorStyle
    
    %% Subsistema Admin
    subgraph Modulo_Admin [Módulo Administrador]
        direction TB
        A_UC1([Iniciar sesión Admin])
        A_UC2([Revisar solicitudes de registro])
        A_UC3([Crear/Editar usuarios médicos])
        A_UC4([Ver estadísticas globales])
    end

    %% Subsistema Gestión de Acceso
    subgraph Gestion_Acceso [Gestión de Acceso (Médicos)]
        direction TB
        M_UC1([Solicitar acceso / Demo])
        M_UC2([Iniciar sesión])
        M_UC3([Cambiar contraseña inicial])
    end

    %% Subsistema Gestión Pacientes y Consultas
    subgraph Gestion_Clinica [Gestión Clínica]
        direction TB
        M_UC4([Crear/Editar paciente])
        M_UC5([Buscar y listar pacientes])
        M_UC6([Crear y editar consultas])
        M_UC7([Ver historial de consultas])
    end

    %% Subsistema Chat y Archivos
    subgraph Sesion_Chat_Archivos [Sesión de Chat y Archivos]
        direction TB
        M_UC8([Subir estudios PDF/JPG])
        M_UC9([Subir audio de consulta])
        M_UC10([Interactuar en Chat con IA])
    end
    
    %% Subsistema Procesos Backend / IA
    subgraph Procesos_Sistema [Procesos Internos / IA]
        direction TB
        SYS1([Extraer texto OCR/PDF])
        SYS2([Transcribir audio a texto])
        SYS3([Generar respuestas de Chat])
    end

    %% Relaciones Admin
    Admin --> A_UC1
    Admin --> A_UC2
    Admin --> A_UC3
    Admin --> A_UC4

    %% Relaciones Médico -> Gestión de Acceso
    Medico --> M_UC1
    Medico --> M_UC2
    Medico --> M_UC3

    %% Relaciones Médico -> Clínica
    Medico --> M_UC4
    Medico --> M_UC5
    Medico --> M_UC6
    Medico --> M_UC7

    %% Relaciones Médico -> Chat
    Medico --> M_UC8
    Medico --> M_UC9
    Medico --> M_UC10

    %% Relaciones <<include>>
    M_UC8 -. << include >> .-> SYS1
    M_UC9 -. << include >> .-> SYS2
    M_UC10 -. << include >> .-> SYS3

    %% Relaciones Sistema -> Actor IA
    SYS1 --- IA
    SYS2 --- IA
    SYS3 --- IA
```

## Descripción de los Casos de Uso Implementados

### Módulo Administrador (`routers/admin.py` y `AdminDashboard.jsx`)
- **Iniciar sesión Admin:** El administrador ingresa con credenciales maestras configuradas por entorno.
- **Revisar solicitudes de registro:** Evalúa las peticiones de los médicos (Demo Requests) pudiendo aceptarlas (lo que genera un usuario y contraseña automática) o rechazarlas.
- **Crear/Editar usuarios médicos:** Posibilidad de dar de alta manualmente a un médico, actualizar sus datos o resetear su contraseña.
- **Ver estadísticas globales:** Visualiza métricas como la cantidad de pacientes y archivos (imágenes, audios, PDFs) gestionados por cada médico.

### Gestión de Acceso (Médicos) (`routers/auth.py` y Frontend Auth)
- **Solicitar acceso / Demo:** El usuario envía sus datos desde la página de inicio (Landing) para que un administrador evalúe su perfil.
- **Iniciar sesión:** Autenticación mediante email y contraseña (JWT).
- **Cambiar contraseña inicial:** Al ingresar por primera vez con la contraseña autogenerada por el administrador, el sistema obliga al médico a establecer una nueva.

### Gestión Clínica (`routers/patients.py` y `routers/consultations.py`)
- **Crear/Editar paciente:** Registro de datos personales de un paciente validando que no se duplique el DNI dentro de la propia agenda del médico.
- **Buscar y listar pacientes:** Obtener el listado de pacientes propios, filtrando por nombre o DNI.
- **Crear y editar consultas:** Registrar el inicio de una consulta médica asignándole motivos, observaciones y diagnósticos preliminares.
- **Ver historial de consultas:** Consultar de forma cronológica todas las sesiones que ha tenido un paciente específico.

### Sesión de Chat y Archivos (`routers/files.py`, `routers/transcriptions.py`, `routers/chat.py`)
- **Subir estudios PDF/JPG:** Adjuntar archivos de historia clínica a una consulta. Esto dispara la extracción (*include*) del texto utilizando procesamiento backend.
- **Subir audio de consulta:** Grabar y subir el audio de la sesión, desencadenando el servicio de transcripción de voz a texto (*include*).
- **Interactuar en Chat con IA:** El médico envía mensajes al asistente sobre el contexto del paciente y la consulta actual, lo cual es respondido por el LLM (*include*).
