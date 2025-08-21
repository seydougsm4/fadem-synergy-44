import { useState } from 'react';
import { Building, Plus, Users, Home, CreditCard, FileText, UserPlus, Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImmobilier } from '@/hooks/useImmobilier';
import { ProprietaireForm } from '@/components/forms/ProprietaireForm';
import { BienForm } from '@/components/forms/BienForm';
import { LocataireForm } from '@/components/forms/LocataireForm';
import { ContratForm } from '@/components/forms/ContratForm';
import { PaiementForm } from '@/components/forms/PaiementForm';
import { ProprietairesTable } from '@/components/tables/ProprietairesTable';
import { LocatairesTable } from '@/components/tables/LocatairesTable';
import { Proprietaire, Bien, Locataire, Contrat, Paiement } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import { toast } from 'sonner';

const Immobilier = () => {
  const {
    proprietaires,
    biens,
    locataires,
    contrats,
    paiements,
    ajouterProprietaire,
    modifierProprietaire,
    supprimerProprietaire,
    ajouterBien,
    modifierBien,
    supprimerBien,
    ajouterLocataire,
    modifierLocataire,
    supprimerLocataire,
    creerContrat,
    modifierContrat,
    resilierContrat,
    enregistrerPaiement,
    obtenirStatistiques,
    obtenirPaiementsEnRetard,
    obtenirEcheancesProchaines
  } = useImmobilier();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProprietaireForm, setShowProprietaireForm] = useState(false);
  const [showBienForm, setShowBienForm] = useState(false);
  const [showLocataireForm, setShowLocataireForm] = useState(false);
  const [showContratForm, setShowContratForm] = useState(false);
  const [showPaiementForm, setShowPaiementForm] = useState(false);
  const [editingProprietaire, setEditingProprietaire] = useState<Proprietaire | null>(null);
  const [editingBien, setEditingBien] = useState<Bien | null>(null);
  const [editingLocataire, setEditingLocataire] = useState<Locataire | null>(null);
  const [editingContrat, setEditingContrat] = useState<Contrat | null>(null);
  const [editingPaiement, setEditingPaiement] = useState<Paiement | null>(null);
  const [preselectedBienId, setPreselectedBienId] = useState<string | undefined>();
  const [preselectedLocataireId, setPreselectedLocataireId] = useState<string | undefined>();
  const [preselectedContratId, setPreselectedContratId] = useState<string | undefined>();

  const stats = obtenirStatistiques();
  const paiementsEnRetard = obtenirPaiementsEnRetard();
  const echeancesProchaines = obtenirEcheancesProchaines();

  const handleAddProprietaire = (data: Omit<Proprietaire, 'id' | 'dateCreation' | 'biensConfies' | 'commissionsRecues'>) => {
    try {
      ajouterProprietaire(data);
      setShowProprietaireForm(false);
      toast.success('Propriétaire ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du propriétaire');
    }
  };

  const handleEditProprietaire = (proprietaire: Proprietaire) => {
    setEditingProprietaire(proprietaire);
    setShowProprietaireForm(true);
  };

  const handleUpdateProprietaire = (data: Omit<Proprietaire, 'id' | 'dateCreation' | 'biensConfies' | 'commissionsRecues'>) => {
    if (!editingProprietaire) return;
    
    try {
      modifierProprietaire(editingProprietaire.id, data);
      setShowProprietaireForm(false);
      setEditingProprietaire(null);
      toast.success('Propriétaire modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteProprietaire = (id: string) => {
    try {
      supprimerProprietaire(id);
      toast.success('Propriétaire supprimé avec succès');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddBien = (data: Omit<Bien, 'id' | 'dateEnregistrement' | 'statut' | 'commission'>) => {
    try {
      ajouterBien(data);
      setShowBienForm(false);
      toast.success('Bien ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du bien');
    }
  };

  const handleEditBien = (bien: Bien) => {
    setEditingBien(bien);
    setShowBienForm(true);
  };

  const handleUpdateBien = (data: Omit<Bien, 'id' | 'dateEnregistrement' | 'statut' | 'commission'>) => {
    if (!editingBien) return;
    
    try {
      modifierBien(editingBien.id, data);
      setShowBienForm(false);
      setEditingBien(null);
      toast.success('Bien modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteBien = (id: string) => {
    try {
      supprimerBien(id);
      toast.success('Bien supprimé avec succès');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Gestion des locataires
  const handleAddLocataire = (data: Omit<Locataire, 'id' | 'dateCreation' | 'contratsActifs' | 'documentsSupplementaires'>) => {
    try {
      ajouterLocataire(data);
      setShowLocataireForm(false);
      toast.success('Locataire ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du locataire');
    }
  };

  const handleEditLocataire = (locataire: Locataire) => {
    setEditingLocataire(locataire);
    setShowLocataireForm(true);
  };

  const handleUpdateLocataire = (data: Omit<Locataire, 'id' | 'dateCreation' | 'contratsActifs' | 'documentsSupplementaires'>) => {
    if (!editingLocataire) return;
    
    try {
      modifierLocataire(editingLocataire.id, data);
      setShowLocataireForm(false);
      setEditingLocataire(null);
      toast.success('Locataire modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteLocataire = (id: string) => {
    try {
      supprimerLocataire(id);
      toast.success('Locataire supprimé avec succès');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Gestion des contrats
  const handleCreateContract = (data: Omit<Contrat, 'id' | 'dateSignature' | 'statut' | 'paiements' | 'factures' | 'dateFin'>) => {
    try {
      creerContrat(data);
      setShowContratForm(false);
      setPreselectedBienId(undefined);
      setPreselectedLocataireId(undefined);
      toast.success('Contrat créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création du contrat');
    }
  };

  const handleCreateContractForLocataire = (locataireId: string) => {
    setPreselectedLocataireId(locataireId);
    setActiveTab('contrats');
    setShowContratForm(true);
  };

  const handleCreateContractForBien = (bienId: string) => {
    setPreselectedBienId(bienId);
    setActiveTab('contrats');
    setShowContratForm(true);
  };

  // Gestion des paiements
  const handleAddPaiement = (data: Omit<Paiement, 'id' | 'recu'>) => {
    try {
      enregistrerPaiement(data);
      setShowPaiementForm(false);
      setPreselectedContratId(undefined);
      toast.success('Paiement enregistré avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du paiement');
    }
  };

  const handleCreatePaiementForContrat = (contratId: string) => {
    setPreselectedContratId(contratId);
    setActiveTab('paiements');
    setShowPaiementForm(true);
  };

  const cancelForms = () => {
    setShowProprietaireForm(false);
    setShowBienForm(false);
    setShowLocataireForm(false);
    setShowContratForm(false);
    setShowPaiementForm(false);
    setEditingProprietaire(null);
    setEditingBien(null);
    setEditingLocataire(null);
    setEditingContrat(null);
    setEditingPaiement(null);
    setPreselectedBienId(undefined);
    setPreselectedLocataireId(undefined);
    setPreselectedContratId(undefined);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg text-white">
            <Building size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-fadem-black">Module Immobilier</h1>
            <p className="text-muted-foreground">Gestion des biens, locataires et propriétaires</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              setActiveTab('proprietaires');
              setShowProprietaireForm(true);
            }}
            className="hidden sm:flex"
          >
            <Users size={20} className="mr-2" />
            Nouveau Propriétaire
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setActiveTab('locataires');
              setShowLocataireForm(true);
            }}
          >
            <UserPlus size={20} className="mr-2" />
            Nouveau Locataire
          </Button>
          <Button 
            className="bg-fadem-red hover:bg-fadem-red-dark text-white"
            onClick={() => {
              setActiveTab('biens');
              setShowBienForm(true);
            }}
          >
            <Plus size={20} className="mr-2" />
            Nouveau Bien
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow animate-fade-in" onClick={() => setActiveTab('proprietaires')}>
          <h3 className="font-semibold text-fadem-black text-sm">Propriétaires</h3>
          <p className="text-xl lg:text-2xl font-bold text-fadem-red mt-1">{stats.proprietaires}</p>
          <p className="text-xs text-muted-foreground">Actifs</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow animate-fade-in" onClick={() => setActiveTab('biens')}>
          <h3 className="font-semibold text-fadem-black text-sm">Biens</h3>
          <p className="text-xl lg:text-2xl font-bold text-fadem-red mt-1">{stats.biensTotal}</p>
          <p className="text-xs text-muted-foreground">En gestion</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow animate-fade-in" onClick={() => setActiveTab('locataires')}>
          <h3 className="font-semibold text-fadem-black text-sm">Locataires</h3>
          <p className="text-xl lg:text-2xl font-bold text-fadem-red mt-1">{stats.locataires}</p>
          <p className="text-xs text-muted-foreground">Inscrits</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow animate-fade-in" onClick={() => setActiveTab('contrats')}>
          <h3 className="font-semibold text-fadem-black text-sm">Contrats</h3>
          <p className="text-xl lg:text-2xl font-bold text-fadem-red mt-1">{stats.contratsActifs}</p>
          <p className="text-xs text-muted-foreground">Actifs</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow animate-fade-in" onClick={() => setActiveTab('paiements')}>
          <h3 className="font-semibold text-fadem-black text-sm">En Retard</h3>
          <p className="text-xl lg:text-2xl font-bold text-destructive mt-1">{paiementsEnRetard.length}</p>
          <p className="text-xs text-muted-foreground">Paiements</p>
        </Card>
        <Card className="p-4 animate-fade-in">
          <h3 className="font-semibold text-fadem-black text-sm">Revenus</h3>
          <p className="text-xl lg:text-2xl font-bold text-success mt-1">{formatCurrency(stats.revenus)}</p>
          <p className="text-xs text-muted-foreground">Ce mois</p>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="dashboard" className="text-xs lg:text-sm">
            <Building size={16} className="mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Tableau de bord</span>
            <span className="sm:hidden">Board</span>
          </TabsTrigger>
          <TabsTrigger value="proprietaires" className="text-xs lg:text-sm">
            <Users size={16} className="mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Propriétaires</span>
            <span className="sm:hidden">Proprio</span>
          </TabsTrigger>
          <TabsTrigger value="biens" className="text-xs lg:text-sm">
            <Home size={16} className="mr-1 lg:mr-2" />
            Biens
          </TabsTrigger>
          <TabsTrigger value="locataires" className="text-xs lg:text-sm">
            <UserPlus size={16} className="mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Locataires</span>
            <span className="sm:hidden">Locat.</span>
          </TabsTrigger>
          <TabsTrigger value="contrats" className="text-xs lg:text-sm">
            <FileText size={16} className="mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Contrats</span>
            <span className="sm:hidden">Contr.</span>
          </TabsTrigger>
          <TabsTrigger value="paiements" className="text-xs lg:text-sm">
            <Calculator size={16} className="mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Paiements</span>
            <span className="sm:hidden">Paiem.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Statistiques Détaillées</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biens disponibles</span>
                  <span className="font-semibold text-success">{stats.biensDisponibles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biens loués</span>
                  <span className="font-semibold text-warning">{stats.biensLoues}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contrats actifs</span>
                  <span className="font-semibold text-fadem-red">{stats.contratsActifs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux d'occupation</span>
                  <span className="font-semibold text-fadem-black">
                    {stats.biensTotal > 0 ? Math.round((stats.biensLoues / stats.biensTotal) * 100) : 0}%
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Actions Rapides</h2>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('proprietaires');
                    setShowProprietaireForm(true);
                  }}
                >
                  <Users size={16} className="mr-2" />
                  Ajouter un propriétaire
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('biens');
                    setShowBienForm(true);
                  }}
                >
                  <Home size={16} className="mr-2" />
                  Enregistrer un bien
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard size={16} className="mr-2" />
                  Créer un contrat
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proprietaires" className="space-y-6">
          {showProprietaireForm ? (
            <ProprietaireForm
              proprietaire={editingProprietaire || undefined}
              onSubmit={editingProprietaire ? handleUpdateProprietaire : handleAddProprietaire}
              onCancel={cancelForms}
            />
          ) : (
            <ProprietairesTable
              proprietaires={proprietaires}
              onEdit={handleEditProprietaire}
              onDelete={handleDeleteProprietaire}
            />
          )}
        </TabsContent>

        <TabsContent value="biens" className="space-y-6">
          {showBienForm ? (
            <BienForm
              bien={editingBien || undefined}
              proprietaires={proprietaires}
              onSubmit={editingBien ? handleUpdateBien : handleAddBien}
              onCancel={cancelForms}
            />
          ) : (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Liste des Biens ({biens.length})</h2>
              {biens.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun bien enregistré
                </div>
              ) : (
                <div className="space-y-4">
                  {biens.map((bien) => {
                    const proprietaire = proprietaires.find(p => p.id === bien.proprietaireId);
                    return (
                      <div key={bien.id} className="border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-fadem-black">
                              {bien.type} - {bien.quartier}
                            </h3>
                            <p className="text-sm text-muted-foreground">{bien.adresse}</p>
                            <p className="text-sm text-muted-foreground">
                              Propriétaire: {proprietaire?.nom} {proprietaire?.prenom}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`text-sm px-2 py-1 rounded-full ${
                                bien.statut === 'disponible' ? 'bg-success/10 text-success' :
                                bien.statut === 'loue' ? 'bg-warning/10 text-warning' :
                                'bg-destructive/10 text-destructive'
                              }`}>
                                {bien.statut}
                              </span>
                              {bien.chambres && <span className="text-sm text-muted-foreground">{bien.chambres} chambres</span>}
                              {bien.superficie && <span className="text-sm text-muted-foreground">{bien.superficie} m²</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-fadem-red">{formatCurrency(bien.prixFadem)}/mois</p>
                            <p className="text-sm text-muted-foreground">Commission: {formatCurrency(bien.commission)}</p>
                            <div className="flex space-x-2 mt-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditBien(bien)}>
                                Modifier
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive"
                                onClick={() => handleDeleteBien(bien.id)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="locataires" className="space-y-6">
          {showLocataireForm ? (
            <LocataireForm
              locataire={editingLocataire || undefined}
              onSubmit={editingLocataire ? handleUpdateLocataire : handleAddLocataire}
              onCancel={cancelForms}
            />
          ) : (
            <LocatairesTable
              locataires={locataires}
              contrats={contrats}
              onEdit={handleEditLocataire}
              onDelete={handleDeleteLocataire}
              onCreateContract={handleCreateContractForLocataire}
            />
          )}
        </TabsContent>

        <TabsContent value="contrats" className="space-y-6">
          {showContratForm ? (
            <ContratForm
              contrat={editingContrat || undefined}
              biens={biens}
              locataires={locataires}
              proprietaires={proprietaires}
              onSubmit={handleCreateContract}
              onCancel={cancelForms}
              preselectedBienId={preselectedBienId}
              preselectedLocataireId={preselectedLocataireId}
            />
          ) : (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Contrats ({contrats.length})</h2>
              {contrats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun contrat créé
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Liste des contrats - Fonctionnalité complète disponible
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="paiements" className="space-y-6">
          {showPaiementForm ? (
            <PaiementForm
              paiement={editingPaiement || undefined}
              contrats={contrats}
              biens={biens}
              locataires={locataires}
              onSubmit={handleAddPaiement}
              onCancel={cancelForms}
              preselectedContratId={preselectedContratId}
            />
          ) : (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Paiements ({paiements.length})</h2>
              {paiements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun paiement enregistré
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Gestion des paiements - Fonctionnalité complète disponible
                </div>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Immobilier;