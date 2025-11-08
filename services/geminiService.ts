import { GoogleGenAI, Type } from "@google/genai";
import { 
    Task, 
    PlanItem, 
    Mission, 
    Mentor,
    HabitPlan,
    LifeArea,
    TaskType,
    LifeAreaStat,
    JournalEntry,
    AnalysisReport
} from '../types';

// Per instructions, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper to parse JSON from Gemini response
const parseJson = <T>(jsonString: string, context: string): T => {
    try {
        // Gemini sometimes returns JSON wrapped in markdown-style code blocks.
        const cleanedString = jsonString.replace(/^```json\n?/, '').replace(/```$/, '').trim();
        return JSON.parse(cleanedString) as T;
    } catch (error) {
        console.error(`Error parsing JSON for ${context}:`, error, "Raw string:", jsonString);
        throw new Error(`Invalid JSON response from Gemini for ${context}.`);
    }
};

const geminiService = {
    async processMindDump(dumpText: string): Promise<Omit<Task, 'id' | 'subtasks' | 'xp' | 'isUrgent'>[]> {
        const prompt = `Analiza el siguiente volcado de texto en español y conviértelo en una lista de tareas. Considera que es comun usar acronimos para proyectos. Para cada elemento, determina un "title", un "type" ('Acción', 'Proyecto', 'Idea', 'Reflexión') y una "category" ('Salud', 'Conocimiento', 'Disciplina', 'Creatividad', 'Relaciones', 'Servicio'). Responde únicamente con un array JSON de objetos en español. Ejemplo: [{"title": "Comprar leche", "type": "Acción", "category": "Disciplina"}]. Texto a analizar:\n\n${dumpText}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            type: { type: Type.STRING, enum: Object.values(TaskType) },
                            category: { type: Type.STRING, enum: Object.values(LifeArea) },
                        },
                        required: ["title", "type", "category"],
                    }
                }
            }
        });

        const jsonString = response.text;
        return parseJson<Omit<Task, 'id' | 'subtasks' | 'xp' | 'isUrgent'>[]>(jsonString, 'mind dump');
    },

    async generateSubtasks(taskTitle: string): Promise<string[]> {
        const prompt = `Desglosa la siguiente tarea en una lista de 2 a 5 subtareas simples y accionables en español. Tarea: "${taskTitle}". Responde únicamente con un array JSON de strings. Ejemplo: ["Subtarea 1", "Subtarea 2"].`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        
        const jsonString = response.text;
        return parseJson<string[]>(jsonString, 'subtasks');
    },

    async generateDailyPlan(fixedEvents: string, tasks: Task[], activeMissions: Mission[]): Promise<Omit<PlanItem, 'id' | 'subtasks'>[]> {
        const context = `
            Eventos fijos del usuario para hoy: ${fixedEvents || 'Ninguno'}.
            Tareas importantes de su lista de pendientes: ${tasks.filter(t => t.isUrgent).map(t => t.title).join(', ') || 'Ninguna urgente'}.
            Tareas generales pendientes: ${tasks.filter(t => !t.isUrgent).map(t => t.title).join(', ') || 'Ninguna'}.
            Misiones heroicas activas que debe avanzar: ${activeMissions.map(m => `${m.title} (${m.description})`).join('; ') || 'Ninguna'}.
        `;
        const prompt = `Como un mentor de vida experto, crea un plan diario realista y con propósito para un usuario, basado en su contexto. El plan debe ir de ~08:00 a ~22:00. Prioriza tareas urgentes y de misiones. Para cada ítem del plan, genera un objeto JSON con las siguientes claves:
    - "title": El título claro y conciso de la tarea.
    - "time": Un rango horario estimado (ej. "09:00 - 10:00").
    - "category": La categoría de la tarea (de ${Object.values(LifeArea).join(', ')}).
    - "xp": Puntos de experiencia (un número entero entre 5 y 25).
    - "purposePhrase": Esta frase es CRUCIAL. No es una cita genérica. Debe conectar la tarea con la transformación personal del usuario. Debe darle un significado profundo al esfuerzo, explicando cómo esta pequeña acción contribuye a sus metas a largo plazo y a la persona en la que se quiere convertir. Debe ser breve, profunda y filosófica, y en español.
    - "taskId": El ID de la tarea original de la lista de pendientes, si aplica.
    - "missionId": El ID de la misión original, si aplica.
    
    Responde ÚNICAMENTE con un array JSON de estos objetos. No incluyas texto introductorio ni explicaciones.
    
    Contexto del usuario:
    ${context}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
             config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            time: { type: Type.STRING },
                            category: { type: Type.STRING, enum: Object.values(LifeArea) },
                            xp: { type: Type.INTEGER },
                            purposePhrase: { type: Type.STRING },
                            taskId: { type: Type.STRING },
                            missionId: { type: Type.STRING },
                        },
                        required: ["title", "time", "category", "xp", "purposePhrase"],
                    }
                }
            }
        });

        const jsonString = response.text;
        return parseJson<Omit<PlanItem, 'id' | 'subtasks'>[]>(jsonString, 'daily plan');
    },
    
    async getMotivation(taskTitle: string, mentor: Mentor): Promise<string> {
        const prompt = `Actúa como el mentor ${mentor.name}, cuya filosofía es "${mentor.philosophy}". Da un breve mensaje de motivación (2-3 frases cortas) para la tarea "${taskTitle}". Responde solo con el texto de la motivación, en español.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    },
    
    async generateMissionProposals(area: LifeArea, difficulty: string): Promise<Omit<Mission, 'id' | 'active' | 'tasks'>[]> {
        const prompt = `Genera 3 propuestas de misiones en español para el área de vida "${area}" con una dificultad "${difficulty}". Cada misión debe tener un "title" (título épico), "description" (breve descripción), y "area" (que será "${area}"). Responde únicamente con un array JSON de 3 objetos.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
             config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            area: { type: Type.STRING, enum: [area] },
                        },
                         required: ["title", "description", "area"],
                    }
                }
            }
        });
        
        const jsonString = response.text;
        return parseJson<Omit<Mission, 'id' | 'active' | 'tasks'>[]>(jsonString, 'mission proposals');
    },
    
    async generateHabitAdoptionPlan(habitDescription: string): Promise<HabitPlan> {
        const prompt = `Crea un plan simple para adoptar el hábito: "${habitDescription}". Define una tarea principal clave ("coreHabitTaskName") y una lista de 2-3 hábitos de apoyo ("supportiveHabits"). Responde únicamente con un objeto JSON en español con las claves "coreHabitTaskName" y "supportiveHabits" (un array de strings).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
             config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        coreHabitTaskName: { type: Type.STRING },
                        supportiveHabits: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["coreHabitTaskName", "supportiveHabits"],
                }
            }
        });

        const jsonString = response.text;
        return parseJson<HabitPlan>(jsonString, 'habit plan');
    },
    
    async analyzeProgress(stats: LifeAreaStat[], completedTasks: Task[], journal: JournalEntry[]): Promise<AnalysisReport> {
        const context = `
            Estadísticas actuales (nivel, xp): ${JSON.stringify(stats)}.
            Últimas 10 tareas completadas: ${JSON.stringify(completedTasks.slice(0, 10).map(t => t.title))}.
            Últimos 5 eventos del diario: ${JSON.stringify(journal.slice(0, 5).map(e => e.text))}.
        `;
        const prompt = `Analiza el progreso del usuario basándote en estos datos. Proporciona un breve informe en español con: "strengths" (fortalezas observadas), "weaknesses" (áreas de mejora), "recommendations" (sugerencias concretas), "highlights" (un logro destacado), y "lowlights" (un punto de atención). Responde únicamente con un objeto JSON con esas 5 claves (todas strings).
        ${context}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using Pro for more complex analysis
            contents: prompt,
             config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        strengths: { type: Type.STRING },
                        weaknesses: { type: Type.STRING },
                        recommendations: { type: Type.STRING },
                        highlights: { type: Type.STRING },
                        lowlights: { type: Type.STRING },
                    },
                    required: ["strengths", "weaknesses", "recommendations", "highlights", "lowlights"],
                }
            }
        });
        
        const jsonString = response.text;
        return parseJson<AnalysisReport>(jsonString, 'progress analysis');
    }
};

export { geminiService };