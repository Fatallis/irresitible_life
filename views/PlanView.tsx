import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../App';
import { geminiService } from '../services/geminiService';
import { PlanItem, Subtask, Mentor, Task, TaskType } from '../types';
import { LIFE_AREA_CONFIG } from '../constants';
import { GoogleGenAI, Chat } from "@google/genai";

// --- Icons ---
const CheckIcon = () => <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;
const BreakdownIcon = () => <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>;
const MotivationIcon = () => <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-1.125a6.01 6.01 0 0 0-3 0m1.5 1.125a6.01 6.01 0 0 1-1.5-1.125m3 0a6.01 6.01 0 0 1-1.5 1.125m-1.5-1.125a3 3 0 1 1-6 0 3 3 0 0 1 6 0m12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-6 3.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 4.811 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;

interface PlanCardProps {
    item: PlanItem;
    onGetMotivation: (item: PlanItem) => void;
    onStartChat: (item: PlanItem) => void;
    onUpdateTitle: (itemId: string, newTitle: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ item, onGetMotivation, onStartChat, onUpdateTitle }) => {
    const { setDailyPlan, tasks, missions, addCompletedTask } = useApp();
    const config = LIFE_AREA_CONFIG[item.category];
    const Icon = config.icon;
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(item.title);
    const [isBreakingDown, setIsBreakingDown] = useState(false);

    const handleComplete = () => {
        let originalTask: Task | undefined;

        // Search for the task in the general pending list or active missions
        if (item.taskId) {
            originalTask = tasks.find(t => t.id === item.taskId);
            if (!originalTask) {
                for (const mission of missions) {
                    if (mission.active) {
                        originalTask = mission.tasks.find(t => t.id === item.taskId);
                        if (originalTask) break;
                    }
                }
            }
        }

        // Whether we found the original task or not, we record the completion.
        // If we found it, we use its data. If not, we create a temporary Task object from the PlanItem.
        const taskToComplete: Task = originalTask ?? {
            id: item.id, // Use plan item id as fallback
            title: item.title,
            type: TaskType.Accion, // Sensible default
            category: item.category,
            subtasks: item.subtasks ?? [],
            xp: item.xp,
            missionId: item.missionId,
            isUrgent: false, // Not relevant for completion
        };

        addCompletedTask(taskToComplete);
        setDailyPlan(prev => prev.filter(p => p.id !== item.id));
    };
    
    const handleDelete = () => {
        setDailyPlan(prev => prev.filter(p => p.id !== item.id));
    };

    const handleBreakdown = async () => {
        setIsBreakingDown(true);
        const subtaskTexts = await geminiService.generateSubtasks(item.title);
        const newSubtasks = subtaskTexts.map(text => ({ id: self.crypto.randomUUID(), text, completed: false }));
        setDailyPlan(prev => prev.map(p => p.id === item.id ? { ...p, subtasks: [...(p.subtasks || []), ...newSubtasks] } : p));
        setIsBreakingDown(false);
    };

    const handleTitleSave = () => {
        if(title.trim()) {
            onUpdateTitle(item.id, title);
        } else {
            setTitle(item.title); // Revert if empty
        }
        setIsEditing(false);
    };

    const SubtaskList = ({ subtasks }: { subtasks: Subtask[] }) => (
        <div className="mt-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600 space-y-1">
            {subtasks.map(st => <div key={st.id} className="text-sm text-gray-600 dark:text-gray-400">{st.text}</div>)}
        </div>
    );

    return (
        <div className={`relative p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 ${config.borderColor}`}>
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-20 text-right">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{item.time}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.xp} XP</p>
                </div>
                <div className="flex-grow">
                    {isEditing ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleSave}
                            onKeyPress={e => e.key === 'Enter' && handleTitleSave()}
                            className="w-full font-bold text-gray-800 dark:text-white bg-transparent border-b-2 border-brand-blue-500 focus:outline-none"
                            autoFocus
                        />
                    ) : (
                        <h3 className="font-bold text-gray-800 dark:text-white">{item.title}</h3>
                    )}
                    <p className="text-sm italic text-gray-600 dark:text-gray-400 mt-1">"{item.purposePhrase}"</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <Icon />
                        <span>{item.category}</span>
                        {item.missionId && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Misión</span>}
                    </div>
                </div>
            </div>
             {item.subtasks && item.subtasks.length > 0 && <SubtaskList subtasks={item.subtasks} />}
             <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-2">
                <button title="Marcar como hecha" onClick={handleComplete} className="p-2 text-gray-500 hover:bg-green-100 hover:text-green-600 dark:hover:bg-gray-700 rounded-full transition-colors"><CheckIcon /></button>
                <button title="Desglosar Tareas" onClick={handleBreakdown} disabled={isBreakingDown} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"><BreakdownIcon /></button>
                <button title="Motivación" onClick={() => onGetMotivation(item)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"><MotivationIcon /></button>
                <button title="Chat con Mentor" onClick={() => onStartChat(item)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"><ChatIcon /></button>
                <button title="Editar" onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"><EditIcon /></button>
                <button title="Eliminar" onClick={handleDelete} className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-gray-700 rounded-full transition-colors"><TrashIcon /></button>
            </div>
        </div>
    );
};

