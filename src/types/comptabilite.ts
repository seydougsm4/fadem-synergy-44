
// Types spécifiques pour le module comptabilité complet

export interface TransactionComptableComplete {
  id: string;
  date: Date;
  type: 'recette' | 'depense';
  montant: number;
  categorieId: string;
  module: 'immobilier' | 'btp' | 'vehicules' | 'personnel' | 'autre';
  compteId: string; // ID du compte bancaire
  reference?: string; // ID de la facture, contrat, etc.
  description: string;
  modePaiement: 'tmoney' | 'moovmoney' | 'especes' | 'virement' | 'cheque';
  numeroTransaction?: string;
  statut: 'validee' | 'en_attente' | 'annulee';
  pieceJustificative?: string;
  remarques?: string;
}

export interface Compte {
  id: string;
  nom: string;
  type: 'banque' | 'especes' | 'mobile_money' | 'autre';
  numero?: string;
  banque?: string;
  soldeInitial: number;
  soldeActuel: number;
  devise: string;
  dateOuverture: Date;
  statut: 'actif' | 'inactif' | 'ferme';
  description?: string;
}

export interface CategorieTransaction {
  id: string;
  nom: string;
  type: 'recette' | 'depense';
  couleur: string;
  description?: string;
  sousCategories?: string[];
}

export interface BilanCompte {
  compteId: string;
  nomCompte: string;
  soldeDebut: number;
  totalRecettes: number;
  totalDepenses: number;
  soldeFin: number;
  nombreTransactions: number;
}

export interface BilanMensuel {
  id: string;
  mois: number;
  annee: number;
  recettesTotales: number;
  depensesTotales: number;
  benefices: number;
  margeNette: number;
  recettesParModule: Record<string, number>;
  depensesParCategorie: Record<string, number>;
  nombreTransactions: number;
  dateGeneration: Date;
  statut: 'brouillon' | 'finalise';
}

export interface StatistiquesComptables {
  revenusJour: number;
  depensesJour: number;
  beneficesNet: number;
  revenusMois: number;
  depensesMois: number;
  margeNette: number;
  soldeTotal: number;
  nombreComptes: number;
  transactionsJour: number;
  transactionsMois: number;
}
