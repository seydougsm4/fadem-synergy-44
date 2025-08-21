import { useState } from 'react';
import { Building, Plus, Users, Home, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImmobilier } from '@/hooks/useImmobilier';
import { ProprietaireForm } from '@/components/forms/ProprietaireForm';
import { BienForm } from '@/components/forms/BienForm';
import { ProprietairesTable } from '@/components/tables/ProprietairesTable';
import { Proprietaire, Bien } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import { toast } from 'sonner';

const Immobilier = () => {
  const {
    proprietaires,
    biens,
    locataires,
    contrats,
    ajouterProprietaire,
    modifierProprietaire,
    supprimerProprietaire,
    ajouterBien,
    modifierBien,
    supprimerBien,
    obtenirStatistiques
  } = useImmobilier();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProprietaireForm, setShowProprietaireForm] = useState(false);
  const [showBienForm, setShowBienForm] = useState(false);
  const [editingProprietaire, setEditingProprietaire] = useState<Proprietaire | null>(null);
  const [editingBien, setEditingBien] = useState<Bien | null>(null);

  const stats = obtenirStatistiques();

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

  const cancelForms = () => {
    setShowProprietaireForm(false);
    setShowBienForm(false);
    setEditingProprietaire(null);
    setEditingBien(null);
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
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => {
              setActiveTab('proprietaires');
              setShowProprietaireForm(true);
            }}
          >
            <Users size={20} className="mr-2" />
            Nouveau Propriétaire
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow" onClick={() => setActiveTab('proprietaires')}>
          <h3 className="font-semibold text-fadem-black">Propriétaires</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.proprietaires}</p>
          <p className="text-sm text-muted-foreground">Actifs</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow" onClick={() => setActiveTab('biens')}>
          <h3 className="font-semibold text-fadem-black">Biens</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.biensTotal}</p>
          <p className="text-sm text-muted-foreground">En gestion</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-fadem transition-shadow" onClick={() => setActiveTab('locataires')}>
          <h3 className="font-semibold text-fadem-black">Locataires</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.locataires}</p>
          <p className="text-sm text-muted-foreground">Contrats actifs</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Revenus Mensuels</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{formatCurrency(stats.revenus)}</p>
          <p className="text-sm text-muted-foreground">Ce mois</p>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            <Building size={16} className="mr-2" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="proprietaires">
            <Users size={16} className="mr-2" />
            Propriétaires
          </TabsTrigger>
          <TabsTrigger value="biens">
            <Home size={16} className="mr-2" />
            Biens
          </TabsTrigger>
          <TabsTrigger value="contrats">
            <CreditCard size={16} className="mr-2" />
            Contrats
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

        <TabsContent value="contrats" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-fadem-black mb-4">Contrats ({contrats.length})</h2>
            {contrats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun contrat créé
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Fonctionnalité des contrats en cours de développement
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Immobilier;