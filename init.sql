-- FocusUp Database Schema
-- PostgreSQL - Script sin ENUMs, usando VARCHAR

-- Crear extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de tareas
CREATE TABLE IF NOT EXISTS task (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(32) DEFAULT 'Media', -- Valores: 'Alta', 'Media', 'Baja'
    status VARCHAR(32) DEFAULT 'pendiente', -- Valores: 'pendiente', 'en progreso', 'completada'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de subtareas (sin task_id)
CREATE TABLE IF NOT EXISTS subtask (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(32) DEFAULT 'pendiente', -- Valores: 'pendiente', 'en progreso', 'completada'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia para la relación muchos a muchos
CREATE TABLE IF NOT EXISTS task_subtask (
    task_id UUID NOT NULL,
    subtask_id UUID NOT NULL,
    PRIMARY KEY (task_id, subtask_id),
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
    FOREIGN KEY (subtask_id) REFERENCES subtask(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_task_status ON task(status);
CREATE INDEX IF NOT EXISTS idx_task_priority ON task(priority);
CREATE INDEX IF NOT EXISTS idx_task_created_at ON task(created_at);
CREATE INDEX IF NOT EXISTS idx_subtask_status ON subtask(status);
CREATE INDEX IF NOT EXISTS idx_subtask_created_at ON subtask(created_at);

-- Crear trigger para actualizar updated_at automáticamente en tareas
CREATE OR REPLACE FUNCTION update_task_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_task_updated_at 
    BEFORE UPDATE ON task 
    FOR EACH ROW 
    EXECUTE FUNCTION update_task_updated_at_column();

-- Crear trigger para actualizar updated_at automáticamente en subtareas
CREATE OR REPLACE FUNCTION update_subtask_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subtask_updated_at 
    BEFORE UPDATE ON subtask 
    FOR EACH ROW 
    EXECUTE FUNCTION update_subtask_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO task (title, description, priority, status) VALUES
('Desarrollar API REST', 'Crear una API REST completa con NestJS', 'Alta', 'pendiente'),
('Implementar autenticación', 'Agregar sistema de autenticación JWT', 'Media', 'pendiente'),
('Crear interfaz de usuario', 'Desarrollar frontend con React/Next.js', 'Alta', 'pendiente'),
('Configurar base de datos', 'Configurar PostgreSQL y migraciones', 'Media', 'pendiente'),
('Implementar tests', 'Crear tests unitarios y de integración', 'Baja', 'pendiente');

INSERT INTO subtask (title, description, status) VALUES
('Investigar tecnologías', 'Investigar las mejores tecnologías para el proyecto', 'pendiente'),
('Diseñar arquitectura', 'Crear el diseño de la arquitectura del sistema', 'pendiente'),
('Configurar entorno', 'Configurar el entorno de desarrollo', 'pendiente'),
('Escribir documentación', 'Crear documentación técnica del proyecto', 'pendiente'),
('Diseñar mockups', 'Crear diseños de la interfaz de usuario', 'pendiente'),
('Instalar PostgreSQL', 'Instalar y configurar PostgreSQL', 'pendiente');

-- Relacionar tareas y subtareas (muchos a muchos)
INSERT INTO task_subtask (task_id, subtask_id) VALUES
((SELECT id FROM task WHERE title = 'Desarrollar API REST' LIMIT 1), (SELECT id FROM subtask WHERE title = 'Investigar tecnologías' LIMIT 1)),
((SELECT id FROM task WHERE title = 'Desarrollar API REST' LIMIT 1), (SELECT id FROM subtask WHERE title = 'Diseñar arquitectura' LIMIT 1)),
((SELECT id FROM task WHERE title = 'Implementar autenticación' LIMIT 1), (SELECT id FROM subtask WHERE title = 'Configurar entorno' LIMIT 1)),
((SELECT id FROM task WHERE title = 'Crear interfaz de usuario' LIMIT 1), (SELECT id FROM subtask WHERE title = 'Diseñar mockups' LIMIT 1)),
((SELECT id FROM task WHERE title = 'Configurar base de datos' LIMIT 1), (SELECT id FROM subtask WHERE title = 'Instalar PostgreSQL' LIMIT 1));

-- Mostrar algunos datos de ejemplo
SELECT 'Tareas:' as info;
SELECT id, title, priority, status FROM task LIMIT 5;

SELECT 'Subtareas:' as info;
SELECT id, title, status FROM subtask LIMIT 5;

SELECT 'Relaciones:' as info;
SELECT 
    t.title as task_title,
    s.title as subtask_title
FROM task_subtask ts
JOIN task t ON ts.task_id = t.id
JOIN subtask s ON ts.subtask_id = s.id
LIMIT 5; 