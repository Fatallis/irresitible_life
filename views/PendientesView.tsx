import React, { useState } from 'react';
import { useApp } from '../App';
import { Task, Subtask } from '../types';
import { geminiService } from '../services/geminiService';
import { LIFE_AREA_CONFIG } from '../constants';

// --- Icons ---
const BreakdownIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
);
const PlusIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);
const CheckIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);
const TrashIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);


const SubtaskItem: React.FC<{ subtask: Subtask, onToggle: (id: string) => void, onUpdate: (id: string, text: string) => void, onDelete: (id: string) => void }> = ({ subtask, onToggle, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(subtask.text);

    const handleUpdate = () => {
        onUpdate(subtask.id, text);
        setIsEditing(false);
    }

    return (
        <div className="flex items-center space-x-2 p-1 group">
            <input type="checkbox" checked={subtask.completed} onChange={() => onToggle(subtask.id)} className="form-checkbox h-4 w-4 text-brand-blue-600 rounded focus:ring-brand-blue-500" />
            {isEditing ? (
                <input 
                    type="text" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    onBlur={handleUpdate}
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
                    className="flex-grow bg-transparent border-b border-brand-blue-500 focus:outline-none"
                    autoFocus
                />
            ) : (
                <p onClick={() => setIsEditing(true)} className={`flex-grow cursor-pointer ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                    {subtask.text}
                </p>
            )}
            <button onClick={() => onDelete(subtask.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
}

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const { setTasks, addCompletedTask } = useApp();
    const [isBreakingDown, setIsBreakingDown] = useState(false);

    const config = LIFE_AREA_CONFIG[task.category];
    const Icon = config.icon;

    const handleBreakdown = async () => {
        setIsBreakingDown(true);
        const subtaskTexts = await geminiService.generateSubtasks(task.title);
        const newSubtasks: Subtask[] = subtaskTexts.map(text => ({ id: self.crypto.randomUUID(), text, completed: false }));
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, subtasks: [...t.subtasks, ...newSubtasks] } : t));
        setIsBreakingDown(false);
    };
    
    const handleToggleUrgent = () => setTasks(prev => prev.map(t => t.id === task.id ? {...t, isUrgent: !t.isUrgent} : t));
    const handleDone = () => {
        addCompletedTask(task);
        setTasks(prev => prev.filter(t => t.id !== task.id));
    }
    const handleDelete = () => setTasks(prev => prev.filter(t => t.id !== task.id));

    const handleSubtaskToggle = (subtaskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === task.id) {
                return { ...t, subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st) };
            }
            return t;
        }));
    };
    const handleSubtaskUpdate = (subtaskId: string, newText: string) => {
        setTasks(prev => prev.map(t => t.id === task.id ? {...t, subtasks: t.subtasks.map(st => st.id === subtaskId ? {...st, text: newText} : st)} : t));
    }
    const handleSubtaskDelete = (subtaskId: string) => {
        setTasks(prev => prev.map(t => t.id === task.id ? {...t, subtasks: t.subtasks.filter(st => st.id !== subtaskId)} : t));
    }
    const handleAddSubtask = () => {
        const newSubtask: Subtask = { id: self.crypto.randomUUID(), text: "Nueva subtarea", completed: false };
        setTasks(prev => prev.map(t => t.id === task.id ? {...t, subtasks: [...t.subtasks, newSubtask]} : t));
    }

    return (
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 ${config.borderColor} ${task.isUrgent ? 'ring-2 ring-yellow-400' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{task.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>{task.type}</span>
                        <div className="flex items-center space-x-1">
                           <Icon />
                           <span>{task.category}</span>
                        </div>
                        <span>{task.xp} XP</span>
                    </div>
                </div>
            </div>
            {task.subtasks.length > 0 && (
                <div className="mt-3 space-y-1">
                    {task.subtasks.map(st => <SubtaskItem key={st.id} subtask={st} onToggle={handleSubtaskToggle} onUpdate={handleSubtaskUpdate} onDelete={handleSubtaskDelete} />)}
                </div>
            )}
            <div className="mt-4 flex items-center justify-between">
                {/* Left side: AI and subtask actions */}
                <div className="flex items-center space-x-1">
                    <button title="Desglosar con IA" onClick={handleBreakdown} disabled={isBreakingDown} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full disabled:opacity-50 transition-colors">
                        <BreakdownIcon className="w-5 h-5" />
                    </button>
                    <button title="Añadir subtarea" onClick={handleAddSubtask} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Right side: Lifecycle actions */}
                <div className="flex items-center space-x-3">
                    <label htmlFor={`urgent-${task.id}`} className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-full hover:bg-yellow-100/50 dark:hover:bg-gray-700" title="Marcar como urgente">
                        <input 
                            id={`urgent-${task.id}`}
                            type="checkbox" 
                            checked={task.isUrgent} 
                            onChange={handleToggleUrgent}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-500 text-yellow-500 focus:ring-yellow-500"
                        />
                    </label>
                    <button title="Marcar como hecha" onClick={handleDone} className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors">
                        <CheckIcon className="w-5 h-5" />
                    </button>
                    <button title="Eliminar tarea" onClick={handleDelete} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const PendientesView: React.FC = () => {
    const { tasks } = useApp();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Pendientes</h1>
            {tasks.length > 0 ? (
                <div className="space-y-4">
                    {tasks.sort((a,b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0)).map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-500 dark:text-gray-400">¡Nada pendiente! Tu mente está clara.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Ve a la pestaña 'Mente' para añadir nuevas tareas.</p>
                </div>
            )}
        </div>
    );
};

export default PendientesView;