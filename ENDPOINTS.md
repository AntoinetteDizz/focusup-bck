# 🎯 FocusUp API - Documentación de Endpoints

## 📋 Información General

- **Base URL**: `http://localhost:3001`
- **Prefijo API**: `/api`
- **Formato de respuesta**: JSON
- **Autenticación**: No requerida (por ahora)

## 🔗 Endpoints Disponibles

### 📊 Información de la API
```
GET /
```
**Descripción**: Información general de la API y documentación de endpoints
**Respuesta**: Información completa de la API, endpoints disponibles y ejemplos

---

### 🧪 Endpoint de Prueba
```
POST /api/test
```
**Descripción**: Endpoint para probar la conectividad de la API
**Body**: Cualquier JSON
**Respuesta**: Confirmación de recepción de datos

---

## 📝 Gestión de Tareas

### Crear Tarea
```
POST /api/tasks
```
**Body**:
```json
{
  "title": "Mi tarea",
  "description": "Descripción de la tarea",
  "priority": "Alta", // Opcional: "Alta", "Media", "Baja"
  "status": "pendiente", // Opcional: "pendiente", "en progreso", "completada"
  "subtaskId": "uuid-opcional" // Opcional: ID de subtarea para relacionar
}
```

### Obtener Todas las Tareas
```
GET /api/tasks
```
**Respuesta**: Array de tareas con sus subtareas relacionadas

### Obtener Tarea por ID
```
GET /api/tasks/:id
```
**Parámetros**: `id` (UUID válido)
**Respuesta**: Tarea específica con su subtarea relacionada

### Actualizar Tarea
```
PATCH /api/tasks/:id
```
**Parámetros**: `id` (UUID válido)
**Body**:
```json
{
  "title": "Nuevo título", // Opcional
  "description": "Nueva descripción", // Opcional
  "priority": "Media", // Opcional
  "status": "en progreso", // Opcional
  "subtaskId": "nuevo-uuid" // Opcional
}
```

### Eliminar Tarea
```
DELETE /api/tasks/:id
```
**Parámetros**: `id` (UUID válido)
**Respuesta**: 204 No Content

### Obtener Tareas por Estado
```
GET /api/tasks/status/:status
```
**Parámetros**: `status` ("pendiente", "en progreso", "completada")
**Respuesta**: Array de tareas con el estado especificado

### Obtener Tareas por Prioridad
```
GET /api/tasks/priority/:priority
```
**Parámetros**: `priority` ("Alta", "Media", "Baja")
**Respuesta**: Array de tareas con la prioridad especificada

### Crear Relación Tarea-Subtarea
```
POST /api/tasks/:id/subtask
```
**Parámetros**: `id` (UUID de la tarea)
**Body**:
```json
{
  "subtaskId": "uuid-de-subtarea",
  "orderIndex": 0 // Opcional
}
```

### Eliminar Relación Tarea-Subtarea
```
DELETE /api/tasks/:id/subtask
```
**Parámetros**: `id` (UUID de la tarea)
**Respuesta**: 204 No Content

---

## 🔧 Gestión de Subtareas

### Crear Subtarea
```
POST /api/subtasks
```
**Body**:
```json
{
  "title": "Mi subtarea",
  "description": "Descripción de la subtarea", // Opcional
  "status": "pendiente" // Opcional
}
```

### Obtener Todas las Subtareas
```
GET /api/subtasks
```
**Respuesta**: Array de todas las subtareas

### Obtener Subtarea por ID
```
GET /api/subtasks/:id
```
**Parámetros**: `id` (UUID válido)
**Respuesta**: Subtarea específica

### Actualizar Subtarea
```
PATCH /api/subtasks/:id
```
**Parámetros**: `id` (UUID válido)
**Body**:
```json
{
  "title": "Nuevo título", // Opcional
  "description": "Nueva descripción", // Opcional
  "status": "en progreso" // Opcional
}
```

### Eliminar Subtarea
```
DELETE /api/subtasks/:id
```
**Parámetros**: `id` (UUID válido)
**Respuesta**: 204 No Content

### Obtener Subtareas por Estado
```
GET /api/subtasks/status/:status
```
**Parámetros**: `status` ("pendiente", "en progreso", "completada")
**Respuesta**: Array de subtareas con el estado especificado

---

## 📊 Enums y Valores Válidos

### Estados (Status)
- `"pendiente"`
- `"en progreso"`
- `"completada"`

### Prioridades (Priority)
- `"Alta"`
- `"Media"`
- `"Baja"`

---

## ⚠️ Manejo de Errores

La API devuelve errores HTTP estándar:

- **400 Bad Request**: Datos de entrada inválidos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error interno del servidor

**Ejemplo de error**:
```json
{
  "message": "Error al crear la tarea: Estado inválido: invalid-status",
  "statusCode": 400
}
```

---

## 🔍 Ejemplos de Uso

### Crear una tarea con prioridad alta
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Proyecto importante",
    "description": "Desarrollar nueva funcionalidad",
    "priority": "Alta",
    "status": "pendiente"
  }'
```

### Obtener tareas en progreso
```bash
curl http://localhost:3001/api/tasks/status/en%20progreso
```

### Actualizar estado de una tarea
```bash
curl -X PATCH http://localhost:3001/api/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completada"
  }'
```

---

## 🚀 Características Implementadas

✅ **Validación automática** de datos de entrada  
✅ **Validación de UUIDs** para IDs  
✅ **Manejo robusto de errores**  
✅ **Relaciones entre tareas y subtareas**  
✅ **Filtrado por estado y prioridad**  
✅ **Documentación completa** de endpoints  
✅ **CORS habilitado** para frontend  
✅ **Logging detallado** para debugging  

---

## 📝 Notas Importantes

1. **Todos los IDs deben ser UUIDs válidos**
2. **Los estados y prioridades son case-sensitive**
3. **Las relaciones tarea-subtarea son 1:1** (una tarea puede tener una subtarea)
4. **La validación es automática** en todos los endpoints
5. **Los timestamps se generan automáticamente** (createdAt, updatedAt) 