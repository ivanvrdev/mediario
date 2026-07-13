# Resumen del Proyecto: Chat Asistente Médico
# Versión 4 — modelo multiusuario con aislamiento de datos por médico

---

## 1. Análisis de la Problemática

Los médicos independientes enfrentan deficiencias estructurales en la gestión de información clínica durante y después de la consulta:

- **Falta de historial centralizado**: Sin un sistema de gestión, el médico registra sus anotaciones en papel por paciente y no conserva copia de los estudios entregados.
- **Dependencia del paciente como archivo**: Para comparar estudios previos, el paciente debe llevar físicamente todos sus antecedentes a cada consulta, lo que genera riesgos de pérdida y discontinuidad diagnóstica.
- **Ausencia de contexto previo en cada consulta**: El médico debe solicitar al paciente que resuma su enfermedad o motivo de consulta en cada visita, dado que no existe registro accesible del historial.
- **Sin registro de la conversación clínica**: No queda constancia de lo hablado entre médico y paciente durante la consulta, lo que dificulta el seguimiento y la trazabilidad del tratamiento.

---

## 2. Objetivo General

Desarrollar un asistente de chat médico para médicos independientes que centralice el historial clínico del paciente, los estudios adjuntos y el registro de cada consulta, permitiendo al médico interactuar con la información clínica mediante lenguaje natural, reduciendo la dependencia del soporte físico y mejorando la continuidad del cuidado médico. El sistema admite el registro de múltiples médicos, garantizando que cada uno acceda exclusivamente a sus propios pacientes y datos clínicos.

---

## 3. Objetivos Específicos

1. Permitir el registro e inicio de sesión de múltiples médicos, cada uno con acceso aislado a sus propios datos.
2. Permitir al médico registrar digitalmente el análisis y las observaciones de cada consulta por paciente.
3. Habilitar la carga de estudios médicos en formato PDF e imagen (JPG); el sistema extrae y almacena su contenido como texto estructurado, asociándolo al paciente y al médico que lo cargó.
4. Facilitar la comparación de estudios históricos del paciente mediante consultas en lenguaje natural a la IA, sin necesidad de presentarlos físicamente.
5. Registrar la transcripción de la conversación clínica durante la consulta mediante grabación de audio activada desde el chat.
6. Proveer acceso rápido al historial completo del paciente antes o durante la consulta a través de la interfaz de chat.

---

## 4. Límites del Sistema

- El sistema está orientado al uso de **médicos independientes**; no contempla roles diferenciados (enfermería, administración, etc.) ni jerarquías entre usuarios.
- Cada médico registrado accede únicamente a los pacientes que él mismo cargó; no existe visibilidad cruzada entre médicos.
- No se integra con laboratorios, centros de imagen ni sistemas externos de salud.
- No gestiona turnos, facturación ni recetas médicas.
- El acceso al sistema es exclusivo del médico; el paciente no tiene acceso directo.
- Los formatos de entrada admitidos son **PDF y JPG**. El sistema no conserva los archivos originales: almacena únicamente el texto extraído (markdown para PDFs, texto OCR para imágenes).
- La IA responde únicamente en base a la información del paciente cargada en el sistema por el médico activo; no realiza diagnósticos independientes.

---

## 5. Alcances del Sistema

- Registro de nuevos médicos y autenticación individual.
- El chat es la interfaz principal del sistema; todas las interacciones clínicas se realizan desde allí.
- Gestión del perfil de cada paciente con su historial de consultas, visible únicamente para el médico que lo registró.
- Carga de estudios médicos (PDF/JPG) con extracción y almacenamiento automático del contenido como texto.
- Visualización del contenido extraído de los estudios directamente en el chat (markdown renderizado para PDFs, texto OCR para imágenes).
- Comparación de estudios históricos mediante preguntas en lenguaje natural a la IA.
- Grabación y transcripción automática de la conversación médico-paciente durante la consulta.
- Consulta del historial completo de un paciente desde la interfaz de chat.

---

## 6. Requerimientos Funcionales

