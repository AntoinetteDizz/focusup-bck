# FocusUp Backend

Backend API para la aplicación de gestión de tareas FocusUp, construido con NestJS y PostgreSQL.

## 🚀 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar base de datos:**
   ```bash
   # Iniciar PostgreSQL con Docker
   npm run docker:up
   
   # O ejecutar manualmente:
   docker-compose up -d
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp env.example .env
   # Editar .env con tus configuraciones
   ```

## 🛠️ Scripts Disponibles

### Desarrollo
- `npm run start:dev` - Inicia el servidor en modo desarrollo con hot reload
- `npm run start:debug` - Inicia el servidor en modo debug
- `npm run build` - Construye la aplicación para producción

### Testing
- `npm run test` - Ejecuta tests unitarios
- `npm run test:watch` - Ejecuta tests en modo watch
- `npm run test:endpoints` - Prueba todos los endpoints de la API
- `npm run test:database` - Prueba la conexión a la base de datos

### Base de Datos
- `npm run docker:up` - Inicia PostgreSQL con Docker
- `npm run docker:down` - Detiene PostgreSQL
- `npm run reset:db` - Resetea la base de datos (Windows)
- `npm run reset:db:unix` - Resetea la base de datos (Unix/Linux)

### Linting y Formateo
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Formatea el código con Prettier

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── tasks/           # Módulo de tareas
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── entities/    # Entidades de base de datos
│   │   ├── services/    # Servicios de negocio
│   │   └── controllers/ # Controladores de API
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test-endpoints.js    # Scripts de prueba de endpoints
├── test-database.js     # Scripts de prueba de base de datos
├── docker-compose.yml   # Configuración de Docker
└── init.sql            # Script de inicialización de BD
```

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` basado en `env.example`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=focusup_user
DATABASE_PASSWORD=focusup_password
DATABASE_NAME=focusup
```

### Base de Datos
La aplicación usa PostgreSQL. Puedes usar Docker para desarrollo:

```bash
docker-compose up -d
```

## 📚 Documentación de API

- [Endpoints Completos](ENDPOINTS.md)
- [Resumen de Endpoints](ENDPOINTS_SUMMARY.md)
- [Solución de Base de Datos](SOLUCION_DB.md)

## 🧪 Testing

### Probar Endpoints
```bash
npm run test:endpoints
```

### Probar Base de Datos
```bash
npm run test:database
```

### Tests Unitarios
```bash
npm run test
```

## 🚀 Despliegue

1. Construir la aplicación:
   ```bash
   npm run build
   ```

2. Iniciar en producción:
   ```bash
   npm run start:prod
   ```

## 📝 Licencia

MIT 