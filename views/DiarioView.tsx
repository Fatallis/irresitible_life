
import React from 'react';
import { useApp } from '../App';
import { JournalEntry } from '../types';

const JournalEntryCard: React.FC<{ entry: JournalEntry, isLast: boolean }> = ({ entry, isLast }) => {
    return (
        <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
                <div className="flex items-center justify-center w-10 h-10 bg-brand-blue-100 dark:bg-brand-blue-900 rounded-full">
                    <span className="text-xl">{entry.icon}</span>
                </div>
                {!isLast && <div className="w-px h-16 bg-gray-300 dark:bg-gray-600"></div>}
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex-grow">
                <p className="text-gray-800 dark:text-gray-200">{entry.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{entry.timestamp.toLocaleString()}</p>
            </div>
        </div>
    );
};

const DiarioView: React.FC = () => {
    const { journal } = useApp();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Diario del Héroe</h1>
            {journal.length > 0 ? (
                <div className="flex flex-col space-y-0">
                    {journal.map((entry, index) => (
                        <JournalEntryCard key={entry.id} entry={entry} isLast={index === journal.length - 1} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-500 dark:text-gray-400">Tu diario está en blanco.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Completa tareas, acepta misiones y elige mentores para escribir tu historia.</p>
                </div>
            )}
        </div>
    );
};

export default DiarioView;
