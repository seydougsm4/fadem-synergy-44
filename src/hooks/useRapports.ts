import { useState, useEffect } from 'react';
import { useFademStorage } from './useLocalStorage';
import { RapportJournalier, RapportPersonnalise } from '@/types';
import { useComptabilite } from './useComptabilite';

interface RapportsData {
  rapportsJournaliers: RapportJournalier[];
  rapportsPersonnalises: RapportPersonnalise[];
}

const initialData: RapportsData = {
  rapportsJournaliers: [],
  rapportsPersonnalises: []
};

export const useRapports = () => {
  const { data, setData, removeData, exportData, importData } = useFademStorage<RapportsData>('rapports', initialData);
  const { transactions } = useComptabilite();

  // Rapports Journaliers
  const genererRapportJournalier = (date: Date) => {
    const dateStr = date.toDateString();
    const transactionsJour = transactions.filter(t => 
      new Date(t.date).toDateString() === dateStr
    );

    const recettes = transactionsJour
      .filter(t => t.type === 'recette')
      .reduce((total, t) => total + t.montant, 0);
    
    const depenses = transactionsJour
      .filter(t => t.type === 'depense')
      .reduce((total, t) => total + t.montant, 0);

    const beneficeNet = recettes - depenses;
    const transactionsCount = transactionsJour.length;

    // Répartition par module
    const activitesParModule: Record<string, any> = {};
    transactionsJour
      .filter(t => t.type === 'recette')
      .forEach(t => {
        const module = t.module;
        if (!activitesParModule[module]) {
          activitesParModule[module] = { montant: 0, transactions: 0 };
        }
        activitesParModule[module].montant += t.montant;
        activitesParModule[module].transactions += 1;
      });

    const rapportJournalier: RapportJournalier = {
      id: `RAPJ-${date.getTime()}`,
      date,
      recettes,
      depenses,
      beneficeNet,
      transactionsCount,
      activitesParModule,
      dateGeneration: new Date()
    };

    setData(prev => ({
      ...prev,
      rapportsJournaliers: [...prev.rapportsJournaliers.filter(r => 
        new Date(r.date).toDateString() !== dateStr
      ), rapportJournalier]
    }));

    return rapportJournalier;
  };

  // Rapports Personnalisés
  const creerRapportPersonnalise = (rapport: Omit<RapportPersonnalise, 'id' | 'dateGeneration'>) => {
    const { dateDebut, dateFin, modules, metriques } = rapport;
    
    const transactionsPeriode = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= new Date(dateDebut) && 
             date <= new Date(dateFin) &&
             (modules.length === 0 || modules.includes(t.module));
    });

    let donnees: any = {};

    // Calculer les métriques demandées
    if (metriques.includes('revenus')) {
      donnees.revenus = transactionsPeriode
        .filter(t => t.type === 'recette')
        .reduce((total, t) => total + t.montant, 0);
    }

    if (metriques.includes('depenses')) {
      donnees.depenses = transactionsPeriode
        .filter(t => t.type === 'depense')
        .reduce((total, t) => total + t.montant, 0);
    }

    if (metriques.includes('benefices')) {
      const revenus = transactionsPeriode
        .filter(t => t.type === 'recette')
        .reduce((total, t) => total + t.montant, 0);
      const depenses = transactionsPeriode
        .filter(t => t.type === 'depense')
        .reduce((total, t) => total + t.montant, 0);
      donnees.benefices = revenus - depenses;
    }

    if (metriques.includes('transactions')) {
      donnees.nombreTransactions = transactionsPeriode.length;
    }

    if (metriques.includes('evolution')) {
      // Calculer l'évolution par rapport à la période précédente
      const duree = new Date(dateFin).getTime() - new Date(dateDebut).getTime();
      const dateDebutPrecedente = new Date(new Date(dateDebut).getTime() - duree);
      const dateFinPrecedente = new Date(dateDebut);

      const transactionsPrecedentes = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= dateDebutPrecedente && 
               date <= dateFinPrecedente &&
               (modules.length === 0 || modules.includes(t.module));
      });

      const revenusPrecedents = transactionsPrecedentes
        .filter(t => t.type === 'recette')
        .reduce((total, t) => total + t.montant, 0);

      const revenusActuels = transactionsPeriode
        .filter(t => t.type === 'recette')
        .reduce((total, t) => total + t.montant, 0);

      donnees.evolution = revenusPrecedents > 0 
        ? Math.round(((revenusActuels - revenusPrecedents) / revenusPrecedents * 100) * 100) / 100
        : 0;
    }

    const nouveauRapport: RapportPersonnalise = {
      ...rapport,
      id: `RAPP-${Date.now()}`,
      donnees,
      dateGeneration: new Date()
    };

    setData(prev => ({
      ...prev,
      rapportsPersonnalises: [...prev.rapportsPersonnalises, nouveauRapport]
    }));

    return nouveauRapport;
  };

  // Génération automatique des rapports quotidiens
  const genererRapportQuotidien = () => {
    const hier = new Date();
    hier.setDate(hier.getDate() - 1);
    
    const rapportExiste = data.rapportsJournaliers.some(r => 
      new Date(r.date).toDateString() === hier.toDateString()
    );

    if (!rapportExiste) {
      return genererRapportJournalier(hier);
    }
    
    return null;
  };

  // Statistics
  const obtenirStatistiques = () => {
    const rapportsGeneres = data.rapportsJournaliers.length + data.rapportsPersonnalises.length;
    const dernierRapport = data.rapportsJournaliers
      .sort((a, b) => new Date(b.dateGeneration).getTime() - new Date(a.dateGeneration).getTime())[0];

    return {
      rapportsGeneres,
      dernierRapport: dernierRapport ? new Date(dernierRapport.dateGeneration) : null
    };
  };

  const obtenirRapportsRecents = (limite: number = 10) => {
    const tousRapports = [
      ...data.rapportsJournaliers.map(r => ({ ...r, type: 'journalier' })),
      ...data.rapportsPersonnalises.map(r => ({ ...r, type: 'personnalise' }))
    ];

    return tousRapports
      .sort((a, b) => new Date(b.dateGeneration).getTime() - new Date(a.dateGeneration).getTime())
      .slice(0, limite);
  };

  return {
    // Data
    rapportsJournaliers: data.rapportsJournaliers,
    rapportsPersonnalises: data.rapportsPersonnalises,
    
    // Methods
    genererRapportJournalier,
    creerRapportPersonnalise,
    genererRapportQuotidien,
    obtenirStatistiques,
    obtenirRapportsRecents,
    
    // Storage
    removeData,
    exportData,
    importData
  };
};