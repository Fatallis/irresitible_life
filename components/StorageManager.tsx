import React, { useState, useRef } from 'react';
import { useClearLocalStorage } from '../hooks/useLocalStorage';
import { MENTORS_DATA } from '../constants';
import { LifeArea } from '../types';

interface StorageInfo {
    key: string;
    size: string;
    itemCount: number;
}

const STORAGE_KEYS = [
    'vida-irresistible-tasks',
    'vida-irresistible-completed-tasks',
    'vida-irresistible-daily-plan',
    'vida-irresistible-mentors',
    'vida-irresistible-missions',
    'vida-irresistible-journal',
    'vida-irresistible-life-area-stats'
];

// Valores por defecto para exportar cuando no existan entradas en localStorage
const DEFAULT_VALUES: Record<string, any> = {
    'vida-irresistible-tasks': [],
    'vida-irresistible-completed-tasks': [],
    'vida-irresistible-daily-plan': [],
    'vida-irresistible-mentors': MENTORS_DATA,
    'vida-irresistible-missions': [],
    'vida-irresistible-journal': [],
    'vida-irresistible-life-area-stats': Object.values(LifeArea).map(area => ({ area, xp: 0, level: 1 }))
};

const StorageManager: React.FC = () => {
    const { clearKey, clearAll } = useClearLocalStorage();
    const [showManager, setShowManager] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const getStorageInfo = (): StorageInfo[] => {
        const storageKeys = STORAGE_KEYS;
        return storageKeys.map(key => {
            const data = localStorage.getItem(key);
            const size = data ? `${(data.length / 1024).toFixed(2)} KB` : '0 KB';
            let itemCount = 0;
            
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    itemCount = Array.isArray(parsed) ? parsed.length : 1;
                } catch {
                    itemCount = 0;
                }
            }

            return { key, size, itemCount };
        });
    };

    const handleClearAll = () => {
        if (window.confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
            clearAll();
            window.location.reload();
        }
    };

    const handleClearKey = (key: string) => {
        if (window.confirm(`¿Estás seguro de que quieres borrar los datos de "${key}"?`)) {
            clearKey(key);
            window.location.reload();
        }
    };

    // Exportar datos a un archivo JSON
    const handleExport = () => {
        try {
            const backup: any = {
                version: '1.0',
                exportedAt: new Date().toISOString(),
                data: {}
            };

            STORAGE_KEYS.forEach(key => {
                const raw = localStorage.getItem(key);
                if (raw !== null) {
                    try {
                        backup.data[key] = JSON.parse(raw);
                    } catch {
                        backup.data[key] = raw;
                    }
                } else {
                    // Si no hay valor en localStorage, exportamos el valor por defecto
                    if (key in DEFAULT_VALUES) {
                        backup.data[key] = DEFAULT_VALUES[key];
                    }
                }
            });

            const json = JSON.stringify(backup, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
            const filename = `vida-irresistible-backup-${stamp}.json`;
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e: any) {
            alert('Error creando el backup: ' + (e?.message || 'desconocido'));
        }
    };

    // Importar datos desde un archivo JSON
    const triggerImport = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            if (!json || typeof json !== 'object' || !json.data || typeof json.data !== 'object') {
                alert('Archivo de backup inválido.');
                return;
            }
            let applied = 0;
            for (const key of Object.keys(json.data)) {
                if (STORAGE_KEYS.includes(key)) {
                    localStorage.setItem(key, JSON.stringify(json.data[key]));
                    applied++;
                }
            }
            alert(`Restauración completada. Claves aplicadas: ${applied}.`);
            window.location.reload();
        } catch (err: any) {
            console.error(err);
            alert('Error al importar el backup: ' + (err?.message || 'desconocido'));
        }
    };

    if (!showManager) {
        return (
            <button
                onClick={() => setShowManager(true)}
                className="fixed bottom-24 right-4 bg-gray-600 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
                title="Gestionar almacenamiento"
            >
                💾
            </button>
        );
    }

    const storageInfo = getStorageInfo();
    const totalSize = storageInfo.reduce((acc, info) => {
        const sizeNum = parseFloat(info.size.replace(' KB', ''));
        return acc + sizeNum;
    }, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Gestión de Almacenamiento</h3>
                    <button
                        onClick={() => setShowManager(false)}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tamaño total: <span className="font-semibold">{totalSize.toFixed(2)} KB</span>
                    </p>
                </div>

                <div className="space-y-2 mb-4">
                    {storageInfo.map(info => (
                        <div key={info.key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div>
                                <div className="text-sm font-medium">
                                    {info.key.replace('vida-irresistible-', '')}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {info.itemCount} elementos • {info.size}
                                </div>
                            </div>
                            <button
                                onClick={() => handleClearKey(info.key)}
                                className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                            >
                                Borrar
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                        Exportar (JSON)
                    </button>
                    <button
                        onClick={triggerImport}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                    >
                        Importar (JSON)
                    </button>
                </div>
                <input
                    type="file"
                    accept="application/json"
                    ref={fileInputRef}
                    onChange={handleFileSelected}
                    className="hidden"
                />

                <div className="flex gap-2">
                    <button
                        onClick={handleClearAll}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                    >
                        Borrar Todo
                    </button>
                    <button
                        onClick={() => setShowManager(false)}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded text-sm">
                    <p className="text-blue-800 dark:text-blue-200">
                        💡 <strong>Tip:</strong> Todos tus datos se guardan automáticamente en tu navegador. 
                        No se perderán al refrescar la página.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StorageManager;