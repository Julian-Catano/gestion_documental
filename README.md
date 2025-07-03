# 📁 Gestión Documental Administrativa

Sistema web desarrollado para facilitar la gestión, carga, visualización y recuperación de documentos dentro del área de Seguridad y Salud en el Trabajo (SST). El sistema utiliza Firebase para autenticación, almacenamiento y base de datos, y React para el frontend.

---

## 🚀 Características principales

- ✅ Autenticación de usuarios con Firebase
- 🔐 Recuperación de contraseña desde el login o perfil
- 🧾 Gestión de archivos por tabla: carga, consulta y visualización
- 🧑‍💼 Acceso restringido solo a usuarios registrados por el administrador
- 📦 Almacenamiento de archivos en Firebase Storage
- 📊 Visualización de documentos en modal (PDF, imágenes, etc.)

---

## 👥 Público objetivo

- **Desarrolladores:** Para mantenimiento, despliegue o mejoras.
- **Administradores:** Para el manejo de usuarios y archivos dentro de la plataforma.

---

## 💻 Tecnologías utilizadas

| Área        | Tecnologías                        |
|-------------|------------------------------------|
| Frontend    | React, Vite, TailwindCSS, ShadCN   |
| Backend     | Firebase (Auth, Firestore, Storage)|
| Herramientas| SweetAlert2, js-cookie, react-router-dom |

---

## 🛠️ Requisitos

### Hardware

- Procesador: 1GHz mínimo
- RAM: 4 GB+
- Disco: 500MB libres

### Software

- Node.js v18 o superior
- NPM v9 o superior
- Navegador moderno (Chrome, Edge, Firefox)

---

## ⚙️ Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/usuario/gestion-documental.git
cd gestion-documental

# 2. Instala las dependencias
npm install

# 3. Configura el entorno (.env)
cp .env.example .env
# Agrega tus claves de Firebase, configura firebase storage y las reglas 

# 4. Inicia el servidor de desarrollo
npm run dev

🔐 Variables de entorno
Crea un archivo .env con lo siguiente:

VITE_API_KEY=...
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...

todo esto se encuentra al momento de crear el proyecto o el espacio para el proyecto en firebase 



🧪 Funcionalidades principales
Login seguro con Firebase Auth

Cambio de contraseña con validación

Carga de archivos organizada por usuarios

Filtros y visualización de archivos

Roles de usuario: administrador, usuario, visitante


🧼 Mantenimiento

npm update


📝 Licencia

Este proyecto se entrega como código abierto con fines académicos y administrativos. Puedes adaptarlo bajo tu propia responsabilidad.


✍️ Autor
Desarrollado por: Julian Estiven Posso Cataño
Contacto: julianestivenposso@gmail.com
Institución: INVERSIONES ULA
