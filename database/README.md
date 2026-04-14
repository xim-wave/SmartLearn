# SmartLearn — Base de Datos

**Motor:** PostgreSQL alojado en Supabase
**Autor:** Ricardo Nieto Campos
**Proyecto:** SmartLearn, Ingeniería de Software 2026

---

## ¿Qué hay en esta carpeta?

Esta carpeta contiene el esquema completo de la base de datos
del proyecto SmartLearn. Incluye la creación de tablas, índices
y políticas de seguridad (RLS) necesarias para que el sistema
funcione correctamente.

| Archivo | Descripción |
|---|---|
| `schema.sql` 	| Código SQL completo y comentado para crear toda la base de datos |
| `README.md` 	| Este archivo de documentación |

---

## Tablas del sistema

| Tabla | Descripción | Requerimiento |
|---|---|---|
| `mazos` 	| Categorías de estudio creadas por cada usuario 			| RF-03 |
| `recursos` 	| URLs y PDFs vinculados a un mazo 					| RF-04, RF-10 |
| `flashcards` 	| Tarjetas de pregunta/respuesta con datos para el algoritmo SM-2 	| RF-06, RF-07, RF-08 |

---

## Seguridad

Todas las tablas tienen **Row Level Security (RLS)** activado.
Cada usuario solo puede ver, crear, editar y eliminar sus propios
datos. Esto se garantiza mediante políticas que validan `auth.uid()`
en cada operación, cumpliendo con el requerimiento **RNF-04**.

---
**Backend** — archivo `.env` dentro de la carpeta `/backend`:

```env

SUPABASE\_URL=https://jiamnhzustmsjfqetfro.supabase.co

SUPABASE\_SECRET\_KEY=aqui\_va\_la\_secret\_key (Por ahora no se publica publicamente por seguridad)

```

**Frontend** — archivo `.env` dentro de la carpeta `/Frontend`:

```env

VITE\_SUPABASE\_URL=https://jiamnhzustmsjfqetfro.supabase.co

VITE\_SUPABASE\_PUBLISHABLE\_KEY=aqui\_va\_la\_publishable\_key (Por ahora no se publica publicamente por seguridad)

```

---

## Cómo recrear la base de datos desde cero

Si en algún momento necesitas borrar y recrear el esquema completo:

1. Entra a tu proyecto en **supabase.com**
2. Ve al **SQL Editor**
3. Copia y pega el contenido completo de `schema.sql`
4. Presiona **Run**

---

## Lo que falta agregar en el futuro

A medida que el proyecto se innove, este archivo podría actualizarse si:

- Se agregan nuevas tablas al sistema
- Se modifican columnas existentes en alguna tabla
- Se agregan nuevas políticas de seguridad RLS
- Se cambia el proveedor de hosting de la base de datos
- Se integra la API de Inteligencia Artificial (NLP) o alguna otra herramienta util
