
import { LifeArea, Mentor, MentorTier } from './types';

// Icons
export const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 15.137A7.5 7.5 0 0112 7.5h0a7.5 7.5 0 017.129 7.637m-14.258 0c.346.913.74 1.797 1.188 2.638M19.129 15.137c-.346.913-.74 1.797-1.188 2.638m-12.753 0V21m12.753-3.225V21m-6.376-3.225V21m0-13.5V3M12 7.5h.008v.008H12V7.5z" /></svg>;
export const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
export const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
export const PantheonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
export const FlagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>;
export const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
export const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;

export const HealthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
export const KnowledgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>;
export const DisciplineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>;
export const CreativityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>;
export const RelationshipsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>;
export const ServiceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H6a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" /></svg>;

export const LIFE_AREA_CONFIG = {
  [LifeArea.Salud]: { color: 'text-red-500', borderColor: 'border-red-500', bgColor: 'bg-red-100', icon: HealthIcon },
  [LifeArea.Conocimiento]: { color: 'text-blue-500', borderColor: 'border-blue-500', bgColor: 'bg-blue-100', icon: KnowledgeIcon },
  [LifeArea.Disciplina]: { color: 'text-gray-500', borderColor: 'border-gray-500', bgColor: 'bg-gray-100', icon: DisciplineIcon },
  [LifeArea.Creatividad]: { color: 'text-purple-500', borderColor: 'border-purple-500', bgColor: 'bg-purple-100', icon: CreativityIcon },
  [LifeArea.Relaciones]: { color: 'text-pink-500', borderColor: 'border-pink-500', bgColor: 'bg-pink-100', icon: RelationshipsIcon },
  [LifeArea.Servicio]: { color: 'text-green-500', borderColor: 'border-green-500', bgColor: 'bg-green-100', icon: ServiceIcon },
};

