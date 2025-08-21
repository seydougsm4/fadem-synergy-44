import { useState, useEffect, useCallback } from 'react';

// Hook générique pour le stockage local
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lecture localStorage pour ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erreur écriture localStorage pour ${key}:`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erreur suppression localStorage pour ${key}:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Hook spécialisé pour les données FADEM avec backup automatique
export function useFademStorage<T>(module: string, initialData: T) {
  const [data, setData, removeData] = useLocalStorage(`fadem_${module}`, initialData);

  // Sauvegarde automatique toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (data !== initialData) {
        const backup = {
          data,
          timestamp: new Date().toISOString(),
          module
        };
        localStorage.setItem(`fadem_backup_${module}`, JSON.stringify(backup));
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [data, initialData, module]);

  // Fonction de restauration depuis backup
  const restoreFromBackup = useCallback(() => {
    try {
      const backup = localStorage.getItem(`fadem_backup_${module}`);
      if (backup) {
        const { data: backupData } = JSON.parse(backup);
        setData(backupData);
        return true;
      }
    } catch (error) {
      console.error(`Erreur restauration backup ${module}:`, error);
    }
    return false;
  }, [module, setData]);

  // Export des données
  const exportData = useCallback(() => {
    const exportObj = {
      module,
      data,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(exportObj, null, 2);
  }, [module, data]);

  // Import des données
  const importData = useCallback((jsonString: string) => {
    try {
      const importObj = JSON.parse(jsonString);
      if (importObj.module === module && importObj.data) {
        setData(importObj.data);
        return true;
      }
    } catch (error) {
      console.error(`Erreur import données ${module}:`, error);
    }
    return false;
  }, [module, setData]);

  return {
    data,
    setData,
    removeData,
    restoreFromBackup,
    exportData,
    importData
  };
}