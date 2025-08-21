
import { useState, useEffect, useCallback } from 'react';
import { useFademStorage } from './useLocalStorage';
import { TransactionComptableComplete, Compte, CategorieTransaction, BilanCompte, BilanMensuel } from '@/types/comptabilite';
import { generateId } from '@/utils/helpers';

interface ComptabiliteCompleteData {
  transactions: TransactionComptableComplete[];
  comptes: Compte[];
  categories: CategorieTransaction[];
  bilans: BilanMensuel[];
}

const categoriesDefaut: CategorieTransaction[] = [
  // Recettes
  { id: 'rec-immobilier', nom: 'Location Immobilier', type: 'recette', couleur: '#22c55e' },
  { id: 'rec-vente-immo', nom: 'Vente Immobilier', type: 'recette', couleur: '#16a34a' },
  { id: 'rec-btp', nom: 'Travaux BTP', type: 'recette', couleur: '#eab308' },
  { id: 'rec-vehicules', nom: 'Location Véhicules', type: 'recette', couleur: '#3b82f6' },
  { id: 'rec-vente-vehicules', nom: 'Vente Véhicules', type: 'recette', couleur: '#1d4ed8' },
  { id: 'rec-autre', nom: 'Autres Recettes', type: 'recette', couleur: '#06b6d4' },
  
  // Dépenses
  { id: 'dep-salaires', nom: 'Salaires & Charges', type: 'depense', couleur: '#dc2626' },
  { id: 'dep-materiaux', nom: 'Matériaux BTP', type: 'depense', couleur: '#ea580c' },
  { id: 'dep-carburant', nom: 'Carburant & Transport', type: 'depense', couleur: '#d97706' },
  { id: 'dep-maintenance', nom: 'Maintenance & Réparations', type: 'depense', couleur: '#7c2d12' },
  { id: 'dep-bureaux', nom: 'Frais de Bureau', type: 'depense', couleur: '#991b1b' },
  { id: 'dep-marketing', nom: 'Marketing & Publicité', type: 'depense', couleur: '#be123c' },
  { id: 'dep-juridique', nom: 'Frais Juridiques', type: 'depense', couleur: '#9f1239' },
  { id: 'dep-autre', nom: 'Autres Dépenses', type: 'depense', couleur: '#7f1d1d' }
];

const initialData: ComptabiliteCompleteData = {
  transactions: [],
  comptes: [],
  categories: categoriesDefaut,
  bilans: []
};

