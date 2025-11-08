import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar localStorage con React
 * @param key - Clave para localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns [value, setValue] - Estado y función para actualizarlo
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // Función para obtener el valor inicial desde localStorage
    const getStoredValue = (): T => {
        try {
            if (typeof window === 'undefined') {
                return initialValue;
            }
            
            const item = window.localStorage.getItem(key);
            if (item === null) {
                return initialValue;
            }
            
            return JSON.parse(item);
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    // Estado inicial
    const [storedValue, setStoredValue] = useState<T>(getStoredValue);

    // Función para actualizar el valor
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Permitir que value sea una función para casos como setCount(c => c + 1)
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            // Guardar en el estado
            setStoredValue(valueToStore);
            
            // Guardar en localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Escuchar cambios en localStorage desde otras pestañas
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.warn(`Error parsing localStorage change for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue];
}

/**
 * Hook para limpiar datos específicos de localStorage
 */
export function useClearLocalStorage() {
    const clearKey = (key: string) => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn(`Error clearing localStorage key "${key}":`, error);
        }
    };

    const clearAll = () => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.clear();
            }
        } catch (error) {
            console.warn('Error clearing all localStorage:', error);
        }
    };

    return { clearKey, clearAll };
}