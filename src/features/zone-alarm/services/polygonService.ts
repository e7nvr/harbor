import { Polygon } from '../domain/types';

export const savePolygon = async (polygon: Polygon): Promise<void> => {
  try {
    // Aquí iría la lógica para guardar el polígono en el backend
    // Por ahora, solo simularemos un guardado con un console.log
    console.log('Polígono guardado:', polygon);
    
    // Simular una llamada API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Polígono guardado exitosamente');
  } catch (error) {
    console.error('Error al guardar el polígono:', error);
    throw error;
  }
};
