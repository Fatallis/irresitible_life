import React from 'react';
import { useApp } from '../App';
import { BrainIcon, ListIcon, CalendarIcon, PantheonIcon, FlagIcon, ChartIcon, BookIcon } from '../constants';

interface NavItemProps {
  label: string;
  // Fix: Changed JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-brand-blue-600 dark:text-brand-blue-400';
  const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:text-brand-blue-500 dark:hover:text-brand-blue-300';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  const navItems = [
    { id: 'Mente', icon: <BrainIcon />, label: 'Mente' },
    { id: 'Pendientes', icon: <ListIcon />, label: 'Pendientes' },
    { id: 'Plan', icon: <CalendarIcon />, label: 'Plan' },
    { id: 'Mentores', icon: <PantheonIcon />, label: 'Mentores' },
    { id: 'Misiones', icon: <FlagIcon />, label: 'Misiones' },
    { id: 'Panel', icon: <ChartIcon />, label: 'Panel' },
    { id: 'Diario', icon: <BookIcon />, label: 'Diario' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg flex justify-around items-center z-50">
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          label={item.label}
          icon={item.icon}
          isActive={activeView === item.id}
          onClick={() => setActiveView(item.id)}
        />
      ))}
    </nav>
  );
};

export default BottomNav;