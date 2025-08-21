import { useState, useEffect } from 'react';
import { useFademStorage } from './useLocalStorage';
import { Chantier, Materiau, DepenseChantier, Employe } from '@/types';

interface BTPData {
  chantiers: Chantier[];
  materiaux: Materiau[];
  depenses: DepenseChantier[];
  ouvriers: Employe[];
}

const initialData: BTPData = {
  chantiers: [],
  materiaux: [],
  depenses: [],
  ouvriers: []
};

export const useBTP = () => {
  const { data, setData, removeData, exportData, importData } = useFademStorage<BTPData>('btp', initialData);

  // Chantiers Management
  const ajouterChantier = (chantier: Omit<Chantier, 'id'>) => {
    const nouveauChantier: Chantier = {
      ...chantier,
      id: `CHT-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      chantiers: [...prev.chantiers, nouveauChantier]
    }));
  };

  const modifierChantier = (id: string, modifications: Partial<Chantier>) => {
    setData(prev => ({
      ...prev,
      chantiers: prev.chantiers.map(chantier =>
        chantier.id === id ? { ...chantier, ...modifications } : chantier
      )
    }));
  };

  const supprimerChantier = (id: string) => {
    setData(prev => ({
      ...prev,
      chantiers: prev.chantiers.filter(chantier => chantier.id !== id)
    }));
  };

  // Matériaux Management
  const ajouterMateriau = (materiau: Omit<Materiau, 'id'>) => {
    const nouveauMateriau: Materiau = {
      ...materiau,
      id: `MAT-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      materiaux: [...prev.materiaux, nouveauMateriau]
    }));
  };

  // Dépenses Management
  const ajouterDepense = (depense: Omit<DepenseChantier, 'id'>) => {
    const nouvelleDepense: DepenseChantier = {
      ...depense,
      id: `DEP-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      depenses: [...prev.depenses, nouvelleDepense]
    }));
  };

  // Ouvriers Management
  const assignerOuvrier = (chantierId: string, ouvrierId: string) => {
    setData(prev => ({
      ...prev,
      chantiers: prev.chantiers.map(chantier =>
        chantier.id === chantierId
          ? { ...chantier, equipeAssignee: [...(chantier.equipeAssignee || []), ouvrierId] }
          : chantier
      )
    }));
  };

  // Statistics
  const obtenirStatistiques = () => {
    const chantiersActifs = data.chantiers.filter(c => c.statut === 'en_cours').length;
    const ouvriersTotaux = data.ouvriers.length;
    const budgetTotal = data.chantiers.reduce((total, c) => total + c.budgetInitial, 0);
    const depensesTotales = data.depenses.reduce((total, d) => total + d.montant, 0);
    const margeMovenne = budgetTotal > 0 ? ((budgetTotal - depensesTotales) / budgetTotal * 100) : 0;

    return {
      chantiersActifs,
      ouvriersTotaux,
      budgetTotal,
      depensesTotales,
      margeMovenne: Math.round(margeMovenne)
    };
  };

  const obtenirChantiersEnRetard = () => {
    const aujourd = new Date();
    return data.chantiers.filter(chantier => 
      chantier.statut === 'en_cours' && 
      new Date(chantier.datePrevue) < aujourd
    );
  };

  return {
    // Data
    chantiers: data.chantiers,
    materiaux: data.materiaux,
    depenses: data.depenses,
    ouvriers: data.ouvriers,
    
    // Methods
    ajouterChantier,
    modifierChantier,
    supprimerChantier,
    ajouterMateriau,
    ajouterDepense,
    assignerOuvrier,
    obtenirStatistiques,
    obtenirChantiersEnRetard,
    
    // Storage
    removeData,
    exportData,
    importData
  };
};