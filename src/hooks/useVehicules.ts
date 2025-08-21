
import { useState, useEffect } from 'react';
import { useFademStorage } from './useLocalStorage';
import { Vehicule, ProprietaireVehicule, ContratVehicule, HistoriqueLocation } from '@/types';

interface VehiculesData {
  vehicules: Vehicule[];
  proprietaires: ProprietaireVehicule[];
  contrats: ContratVehicule[];
  historique: HistoriqueLocation[];
}

const initialData: VehiculesData = {
  vehicules: [],
  proprietaires: [],
  contrats: [],
  historique: []
};

export const useVehicules = () => {
  const { data, setData, removeData, exportData, importData } = useFademStorage<VehiculesData>('vehicules', initialData);

  // Véhicules Management
  const ajouterVehicule = (vehicule: Omit<Vehicule, 'id' | 'dateEnregistrement'>) => {
    const nouveauVehicule: Vehicule = {
      ...vehicule,
      id: `VEH-${Date.now()}`,
      dateEnregistrement: new Date(),
      contratsLocation: [],
      historiqueLocation: []
    };
    
    setData(prev => ({
      ...prev,
      vehicules: [...prev.vehicules, nouveauVehicule]
    }));
  };

  const modifierVehicule = (id: string, modifications: Partial<Vehicule>) => {
    setData(prev => ({
      ...prev,
      vehicules: prev.vehicules.map(vehicule =>
        vehicule.id === id ? { ...vehicule, ...modifications } : vehicule
      )
    }));
  };

  const supprimerVehicule = (id: string) => {
    setData(prev => ({
      ...prev,
      vehicules: prev.vehicules.filter(vehicule => vehicule.id !== id)
    }));
  };

  // Propriétaires Management
  const ajouterProprietaire = (proprietaire: Omit<ProprietaireVehicule, 'id' | 'dateCreation' | 'vehiculesConfies' | 'commissionsRecues'>) => {
    const nouveauProprietaire: ProprietaireVehicule = {
      ...proprietaire,
      id: `PROP-VEH-${Date.now()}`,
      dateCreation: new Date(),
      vehiculesConfies: [],
      commissionsRecues: 0
    };
    
    setData(prev => ({
      ...prev,
      proprietaires: [...prev.proprietaires, nouveauProprietaire]
    }));
  };

  const modifierProprietaire = (id: string, modifications: Partial<ProprietaireVehicule>) => {
    setData(prev => ({
      ...prev,
      proprietaires: prev.proprietaires.map(proprietaire =>
        proprietaire.id === id ? { ...proprietaire, ...modifications } : proprietaire
      )
    }));
  };

  const supprimerProprietaire = (id: string) => {
    // Vérifier qu'aucun véhicule n'est associé
    const vehiculesAssocies = data.vehicules.filter(v => v.proprietaireVehiculeId === id);
    if (vehiculesAssocies.length > 0) {
      throw new Error('Impossible de supprimer: des véhicules sont associés à ce propriétaire');
    }

    setData(prev => ({
      ...prev,
      proprietaires: prev.proprietaires.filter(proprietaire => proprietaire.id !== id)
    }));
  };

  // Contrats Management
  const creerContrat = (contrat: Omit<ContratVehicule, 'id' | 'paiements'>) => {
    const nouveauContrat: ContratVehicule = {
      ...contrat,
      id: `CONT-VEH-${Date.now()}`,
      paiements: []
    };
    
    setData(prev => ({
      ...prev,
      contrats: [...prev.contrats, nouveauContrat]
    }));

    // Ajouter le contrat à la liste des contrats du véhicule
    setData(prev => ({
      ...prev,
      vehicules: prev.vehicules.map(v =>
        v.id === contrat.vehiculeId 
          ? { ...v, contratsLocation: [...v.contratsLocation, nouveauContrat.id] }
          : v
      )
    }));
  };

  const modifierContrat = (id: string, modifications: Partial<ContratVehicule>) => {
    setData(prev => ({
      ...prev,
      contrats: prev.contrats.map(contrat =>
        contrat.id === id ? { ...contrat, ...modifications } : contrat
      )
    }));
  };

  const terminerLocation = (contratId: string) => {
    const contrat = data.contrats.find(c => c.id === contratId);
    if (contrat && contrat.type === 'location' && contrat.statut === 'actif') {
      // Mettre à jour le contrat
      setData(prev => ({
        ...prev,
        contrats: prev.contrats.map(c =>
          c.id === contratId ? { ...c, statut: 'termine', dateFin: new Date() } : c
        )
      }));

      // Ajouter à l'historique
      const nouvelHistorique: HistoriqueLocation = {
        dateDebut: contrat.dateDebut,
        dateFin: new Date(),
        client: contrat.clientNom,
        montant: contrat.montant,
        kilometrage: contrat.kilometrageDebut
      };

      setData(prev => ({
        ...prev,
        historique: [...prev.historique, nouvelHistorique],
        vehicules: prev.vehicules.map(v =>
          v.id === contrat.vehiculeId 
            ? { 
                ...v, 
                statut: 'disponible',
                historiqueLocation: [...v.historiqueLocation, nouvelHistorique]
              }
            : v
        )
      }));
    }
  };

  // Statistics
  const obtenirStatistiques = () => {
    const vehiculesTotal = data.vehicules.length;
    const enLocation = data.vehicules.filter(v => v.statut === 'loue').length;
    const disponibles = data.vehicules.filter(v => v.statut === 'disponible').length;
    const contratsMois = data.contrats.filter(c => {
      const maintenant = new Date();
      const dateContrat = new Date(c.dateDebut);
      return dateContrat.getMonth() === maintenant.getMonth() && 
             dateContrat.getFullYear() === maintenant.getFullYear();
    });
    const revenusMensuels = contratsMois.reduce((total, c) => total + c.montant, 0);

    return {
      vehiculesTotal,
      enLocation,
      disponibles,
      revenusMensuels
    };
  };

  const obtenirVehiculesDisponibles = () => {
    return data.vehicules.filter(v => v.statut === 'disponible');
  };

  const obtenirContratsActifs = () => {
    return data.contrats.filter(c => c.statut === 'actif');
  };

  return {
    // Data
    vehicules: data.vehicules,
    proprietaires: data.proprietaires,
    contrats: data.contrats,
    historique: data.historique,
    
    // Véhicules methods
    ajouterVehicule,
    modifierVehicule,
    supprimerVehicule,
    
    // Propriétaires methods
    ajouterProprietaire,
    modifierProprietaire,
    supprimerProprietaire,
    
    // Contrats methods
    creerContrat,
    modifierContrat,
    terminerLocation,
    
    // Analytics
    obtenirStatistiques,
    obtenirVehiculesDisponibles,
    obtenirContratsActifs,
    
    // Storage
    removeData,
    exportData,
    importData
  };
};
