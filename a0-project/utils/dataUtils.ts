import { DayData } from '../types/types';

export const generateInitialData = (): { [date: string]: DayData } => {
  const data: { [date: string]: DayData } = {};
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Add sample data for today
  data[todayStr] = {
    tasks: [
      { id: '1', title: 'Ejercicio matutino', completed: false },
      { id: '2', title: 'Revisar emails', completed: false },
      { id: '3', title: 'Reunión de equipo', completed: false },
      { id: '4', title: 'Completar proyecto', completed: false },
      { id: '5', title: 'Actualizar calendario', completed: false },
      { id: '6', title: 'Llamar a cliente', completed: false },
      { id: '7', title: 'Leer 20 minutos', completed: false },
    ],
    completed: 0
  };
  
  // Add some sample data for yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  data[yesterdayStr] = {
    tasks: [
      { id: '8', title: 'Ejercicio matutino', completed: true },
      { id: '9', title: 'Revisar emails', completed: true },
      { id: '10', title: 'Comprar víveres', completed: true },
      { id: '11', title: 'Llamar a mamá', completed: false },
      { id: '12', title: 'Leer 20 minutos', completed: true },
    ],
    completed: 4
  };
  
  return data;
};