export const MENTORS_DATA: Mentor[] = [
  // Salud
  { id: 1, name: 'Cristiano Ronaldo', philosophy: 'disciplina total, cuerpo cuidado al extremo.', area: LifeArea.Salud, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 2, name: 'Dwayne “The Rock” Johnson', philosophy: 'energía positiva y entrenamiento constante.', area: LifeArea.Salud, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 3, name: 'Arnold Schwarzenegger', philosophy: 'fuerza, constancia y visión.', area: LifeArea.Salud, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 4, name: 'Michael Jordan', philosophy: 'esfuerzo físico y mental de alto nivel.', area: LifeArea.Salud, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 3 en Salud' },
  { id: 5, name: 'Bruce Lee', philosophy: 'cuerpo y mente en equilibrio.', area: LifeArea.Salud, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 5 en Salud' },
  { id: 6, name: 'Jackie Chan', philosophy: 'vitalidad, acrobacia y disciplina inquebrantable.', area: LifeArea.Salud, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 10 en Salud' },
  { id: 7, name: 'Sylvester Stallone', philosophy: 'esfuerzo, reinvención y superación física.', area: LifeArea.Salud, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 12 en Salud' },
  { id: 8, name: 'Jean-Claude Van Damme', philosophy: 'control físico y mental.', area: LifeArea.Salud, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 15 en Salud' },
  { id: 9, name: 'Tom Cruise', philosophy: 'condición y energía en cada reto.', area: LifeArea.Salud, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 18 en Salud' },
  { id: 10, name: 'Usain Bolt', philosophy: 'cuerpo diseñado para la excelencia y alegría.', area: LifeArea.Salud, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 20 en Salud' },
  { id: 11, name: 'Pelé', philosophy: 'símbolo de salud, alegría y vitalidad.', area: LifeArea.Salud, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 25 en Salud' },
  { id: 12, name: 'Muhammad Ali', philosophy: 'cuerpo, mente y orgullo integrados.', area: LifeArea.Salud, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 30 en Salud' },
  // Conocimiento
  { id: 13, name: 'Steve Jobs', philosophy: 'pensamiento diferente y curiosidad constante.', area: LifeArea.Conocimiento, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 14, name: 'Bill Gates', philosophy: 'aprendizaje continuo y mente analítica.', area: LifeArea.Conocimiento, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 15, name: 'Albert Einstein', philosophy: 'imaginación al servicio del conocimiento.', area: LifeArea.Conocimiento, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 16, name: 'Leonardo da Vinci', philosophy: 'curiosidad universal.', area: LifeArea.Conocimiento, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 5 en Conocimiento' },
  { id: 17, name: 'Isaac Newton', philosophy: 'pensamiento metódico y profundo.', area: LifeArea.Conocimiento, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 7 en Conocimiento' },
  { id: 18, name: 'Nikola Tesla', philosophy: 'inventiva y pensamiento adelantado a su tiempo.', area: LifeArea.Conocimiento, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 10 en Conocimiento' },
  { id: 19, name: 'Stephen Hawking', philosophy: 'sabiduría bajo condiciones extremas.', area: LifeArea.Conocimiento, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 12 en Conocimiento' },
  { id: 20, name: 'Carl Sagan', philosophy: 'pasión por enseñar y explorar.', area: LifeArea.Conocimiento, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 15 en Conocimiento' },
  { id: 21, name: 'Aristóteles', philosophy: 'método y orden mental.', area: LifeArea.Conocimiento, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 18 en Conocimiento' },
  { id: 22, name: 'Confucio', philosophy: 'conocimiento aplicado a la vida ética.', area: LifeArea.Conocimiento, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 20 en Conocimiento' },
  { id: 23, name: 'Socrates', philosophy: 'sabiduría a través de la pregunta.', area: LifeArea.Conocimiento, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 25 en Conocimiento' },
  { id: 24, name: 'Platón', philosophy: 'pensamiento profundo y visión filosófica.', area: LifeArea.Conocimiento, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 30 en Conocimiento' },
  // Disciplina
  { id: 25, name: 'Cristiano Ronaldo', philosophy: 'entrenamiento y enfoque impecable.', area: LifeArea.Disciplina, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 26, name: 'Michael Jordan', philosophy: 'práctica incansable y perfeccionismo.', area: LifeArea.Disciplina, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 27, name: 'Tom Brady', philosophy: 'longevidad gracias a disciplina extrema.', area: LifeArea.Disciplina, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 3 en Disciplina' },
  { id: 28, name: 'Arnold Schwarzenegger', philosophy: 'esfuerzo sostenido y visión.', area: LifeArea.Disciplina, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 5 en Disciplina' },
  { id: 29, name: 'The Rock', philosophy: 'madrugar y cumplir sin excusas.', area: LifeArea.Disciplina, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 7 en Disciplina' },
  { id: 30, name: 'Kobe Bryant', philosophy: 'obsesión por la mejora constante.', area: LifeArea.Disciplina, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 10 en Disciplina' },
  { id: 31, name: 'Bruce Lee', philosophy: 'control y repetición perfecta.', area: LifeArea.Disciplina, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 12 en Disciplina' },
  { id: 32, name: 'Benjamin Franklin', philosophy: 'método y mejora continua.', area: LifeArea.Disciplina, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 15 en Disciplina' },
  { id: 33, name: 'Sun Tzu', philosophy: 'disciplina estratégica.', area: LifeArea.Disciplina, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 20 en Disciplina' },
  { id: 34, name: 'Miyamoto Musashi', philosophy: 'dominio personal y constancia.', area: LifeArea.Disciplina, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 25 en Disciplina' },
  { id: 35, name: 'Epicteto', philosophy: 'control de uno mismo (estoicismo).', area: LifeArea.Disciplina, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 30 en Disciplina' },
  // Creatividad
  { id: 36, name: 'Walt Disney', philosophy: 'sueños hechos realidad.', area: LifeArea.Creatividad, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 37, name: 'Steve Jobs', philosophy: 'creatividad con propósito.', area: LifeArea.Creatividad, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 38, name: 'Stan Lee', philosophy: 'héroes humanos con valores.', area: LifeArea.Creatividad, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 3 en Creatividad' },
  { id: 39, name: 'George Lucas', philosophy: 'creación de universos con mensaje.', area: LifeArea.Creatividad, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 5 en Creatividad' },
  { id: 40, name: 'Jim Carrey', philosophy: 'libertad expresiva y autenticidad.', area: LifeArea.Creatividad, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 7 en Creatividad' },
  { id: 41, name: 'Robin Williams', philosophy: 'humor creativo y emocional.', area: LifeArea.Creatividad, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 10 en Creatividad' },
  { id: 42, name: 'Michael Jackson', philosophy: 'innovación musical y escénica.', area: LifeArea.Creatividad, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 12 en Creatividad' },
  { id: 43, name: 'Quentin Tarantino', philosophy: 'narrativa fuera de lo común.', area: LifeArea.Creatividad, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 15 en Creatividad' },
  { id: 44, name: 'Leonardo da Vinci', philosophy: 'unión entre arte y ciencia.', area: LifeArea.Creatividad, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 20 en Creatividad' },
  { id: 45, name: 'Pablo Picasso', philosophy: 'revolución visual.', area: LifeArea.Creatividad, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 25 en Creatividad' },
  { id: 46, name: 'Salvador Dalí', philosophy: 'imaginación sin fronteras.', area: LifeArea.Creatividad, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 30 en Creatividad' },
  // Relaciones
  { id: 47, name: 'Keanu Reeves', philosophy: 'humildad y bondad genuina.', area: LifeArea.Relaciones, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 48, name: 'Tom Hanks', philosophy: 'carisma y sencillez constante.', area: LifeArea.Relaciones, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 49, name: 'Robin Williams', philosophy: 'humor empático y calidez.', area: LifeArea.Relaciones, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 3 en Relaciones' },
  { id: 50, name: 'Will Smith', philosophy: 'energía positiva y conexión humana.', area: LifeArea.Relaciones, tier: MentorTier.Inicial, unlocked: false, unlockCondition: 'Llega a nivel 5 en Relaciones' },
  { id: 51, name: 'Oprah Winfrey', philosophy: 'maestra de la empatía y la escucha.', area: LifeArea.Relaciones, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 10 en Relaciones' },
  { id: 52, name: 'Barack Obama', philosophy: 'liderazgo humano y cercano.', area: LifeArea.Relaciones, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 12 en Relaciones' },
  { id: 53, name: 'Dalai Lama', philosophy: 'compasión práctica.', area: LifeArea.Relaciones, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 20 en Relaciones' },
  { id: 54, name: 'Martin Luther King Jr.', philosophy: 'amor activo y unión.', area: LifeArea.Relaciones, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 25 en Relaciones' },
  { id: 55, name: 'Mister Rogers', philosophy: 'enseñó empatía y ternura humana.', area: LifeArea.Relaciones, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 30 en Relaciones' },
  // Servicio
  { id: 56, name: 'Keanu Reeves', philosophy: 'generosidad discreta.', area: LifeArea.Servicio, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 57, name: 'Oprah Winfrey', philosophy: 'filantropía enfocada en educación.', area: LifeArea.Servicio, tier: MentorTier.Inicial, unlocked: true, unlockCondition: '' },
  { id: 58, name: 'Bill Gates', philosophy: 'salud y educación global.', area: LifeArea.Servicio, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 10 en Servicio' },
  { id: 59, name: 'Leonardo DiCaprio', philosophy: 'protección del medio ambiente.', area: LifeArea.Servicio, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 12 en Servicio' },
  { id: 60, name: 'Princess Diana', philosophy: 'empatía genuina con los más frágiles.', area: LifeArea.Servicio, tier: MentorTier.Intermedio, unlocked: false, unlockCondition: 'Llega a nivel 15 en Servicio' },
  { id: 61, name: 'Jesús de Nazaret', philosophy: 'amor y servicio total.', area: LifeArea.Servicio, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 20 en Servicio' },
  { id: 62, name: 'Buda', philosophy: 'liberación del sufrimiento ajeno.', area: LifeArea.Servicio, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 25 en Servicio' },
  { id: 63, name: 'Florence Nightingale', philosophy: 'entrega total a los demás.', area: LifeArea.Servicio, tier: MentorTier.Maestro, unlocked: false, unlockCondition: 'Llega a nivel 30 en Servicio' },
];
