// Types pour toutes les entités FADEM

export interface Proprietaire {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse: string;
  cni: string;
  dateCreation: Date;
  biensConfies: string[]; // IDs des biens
  commissionsRecues: number;
  documentsSupplementaires?: string[];
}

export interface Bien {
  id: string;
  proprietaireId: string;
  type: 'appartement' | 'villa' | 'bureau' | 'commerce' | 'terrain';
  adresse: string;
  quartier: string;
  superficie?: number;
  chambres?: number;
  sallesBain?: number;
  prixProprietaire: number;
  prixFadem: number;
  commission: number;
  description?: string;
  photos?: string[];
  equipements?: string[];
  dateEnregistrement: Date;
  statut: 'disponible' | 'loue' | 'maintenance' | 'reserve';
  contratActuel?: string; // ID du contrat
}

export interface Locataire {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse: string;
  profession: string;
  entreprise?: string;
  cni: string;
  passeport?: string;
  dateNaissance: Date;
  situationMatrimoniale: string;
  personnesACharge: number;
  revenus?: number;
  documentsSupplementaires?: string[];
  dateCreation: Date;
  contratsActifs: string[]; // IDs des contrats
}

export interface Contrat {
  id: string;
  bienId: string;
  locataireId: string;
  proprietaireId: string;
  type: 'location' | 'vente';
  montantMensuel: number;
  caution: number;
  avance?: number;
  dateDebut: Date;
  dateFin?: Date;
  duree: number; // en mois
  clausesSpeciales?: string[];
  dateSignature: Date;
  statut: 'actif' | 'expire' | 'resilié' | 'suspendu';
  paiements: string[]; // IDs des paiements
  factures: string[]; // IDs des factures
}

export interface Paiement {
  id: string;
  contratId: string;
  montant: number;
  datePaiement: Date;
  dateEcheance: Date;
  modePaiement: 'tmoney' | 'moovmoney' | 'especes' | 'virement' | 'cheque';
  referenceTransaction?: string;
  statut: 'paye' | 'en_retard' | 'partiel' | 'annule';
  penalites?: number;
  remarques?: string;
  recu: string; // Numéro de reçu
}

export interface Facture {
  id: string;
  numero: string;
  contratId?: string;
  chantierId?: string;
  vehiculeId?: string;
  type: 'location' | 'vente' | 'btp' | 'vehicule';
  montantHT: number;
  montantTTC: number;
  tva?: number;
  dateEmission: Date;
  dateEcheance: Date;
  statut: 'brouillon' | 'emise' | 'payee' | 'annulee';
  lignes: LigneFacture[];
  remarques?: string;
}

export interface LigneFacture {
  id: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;
}

// Types BTP
export interface Chantier {
  id: string;
  nom: string;
  client: string;
  adresse: string;
  typeChantier: 'construction' | 'renovation' | 'demolition' | 'amenagement';
  dateDebut: Date;
  dateFin?: Date;
  datePrevue: Date;
  budgetInitial: number;
  budgetActuel: number;
  depensesTotales: number;
  avancement: number; // pourcentage
  statut: 'planifie' | 'en_cours' | 'suspendu' | 'termine' | 'annule';
  responsable: string;
  equipeAssignee: string[]; // IDs des employés
  materiaux: Materiau[];
  depenses: DepenseChantier[];
  factures: string[]; // IDs des factures
  photos?: string[];
  description?: string;
}

export interface Materiau {
  id: string;
  nom: string;
  quantite: number;
  unite: string;
  prixUnitaire: number;
  prixTotal: number;
  fournisseur?: string;
  dateAchat: Date;
}

export interface DepenseChantier {
  id: string;
  chantierId: string;
  designation: string;
  montant: number;
  date: Date;
  categorie: 'materiau' | 'main_oeuvre' | 'transport' | 'equipement' | 'autre';
  facture?: string;
  remarques?: string;
}

// Types Véhicules
export interface Vehicule {
  id: string;
  proprietaireVehiculeId: string;
  marque: string;
  modele: string;
  annee: number;
  couleur: string;
  immatriculation: string;
  numeroSerie: string;
  typeVehicule: 'berline' | 'suv' | 'pickup' | 'moto' | 'camion';
  prixProprietaire: number;
  prixFadem: number;
  commission: number;
  kilometrage: number;
  carburant: 'essence' | 'diesel' | 'hybride' | 'electrique';
  documents: DocumentVehicule[];
  photos?: string[];
  statut: 'disponible' | 'loue' | 'en_vente' | 'maintenance' | 'vendu';
  dateEnregistrement: Date;
  contratsLocation: string[]; // IDs des contrats
  historiqueLocation: HistoriqueLocation[];
}

export interface ProprietaireVehicule {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse: string;
  cni: string;
  permisConduire?: string;
  dateCreation: Date;
  vehiculesConfies: string[]; // IDs des véhicules
  commissionsRecues: number;
}

export interface DocumentVehicule {
  type: 'carte_grise' | 'assurance' | 'visite_technique' | 'autre';
  numero: string;
  dateExpiration?: Date;
  fichier?: string;
}

