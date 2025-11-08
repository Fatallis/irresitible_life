
import React, { useState, useCallback, useMemo, createContext, useContext } from 'react';
import { Task, PlanItem, Mentor, Mission, JournalEntry, LifeAreaStat, LifeArea, TaskType } from './types';
import { MENTORS_DATA } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';

// Views
import MenteView from './views/MenteView';
import PendientesView from './views/PendientesView';
import PlanView from './views/PlanView';
import MentoresView from './views/MentoresView';
import MisionesView from './views/MisionesView';
import PanelView from './views/PanelView';
import DiarioView from './views/DiarioView';

// Components
import BottomNav from './components/BottomNav';
import StorageManager from './components/StorageManager';

interface AppContextType {
    activeView: string;
    setActiveView: (view: string) => void;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    completedTasks: Task[];
    addCompletedTask: (task: Task) => void;
    dailyPlan: PlanItem[];
    setDailyPlan: React.Dispatch<React.SetStateAction<PlanItem[]>>;
    mentors: Mentor[];
    setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
    selectedMentor: Mentor | null;
    setSelectedMentor: React.Dispatch<React.SetStateAction<Mentor | null>>;
    missions: Mission[];
    setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
    journal: JournalEntry[];
    addJournalEntry: (text: string, icon: string) => void;
    lifeAreaStats: LifeAreaStat[];
    addXP: (area: LifeArea, xp: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within an AppProvider");
    return context;
};

const App: React.FC = () => {
    const [activeView, setActiveView] = useState('Mente');
    
    // Estados con persistencia en localStorage
    const [tasks, setTasks] = useLocalStorage<Task[]>('vida-irresistible-tasks', []);
    const [completedTasks, setCompletedTasks] = useLocalStorage<Task[]>('vida-irresistible-completed-tasks', []);
    const [dailyPlan, setDailyPlan] = useLocalStorage<PlanItem[]>('vida-irresistible-daily-plan', []);
    const [mentors, setMentors] = useLocalStorage<Mentor[]>('vida-irresistible-mentors', MENTORS_DATA);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [missions, setMissions] = useLocalStorage<Mission[]>('vida-irresistible-missions', []);
    const [journal, setJournal] = useLocalStorage<JournalEntry[]>('vida-irresistible-journal', []);
    const [lifeAreaStats, setLifeAreaStats] = useLocalStorage<LifeAreaStat[]>(
        'vida-irresistible-life-area-stats',
        Object.values(LifeArea).map(area => ({ area, xp: 0, level: 1 }))
    );

    const addJournalEntry = useCallback((text: string, icon: string) => {
        setJournal(prev => [{ id: self.crypto.randomUUID(), timestamp: new Date(), text, icon }, ...prev]);
    }, [setJournal]);

    const addXP = useCallback((area: LifeArea, xp: number) => {
        setLifeAreaStats(prevStats => {
            const newStats = prevStats.map(stat => {
                if (stat.area === area) {
                    const newXp = stat.xp + xp;
                    const newLevel = Math.floor(Math.pow(newXp / 100, 0.7)) + 1; // Example leveling curve
                    if(newLevel > stat.level) {
                        addJournalEntry(`¡Subiste al nivel ${newLevel} en ${area}!`, '🏆');
                        // Unlock mentors
                        setMentors(prevMentors => prevMentors.map(m => {
                            if (m.area === area && !m.unlocked && newLevel >= parseInt(m.unlockCondition.split(' ')[2])) {
                                addJournalEntry(`Mentor desbloqueado: ${m.name}`, '🌟');
                                return { ...m, unlocked: true };
                            }
                            return m;
                        }));
                    }
                    return { ...stat, xp: newXp, level: newLevel };
                }
                return stat;
            });
            return newStats;
        });
    }, [setLifeAreaStats, setMentors, addJournalEntry]);
    
    const addCompletedTask = useCallback((task: Task) => {
        setCompletedTasks(prev => [task, ...prev]);
        addXP(task.category, task.xp);
        addJournalEntry(`Tarea completada: "${task.title}"`, '✅');
    }, [setCompletedTasks, addXP, addJournalEntry]);


    const renderView = () => {
        switch (activeView) {
            case 'Mente': return <MenteView />;
            case 'Pendientes': return <PendientesView />;
            case 'Plan': return <PlanView />;
            case 'Mentores': return <MentoresView />;
            case 'Misiones': return <MisionesView />;
            case 'Panel': return <PanelView />;
            case 'Diario': return <DiarioView />;
            default: return <MenteView />;
        }
    };

    const contextValue = useMemo(() => ({
        activeView,
        setActiveView,
        tasks,
        setTasks,
        completedTasks,
        addCompletedTask,
        dailyPlan,
        setDailyPlan,
        mentors,
        setMentors,
        selectedMentor,
        setSelectedMentor,
        missions,
        setMissions,
        journal,
        addJournalEntry,
        lifeAreaStats,
        addXP,
    }), [activeView, tasks, completedTasks, dailyPlan, mentors, selectedMentor, missions, journal, lifeAreaStats, addCompletedTask, addJournalEntry, addXP]);

    return (
        <AppContext.Provider value={contextValue}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
                <main className="pb-20">
                    <div className="container mx-auto px-4 py-8">
                        {renderView()}
                    </div>
                </main>
                <BottomNav />
                <StorageManager />
            </div>
        </AppContext.Provider>
    );
};

export default App;
