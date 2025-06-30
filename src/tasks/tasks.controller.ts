import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskSubtaskDto } from './dto/create-task-subtask.dto';
import { Status, Priority } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Crear una nueva tarea
   * @param createTaskDto - Datos de la tarea a crear
   * @returns Tarea creada
   */
  @Post()
  async create(@Body(ValidationPipe) createTaskDto: CreateTaskDto) {
    try {
      return await this.tasksService.create(createTaskDto);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      throw new BadRequestException(`Error al crear la tarea: ${error.message}`);
    }
  }

  /**
   * Obtener todas las tareas
   * @returns Lista de todas las tareas
   */
  @Get()
  async findAll() {
    try {
      return await this.tasksService.findAll();
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      throw new BadRequestException(`Error al obtener las tareas: ${error.message}`);
    }
  }

  /**
   * Obtener una tarea por ID
   * @param id - ID de la tarea
   * @returns Tarea encontrada
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.tasksService.findOne(id);
    } catch (error) {
      console.error('Error al obtener tarea:', error);
      throw new BadRequestException(`Error al obtener la tarea: ${error.message}`);
    }
  }

  /**
   * Actualizar una tarea
   * @param id - ID de la tarea
   * @param updateTaskDto - Datos a actualizar
   * @returns Tarea actualizada
   */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto
  ) {
    try {
      console.log('Actualizando tarea:', { id, updateTaskDto });
      const result = await this.tasksService.update(id, updateTaskDto);
      console.log('Tarea actualizada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error en controlador al actualizar tarea:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar la tarea: ${error.message}`);
    }
  }

  /**
   * Eliminar una tarea
   * @param id - ID de la tarea
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.tasksService.remove(id);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      throw new BadRequestException(`Error al eliminar la tarea: ${error.message}`);
    }
  }

  /**
   * Crear relación entre tarea y subtarea
   * @param taskId - ID de la tarea
   * @param createTaskSubtaskDto - Datos de la relación
   * @returns Relación creada
   */
  @Post(':id/subtask')
  async createTaskSubtaskRelation(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body(ValidationPipe) createTaskSubtaskDto: CreateTaskSubtaskDto
  ) {
    try {
      createTaskSubtaskDto.taskId = taskId;
      return await this.tasksService.createTaskSubtaskRelation(createTaskSubtaskDto);
    } catch (error) {
      console.error('Error al crear relación tarea-subtarea:', error);
      throw new BadRequestException(`Error al crear la relación: ${error.message}`);
    }
  }

  /**
   * Eliminar relación entre tarea y subtarea
   * @param taskId - ID de la tarea
   * @param subtaskId - ID de la subtarea
   */
  @Delete(':id/subtasks/:subtaskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSubtaskFromTask(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Param('subtaskId', ParseUUIDPipe) subtaskId: string
  ) {
    try {
      await this.tasksService.removeTaskSubtaskRelation(taskId, subtaskId);
    } catch (error) {
      throw new BadRequestException(`Error al quitar subtarea de la tarea: ${error.message}`);
    }
  }

  /**
   * Obtener tareas por estado
   * @param status - Estado de las tareas
   * @returns Lista de tareas con el estado especificado
   */
  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    try {
      if (!Object.values(Status).includes(status as Status)) {
        throw new BadRequestException(`Estado inválido: ${status}. Estados válidos: ${Object.values(Status).join(', ')}`);
      }
      return await this.tasksService.findByStatus(status as Status);
    } catch (error) {
      console.error('Error al obtener tareas por estado:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener tareas por estado: ${error.message}`);
    }
  }

  /**
   * Obtener tareas por prioridad
   * @param priority - Prioridad de las tareas
   * @returns Lista de tareas con la prioridad especificada
   */
  @Get('priority/:priority')
  async findByPriority(@Param('priority') priority: string) {
    try {
      if (!Object.values(Priority).includes(priority as Priority)) {
        throw new BadRequestException(`Prioridad inválida: ${priority}. Prioridades válidas: ${Object.values(Priority).join(', ')}`);
      }
      return await this.tasksService.findByPriority(priority as Priority);
    } catch (error) {
      console.error('Error al obtener tareas por prioridad:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener tareas por prioridad: ${error.message}`);
    }
  }

  /**
   * Obtener todas las subtareas de una tarea
   */
  @Get(':id/subtasks')
  async findAllSubtasksOfTask(@Param('id', ParseUUIDPipe) taskId: string) {
    try {
      return await this.tasksService.findAllSubtasksOfTask(taskId);
    } catch (error) {
      throw new BadRequestException(`Error al obtener subtareas de la tarea: ${error.message}`);
    }
  }

  /**
   * Agregar una subtarea a una tarea
   */
  @Post(':id/subtasks')
  async addSubtaskToTask(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body(ValidationPipe) createTaskSubtaskDto: CreateTaskSubtaskDto
  ) {
    try {
      createTaskSubtaskDto.taskId = taskId;
      return await this.tasksService.createTaskSubtaskRelation(createTaskSubtaskDto);
    } catch (error) {
      throw new BadRequestException(`Error al agregar subtarea a la tarea: ${error.message}`);
    }
  }
} 