export interface ContratVehicule {
  id: string;
  vehiculeId: string;
  clientNom: string;
  clientTelephone: string;
  clientCNI: string;
  type: 'location' | 'vente';
  avecChauffeur: boolean;
  chauffeurId?: string;
  montant: number;
  caution?: number;
  dateDebut: Date;
  dateFin?: Date;
  duree?: number; // en jours
  kilometrageDebut: number;
  kilometrageFin?: number;
  statut: 'actif' | 'termine' | 'annule';
  paiements: string[]; // IDs des paiements
}

export interface HistoriqueLocation {
  dateDebut: Date;
  dateFin: Date;
  client: string;
  montant: number;
  kilometrage: number;
}

// Types Personnel
export interface Employe {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse: string;
  cni: string;
  dateNaissance: Date;
  dateEmbauche: Date;
  poste: string;
  departement: 'immobilier' | 'btp' | 'vehicules' | 'comptabilite' | 'administration';
  salaireMensuel: number;
  typeContrat: 'cdi' | 'cdd' | 'stage' | 'freelance';
  statut: 'actif' | 'conge' | 'suspendu' | 'demissionne';
  documents: DocumentEmploye[];
  photos?: string[];
  competences?: string[];
  formations?: Formation[];
  evaluations?: Evaluation[];
  historiquePoste?: HistoriquePoste[];
}

export interface DocumentEmploye {
  type: 'cv' | 'diplome' | 'certificat' | 'contrat' | 'autre';
  nom: string;
  fichier?: string;
  dateAjout: Date;
}

export interface Formation {
  id: string;
  nom: string;
  organisme: string;
  dateDebut: Date;
  dateFin: Date;
  certificat?: string;
}

export interface Evaluation {
  id: string;
  date: Date;
  note: number;
  commentaires: string;
  evaluateur: string;
}

export interface HistoriquePoste {
  poste: string;
  dateDebut: Date;
  dateFin?: Date;
  salaire: number;
}

export interface Salaire {
  id: string;
  employeId: string;
  mois: number;
  annee: number;
  salaireBase: number;
  primes?: number;
  avances?: number;
  retenues?: number;
  salaireNet: number;
  datePaiement: Date;
  modePaiement: 'tmoney' | 'moovmoney' | 'especes' | 'virement' | 'cheque';
  statut: 'paye' | 'en_attente' | 'annule';
  remarques?: string;
}

export interface Conge {
  id: string;
  employeId: string;
  type: 'annuel' | 'maladie' | 'maternite' | 'sans_solde' | 'autre';
  dateDebut: Date;
  dateFin: Date;
  nombreJours: number;
  statut: 'demande' | 'approuve' | 'refuse' | 'en_cours';
  motif?: string;
  approbateur?: string;
  dateApprobation?: Date;
}

export interface Absence {
  id: string;
  employeId: string;
  date: Date;
  type: 'retard' | 'absence_non_justifiee' | 'absence_justifiee';
  duree: number; // en heures
  motif?: string;
  sanction?: string;
}

// Types Comptabilité
export interface TransactionComptable {
  id: string;
  date: Date;
  type: 'recette' | 'depense';
  montant: number;
  categorie: string;
  sousCategorie?: string;
  module: 'immobilier' | 'btp' | 'vehicules' | 'personnel' | 'autre';
  reference?: string; // ID de la facture, contrat, etc.
  description: string;
  modePaiement: 'tmoney' | 'moovmoney' | 'especes' | 'virement' | 'cheque';
  numeroTransaction?: string;
  statut: 'validee' | 'en_attente' | 'annulee';
  piece?: string; // Numéro de pièce justificative
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

// Types Rapports
export interface RapportJournalier {
  id: string;
  date: Date;
  recettes: number;
  depenses: number;
  beneficeNet: number;
  transactionsCount: number;
  activitesParModule: Record<string, any>;
  alertes?: string[];
  remarques?: string;
  generePar?: string;
  dateGeneration: Date;
}

export interface RapportPersonnalise {
  id: string;
  nom: string;
  description?: string;
  dateDebut: Date;
  dateFin: Date;
  modules: string[];
  metriques: string[];
  filtres?: Record<string, any>;
  donnees?: Record<string, any>;
  dateGeneration: Date;
  generePar?: string;
  format: 'pdf' | 'excel' | 'json';
}

// Types généraux
export interface Notification {
  id: string;
  type: 'echeance' | 'retard' | 'rappel' | 'alerte' | 'info';
  titre: string;
  message: string;
  date: Date;
  lu: boolean;
  module: string;
  referenceId?: string;
  priorite: 'basse' | 'normale' | 'haute' | 'critique';
}

export interface ParametreSystem {
  id: string;
  categorie: string;
  cle: string;
  valeur: any;
  description?: string;
  dateModification: Date;
  modifiePar?: string;
}

export interface UtilisateurModule {
  id: string;
  nom: string;
  email?: string;
  motDePasse: string;
  modulesAcces: string[];
  permissions: Record<string, string[]>; // module -> [read, write, delete, admin]
  statut: 'actif' | 'inactif' | 'suspendu';
  derniereConnexion?: Date;
  dateCreation: Date;
}