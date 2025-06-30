import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete, 
  ValidationPipe, 
  ParseUUIDPipe, 
  BadRequestException 
} from '@nestjs/common';
import { SubtasksService } from './services/subtasks.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { Status } from './entities/task.entity';

@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  /**
   * Crear una nueva subtarea
   * @param createSubtaskDto - Datos de la subtarea a crear
   * @returns Subtarea creada
   */
  @Post()
  async create(@Body(ValidationPipe) createSubtaskDto: CreateSubtaskDto) {
    try {
      return await this.subtasksService.create(createSubtaskDto);
    } catch (error) {
      console.error('Error al crear subtarea:', error);
      throw new BadRequestException(`Error al crear la subtarea: ${error.message}`);
    }
  }

  /**
   * Crear sugerencias de subtareas usando IA (no guarda en la base de datos)
   * @param taskData - Datos de la tarea para generar las subtareas
   * @returns Array de sugerencias de subtareas
   */
  @Post('ai')
  async suggestWithAI(@Body() taskData: { title: string; description: string; priority: string }) {
    try {
      return await this.subtasksService.createWithAI(taskData);
    } catch (error) {
      console.error('Error al sugerir subtareas con IA:', error);
      throw new BadRequestException(`Error al sugerir subtareas con IA: ${error.message}`);
    }
  }

  /**
   * Obtener todas las subtareas
   * @returns Lista de todas las subtareas
   */
  @Get()
  async findAll() {
    try {
      return await this.subtasksService.findAll();
    } catch (error) {
      console.error('Error al obtener subtareas:', error);
      throw new BadRequestException(`Error al obtener las subtareas: ${error.message}`);
    }
  }

  /**
   * Obtener una subtarea por ID
   * @param id - ID de la subtarea
   * @returns Subtarea encontrada
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.subtasksService.findOne(id);
    } catch (error) {
      console.error('Error al obtener subtarea:', error);
      throw new BadRequestException(`Error al obtener la subtarea: ${error.message}`);
    }
  }

  /**
   * Actualizar una subtarea
   * @param id - ID de la subtarea
   * @param updateSubtaskDto - Datos a actualizar
   * @returns Subtarea actualizada
   */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body(ValidationPipe) updateSubtaskDto: UpdateSubtaskDto
  ) {
    try {
      return await this.subtasksService.update(id, updateSubtaskDto);
    } catch (error) {
      console.error('Error al actualizar subtarea:', error);
      throw new BadRequestException(`Error al actualizar la subtarea: ${error.message}`);
    }
  }

  /**
   * Eliminar una subtarea
   * @param id - ID de la subtarea
   */
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.subtasksService.remove(id);
    } catch (error) {
      console.error('Error al eliminar subtarea:', error);
      throw new BadRequestException(`Error al eliminar la subtarea: ${error.message}`);
    }
  }

  /**
   * Obtener subtareas por estado
   * @param status - Estado de las subtareas
   * @returns Lista de subtareas con el estado especificado
   */
  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    try {
      if (!Object.values(Status).includes(status as Status)) {
        throw new BadRequestException(`Estado inválido: ${status}. Estados válidos: ${Object.values(Status).join(', ')}`);
      }
      return await this.subtasksService.findByStatus(status as Status);
    } catch (error) {
      console.error('Error al obtener subtareas por estado:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener subtareas por estado: ${error.message}`);
    }
  }

  /**
   * Obtener todas las tareas relacionadas a una subtarea
   */
  @Get(':id/tasks')
  async findAllTasksOfSubtask(@Param('id', ParseUUIDPipe) subtaskId: string) {
    try {
      return await this.subtasksService.findAllTasksOfSubtask(subtaskId);
    } catch (error) {
      throw new BadRequestException(`Error al obtener tareas de la subtarea: ${error.message}`);
    }
  }
} 