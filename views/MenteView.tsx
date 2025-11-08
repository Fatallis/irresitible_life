
import React, { useState } from 'react';
import { useApp } from '../App';
import { geminiService } from '../services/geminiService';
import { Task } from '../types';

const MenteView: React.FC = () => {
    const { setTasks, setActiveView } = useApp();
    const [dumpText, setDumpText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleProcess = async () => {
        if (!dumpText.trim()) return;
        setIsLoading(true);
        try {
            const processedItems = await geminiService.processMindDump(dumpText);
            const newTasks: Task[] = processedItems.map(item => ({
                ...item,
                id: self.crypto.randomUUID(),
                subtasks: [],
                xp: 10, // default XP
                isUrgent: false,
            }));
            setTasks(prev => [...newTasks, ...prev]);
            setDumpText('');
            setActiveView('Pendientes');
        } catch (error) {
            console.error("Error processing mind dump:", error);
            // Here you could show an error toast to the user
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Vaciado Mental</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                Libera tu mente. Escribe todo lo que tengas pendiente, ideas, preocupaciones. El Oráculo lo organizará por ti.
            </p>

            <div className="w-full max-w-2xl">
                <textarea
                    value={dumpText}
                    onChange={(e) => setDumpText(e.target.value)}
                    placeholder="Escribe una cosa por línea..."
                    className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500 transition-shadow"
                    disabled={isLoading}
                />
            </div>
            <button
                onClick={handleProcess}
                disabled={isLoading || !dumpText.trim()}
                className="mt-8 px-12 py-4 bg-brand-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-lg flex items-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                    </>
                ) : (
                    'Vaciar Mente'
                )}
            </button>
        </div>
    );
};

export default MenteView;
