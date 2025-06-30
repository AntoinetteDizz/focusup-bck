import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum Priority {
  ALTA = 'Alta',
  MEDIA = 'Media',
  BAJA = 'Baja',
}

export enum Status {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en progreso',
  COMPLETADA = 'completada',
}

// Log para verificar los valores de los enums
console.log('Status enum values:', Object.values(Status));
console.log('Priority enum values:', Object.values(Priority));

@Entity('subtask')
export class Subtask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 32, default: 'pendiente' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => TaskSubtask, taskSubtask => taskSubtask.subtask)
  taskSubtasks: TaskSubtask[];
}

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 32, default: 'Media' })
  priority: string;

  @Column({ type: 'varchar', length: 32, default: 'pendiente' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => TaskSubtask, taskSubtask => taskSubtask.task)
  taskSubtasks: TaskSubtask[];
}

@Entity('task_subtask')
export class TaskSubtask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_id', type: 'uuid' })
  taskId: string;

  @Column({ name: 'subtask_id', type: 'uuid' })
  subtaskId: string;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @ManyToOne(() => Task, task => task.taskSubtasks)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => Subtask, subtask => subtask.taskSubtasks)
  @JoinColumn({ name: 'subtask_id' })
  subtask: Subtask;
} 