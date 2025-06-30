import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: '🎯 FocusUp API está funcionando correctamente!',
      version: '1.0.0',
      description: 'API para gestión de tareas y productividad con técnicas Pomodoro',
      status: 'online',
      timestamp: new Date().toISOString(),
      endpoints: {
        info: '/',
        test: '/api/test',
        tasks: {
          base: '/api/tasks',
          create: 'POST /api/tasks',
          getAll: 'GET /api/tasks',
          getById: 'GET /api/tasks/:id',
          update: 'PATCH /api/tasks/:id',
          delete: 'DELETE /api/tasks/:id',
          byStatus: 'GET /api/tasks/status/:status',
          byPriority: 'GET /api/tasks/priority/:priority',
          addSubtask: 'POST /api/tasks/:id/subtask',
          removeSubtask: 'DELETE /api/tasks/:id/subtask'
        },
        subtasks: {
          base: '/api/subtasks',
          create: 'POST /api/subtasks',
          getAll: 'GET /api/subtasks',
          getById: 'GET /api/subtasks/:id',
          update: 'PATCH /api/subtasks/:id',
          delete: 'DELETE /api/subtasks/:id',
          byStatus: 'GET /api/subtasks/status/:status'
        }
      },
      enums: {
        status: ['pendiente', 'en progreso', 'completada'],
        priority: ['Alta', 'Media', 'Baja']
      },
      features: [
        'Gestión completa de tareas (CRUD)',
        'Gestión completa de subtareas (CRUD)',
        'Relaciones entre tareas y subtareas',
        'Filtrado por estado y prioridad',
        'Validación automática de datos',
        'Manejo de errores robusto',
        'Técnica Pomodoro integrada',
        'División automática de tareas con IA',
        'Seguimiento de productividad'
      ],
      documentation: {
        note: 'Todos los endpoints requieren IDs válidos (UUID) y validación de datos',
        examples: {
          createTask: {
            method: 'POST',
            url: '/api/tasks',
            body: {
              title: 'Mi tarea',
              description: 'Descripción de la tarea',
              priority: 'Alta',
              status: 'pendiente'
            }
          },
          createSubtask: {
            method: 'POST',
            url: '/api/subtasks',
            body: {
              title: 'Mi subtarea',
              description: 'Descripción de la subtarea',
              status: 'pendiente'
            }
          }
        }
      }
    };
  }

  @Post('test')
  testEndpoint(@Body() body: any) {
    console.log('Test endpoint llamado con:', body);
    return {
      message: 'Test endpoint funcionando correctamente',
      receivedData: body,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  }
} 