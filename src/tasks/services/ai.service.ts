import OpenAI from 'openai';

export class AiService {
  /**
   * Divide una tarea en subtareas usando IA
   * Si hay una API key de OpenAI configurada, usa la API real
   * Si no, usa una función simulada mejorada
   */
  async splitTaskIntoSubtasks(description: string): Promise<string[]> {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (openaiApiKey && openaiApiKey !== 'your_openai_api_key_here') {
      return this.splitWithOpenAI(description, openaiApiKey);
    } else {
      return this.splitWithMockAI(description);
    }
  }

  /**
   * Función simulada de IA mejorada que divide tareas basándose en análisis más detallado
   */
  private async splitWithMockAI(description: string): Promise<string[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerDescription = description.toLowerCase();
    const words = description.split(/\s+/);
    const subtasks: string[] = [];

    // Análisis más detallado basado en múltiples criterios
    const analysis = this.analyzeTaskContent(description, lowerDescription, words);
    
    // Generar subtareas basadas en el análisis
    if (analysis.isProject) {
      subtasks.push(...this.generateProjectSubtasks(description, analysis));
    } else if (analysis.isLearning) {
      subtasks.push(...this.generateLearningSubtasks(description, analysis));
    } else if (analysis.isPhysical) {
      subtasks.push(...this.generatePhysicalSubtasks(description, analysis));
    } else if (analysis.isCreative) {
      subtasks.push(...this.generateCreativeSubtasks(description, analysis));
    } else if (analysis.isMaintenance) {
      subtasks.push(...this.generateMaintenanceSubtasks(description, analysis));
    } else {
      // Subtareas genéricas pero más específicas al contexto
      subtasks.push(...this.generateGenericSubtasks(description, analysis));
    }

    // Asegurar que tengamos entre 3-5 subtareas
    return subtasks.slice(0, 5);
  }

  /**
   * Análisis detallado del contenido de la tarea
   */
  private analyzeTaskContent(description: string, lowerDescription: string, words: string[]) {
    const analysis = {
      isProject: false,
      isLearning: false,
      isPhysical: false,
      isCreative: false,
      isMaintenance: false,
      hasDeadline: false,
      isComplex: false,
      keywords: [] as string[],
      domain: '' as string
    };

    // Detectar palabras clave específicas
    const projectKeywords = ['proyecto', 'project', 'desarrollar', 'crear', 'implementar', 'construir', 'diseñar'];
    const learningKeywords = ['estudiar', 'aprender', 'investigar', 'leer', 'analizar', 'comprender', 'memorizar'];
    const physicalKeywords = ['ejercicio', 'deporte', 'correr', 'gimnasio', 'entrenar', 'caminar', 'nadar'];
    const creativeKeywords = ['escribir', 'dibujar', 'pintar', 'componer', 'fotografiar', 'editar', 'crear'];
    const maintenanceKeywords = ['limpiar', 'organizar', 'reparar', 'mantener', 'revisar', 'actualizar'];

    // Analizar dominio específico
    const domains = {
      'tecnología': ['programar', 'código', 'software', 'app', 'web', 'database', 'api'],
      'salud': ['ejercicio', 'dieta', 'medicina', 'doctor', 'fitness', 'nutrición'],
      'educación': ['estudiar', 'curso', 'universidad', 'examen', 'tarea', 'investigación'],
      'hogar': ['limpiar', 'cocinar', 'reparar', 'organizar', 'decorar', 'jardín'],
      'trabajo': ['reunión', 'presentación', 'reporte', 'cliente', 'proyecto', 'deadline'],
      'finanzas': ['presupuesto', 'inversión', 'ahorro', 'gastos', 'banco', 'impuestos']
    };

    // Detectar tipo de tarea
    if (projectKeywords.some(keyword => lowerDescription.includes(keyword))) {
      analysis.isProject = true;
    }
    if (learningKeywords.some(keyword => lowerDescription.includes(keyword))) {
      analysis.isLearning = true;
    }
    if (physicalKeywords.some(keyword => lowerDescription.includes(keyword))) {
      analysis.isPhysical = true;
    }
    if (creativeKeywords.some(keyword => lowerDescription.includes(keyword))) {
      analysis.isCreative = true;
    }
    if (maintenanceKeywords.some(keyword => lowerDescription.includes(keyword))) {
      analysis.isMaintenance = true;
    }

    // Detectar complejidad y deadlines
    analysis.hasDeadline = lowerDescription.includes('fecha') || lowerDescription.includes('deadline') || 
                          lowerDescription.includes('hasta') || lowerDescription.includes('para');
    analysis.isComplex = words.length > 10 || lowerDescription.includes('complejo') || 
                        lowerDescription.includes('difícil') || lowerDescription.includes('desafiante');

    // Detectar dominio
    for (const [domain, keywords] of Object.entries(domains)) {
      if (keywords.some(keyword => lowerDescription.includes(keyword))) {
        analysis.domain = domain;
        break;
      }
    }

    // Extraer palabras clave relevantes
    analysis.keywords = words.filter(word => 
      word.length > 3 && 
      !['para', 'con', 'los', 'las', 'una', 'por', 'que', 'del', 'este', 'esta'].includes(word.toLowerCase())
    );

    return analysis;
  }

