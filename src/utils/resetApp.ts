
// Utilitaire pour remettre l'application à zéro
export const resetAllData = (): void => {
  const modules = ['immobilier', 'vehicules', 'comptabilite', 'btp', 'personnel'];
  
  modules.forEach(module => {
    localStorage.removeItem(`fadem_${module}`);
    localStorage.removeItem(`fadem_backup_${module}`);
  });
  
  // Supprimer aussi les autres clés FADEM
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('fadem_')) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('Toutes les données FADEM ont été supprimées');
};

export const exportAllData = (): string => {
  const allData: Record<string, any> = {};
  const modules = ['immobilier', 'vehicules', 'comptabilite', 'btp', 'personnel'];
  
  modules.forEach(module => {
    const data = localStorage.getItem(`fadem_${module}`);
    if (data) {
      try {
        allData[module] = JSON.parse(data);
      } catch (error) {
        console.error(`Erreur parsing ${module}:`, error);
      }
    }
  });
  
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '1.0',
    data: allData
  }, null, 2);
};

export const importAllData = (jsonString: string): boolean => {
  try {
    const importObj = JSON.parse(jsonString);
    if (!importObj.data) return false;
    
    Object.keys(importObj.data).forEach(module => {
      localStorage.setItem(`fadem_${module}`, JSON.stringify(importObj.data[module]));
    });
    
    return true;
  } catch (error) {
    console.error('Erreur import:', error);
    return false;
  }
};
