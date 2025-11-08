import React, { useState } from 'react';
import { useApp } from '../App';
import { Mission, LifeArea, Task, TaskType } from '../types';
import { geminiService } from '../services/geminiService';
import { LIFE_AREA_CONFIG } from '../constants';

const MissionCard: React.FC<{ mission: Mission, onAccept?: () => void, isProposal?: boolean }> = ({ mission, onAccept, isProposal = false }) => {
    const config = LIFE_AREA_CONFIG[mission.area];
    return (
        <div className={`p-4 rounded-lg shadow-md border-l-4 ${config.borderColor} bg-white dark:bg-gray-800`}>
            <h3 className="font-bold text-lg">{mission.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{mission.description}</p>
            {isProposal && onAccept && (
                 <button onClick={onAccept} className="mt-3 w-full px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 text-sm">
                    Aceptar Misión
                </button>
            )}
        </div>
    );
}

type Difficulty = 'Fácil' | 'Intermedia' | 'Difícil';

const MisionesView: React.FC = () => {
    const { missions, setMissions, addJournalEntry } = useApp();
    const [habitDescription, setHabitDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // State for Oracle proposals
    const [selectedArea, setSelectedArea] = useState<LifeArea | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
    const [missionProposals, setMissionProposals] = useState<Omit<Mission, 'id' | 'active' | 'tasks'>[]>([]);

    const activeMissions = missions.filter(m => m.active);

    const handleSelectArea = (area: LifeArea) => {
        setSelectedArea(area);
        setSelectedDifficulty(null);
        setMissionProposals([]);
    }

    const handleGenerateMissions = async (difficulty: Difficulty) => {
        if (!selectedArea) return;
        setSelectedDifficulty(difficulty);
        setIsGenerating(true);
        try {
            const proposals = await geminiService.generateMissionProposals(selectedArea, difficulty);
            setMissionProposals(proposals);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    }

    const acceptOracleMission = (missionData: Omit<Mission, 'id' | 'active' | 'tasks'>) => {
        const newMission: Mission = {
            ...missionData,
            id: self.crypto.randomUUID(),
            active: true,
            tasks: [], // A more advanced version could generate initial tasks here too
        };
        setMissions(prev => [...prev, newMission]);
        addJournalEntry(`Has aceptado la misión: "${newMission.title}"`, '📜');
        // Reset flow
        setSelectedArea(null);
        setSelectedDifficulty(null);
        setMissionProposals([]);
    }

    const handleGenerateHabit = async () => {
        if (!habitDescription.trim()) return;
        setIsGenerating(true);
        try {
            const plan = await geminiService.generateHabitAdoptionPlan(habitDescription);
            const missionToActivate: Mission = {
                id: self.crypto.randomUUID(),
                title: `Forjar Hábito: ${habitDescription}`,
                description: `Integrar "${habitDescription}" en tu vida. Tarea principal: ${plan.coreHabitTaskName}.`,
                area: LifeArea.Disciplina,
                active: true,
                tasks: [
                    {
                        id: self.crypto.randomUUID(),
                        title: plan.coreHabitTaskName,
                        category: LifeArea.Disciplina,
                        type: TaskType.Accion,
                        subtasks: [], xp: 15, missionId: 'temp', isUrgent: true,
                    },
                    ...plan.supportiveHabits.map(habit => ({
                        id: self.crypto.randomUUID(),
                        title: habit,
                        category: LifeArea.Disciplina,
                        type: TaskType.Accion,
                        subtasks: [], xp: 5, missionId: 'temp', isUrgent: false,
                    }))
                ],
                habitPlan: plan,
            };
            missionToActivate.tasks.forEach(t => t.missionId = missionToActivate.id); // Fix temp id
            
            setMissions(prev => [...prev, missionToActivate]);
            addJournalEntry(`Has aceptado la misión: "${missionToActivate.title}"`, '📜');
            setHabitDescription('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Misiones Heroicas</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Misiones Activas</h2>
                {activeMissions.length > 0 ? (
                    <div className="space-y-4">
                        {activeMissions.map(m => <MissionCard key={m.id} mission={m} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No hay misiones activas. ¡Acepta un nuevo desafío!</p>
                )}
            </section>
            
            <div className="space-y-8">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Propuestas del Oráculo</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Elige un área de vida para recibir una propuesta de misión del Oráculo.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
                        {Object.values(LifeArea).map(area => (
                            <button key={area} onClick={() => handleSelectArea(area)} className={`p-2 rounded-md flex flex-col items-center border-2 transition-colors ${selectedArea === area ? 'bg-brand-blue-100 dark:bg-brand-blue-900 border-brand-blue-500' : 'bg-gray-100 dark:bg-gray-700 border-transparent hover:border-brand-blue-400'}`}>
                                {React.createElement(LIFE_AREA_CONFIG[area].icon, { className: "w-6 h-6"})}
                                <span className="text-xs mt-1">{area}</span>
                            </button>
                        ))}
                    </div>

                    {selectedArea && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-center mb-2">Selecciona una dificultad:</h3>
                            <div className="flex justify-center space-x-2">
                                {(['Fácil', 'Intermedia', 'Difícil'] as Difficulty[]).map(diff => (
                                    <button key={diff} onClick={() => handleGenerateMissions(diff)} disabled={isGenerating} className={`px-4 py-2 rounded-md font-semibold text-sm ${selectedDifficulty === diff ? 'bg-brand-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-brand-blue-200'}`}>
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {isGenerating && <p className="text-center mt-4">El Oráculo está consultando... 🔮</p>}

                    {missionProposals.length > 0 && (
                        <div className="mt-6 space-y-3">
                             <h3 className="font-semibold text-center mb-2">Elige tu misión:</h3>
                            {missionProposals.map((proposal, i) => (
                                <MissionCard key={i} mission={proposal as Mission} onAccept={() => acceptOracleMission(proposal)} isProposal={true} />
                            ))}
                        </div>
                    )}
                </section>

                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                     <h2 className="text-2xl font-semibold mb-4">Forja tu Hábito</h2>
                     <p className="text-gray-600 dark:text-gray-400 mb-4">Describe un hábito que deseas construir. El Oráculo creará un plan de adopción para ti.</p>
                     <textarea
                        value={habitDescription}
                        onChange={(e) => setHabitDescription(e.target.value)}
                        placeholder="Ej: Meditar 10 minutos cada mañana"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        rows={2}
                     />
                     <button onClick={handleGenerateHabit} disabled={isGenerating || !habitDescription} className="mt-2 w-full px-6 py-3 bg-brand-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-700 disabled:bg-gray-400">
                        {isGenerating ? "Forjando plan..." : "Generar Plan de Hábito"}
                     </button>
                </section>
            </div>
        </div>
    );
};

export default MisionesView;