  /**
   * Generar subtareas específicas para proyectos
   */
  private generateProjectSubtasks(description: string, analysis: any): string[] {
    const subtasks = [];
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('web') || lowerDesc.includes('app')) {
      subtasks.push('Definir requerimientos y funcionalidades');
      subtasks.push('Crear wireframes y mockups');
      subtasks.push('Desarrollar frontend y backend');
      subtasks.push('Implementar base de datos');
      subtasks.push('Realizar pruebas y optimización');
    } else if (lowerDesc.includes('presentación') || lowerDesc.includes('reporte')) {
      subtasks.push('Recopilar información y datos');
      subtasks.push('Estructurar el contenido');
      subtasks.push('Crear visualizaciones y gráficos');
      subtasks.push('Preparar el material de presentación');
      subtasks.push('Practicar y ensayar la presentación');
    } else {
      subtasks.push('Definir objetivos y alcance del proyecto');
      subtasks.push('Crear plan de trabajo y cronograma');
      subtasks.push('Asignar recursos y responsabilidades');
      subtasks.push('Ejecutar las tareas planificadas');
      subtasks.push('Revisar resultados y hacer ajustes');
    }
    
    return subtasks;
  }

  /**
   * Generar subtareas específicas para aprendizaje
   */
  private generateLearningSubtasks(description: string, analysis: any): string[] {
    const subtasks = [];
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('idioma') || lowerDesc.includes('language')) {
      subtasks.push('Practicar vocabulario y gramática');
      subtasks.push('Escuchar podcasts o videos en el idioma');
      subtasks.push('Leer textos y artículos');
      subtasks.push('Conversar con hablantes nativos');
      subtasks.push('Completar ejercicios de práctica');
    } else if (lowerDesc.includes('programación') || lowerDesc.includes('coding')) {
      subtasks.push('Revisar conceptos teóricos');
      subtasks.push('Practicar con ejercicios básicos');
      subtasks.push('Desarrollar proyectos pequeños');
      subtasks.push('Revisar código y documentación');
      subtasks.push('Participar en desafíos de programación');
    } else {
      subtasks.push('Investigar y recopilar información del tema');
      subtasks.push('Crear notas y resúmenes estructurados');
      subtasks.push('Practicar con ejercicios y ejemplos');
      subtasks.push('Aplicar conocimientos en casos prácticos');
      subtasks.push('Evaluar progreso y reforzar conceptos débiles');
    }
    
    return subtasks;
  }

  /**
   * Generar subtareas específicas para actividades físicas
   */
  private generatePhysicalSubtasks(description: string, analysis: any): string[] {
    const subtasks = [];
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('gimnasio') || lowerDesc.includes('pesas')) {
      subtasks.push('Calentamiento cardiovascular (10-15 min)');
      subtasks.push('Ejercicios de fuerza principales');
      subtasks.push('Ejercicios complementarios');
      subtasks.push('Enfriamiento y estiramientos');
      subtasks.push('Hidratación y recuperación');
    } else if (lowerDesc.includes('correr') || lowerDesc.includes('running')) {
      subtasks.push('Estiramientos dinámicos');
      subtasks.push('Carrera principal con ritmo controlado');
      subtasks.push('Intervalos de velocidad (opcional)');
      subtasks.push('Enfriamiento progresivo');
      subtasks.push('Estiramientos estáticos');
    } else {
      subtasks.push('Preparación y calentamiento');
      subtasks.push('Actividad física principal');
      subtasks.push('Variaciones y progresiones');
      subtasks.push('Enfriamiento y recuperación');
      subtasks.push('Evaluación del rendimiento');
    }
    
    return subtasks;
  }

  /**
   * Generar subtareas específicas para actividades creativas
   */
  private generateCreativeSubtasks(description: string, analysis: any): string[] {
    const subtasks = [];
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('escribir') || lowerDesc.includes('write')) {
      subtasks.push('Generar ideas y lluvia de ideas');
      subtasks.push('Crear esquema y estructura');
      subtasks.push('Desarrollar el contenido principal');
      subtasks.push('Revisar y editar el texto');
      subtasks.push('Pulir detalles y formato final');
    } else if (lowerDesc.includes('dibujar') || lowerDesc.includes('pintar')) {
      subtasks.push('Hacer bocetos y estudios preliminares');
      subtasks.push('Preparar materiales y herramientas');
      subtasks.push('Desarrollar la composición principal');
      subtasks.push('Añadir detalles y texturas');
      subtasks.push('Finalizar y firmar la obra');
    } else {
      subtasks.push('Explorar inspiración y referencias');
      subtasks.push('Experimentar con técnicas y materiales');
      subtasks.push('Desarrollar el concepto principal');
      subtasks.push('Refinar y mejorar el resultado');
      subtasks.push('Documentar y compartir el trabajo');
    }
    
    return subtasks;
  }

  /**
   * Generar subtareas específicas para mantenimiento
   */
  private generateMaintenanceSubtasks(description: string, analysis: any): string[] {
    const subtasks = [];
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('limpiar') || lowerDesc.includes('clean')) {
      subtasks.push('Identificar áreas y superficies a limpiar');
      subtasks.push('Recolectar productos y herramientas necesarias');
      subtasks.push('Ejecutar limpieza sistemática por zonas');
      subtasks.push('Verificar resultados y hacer ajustes');
      subtasks.push('Organizar y guardar materiales');
    } else if (lowerDesc.includes('organizar') || lowerDesc.includes('organize')) {
      subtasks.push('Evaluar el estado actual del espacio');
      subtasks.push('Clasificar y categorizar elementos');
      subtasks.push('Descartar objetos innecesarios');
      subtasks.push('Implementar sistema de organización');
      subtasks.push('Mantener el orden establecido');
    } else {
      subtasks.push('Diagnosticar el problema o necesidad');
      subtasks.push('Planificar la solución y recursos');
      subtasks.push('Ejecutar las tareas de mantenimiento');
      subtasks.push('Verificar que todo funcione correctamente');
      subtasks.push('Documentar cambios y próximos pasos');
    }
    
    return subtasks;
  }

  /**
   * Generar subtareas genéricas pero contextuales
   */
  private generateGenericSubtasks(description: string, analysis: any): string[] {
    const subtasks = [];
    const lowerDesc = description.toLowerCase();
    
    // Personalizar basándose en el dominio detectado
    if (analysis.domain === 'tecnología') {
      subtasks.push('Analizar requerimientos técnicos');
      subtasks.push('Diseñar la solución');
      subtasks.push('Implementar y desarrollar');
      subtasks.push('Probar y depurar');
      subtasks.push('Documentar y desplegar');
    } else if (analysis.domain === 'salud') {
      subtasks.push('Consultar con profesionales');
      subtasks.push('Investigar opciones disponibles');
      subtasks.push('Planificar la implementación');
      subtasks.push('Ejecutar el plan de salud');
      subtasks.push('Monitorear progreso y resultados');
    } else if (analysis.domain === 'finanzas') {
      subtasks.push('Analizar situación financiera actual');
      subtasks.push('Establecer objetivos y metas');
      subtasks.push('Crear plan de acción');
      subtasks.push('Implementar estrategias');
      subtasks.push('Revisar y ajustar según resultados');
    } else {
      subtasks.push('Analizar el problema o objetivo');
      subtasks.push('Investigar opciones y alternativas');
      subtasks.push('Planificar la estrategia de acción');
      subtasks.push('Ejecutar el plan paso a paso');
      subtasks.push('Evaluar resultados y hacer mejoras');
    }
    
    return subtasks;
  }

  /**
   * Función para usar OpenAI API real
   */
  private async splitWithOpenAI(description: string, apiKey: string): Promise<string[]> {
    try {
      const openai = new OpenAI({ apiKey });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un asistente experto en productividad y gestión de tareas. Tu objetivo es dividir tareas en subtareas específicas, accionables y relevantes.

Instrucciones:
- Analiza cuidadosamente la descripción de la tarea
- Identifica el tipo de actividad (proyecto, aprendizaje, físico, creativo, mantenimiento, etc.)
- Genera 3-5 subtareas específicas y contextuales
- Las subtareas deben ser claras, medibles y realizables
- Considera la complejidad y el dominio de la tarea
- Responde solo con las subtareas, una por línea, sin numeración ni viñetas
- Usa un lenguaje claro y directo`
          },
          {
            role: "user",
            content: `Divide la siguiente tarea en subtareas específicas y relevantes: "${description}"`
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });
      
      const subtasks = completion.choices[0].message.content
        ?.split('\n')
        .map(task => task.trim())
        .filter(task => task.length > 0 && !task.match(/^\d+\./)) || [];
      
      // Si no se generaron subtareas válidas, usar fallback
      if (subtasks.length === 0) {
        console.log('OpenAI no generó subtareas válidas, usando fallback');
        return this.splitWithMockAI(description);
      }
      
      return subtasks;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      // Fallback a función simulada
      return this.splitWithMockAI(description);
    }
  }
} 