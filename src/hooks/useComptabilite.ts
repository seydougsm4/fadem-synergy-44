import { useState, useEffect } from 'react';
import { useFademStorage } from './useLocalStorage';
import { TransactionComptable, BilanMensuel } from '@/types';

interface ComptabiliteData {
  transactions: TransactionComptable[];
  bilans: BilanMensuel[];
}

const initialData: ComptabiliteData = {
  transactions: [],
  bilans: []
};

export const useComptabilite = () => {
  const { data, setData, removeData, exportData, importData } = useFademStorage<ComptabiliteData>('comptabilite', initialData);

  // Transactions Management
  const ajouterTransaction = (transaction: Omit<TransactionComptable, 'id'>) => {
    const nouvelleTransaction: TransactionComptable = {
      ...transaction,
      id: `TXN-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      transactions: [...prev.transactions, nouvelleTransaction]
    }));
  };

  const modifierTransaction = (id: string, modifications: Partial<TransactionComptable>) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(transaction =>
        transaction.id === id ? { ...transaction, ...modifications } : transaction
      )
    }));
  };

  const supprimerTransaction = (id: string) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(transaction => transaction.id !== id)
    }));
  };

  // Bilans Management
  const genererBilanMensuel = (mois: number, annee: number) => {
    const transactionsMois = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === mois && date.getFullYear() === annee;
    });

    const revenus = transactionsMois
      .filter(t => t.type === 'recette')
      .reduce((total, t) => total + t.montant, 0);
    
    const depenses = transactionsMois
      .filter(t => t.type === 'depense')
      .reduce((total, t) => total + t.montant, 0);

    const revenusPreviousMois = data.transactions
      .filter(t => {
        const date = new Date(t.date);
        const prevMois = mois === 0 ? 11 : mois - 1;
        const prevAnnee = mois === 0 ? annee - 1 : annee;
        return date.getMonth() === prevMois && date.getFullYear() === prevAnnee && t.type === 'recette';
      })
      .reduce((total, t) => total + t.montant, 0);

    const beneficeNet = revenus - depenses;
    const margeNette = revenus > 0 ? (beneficeNet / revenus * 100) : 0;
    const evolutionCA = revenusPreviousMois > 0 ? ((revenus - revenusPreviousMois) / revenusPreviousMois * 100) : 0;

    // Revenus par secteur
    const revenusParSecteur = new Map<string, number>();
    transactionsMois
      .filter(t => t.type === 'recette')
      .forEach(t => {
        const secteur = t.module;
        revenusParSecteur.set(secteur, (revenusParSecteur.get(secteur) || 0) + t.montant);
      });

    // Dépenses par catégorie
    const depensesParCategorie = new Map<string, number>();
    transactionsMois
      .filter(t => t.type === 'depense')
      .forEach(t => {
        const categorie = t.categorie;
        depensesParCategorie.set(categorie, (depensesParCategorie.get(categorie) || 0) + t.montant);
      });

    const revenusParModuleRecord: Record<string, number> = {};
    revenusParSecteur.forEach((montant, secteur) => {
      revenusParModuleRecord[secteur] = montant;
    });

    const depensesParCategorieRecord: Record<string, number> = {};
    depensesParCategorie.forEach((montant, categorie) => {
      depensesParCategorieRecord[categorie] = montant;
    });

    const nouveauBilan: BilanMensuel = {
      id: `BILAN-${mois}-${annee}`,
      mois,
      annee,
      recettesTotales: revenus,
      depensesTotales: depenses,
      benefices: beneficeNet,
      margeNette: Math.round(margeNette * 100) / 100,
      recettesParModule: revenusParModuleRecord,
      depensesParCategorie: depensesParCategorieRecord,
      nombreTransactions: transactionsMois.length,
      dateGeneration: new Date(),
      statut: 'finalise'
    };

    setData(prev => ({
      ...prev,
      bilans: [...prev.bilans.filter(b => !(b.mois === mois && b.annee === annee)), nouveauBilan]
    }));

    return nouveauBilan;
  };

  // Statistics & Analytics
  const obtenirStatistiques = () => {
    const aujourd = new Date();
    const moisActuel = aujourd.getMonth();
    const anneeActuelle = aujourd.getFullYear();

    // Transactions du mois actuel
    const transactionsMois = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === moisActuel && date.getFullYear() === anneeActuelle;
    });

    const revenusJour = data.transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.toDateString() === aujourd.toDateString() && t.type === 'recette';
      })
      .reduce((total, t) => total + t.montant, 0);

    const depensesJour = data.transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.toDateString() === aujourd.toDateString() && t.type === 'depense';
      })
      .reduce((total, t) => total + t.montant, 0);

    const revenusMois = transactionsMois
      .filter(t => t.type === 'recette')
      .reduce((total, t) => total + t.montant, 0);

    const depensesMois = transactionsMois
      .filter(t => t.type === 'depense')
      .reduce((total, t) => total + t.montant, 0);

    const beneficesNet = revenusJour - depensesJour;
    const margeNette = revenusMois > 0 ? ((revenusMois - depensesMois) / revenusMois * 100) : 0;

    return {
      revenusJour,
      depensesJour,
      beneficesNet,
      revenusMois,
      depensesMois,
      margeNette: Math.round(margeNette * 100) / 100
    };
  };

  const obtenirRevenusParSecteur = () => {
    const moisActuel = new Date().getMonth();
    const anneeActuelle = new Date().getFullYear();
    
    const transactionsMois = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === moisActuel && 
             date.getFullYear() === anneeActuelle && 
             t.type === 'recette';
    });

    const revenus = new Map<string, number>();
    transactionsMois.forEach(t => {
      const secteur = t.module;
      revenus.set(secteur, (revenus.get(secteur) || 0) + t.montant);
    });

    const total = Array.from(revenus.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(revenus.entries()).map(([secteur, montant]) => ({
      secteur,
      montant,
      pourcentage: total > 0 ? Math.round((montant / total * 100) * 100) / 100 : 0
    }));
  };

  const obtenirDepensesParCategorie = () => {
    const moisActuel = new Date().getMonth();
    const anneeActuelle = new Date().getFullYear();
    
    const transactionsMois = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === moisActuel && 
             date.getFullYear() === anneeActuelle && 
             t.type === 'depense';
    });

    const depenses = new Map<string, number>();
    transactionsMois.forEach(t => {
      const categorie = t.categorie;
      depenses.set(categorie, (depenses.get(categorie) || 0) + t.montant);
    });

    return Array.from(depenses.entries()).map(([categorie, montant]) => ({
      categorie,
      montant
    }));
  };

  return {
    // Data
    transactions: data.transactions,
    bilans: data.bilans,
    
    // Methods
    ajouterTransaction,
    modifierTransaction,
    supprimerTransaction,
    genererBilanMensuel,
    obtenirStatistiques,
    obtenirRevenusParSecteur,
    obtenirDepensesParCategorie,
    
    // Storage
    removeData,
    exportData,
    importData
  };
};