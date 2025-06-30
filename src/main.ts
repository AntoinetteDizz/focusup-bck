import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 400,
      exceptionFactory: (errors) => {
        console.error('Errores de validación:', errors);
        return new BadRequestException({
          message: 'Datos de entrada inválidos',
          errors: errors.map(error => ({
            field: error.property,
            constraints: error.constraints,
            value: error.value,
          })),
        });
      },
    }),
  );

  // Configurar prefijo global para API (excluyendo el AppController)
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 FocusUp Backend corriendo en http://localhost:${port}`);
  console.log(`📊 Información general: http://localhost:${port}/`);
  console.log(`🎯 Endpoints de tareas: http://localhost:${port}/api/tasks`);
  console.log(`📝 Endpoints de subtareas: http://localhost:${port}/api/subtasks`);
}
bootstrap(); 