const MotivationModal = ({ motivation, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Motivación para: {motivation.title}</h3>
                <button onClick={onClose} className="text-2xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">&times;</button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-4">{motivation.text}</p>
            <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-brand-blue-600 text-white font-semibold rounded hover:bg-brand-blue-700">Cerrar</button>
        </div>
    </div>
);

const ChatModal = ({ item, messages, onClose, onSendMessage, isLoading, mentor }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg h-[80vh] flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 relative">
                    <h3 className="text-xl font-bold text-center">Chat con {mentor.name}</h3>
                    <p className="text-sm text-gray-500 text-center">Discutiendo: {item.title}</p>
                    <button onClick={onClose} className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-brand-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="text-center text-gray-500">...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t dark:border-gray-700 flex">
                    <input 
                        type="text" value={input} onChange={(e) => setInput(e.target.value)} 
                        onKeyPress={e => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder="Escribe tu mensaje..."
                        className="flex-grow p-2 border rounded-l-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    />
                    <button onClick={handleSend} disabled={isLoading} className="px-4 py-2 bg-brand-blue-600 text-white rounded-r-md disabled:bg-gray-400">Enviar</button>
                </div>
            </div>
        </div>
    );
};


const PlanView = () => {
    const { dailyPlan, setDailyPlan, tasks, missions, selectedMentor } = useApp();
    const [fixedEvents, setFixedEvents] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [motivation, setMotivation] = useState(null);
    const [chatItem, setChatItem] = useState(null);
    const [chatSession, setChatSession] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isChatLoading, setIsChatLoading] = useState(false);

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        try {
            const plan = await geminiService.generateDailyPlan(fixedEvents, tasks, missions.filter(m => m.active));
            const planWithIds = plan.map(p => ({
                ...p,
                id: self.crypto.randomUUID(),
                subtasks: []
            }));
            setDailyPlan(planWithIds);
        } catch (error) {
            console.error("Error generating daily plan:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetMotivation = async (item) => {
        if (!selectedMentor) {
            alert("Por favor, selecciona un mentor primero desde la pestaña 'Mentores'.");
            return;
        }
        setIsLoading(true);
        const motivationText = await geminiService.getMotivation(item.title, selectedMentor);
        setMotivation({ title: item.title, text: motivationText });
        setIsLoading(false);
    };
    
    const handleStartChat = (item) => {
        if (!selectedMentor) {
            alert("Por favor, selecciona un mentor primero desde la pestaña 'Mentores'.");
            return;
        }
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) return;
        const ai = new GoogleGenAI({ apiKey: API_KEY });

        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `Eres el mentor ${selectedMentor.name}. Tu filosofía es "${selectedMentor.philosophy}". Estás hablando con un usuario sobre su tarea del día: "${item.title}". Sé conciso, sabio y mantén tu personaje. Responde exclusivamente en español.`,
            },
        });
        setChatItem(item);
        setChatSession(newChat);
        setChatMessages([]);
    };

    const handleSendChatMessage = async (message) => {
        if (!chatSession) return;
        setIsChatLoading(true);
        setChatMessages(prev => [...prev, { role: 'user', text: message }]);
        const response = await chatSession.sendMessage({ message });
        setChatMessages(prev => [...prev, { role: 'model', text: response.text }]);
        setIsChatLoading(false);
    };

    const handleUpdateItemTitle = (itemId: string, newTitle: string) => {
        setDailyPlan(prev => prev.map(item => item.id === itemId ? { ...item, title: newTitle } : item));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Plan del Día</h1>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
                <h2 className="font-semibold mb-2">Eventos Fijos del Día</h2>
                <textarea
                    value={fixedEvents}
                    onChange={(e) => setFixedEvents(e.target.value)}
                    placeholder="Ej: 13:00-14:00 Almuerzo con el equipo&#x0a;19:00 Cena familiar"
                    className="w-full h-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-brand-blue-500"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGeneratePlan}
                    disabled={isLoading}
                    className="mt-4 w-full px-6 py-3 bg-brand-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 disabled:bg-gray-400 transition-colors"
                >
                    {isLoading ? 'Generando...' : 'Generar Plan del Día'}
                </button>
            </div>

            {dailyPlan.length > 0 ? (
                <div className="space-y-3">
                    {dailyPlan.map(item => 
                        <PlanCard 
                            key={item.id} 
                            item={item} 
                            onGetMotivation={handleGetMotivation}
                            onStartChat={handleStartChat}
                            onUpdateTitle={handleUpdateItemTitle}
                        />
                    )}
                </div>
            ) : (
                <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-500 dark:text-gray-400">Tu día está por planificar.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Añade tus eventos fijos y genera tu plan para empezar.</p>
                </div>
            )}

            {isLoading && <div className="text-center mt-4">Cargando...</div>}
            {motivation && <MotivationModal motivation={motivation} onClose={() => setMotivation(null)} />}
            {chatItem && <ChatModal item={chatItem} messages={chatMessages} onClose={() => setChatItem(null)} onSendMessage={handleSendChatMessage} isLoading={isChatLoading} mentor={selectedMentor} />}
        </div>
    );
};

export default PlanView;