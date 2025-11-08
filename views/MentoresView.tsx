import React, { useMemo } from 'react';
import { useApp } from '../App';
import { Mentor, LifeArea, MentorTier } from '../types';
import { LIFE_AREA_CONFIG } from '../constants';

const TIER_COLORS: { [key in MentorTier]: string } = {
    [MentorTier.Inicial]: 'bg-green-500',
    [MentorTier.Intermedio]: 'bg-blue-500',
    [MentorTier.Maestro]: 'bg-purple-500',
};

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;

const MentorCard: React.FC<{ mentor: Mentor }> = ({ mentor }) => {
    const { selectedMentor, setSelectedMentor, addJournalEntry } = useApp();
    const isSelected = selectedMentor?.id === mentor.id;
    
    const handleSelect = () => {
        if (!mentor.unlocked) return;
        setSelectedMentor(mentor);
        addJournalEntry(`Has seleccionado a ${mentor.name} como tu mentor.`, '🤝');
    };

    return (
        <div className={`relative rounded-lg shadow-md overflow-hidden transition-all duration-300 ${mentor.unlocked ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'}`}>
            <img 
                src={`https://picsum.photos/seed/${mentor.id}/400/200`} 
                alt={mentor.name} 
                className={`w-full h-24 object-cover ${!mentor.unlocked ? 'grayscale' : ''}`}
            />
            <div className="p-4">
                <h3 className={`font-bold text-lg ${mentor.unlocked ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{mentor.name}</h3>
                <p className={`text-xs italic mt-1 ${mentor.unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>"{mentor.philosophy}"</p>
                <div className="flex items-center justify-between mt-3 text-xs">
                    <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${TIER_COLORS[mentor.tier]}`}></div>
                        <span>{mentor.tier}</span>
                    </div>
                    {LIFE_AREA_CONFIG[mentor.area].icon()}
                </div>
            </div>
            {!mentor.unlocked && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-2 text-center">
                    <LockIcon />
                    <p className="text-xs mt-1">{mentor.unlockCondition}</p>
                </div>
            )}
            {mentor.unlocked && (
                <button
                    onClick={handleSelect}
                    className={`w-full text-center py-2 font-semibold text-sm transition-colors ${isSelected ? 'bg-brand-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-brand-blue-800 dark:text-brand-blue-300 hover:bg-brand-blue-200 dark:hover:bg-brand-blue-900'}`}
                >
                    {isSelected ? 'Seleccionado' : 'Seleccionar'}
                </button>
            )}
        </div>
    );
}

const MentoresView: React.FC = () => {
    const { mentors } = useApp();

    const groupedMentors = useMemo(() => {
        // Fix: The previous for-loop implementation was causing type inference issues.
        // Replaced with a correctly typed `reduce` to group mentors by area.
        return mentors.reduce((acc, mentor) => {
            const area = mentor.area;
            if (!acc[area]) {
                acc[area] = [];
            }
            acc[area].push(mentor);
            return acc;
        }, {} as Record<LifeArea, Mentor[]>);
    }, [mentors]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Panteón de la Sabiduría</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Elige un mentor que te inspire. Su filosofía guiará tus sugerencias y motivaciones.</p>
            <div className="space-y-8">
                {/* Fix: Explicitly cast the result of Object.entries to resolve type inference issue. */}
                {(Object.entries(groupedMentors) as [LifeArea, Mentor[]][]).map(([area, areaMentors]) => (
                    <div key={area}>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                           {LIFE_AREA_CONFIG[area].icon()}
                           <span>{area}</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {areaMentors.map(mentor => (
                                <MentorCard key={mentor.id} mentor={mentor} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MentoresView;