export const useComptabiliteComplete = () => {
  const { data, setData, removeData, exportData, importData } = useFademStorage<ComptabiliteCompleteData>('comptabilite', initialData);

  // Comptes Management
  const ajouterCompte = useCallback((compteData: Omit<Compte, 'id' | 'dateOuverture' | 'soldeActuel'>) => {
    const nouveauCompte: Compte = {
      ...compteData,
      id: generateId(),
      dateOuverture: new Date(),
      soldeActuel: compteData.soldeInitial
    };
    
    setData(prev => ({
      ...prev,
      comptes: [...prev.comptes, nouveauCompte]
    }));
    
    return nouveauCompte;
  }, [setData]);

  const modifierCompte = useCallback((id: string, modifications: Partial<Compte>) => {
    setData(prev => ({
      ...prev,
      comptes: prev.comptes.map(compte =>
        compte.id === id ? { ...compte, ...modifications } : compte
      )
    }));
  }, [setData]);

  const supprimerCompte = useCallback((id: string) => {
    // Vérifier qu'il n'y a pas de transactions
    const transactionsLiees = data.transactions.filter(t => t.compteId === id);
    if (transactionsLiees.length > 0) {
      throw new Error('Impossible de supprimer: des transactions sont associées à ce compte');
    }

    setData(prev => ({
      ...prev,
      comptes: prev.comptes.filter(compte => compte.id !== id)
    }));
  }, [data.transactions, setData]);

  // Transactions Management
  const ajouterTransaction = useCallback((transactionData: Omit<TransactionComptableComplete, 'id'>) => {
    const nouvelleTransaction: TransactionComptableComplete = {
      ...transactionData,
      id: generateId()
    };
    
    // Mettre à jour le solde du compte
    const compte = data.comptes.find(c => c.id === transactionData.compteId);
    if (compte) {
      const nouveauSolde = transactionData.type === 'recette' 
        ? compte.soldeActuel + transactionData.montant
        : compte.soldeActuel - transactionData.montant;

      setData(prev => ({
        ...prev,
        transactions: [...prev.transactions, nouvelleTransaction],
        comptes: prev.comptes.map(c => 
          c.id === transactionData.compteId 
            ? { ...c, soldeActuel: nouveauSolde }
            : c
        )
      }));
    }
    
    return nouvelleTransaction;
  }, [data.comptes, setData]);

  const modifierTransaction = useCallback((id: string, modifications: Partial<TransactionComptableComplete>) => {
    const ancienneTransaction = data.transactions.find(t => t.id === id);
    if (!ancienneTransaction) return;

    // Restaurer l'ancien solde puis appliquer le nouveau
    const compte = data.comptes.find(c => c.id === ancienneTransaction.compteId);
    if (compte) {
      let nouveauSolde = compte.soldeActuel;
      
      // Annuler l'ancienne transaction
      nouveauSolde = ancienneTransaction.type === 'recette' 
        ? nouveauSolde - ancienneTransaction.montant
        : nouveauSolde + ancienneTransaction.montant;

      // Appliquer la nouvelle transaction
      const transactionModifiee = { ...ancienneTransaction, ...modifications };
      nouveauSolde = transactionModifiee.type === 'recette' 
        ? nouveauSolde + transactionModifiee.montant
        : nouveauSolde - transactionModifiee.montant;

      setData(prev => ({
        ...prev,
        transactions: prev.transactions.map(transaction =>
          transaction.id === id ? transactionModifiee : transaction
        ),
        comptes: prev.comptes.map(c => 
          c.id === ancienneTransaction.compteId 
            ? { ...c, soldeActuel: nouveauSolde }
            : c
        )
      }));
    }
  }, [data.transactions, data.comptes, setData]);

  const supprimerTransaction = useCallback((id: string) => {
    const transaction = data.transactions.find(t => t.id === id);
    if (!transaction) return;

    // Restaurer le solde du compte
    const compte = data.comptes.find(c => c.id === transaction.compteId);
    if (compte) {
      const nouveauSolde = transaction.type === 'recette' 
        ? compte.soldeActuel - transaction.montant
        : compte.soldeActuel + transaction.montant;

      setData(prev => ({
        ...prev,
        transactions: prev.transactions.filter(t => t.id !== id),
        comptes: prev.comptes.map(c => 
          c.id === transaction.compteId 
            ? { ...c, soldeActuel: nouveauSolde }
            : c
        )
      }));
    }
  }, [data.transactions, data.comptes, setData]);

  // Statistics & Analytics
  const obtenirStatistiques = useCallback(() => {
    const aujourd = new Date();
    const moisActuel = aujourd.getMonth();
    const anneeActuelle = aujourd.getFullYear();

    // Transactions du jour
    const transactionsJour = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date.toDateString() === aujourd.toDateString();
    });

    // Transactions du mois
    const transactionsMois = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === moisActuel && date.getFullYear() === anneeActuelle;
    });

    const revenusJour = transactionsJour
      .filter(t => t.type === 'recette' && t.statut === 'validee')
      .reduce((total, t) => total + t.montant, 0);

    const depensesJour = transactionsJour
      .filter(t => t.type === 'depense' && t.statut === 'validee')
      .reduce((total, t) => total + t.montant, 0);

    const revenusMois = transactionsMois
      .filter(t => t.type === 'recette' && t.statut === 'validee')
      .reduce((total, t) => total + t.montant, 0);

    const depensesMois = transactionsMois
      .filter(t => t.type === 'depense' && t.statut === 'validee')
      .reduce((total, t) => total + t.montant, 0);

    const beneficesNet = revenusJour - depensesJour;
    const margeNette = revenusMois > 0 ? ((revenusMois - depensesMois) / revenusMois * 100) : 0;
    
    // Solde total tous comptes
    const soldeTotal = data.comptes
      .filter(c => c.statut === 'actif')
      .reduce((total, c) => total + c.soldeActuel, 0);

    return {
      revenusJour,
      depensesJour,
      beneficesNet,
      revenusMois,
      depensesMois,
      margeNette: Math.round(margeNette * 100) / 100,
      soldeTotal,
      nombreComptes: data.comptes.filter(c => c.statut === 'actif').length,
      transactionsJour: transactionsJour.length,
      transactionsMois: transactionsMois.length
    };
  }, [data.transactions, data.comptes]);

  const obtenirBilansComptes = useCallback(() => {
    const moisActuel = new Date().getMonth();
    const anneeActuelle = new Date().getFullYear();

    return data.comptes.map(compte => {
      const transactionsCompte = data.transactions.filter(t => 
        t.compteId === compte.id && 
        new Date(t.date).getMonth() === moisActuel &&
        new Date(t.date).getFullYear() === anneeActuelle &&
        t.statut === 'validee'
      );

      const totalRecettes = transactionsCompte
        .filter(t => t.type === 'recette')
        .reduce((sum, t) => sum + t.montant, 0);

      const totalDepenses = transactionsCompte
        .filter(t => t.type === 'depense')
        .reduce((sum, t) => sum + t.montant, 0);

      const bilansCompte: BilanCompte = {
        compteId: compte.id,
        nomCompte: compte.nom,
        soldeDebut: compte.soldeInitial,
        totalRecettes,
        totalDepenses,
        soldeFin: compte.soldeActuel,
        nombreTransactions: transactionsCompte.length
      };

      return bilansCompte;
    });
  }, [data.comptes, data.transactions]);

  const obtenirRevenusParModule = useCallback(() => {
    const moisActuel = new Date().getMonth();
    const anneeActuelle = new Date().getFullYear();
    
    const transactionsMois = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === moisActuel && 
             date.getFullYear() === anneeActuelle && 
             t.type === 'recette' &&
             t.statut === 'validee';
    });

    const revenus = new Map<string, number>();
    transactionsMois.forEach(t => {
      const module = t.module;
      revenus.set(module, (revenus.get(module) || 0) + t.montant);
    });

    const total = Array.from(revenus.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(revenus.entries()).map(([module, montant]) => ({
      module,
      montant,
      pourcentage: total > 0 ? Math.round((montant / total * 100) * 100) / 100 : 0
    }));
  }, [data.transactions]);

  const obtenirDepensesParCategorie = useCallback(() => {
    const moisActuel = new Date().getMonth();
    const anneeActuelle = new Date().getFullYear();
    
    const transactionsMois = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === moisActuel && 
             date.getFullYear() === anneeActuelle && 
             t.type === 'depense' &&
             t.statut === 'validee';
    });

    const depenses = new Map<string, number>();
    transactionsMois.forEach(t => {
      const categorie = data.categories.find(c => c.id === t.categorieId)?.nom || 'Non classé';
      depenses.set(categorie, (depenses.get(categorie) || 0) + t.montant);
    });

    return Array.from(depenses.entries()).map(([categorie, montant]) => ({
      categorie,
      montant
    }));
  }, [data.transactions, data.categories]);

  return {
    // Data
    transactions: data.transactions,
    comptes: data.comptes,
    categories: data.categories,
    bilans: data.bilans,
    
    // Comptes methods
    ajouterCompte,
    modifierCompte,
    supprimerCompte,
    
    // Transactions methods
    ajouterTransaction,
    modifierTransaction,
    supprimerTransaction,
    
    // Analytics
    obtenirStatistiques,
    obtenirBilansComptes,
    obtenirRevenusParModule,
    obtenirDepensesParCategorie,
    
    // Storage
    removeData,
    exportData,
    importData
  };
};
