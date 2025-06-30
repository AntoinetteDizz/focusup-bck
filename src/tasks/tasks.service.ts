import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, Subtask, TaskSubtask, Priority, Status } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskSubtaskDto } from './dto/create-task-subtask.dto';
import { AiService } from './services/ai.service';
import { SubtasksService } from './services/subtasks.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskSubtask)
    private taskSubtaskRepository: Repository<TaskSubtask>,
    private aiService: AiService,
    private subtasksService: SubtasksService,
  ) {}

  /**
   * Crear una nueva tarea
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { subtaskIds, ...rest } = createTaskDto;
    const task = this.tasksRepository.create(rest);
    const savedTask = await this.tasksRepository.save(task);
    // Asociar todas las subtareas seleccionadas
    if (Array.isArray(subtaskIds) && subtaskIds.length > 0) {
      for (let i = 0; i < subtaskIds.length; i++) {
        await this.createTaskSubtaskRelation({
          taskId: savedTask.id,
          subtaskId: subtaskIds[i],
          orderIndex: i
        });
      }
    }
    // Incluir subtasks en la respuesta
    const subtasks = await this.findAllSubtasksOfTask(savedTask.id);
    return { ...savedTask, subtasks } as Task;
  }

  /**
   * Obtener todas las tareas con sus subtareas relacionadas
   */
  async findAll(): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      order: { createdAt: 'DESC' },
    });
    for (const task of tasks) {
      const subtasks = await this.findAllSubtasksOfTask(task.id);
      (task as any).subtasks = subtasks;
    }
    return tasks;
  }

  /**
   * Obtener una tarea por ID con su subtarea relacionada
   */
  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    const subtasks = await this.findAllSubtasksOfTask(task.id);
    return { ...task, subtasks } as Task;
  }

  /**
   * Actualizar una tarea
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      console.log('Servicio: Actualizando tarea:', { id, updateTaskDto });
      if (!id || typeof id !== 'string') {
        throw new Error('ID de tarea inválido');
      }
      const task = await this.findOne(id);
      console.log('Tarea encontrada:', task);
      
      if (updateTaskDto.status && !Object.values(Status).includes(updateTaskDto.status)) {
        throw new Error(`Estado inválido: ${updateTaskDto.status}`);
      }
      if (updateTaskDto.priority && !Object.values(Priority).includes(updateTaskDto.priority)) {
        throw new Error(`Prioridad inválida: ${updateTaskDto.priority}`);
      }

      // Manejar la relación con subtareas
      if (updateTaskDto.subtaskIds !== undefined) {
        // Eliminar relaciones existentes
        await this.taskSubtaskRepository.delete({ taskId: id });
        // Crear nuevas relaciones
        for (let i = 0; i < updateTaskDto.subtaskIds.length; i++) {
          await this.createTaskSubtaskRelation({
            taskId: id,
            subtaskId: updateTaskDto.subtaskIds[i],
            orderIndex: i
          });
        }
      }

      // Actualizar campos de la tarea
      const { subtaskIds, ...rest } = updateTaskDto;
      Object.assign(task, rest);
      console.log('Tarea después de actualizar:', task);
      const savedTask = await this.tasksRepository.save(task);
      console.log('Tarea guardada exitosamente:', savedTask);
      // Incluir subtasks en la respuesta
      const subtasks = await this.findAllSubtasksOfTask(savedTask.id);
      return { ...savedTask, subtasks } as Task;
    } catch (error) {
      console.error('Error en servicio al actualizar tarea:', error);
      throw error;
    }
  }

  /**
   * Eliminar una tarea
   */
  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    // Eliminar la relación primero
    await this.taskSubtaskRepository.delete({ taskId: id });
    await this.tasksRepository.remove(task);
  }

  /**
   * Crear relación entre tarea y subtarea (muchos a muchos)
   */
  async createTaskSubtaskRelation(createTaskSubtaskDto: CreateTaskSubtaskDto): Promise<TaskSubtask> {
    // Verificar que la tarea y subtarea existen
    await this.findOne(createTaskSubtaskDto.taskId);
    await this.subtasksService.findOne(createTaskSubtaskDto.subtaskId);

    // Verificar si ya existe la relación
    const exists = await this.taskSubtaskRepository.findOne({
      where: {
        taskId: createTaskSubtaskDto.taskId,
        subtaskId: createTaskSubtaskDto.subtaskId,
      },
    });
    if (exists) return exists;

    const taskSubtask = this.taskSubtaskRepository.create(createTaskSubtaskDto);
    return await this.taskSubtaskRepository.save(taskSubtask);
  }

  /**
   * Obtener todas las subtareas de una tarea
   */
  async findAllSubtasksOfTask(taskId: string): Promise<Subtask[]> {
    const relations = await this.taskSubtaskRepository.find({
      where: { taskId },
      relations: ['subtask'],
    });
    return relations.map(rel => rel.subtask);
  }

  /**
   * Eliminar una relación específica entre tarea y subtarea
   */
  async removeTaskSubtaskRelation(taskId: string, subtaskId: string): Promise<void> {
    await this.taskSubtaskRepository.delete({ taskId, subtaskId });
  }

  /**
   * Obtener tareas por estado
   */
  async findByStatus(status: Status): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: { status },
      order: {
        createdAt: 'DESC',
      },
    });

    // Obtener las relaciones y subtareas para cada tarea
    for (const task of tasks) {
      const taskSubtask = await this.taskSubtaskRepository.findOne({
        where: { taskId: task.id },
        relations: ['subtask']
      });
      if (taskSubtask) {
        (task as any).subtask = taskSubtask.subtask;
      }
    }

    return tasks;
  }

  /**
   * Obtener tareas por prioridad
   */
  async findByPriority(priority: Priority): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: { priority },
      order: {
        createdAt: 'DESC',
      },
    });

    // Obtener las relaciones y subtareas para cada tarea
    for (const task of tasks) {
      const taskSubtask = await this.taskSubtaskRepository.findOne({
        where: { taskId: task.id },
        relations: ['subtask']
      });
      if (taskSubtask) {
        (task as any).subtask = taskSubtask.subtask;
      }
    }

    return tasks;
  }
} 