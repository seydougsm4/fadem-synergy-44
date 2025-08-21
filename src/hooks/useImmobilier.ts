import { useCallback } from 'react';
import { useFademStorage } from './useLocalStorage';
import { Proprietaire, Bien, Locataire, Contrat, Paiement, Facture } from '../types';
import { generateId, calculateCommission } from '../utils/helpers';

interface ImmobilierData {
  proprietaires: Proprietaire[];
  biens: Bien[];
  locataires: Locataire[];
  contrats: Contrat[];
  paiements: Paiement[];
  factures: Facture[];
}

const initialData: ImmobilierData = {
  proprietaires: [],
  biens: [],
  locataires: [],
  contrats: [],
  paiements: [],
  factures: []
};

export function useImmobilier() {
  const { data, setData } = useFademStorage('immobilier', initialData);

  // Propriétaires
  const ajouterProprietaire = useCallback((proprietaire: Omit<Proprietaire, 'id' | 'dateCreation' | 'biensConfies' | 'commissionsRecues'>) => {
    const nouveauProprietaire: Proprietaire = {
      ...proprietaire,
      id: generateId(),
      dateCreation: new Date(),
      biensConfies: [],
      commissionsRecues: 0
    };

    setData(prev => ({
      ...prev,
      proprietaires: [...prev.proprietaires, nouveauProprietaire]
    }));

    return nouveauProprietaire;
  }, [setData]);

  const modifierProprietaire = useCallback((id: string, updates: Partial<Proprietaire>) => {
    setData(prev => ({
      ...prev,
      proprietaires: prev.proprietaires.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    }));
  }, [setData]);

  const supprimerProprietaire = useCallback((id: string) => {
    // Vérifier qu'il n'y a pas de biens associés
    const biensAssocies = data.biens.filter(b => b.proprietaireId === id);
    if (biensAssocies.length > 0) {
      throw new Error('Impossible de supprimer: des biens sont associés à ce propriétaire');
    }

    setData(prev => ({
      ...prev,
      proprietaires: prev.proprietaires.filter(p => p.id !== id)
    }));
  }, [data.biens, setData]);

  // Biens
  const ajouterBien = useCallback((bien: Omit<Bien, 'id' | 'dateEnregistrement' | 'statut' | 'commission'>) => {
    const commission = calculateCommission(bien.prixFadem, bien.prixProprietaire);
    const nouveauBien: Bien = {
      ...bien,
      id: generateId(),
      dateEnregistrement: new Date(),
      statut: 'disponible',
      commission
    };

    setData(prev => ({
      ...prev,
      biens: [...prev.biens, nouveauBien],
      proprietaires: prev.proprietaires.map(p => 
        p.id === bien.proprietaireId 
          ? { ...p, biensConfies: [...p.biensConfies, nouveauBien.id] }
          : p
      )
    }));

    return nouveauBien;
  }, [setData]);

  const modifierBien = useCallback((id: string, updates: Partial<Bien>) => {
    setData(prev => ({
      ...prev,
      biens: prev.biens.map(b => {
        if (b.id === id) {
          const updated = { ...b, ...updates };
          if (updates.prixFadem || updates.prixProprietaire) {
            updated.commission = calculateCommission(
              updates.prixFadem || b.prixFadem,
              updates.prixProprietaire || b.prixProprietaire
            );
          }
          return updated;
        }
        return b;
      })
    }));
  }, [setData]);

  const supprimerBien = useCallback((id: string) => {
    const bien = data.biens.find(b => b.id === id);
    if (!bien) return;

    // Vérifier qu'il n'y a pas de contrat actif
    const contratsActifs = data.contrats.filter(c => c.bienId === id && c.statut === 'actif');
    if (contratsActifs.length > 0) {
      throw new Error('Impossible de supprimer: le bien a des contrats actifs');
    }

    setData(prev => ({
      ...prev,
      biens: prev.biens.filter(b => b.id !== id),
      proprietaires: prev.proprietaires.map(p => 
        p.id === bien.proprietaireId
          ? { ...p, biensConfies: p.biensConfies.filter(bId => bId !== id) }
          : p
      )
    }));
  }, [data.biens, data.contrats, setData]);

  // Locataires
  const ajouterLocataire = useCallback((locataire: Omit<Locataire, 'id' | 'dateCreation' | 'contratsActifs'>) => {
    const nouveauLocataire: Locataire = {
      ...locataire,
      id: generateId(),
      dateCreation: new Date(),
      contratsActifs: []
    };

    setData(prev => ({
      ...prev,
      locataires: [...prev.locataires, nouveauLocataire]
    }));

    return nouveauLocataire;
  }, [setData]);

  const modifierLocataire = useCallback((id: string, updates: Partial<Locataire>) => {
    setData(prev => ({
      ...prev,
      locataires: prev.locataires.map(l => 
        l.id === id ? { ...l, ...updates } : l
      )
    }));
  }, [setData]);

  const supprimerLocataire = useCallback((id: string) => {
    // Vérifier qu'il n'y a pas de contrats actifs
    const contratsActifs = data.contrats.filter(c => c.locataireId === id && c.statut === 'actif');
    if (contratsActifs.length > 0) {
      throw new Error('Impossible de supprimer: le locataire a des contrats actifs');
    }

    setData(prev => ({
      ...prev,
      locataires: prev.locataires.filter(l => l.id !== id)
    }));
  }, [data.contrats, setData]);

  // Contrats
  const creerContrat = useCallback((contrat: Omit<Contrat, 'id' | 'dateSignature' | 'paiements' | 'factures'>) => {
    const nouveauContrat: Contrat = {
      ...contrat,
      id: generateId(),
      dateSignature: new Date(),
      paiements: [],
      factures: []
    };

    setData(prev => ({
      ...prev,
      contrats: [...prev.contrats, nouveauContrat],
      biens: prev.biens.map(b => 
        b.id === contrat.bienId 
          ? { ...b, statut: 'loue', contratActuel: nouveauContrat.id }
          : b
      ),
      locataires: prev.locataires.map(l => 
        l.id === contrat.locataireId
          ? { ...l, contratsActifs: [...l.contratsActifs, nouveauContrat.id] }
          : l
      )
    }));

    return nouveauContrat;
  }, [setData]);

  const modifierContrat = useCallback((id: string, updates: Partial<Contrat>) => {
    setData(prev => ({
      ...prev,
      contrats: prev.contrats.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  }, [setData]);

  const resilierContrat = useCallback((id: string, motif?: string) => {
    const contrat = data.contrats.find(c => c.id === id);
    if (!contrat) return;

    setData(prev => ({
      ...prev,
      contrats: prev.contrats.map(c => 
        c.id === id 
          ? { ...c, statut: 'resilié' as const, dateFin: new Date() }
          : c
      ),
      biens: prev.biens.map(b => 
        b.id === contrat.bienId 
          ? { ...b, statut: 'disponible', contratActuel: undefined }
          : b
      ),
      locataires: prev.locataires.map(l => 
        l.id === contrat.locataireId
          ? { ...l, contratsActifs: l.contratsActifs.filter(cId => cId !== id) }
          : l
      )
    }));
  }, [data.contrats, setData]);

  // Paiements
  const enregistrerPaiement = useCallback((paiement: Omit<Paiement, 'id' | 'recu'>) => {
    const nouveauPaiement: Paiement = {
      ...paiement,
      id: generateId(),
      recu: `REC-${Date.now()}`
    };

    setData(prev => ({
      ...prev,
      paiements: [...prev.paiements, nouveauPaiement],
      contrats: prev.contrats.map(c => 
        c.id === paiement.contratId
          ? { ...c, paiements: [...c.paiements, nouveauPaiement.id] }
          : c
      )
    }));

    return nouveauPaiement;
  }, [setData]);

  // Utilitaires
  const obtenirStatistiques = useCallback(() => {
    const biensTotal = data.biens.length;
    const biensLoues = data.biens.filter(b => b.statut === 'loue').length;
    const biensDisponibles = data.biens.filter(b => b.statut === 'disponible').length;
    const contratsActifs = data.contrats.filter(c => c.statut === 'actif').length;
    
    const revenus = data.paiements
      .filter(p => p.statut === 'paye' && p.datePaiement.getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + p.montant, 0);

    return {
      proprietaires: data.proprietaires.length,
      biensTotal,
      biensLoues,
      biensDisponibles,
      locataires: data.locataires.length,
      contratsActifs,
      revenus
    };
  }, [data]);

  const obtenirPaiementsEnRetard = useCallback(() => {
    const aujourd = new Date();
    return data.paiements.filter(p => 
      p.statut !== 'paye' && 
      new Date(p.dateEcheance) < aujourd
    );
  }, [data.paiements]);

  const obtenirEcheancesProchaines = useCallback((jours = 7) => {
    const limite = new Date();
    limite.setDate(limite.getDate() + jours);
    
    return data.paiements.filter(p => 
      p.statut !== 'paye' && 
      new Date(p.dateEcheance) <= limite &&
      new Date(p.dateEcheance) >= new Date()
    );
  }, [data.paiements]);

  return {
    // Données
    proprietaires: data.proprietaires,
    biens: data.biens,
    locataires: data.locataires,
    contrats: data.contrats,
    paiements: data.paiements,
    factures: data.factures,

    // Actions Propriétaires
    ajouterProprietaire,
    modifierProprietaire,
    supprimerProprietaire,

    // Actions Biens
    ajouterBien,
    modifierBien,
    supprimerBien,

    // Actions Locataires
    ajouterLocataire,
    modifierLocataire,
    supprimerLocataire,

    // Actions Contrats
    creerContrat,
    modifierContrat,
    resilierContrat,

    // Actions Paiements
    enregistrerPaiement,

    // Utilitaires
    obtenirStatistiques,
    obtenirPaiementsEnRetard,
    obtenirEcheancesProchaines
  };
}