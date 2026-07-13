# Estructura de Base de Datos — Asistente Médico (MVP)
# Versión 2 — modelo multiusuario con aislamiento de datos por médico

Fuentes analizadas:
- `relevamiento_inicial_v4.md` — alcance, límites y requerimientos funcionales
- `estructura_base_datos_v1.md` — esquema base anterior

---

## Tablas

### 1. `users`

Médico registrado en el sistema. Múltiples médicos pueden coexistir; cada uno accede exclusivamente a sus propios datos. Sin cambios estructurales respecto a la versión anterior.

| Columna         | Tipo           | Restricciones                  | Descripción                     |
|-----------------|----------------|--------------------------------|---------------------------------|
| `id`            | UUID           | PK, DEFAULT gen_random_uuid()  |                                 |
| `full_name`     | VARCHAR(200)   | NOT NULL                       | Nombre y apellido del médico    |
| `email`         | VARCHAR(254)   | UNIQUE, NOT NULL               | Credencial de login             |
| `phone`         | VARCHAR(50)    |                                | Número de teléfono              |
| `password_hash` | TEXT           | NOT NULL                       | Hash bcrypt de la contraseña    |
| `created_at`    | TIMESTAMP      | DEFAULT now()                  |                                 |

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     VARCHAR(200) NOT NULL,
  email         VARCHAR(254) UNIQUE NOT NULL,
  phone         VARCHAR(50),
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT now()
);
```

---

### 2. `patients`

Cada paciente está asociado al médico que lo registró mediante `doctor_id`. Un médico solo puede ver y operar los pacientes donde `doctor_id` coincide con su propio `id`. El DNI es único por médico, no globalmente: dos médicos pueden registrar al mismo paciente (mismo DNI) sin conflicto.

| Columna      | Tipo          | Restricciones                           | Descripción                        |
|--------------|---------------|-----------------------------------------|------------------------------------|
| `id`         | UUID          | PK, DEFAULT gen_random_uuid()           |                                    |
| `doctor_id`  | UUID          | NOT NULL, FK → users(id) ON DELETE CASCADE | Médico propietario del registro |
| `full_name`  | VARCHAR(200)  | NOT NULL                                | Nombre y apellido                  |
| `dni`        | VARCHAR(20)   | UNIQUE(dni, doctor_id)                  | Documento de identidad             |
| `birth_date` | DATE          |                                         | Fecha de nacimiento                |
| `gender`     | VARCHAR(50)   |                                         | Sexo (texto libre: Masculino, etc.)|
| `phone`      | VARCHAR(50)   |                                         | Número de teléfono                 |
| `notes`      | TEXT          |                                         | Notas clínicas generales           |
| `created_at` | TIMESTAMP     | DEFAULT now()                           |                                    |

```sql
CREATE TABLE patients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name   VARCHAR(200) NOT NULL,
  dni         VARCHAR(20),
  birth_date  DATE,
  gender      VARCHAR(50),
  phone       VARCHAR(50),
  notes       TEXT,
  created_at  TIMESTAMP DEFAULT now(),
  UNIQUE (dni, doctor_id)
);
```

---

### 3. `consultations`

Sin cambios estructurales. El aislamiento por médico se garantiza a través de `patient_id`: al filtrar pacientes por `doctor_id`, las consultas quedan automáticamente restringidas al médico autenticado.

| Columna          | Tipo      | Restricciones                        | Descripción                                  |
|------------------|-----------|--------------------------------------|----------------------------------------------|
| `id`             | UUID      | PK, DEFAULT gen_random_uuid()        |                                              |
| `patient_id`     | UUID      | FK → patients(id) ON DELETE CASCADE  |                                              |
| `date`           | TIMESTAMP | DEFAULT now()                        | Fecha/hora de la consulta                    |
| `reason`         | TEXT      |                                      | Motivo de consulta                           |
| `observations`   | TEXT      |                                      | Observaciones clínicas                       |
| `diagnosis`      | TEXT      |                                      | Diagnóstico                                  |
| `transcript`     | TEXT      |                                      | Transcripción de audio (Whisper)             |
| `chat_log`       | JSONB     |                                      | Historial completo del chat con el asistente |
| `created_at`     | TIMESTAMP | DEFAULT now()                        |                                              |

```sql
CREATE TABLE consultations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id   UUID REFERENCES patients(id) ON DELETE CASCADE,
  date         TIMESTAMP DEFAULT now(),
  reason       TEXT,
  observations TEXT,
  diagnosis    TEXT,
  transcript   TEXT,
  chat_log     JSONB,
  created_at   TIMESTAMP DEFAULT now()
);
```

---

### 4. `medical_files`

Sin cambios estructurales. El aislamiento por médico se garantiza a través de `patient_id`, igual que en `consultations`.

| Columna             | Tipo          | Restricciones                               | Descripción                                |
|---------------------|---------------|---------------------------------------------|--------------------------------------------|
| `id`                | UUID          | PK, DEFAULT gen_random_uuid()               |                                            |
| `patient_id`        | UUID          | FK → patients(id) ON DELETE CASCADE         |                                            |
| `consultation_id`   | UUID          | FK → consultations(id) ON DELETE SET NULL   | Puede ser NULL si se sube fuera de consulta|
| `original_name`     | VARCHAR(300)  | NOT NULL                                    | Nombre del archivo tal como fue subido     |
| `source_type`       | VARCHAR(20)   | NOT NULL, CHECK IN ('pdf', 'image')         | Origen del texto extraído                  |
| `content_text`      | TEXT          | NOT NULL                                    | Markdown (PDF) o texto plano OCR (JPG)     |
| `uploaded_at`       | TIMESTAMP     | DEFAULT now()                               |                                            |

```sql
CREATE TABLE medical_files (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES patients(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
  original_name   VARCHAR(300) NOT NULL,
  source_type     VARCHAR(20) NOT NULL CHECK (source_type IN ('pdf', 'image')),
  content_text    TEXT NOT NULL,
  uploaded_at     TIMESTAMP DEFAULT now()
);
```

---

## Relaciones

```
users
 └── patients (1:N) — doctor_id
      ├── consultations (1:N) — patient_id
      └── medical_files (1:N) — patient_id

consultations
 └── medical_files (1:N, opcional) — consultation_id
```

---

## Política de aislamiento de datos

El aislamiento entre médicos se aplica en la capa de aplicación (backend). Toda consulta a `patients`, `consultations` y `medical_files` debe incluir el filtro por el médico autenticado:

```sql
-- Ejemplo: listar pacientes del médico autenticado
SELECT * FROM patients
WHERE doctor_id = :authenticated_doctor_id;

-- Ejemplo: obtener consultas de un paciente (verificando propiedad)
SELECT c.*
FROM consultations c
JOIN patients p ON p.id = c.patient_id
WHERE p.doctor_id = :authenticated_doctor_id
  AND c.patient_id = :patient_id;
```

La base de datos no impone restricciones de visibilidad entre médicos por sí sola; es responsabilidad del backend garantizar que cada operación filtre por `doctor_id` antes de devolver o modificar datos.

---

## Cambios respecto a la versión anterior

| Tabla      | Campo        | Estado   | Motivo                                                                 |
|------------|--------------|----------|------------------------------------------------------------------------|
| `patients` | `doctor_id`  | Agregado | Vincula cada paciente al médico que lo registró                        |
| `patients` | `dni` UNIQUE | Modificado | La unicidad pasa de global a por médico: `UNIQUE(dni, doctor_id)`   |
| `users`    | —            | Sin cambios | La tabla ya existía; no requiere modificaciones estructurales        |
| `consultations` | —       | Sin cambios | El aislamiento se hereda a través de `patient_id → doctor_id`      |
| `medical_files` | —       | Sin cambios | El aislamiento se hereda a través de `patient_id → doctor_id`      |

---

*Documento versión 2 — incorporación de `doctor_id` en `patients` para modelo multiusuario con aislamiento por médico.*