| ID    | Requerimiento |
|-------|---------------|
| RF01  | El sistema debe permitir crear, editar y consultar el perfil de cada paciente (nombre, fecha de nacimiento, datos de contacto). |
| RF02  | El sistema debe permitir registrar una nueva consulta por paciente con fecha, motivo de consulta, observaciones clínicas y diagnóstico. |
| RF03  | El sistema debe permitir adjuntar uno o más archivos (PDF o JPG) dentro de la sesión de chat; el backend extrae el contenido como texto (PDF→markdown, JPG→OCR) y lo asocia al paciente activo. El archivo original no se conserva. |
| RF04  | El sistema debe permitir visualizar el contenido extraído de los estudios directamente desde la interfaz de chat, renderizando el texto en formato markdown. |
| RF05  | El sistema debe permitir al médico comparar estudios históricos del paciente realizando preguntas en lenguaje natural a la IA dentro del chat. |
| RF06  | El chat debe incluir un botón "Grabar" que active la grabación de audio de la conversación médico-paciente y genere automáticamente una transcripción asociada a la consulta. |
| RF07  | El sistema debe mostrar el historial completo de consultas de un paciente en orden cronológico, accesible desde el chat. |
| RF08  | El sistema debe permitir buscar pacientes por nombre u otro dato identificatorio, mostrando únicamente los pacientes del médico autenticado. |
| RF09  | El sistema debe permitir el registro de nuevos médicos con nombre completo, email y contraseña. El acceso posterior se realiza mediante email y contraseña. |
| RF10  | El chat debe requerir que se seleccione un paciente existente o se cree uno nuevo antes de iniciar una sesión. |
| RF11  | La IA debe analizar el contenido textual de los estudios cargados y el historial previo del paciente, generando un resumen de contexto al iniciar el chat. |
| RF12  | El médico debe poder realizar preguntas en lenguaje natural sobre los datos del paciente activo y recibir respuestas de la IA dentro del chat. |
| RF13  | La IA debe responder basándose exclusivamente en la información del paciente cargada en la sesión y su historial registrado en el sistema. |
| RF14  | La sesión de chat debe guardarse automáticamente como parte del historial del paciente, asociada a la consulta correspondiente. |
| RF15  | El sistema debe garantizar el aislamiento de datos entre médicos: un médico autenticado no puede acceder, visualizar ni modificar los pacientes, consultas ni estudios cargados por otro médico. |

---

## 7. Requerimientos No Funcionales

| ID     | Requerimiento |
|--------|---------------|
| RNF01  | El contenido extraído de los estudios debe transmitirse y almacenarse con cifrado (TLS en tránsito, cifrado en reposo). |
| RNF02  | Los datos del paciente enviados a la IA no deben ser retenidos por el proveedor del modelo más allá de la sesión activa. |
| RNF03  | El sistema debe responder a las consultas del chat en menos de 15 segundos en condiciones normales de red. |
| RNF04  | La interfaz debe ser operable sin capacitación técnica previa por parte del médico. |
| RNF05  | El sistema debe soportar archivos de hasta 10 MB por archivo cargado; la extracción de texto debe completarse en menos de 30 segundos. |
| RNF06  | El sistema debe estar disponible durante el horario de atención médica con un tiempo de caída mensual menor al 1%. |

---

## 8. Decisión de diseño: almacenamiento de estudios como texto

**Contexto:** En la versión inicial se contemplaba conservar los archivos PDF/JPG en el servidor. Para el prototipo mínimo viable se decidió no almacenar los archivos originales.

**Solución adoptada:** al recibir un archivo, el backend extrae su contenido como texto (PDF → markdown estructurado, JPG → texto OCR) y lo persiste en la base de datos. El archivo original se descarta.

**Ventajas:**
- Elimina la necesidad de almacenamiento de archivos (sin Persistent Disk ni object storage).
- El contenido de los estudios queda disponible directamente en el contexto de la IA sin pasos adicionales.
- Simplifica la arquitectura de deploy en Render.com.

**Limitación aceptada para el MVP:** el médico no puede recuperar el archivo original una vez procesado. La visualización es texto renderizado, no el documento original.

---

## 9. Decisión de diseño: modelo multiusuario con aislamiento por médico

**Contexto:** Las versiones anteriores definían el sistema como monousuario (un único médico). A partir de esta versión el sistema admite múltiples médicos registrados.

**Solución adoptada:** cada paciente queda vinculado al médico que lo creó mediante una clave foránea (`doctor_id`) en la tabla `patients`. Todas las consultas y archivos médicos heredan ese aislamiento a través de la relación con el paciente. El backend debe filtrar por el `doctor_id` del médico autenticado en cada operación de lectura y escritura sobre pacientes, consultas y estudios.

**Implicancia en unicidad de DNI:** el DNI es único por médico, no globalmente. Si dos médicos registran al mismo paciente (mismo DNI), cada uno tendrá su propia ficha independiente sin conflicto de unicidad.

**Lo que no cambia:** no existen roles diferenciados ni jerarquías. Todos los usuarios registrados tienen el mismo nivel de acceso sobre sus propios datos.

---

*Documento versión 4 — incorporación de modelo multiusuario con aislamiento de datos por médico.*
