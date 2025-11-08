import React, { useState } from 'react';
import { useApp } from '../App';
import { geminiService } from '../services/geminiService';
import { AnalysisReport, LifeAreaStat } from '../types';
import { LIFE_AREA_CONFIG } from '../constants';

const StatCard: React.FC<{ stat: LifeAreaStat }> = ({ stat }) => {
    const config = LIFE_AREA_CONFIG[stat.area];
    const Icon = config.icon;
    // Note: This is an approximation of the next level's XP for visualization.
    // The actual leveling logic is in App.tsx.
    const xpForLevelOne = 100;
    const nextLevelXp = Math.pow(stat.level, 1 / 0.7) * xpForLevelOne;
    const currentLevelBaseXp = Math.pow(stat.level - 1, 1/0.7) * xpForLevelOne;
    const xpInLevel = stat.xp - currentLevelBaseXp;
    const xpToNextLevel = nextLevelXp - currentLevelBaseXp;

    const progress = xpToNextLevel > 0 ? (xpInLevel / xpToNextLevel) * 100 : 0;

    return (
        <div className={`p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 border-l-4 ${config.borderColor}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`${config.bgColor} p-2 rounded-full`}>
                        <Icon />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{stat.area}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nivel {stat.level}</p>
                    </div>
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{stat.xp} XP</span>
            </div>
            <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className={`${config.color.replace('text-', 'bg-')} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

const AnalysisSection: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{content}</p>
    </div>
);

const PanelView: React.FC = () => {
    const { lifeAreaStats, completedTasks, journal } = useApp();
    const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        try {
            const report = await geminiService.analyzeProgress(lifeAreaStats, completedTasks, journal);
            setAnalysis(report);
        } catch (error) {
            console.error("Error analyzing progress:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Panel de Control del Héroe</h1>
            
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Progreso por Área</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lifeAreaStats.map(stat => (
                        <StatCard key={stat.area} stat={stat} />
                    ))}
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-semibold mb-4">Análisis del Oráculo</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Obtén un análisis de tu progreso reciente y recomendaciones para seguir mejorando.</p>
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-brand-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 disabled:bg-gray-400 transition-colors"
                    >
                        {isLoading ? 'Analizando...' : 'Consultar al Oráculo'}
                    </button>
                    
                    {analysis && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AnalysisSection title="🌟 Destacado" content={analysis.highlights} />
                                <AnalysisSection title="🤔 A mejorar" content={analysis.lowlights} />
                            </div>
                            <AnalysisSection title="💪 Fortalezas" content={analysis.strengths} />
                            <AnalysisSection title="📉 Debilidades" content={analysis.weaknesses} />
                            <AnalysisSection title="🚀 Recomendaciones" content={analysis.recommendations} />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PanelView;
