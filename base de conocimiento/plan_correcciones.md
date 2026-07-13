# Plan de Correcciones — Flujo de Chat y Arquitectura
# Generado a partir del análisis de inconsistencias de los documentos del proyecto

---

## Cómo usar este documento

- `[ ]` pendiente
- `[~]` en progreso
- `[x]` completado

Cada corrección incluye: qué documento(s) modificar, qué cambiar y por qué.

---

## C01 — Schema SQL desactualizado en `arquitectura_sistema_v2.md`

**Severidad:** Alta
**Documento a corregir:** `arquitectura_sistema_v2.md` (sección 6)
**Estado:** [x]

**Problema:**
La sección 6 del documento de arquitectura contiene un schema SQL de la versión anterior (v1). Tiene dos errores concretos:

1. La tabla `users` define `username VARCHAR(100) UNIQUE` en lugar de `email VARCHAR(254) UNIQUE`.
2. La tabla `patients` no incluye los campos `doctor_id`, `dni`, `gender` ni `phone`, que son parte del modelo multiusuario definido en `estructura_base_datos_v2.md`.

Si alguien ejecuta las migraciones desde este archivo, el esquema resultante es incompatible con el modelo de aislamiento por médico (RF15).

**Corrección requerida:**
Reemplazar la sección 6 de `arquitectura_sistema_v2.md` con el schema SQL canónico que ya está correctamente definido en `estructura_base_datos_v2.md`. Alternativamente, eliminar la sección 6 del documento de arquitectura y agregar una referencia explícita a `estructura_base_datos_v2.md` como fuente única del schema.

---

## C02 — Ciclo de vida de la consulta activa antes del chat

**Severidad:** Alta
**Documentos a corregir:** `arquitectura_sistema_v2.md` (sección 8), `tareas_desarrollo_mvp.md` (Fase 5 y Fase 6)
**Estado:** [x]

**Problema:**
El flujo del chat (sección 8 de arquitectura) indica que al finalizar el intercambio se guarda `chat_log` en `consultations`. Pero nunca se especifica cuándo ni cómo se crea la consulta activa a la que se asocia ese log.

La Fase 5 describe `POST /consultations` con campos clínicos (reason, observations, diagnosis), lo que sugiere creación manual por el médico. La Fase 6 arranca el flujo de chat sin mencionar que la consulta debe preexistir. Si el médico inicia un chat sin haber creado una consulta, RF14 falla silenciosamente o el backend no tiene dónde escribir el `chat_log`.

**Corrección requerida:**
Definir y documentar explícitamente una de estas dos opciones (y actualizar ambos documentos en consecuencia):

- **Opción A:** La consulta se crea automáticamente al iniciar una sesión de chat (al seleccionar el paciente o al enviar el primer mensaje). El `POST /chat` crea la consulta si no existe una activa.
- **Opción B:** El médico debe crear la consulta manualmente antes de iniciar el chat. El frontend debe bloquear el input del chat hasta que exista una consulta activa y guiar al médico a crearla.

Agregar la decisión al flujo del chat en `arquitectura_sistema_v2.md` sección 8, y reflejarla como tarea explícita en `tareas_desarrollo_mvp.md`.

**Resolución:** Se adoptó la Opción A. La consulta se crea automáticamente al iniciar la sesión de chat; `POST /chat` la crea si no existe una activa para el paciente. Documentado en `arquitectura_sistema_v2.md` sección 8.1, y reflejado en Fase 5 y Fase 6 de `tareas_desarrollo_mvp.md`.

---

## C03 — Sin estrategia de límite de tokens para el context string

**Severidad:** Alta
**Documentos a corregir:** `arquitectura_sistema_v2.md` (sección 8), `tareas_desarrollo_mvp.md` (Fase 6)
**Estado:** [x]

**Problema:**
El backend carga `content_text` de todos los estudios del paciente más el historial completo de consultas y los concatena en un único context string enviado al modelo. No hay ningún mecanismo documentado de truncado, paginación ni priorización. Un paciente con historial extenso o varios estudios puede superar el límite de tokens del proveedor de IA, causando errores en tiempo de ejecución sin que el sistema los anticipe.

**Corrección requerida:**
Definir y documentar una estrategia de manejo del contexto. Como mínimo para el MVP:

1. Establecer un límite máximo de caracteres (o tokens estimados) para el context string.
2. Definir la política de priorización cuando se supera el límite (por ejemplo: incluir siempre las N consultas más recientes y los M estudios más recientes, descartando los más antiguos).
3. Agregar en `tareas_desarrollo_mvp.md` Fase 6 una tarea explícita para implementar ese límite en el endpoint `POST /chat`.

Documentar los límites elegidos en `arquitectura_sistema_v2.md` sección 8.

**Resolución:** Se incluyen como máximo las N consultas y M estudios más recientes del paciente, descartando los más antiguos; N y M quedan como constantes configurables en `config.py`. Documentado en `arquitectura_sistema_v2.md` sección 8.2, y agregado como tarea en Fase 6 de `tareas_desarrollo_mvp.md`.

---

## C04 — Historial multi-turno durante la sesión: responsabilidad no definida

**Severidad:** Media
**Documentos a corregir:** `arquitectura_sistema_v2.md` (sección 8), `tareas_desarrollo_mvp.md` (Fase 6)
**Estado:** [x]

**Problema:**
La firma del proveedor abstracto es `chat(messages, context)`, donde `messages` representa el historial de la conversación actual (necesario para que el modelo tenga memoria dentro de la sesión). No está definido quién mantiene ese historial:

- Si lo mantiene el **frontend** en memoria: una recarga de página borra el historial visible antes de que el backend lo persista en `chat_log`.
- Si lo mantiene el **backend** leyendo `chat_log` en cada turno: implica una lectura a la base de datos en cada mensaje, y requiere que el guardado sea frecuente o incremental.

La ambigüedad puede llevar a inconsistencias entre lo que el médico ve en pantalla y lo que el modelo recibe como contexto de conversación.

**Corrección requerida:**
Documentar explícitamente la estrategia de manejo del historial de conversación durante la sesión. Opciones:

- **Opción A (frontend acumula):** El frontend envía el historial completo en cada `POST /chat`. El backend persiste el `chat_log` completo al final de la sesión o periódicamente. Documentar la política de guardado (al cerrar sesión, cada N mensajes, etc.).
- **Opción B (backend lee de DB):** El backend lee `chat_log` de la consulta activa en cada turno y lo incluye en `messages`. Requiere guardado incremental tras cada intercambio.

Reflejar la decisión en la sección 8 de `arquitectura_sistema_v2.md` y como tarea en Fase 6 de `tareas_desarrollo_mvp.md`.

**Resolución:** Se adoptó la Opción B. El backend lee `chat_log` de la consulta activa desde PostgreSQL en cada turno, y cada intercambio se persiste de forma incremental inmediatamente después de la respuesta del AIProvider. Documentado en `arquitectura_sistema_v2.md` sección 8.3.

---

## C05 — Mecanismo de respuesta en "tiempo real" sin especificar

**Severidad:** Media
**Documentos a corregir:** `arquitectura_sistema_v2.md` (sección 8), `tareas_desarrollo_mvp.md` (Fase 6)
**Estado:** [x]

**Problema:**
`tareas_desarrollo_mvp.md` Fase 6 indica "mostrar respuestas de la IA en tiempo real (RF12)" pero no se documenta el mecanismo técnico. Las opciones posibles son:

- Respuesta síncrona completa (el frontend espera hasta recibir el JSON completo).
- Streaming via SSE (Server-Sent Events).
- WebSocket.

La elección afecta la implementación del endpoint en FastAPI, la del cliente en React, y el cumplimiento del RNF03 (respuesta < 15 segundos), ya que con streaming el primer token llega antes aunque la respuesta completa tarde más.

**Corrección requerida:**
Definir el mecanismo y documentarlo en `arquitectura_sistema_v2.md` sección 8 y en la tarea correspondiente de `tareas_desarrollo_mvp.md` Fase 6. Para el MVP, la opción más simple es respuesta síncrona; si se elige streaming, agregar la tarea de implementar SSE en backend y el consumidor en frontend como ítems separados.

**Resolución:** Se adoptó respuesta síncrona para el MVP; no se implementa streaming. Documentado en `arquitectura_sistema_v2.md` sección 8.4, aclarando que "tiempo real" en Fase 6 significa "sin recarga de página", no streaming token a token.

---

## C06 — Transcripción activa vs. historial en el contexto de la IA

**Severidad:** Baja
**Documentos a corregir:** `arquitectura_sistema_v2.md` (sección 8)
**Estado:** [x]

**Problema:**
El paso 2 del flujo del chat carga `transcript` de las consultas previas del historial del paciente. Sin embargo, durante una consulta en curso el médico puede estar grabando audio simultáneamente al chat (RF06). No se especifica si la transcripción de la consulta *actual* (parcial o completa) también se incluye en el context string enviado al modelo.

Esta decisión tiene impacto clínico: si la transcripción activa no se incluye, la IA no puede referenciar lo que se está discutiendo en la consulta en curso.

**Corrección requerida:**
Definir explícitamente en la sección 8 de `arquitectura_sistema_v2.md` si el campo `transcript` de la consulta activa se incluye en el context string. Si se decide incluirlo, documentar en qué punto del flujo se lee (antes de enviar al modelo) y cómo se obtiene si aún no fue guardado en la base de datos.

**Resolución:** El `transcript` de la consulta activa (en curso) no se incluye en el context string. Solo se incluye el `transcript` de consultas previas ya cerradas. Documentado en `arquitectura_sistema_v2.md` sección 8.5; queda como mejora futura fuera de alcance del MVP.

---

## C07 — Falta endpoint `GET /consultations/{id}`

**Severidad:** Baja
**Documento a corregir:** `tareas_desarrollo_mvp.md` (Fase 5)
**Estado:** [x]

**Problema:**
La Fase 5 de `tareas_desarrollo_mvp.md` define `POST /consultations`, `GET /consultations?patient_id=` y `PATCH /consultations/{id}`, pero no incluye `GET /consultations/{id}`. Este endpoint es necesario para:

1. Recuperar el `chat_log` de una consulta específica (por ejemplo, al recargar la página o al consultar el historial desde RF07).
2. Mostrar el detalle completo de una consulta (reason, observations, diagnosis, transcript) desde la interfaz.

Sin este endpoint, RF07 (historial completo del paciente) sólo puede listar consultas sin poder acceder al detalle de cada una.

**Corrección requerida:**
Agregar en `tareas_desarrollo_mvp.md` Fase 5 (backend) la tarea:
`GET /consultations/{id}` — obtener detalle completo de una consulta (verificando `doctor_id`), incluyendo `chat_log` y `transcript`.

**Resolución:** Agregado en Fase 5 de `tareas_desarrollo_mvp.md`.

---

*Documento generado el 2026-06-29 a partir del análisis de `arquitectura_sistema_v2.md`, `relevamiento_inicial_v4.md`, `estructura_base_datos_v2.md` y `tareas_desarrollo_mvp.md`. Correcciones C02–C07 aplicadas el 2026-07-02.*
