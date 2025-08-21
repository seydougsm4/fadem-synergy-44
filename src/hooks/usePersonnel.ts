import { useState, useEffect } from 'react';
import { useFademStorage } from './useLocalStorage';
import { Employe, Salaire, Conge, Absence, Formation, Evaluation } from '@/types';

interface PersonnelData {
  employes: Employe[];
  salaires: Salaire[];
  conges: Conge[];
  absences: Absence[];
  formations: Formation[];
  evaluations: Evaluation[];
}

const initialData: PersonnelData = {
  employes: [],
  salaires: [],
  conges: [],
  absences: [],
  formations: [],
  evaluations: []
};

export const usePersonnel = () => {
  const { data, setData, removeData, exportData, importData } = useFademStorage<PersonnelData>('personnel', initialData);

  // Employés Management
  const ajouterEmploye = (employe: Omit<Employe, 'id' | 'dateEmbauche'>) => {
    const nouvelEmploye: Employe = {
      ...employe,
      id: `EMP-${Date.now()}`,
      dateEmbauche: new Date()
    };
    
    setData(prev => ({
      ...prev,
      employes: [...prev.employes, nouvelEmploye]
    }));
  };

  const modifierEmploye = (id: string, modifications: Partial<Employe>) => {
    setData(prev => ({
      ...prev,
      employes: prev.employes.map(employe =>
        employe.id === id ? { ...employe, ...modifications } : employe
      )
    }));
  };

  const supprimerEmploye = (id: string) => {
    setData(prev => ({
      ...prev,
      employes: prev.employes.filter(employe => employe.id !== id)
    }));
  };

  // Salaires Management  
  const enregistrerSalaire = (salaire: Omit<Salaire, 'id'>) => {
    const nouveauSalaire: Salaire = {
      ...salaire,
      id: `SAL-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      salaires: [...prev.salaires, nouveauSalaire]
    }));
  };

  const calculerSalaire = (employeId: string, mois: number, annee: number) => {
    const employe = data.employes.find(e => e.id === employeId);
    if (!employe) return 0;

    const salaireBase = employe.salaireMensuel;
    const primes = 0; // You can add primes logic here
    const avances = data.salaires
      .filter(s => s.employeId === employeId && s.avances && s.avances > 0)
      .reduce((total, s) => total + (s.avances || 0), 0);

    return salaireBase + primes - avances;
  };

  // Congés Management
  const demanderConge = (conge: Omit<Conge, 'id'>) => {
    const nouveauConge: Conge = {
      ...conge,
      id: `CONG-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      conges: [...prev.conges, nouveauConge]
    }));
  };

  const approuverConge = (congeId: string, statut: 'approuve' | 'refuse') => {
    setData(prev => ({
      ...prev,
      conges: prev.conges.map(conge =>
        conge.id === congeId ? { ...conge, statut } : conge
      )
    }));
  };

  // Absences Management
  const enregistrerAbsence = (absence: Omit<Absence, 'id'>) => {
    const nouvelleAbsence: Absence = {
      ...absence,
      id: `ABS-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      absences: [...prev.absences, nouvelleAbsence]
    }));
  };

  // Formations Management
  const ajouterFormation = (formation: Omit<Formation, 'id'>) => {
    const nouvelleFormation: Formation = {
      ...formation,
      id: `FORM-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      formations: [...prev.formations, nouvelleFormation]
    }));
  };

  // Statistics
  const obtenirStatistiques = () => {
    const employesActifs = data.employes.filter(e => e.statut === 'actif').length;
    const enConge = data.conges.filter(c => {
      const maintenant = new Date();
      return c.statut === 'approuve' && 
             new Date(c.dateDebut) <= maintenant && 
             new Date(c.dateFin) >= maintenant;
    }).length;
    
    const masseSalariale = data.employes
      .filter(e => e.statut === 'actif')
      .reduce((total, e) => total + e.salaireMensuel, 0);
    
    const avancesMois = data.salaires
      .filter(s => {
        const maintenant = new Date();
        const dateSalaire = new Date(s.datePaiement);
        return s.avances && s.avances > 0 && 
               dateSalaire.getMonth() === maintenant.getMonth() && 
               dateSalaire.getFullYear() === maintenant.getFullYear();
      })
      .reduce((total, s) => total + (s.avances || 0), 0);

    return {
      employesActifs,
      enConge,
      masseSalariale,
      avancesMois
    };
  };

  const obtenirEmployesParDepartement = () => {
    const departements = new Map<string, number>();
    data.employes.forEach(employe => {
      const dept = employe.departement;
      departements.set(dept, (departements.get(dept) || 0) + 1);
    });
    return Array.from(departements.entries()).map(([nom, nombre]) => ({ nom, nombre }));
  };

  return {
    // Data
    employes: data.employes,
    salaires: data.salaires,
    conges: data.conges,
    absences: data.absences,
    formations: data.formations,
    evaluations: data.evaluations,
    
    // Methods
    ajouterEmploye,
    modifierEmploye,
    supprimerEmploye,
    enregistrerSalaire,
    calculerSalaire,
    demanderConge,
    approuverConge,
    enregistrerAbsence,
    ajouterFormation,
    obtenirStatistiques,
    obtenirEmployesParDepartement,
    
    // Storage
    removeData,
    exportData,
    importData
  };
};