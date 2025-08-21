import { Hammer, Plus, MapPin, Clock, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChantierForm } from "@/components/forms/ChantierForm";
import { useBTP } from "@/hooks/useBTP";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const BTP = () => {
  const { 
    chantiers, 
    ajouterChantier, 
    modifierChantier, 
    supprimerChantier, 
    obtenirStatistiques 
  } = useBTP();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showChantierForm, setShowChantierForm] = useState(false);
  const [editingChantier, setEditingChantier] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stats = obtenirStatistiques();

  const handleAddChantier = () => {
    setEditingChantier(null);
    setShowChantierForm(true);
    setActiveTab("chantiers");
  };

  const handleEditChantier = (chantier) => {
    setEditingChantier(chantier);
    setShowChantierForm(true);
    setActiveTab("chantiers");
  };

  const handleDeleteChantier = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chantier ?')) {
      supprimerChantier(id);
    }
  };

  const handleSubmitChantier = async (chantierData) => {
    setIsLoading(true);
    try {
      if (editingChantier) {
        modifierChantier(editingChantier.id, chantierData);
      } else {
        ajouterChantier(chantierData);
      }
      setShowChantierForm(false);
      setEditingChantier(null);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelForms = () => {
    setShowChantierForm(false);
    setEditingChantier(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg text-white">
            <Hammer size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-fadem-black">Module BTP</h1>
            <p className="text-muted-foreground">Gestion des chantiers et suivi des travaux</p>
          </div>
        </div>
        <Button 
          onClick={handleAddChantier}
          className="bg-fadem-red hover:bg-fadem-red-dark text-white"
        >
          <Plus size={20} className="mr-2" />
          Nouveau Chantier
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Chantiers Actifs</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.chantiersActifs}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Ouvriers Assignés</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.ouvriersTotaux}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Budget Total</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{(stats.budgetTotal / 1000000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Marge Moyenne</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.margeMovenne}%</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="chantiers">Chantiers</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Active Projects */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-fadem-black mb-4">Chantiers en Cours</h2>
            {chantiers.length === 0 ? (
              <div className="text-center py-8">
                <Hammer size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun chantier enregistré</p>
                <Button 
                  onClick={handleAddChantier}
                  className="mt-4 bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  Créer le premier chantier
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {chantiers.slice(0, 5).map((chantier) => (
                  <div key={chantier.id} className="border border-card-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-fadem-black">{chantier.nom}</h3>
                        <p className="text-muted-foreground flex items-center mt-1">
                          <MapPin size={16} className="mr-1" />
                          Client: {chantier.client}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          chantier.statut === 'en_cours' ? 'bg-warning/10 text-warning' :
                          chantier.statut === 'termine' ? 'bg-success/10 text-success' :
                          'bg-secondary text-secondary-foreground'
                        }`}>
                          {chantier.statut === 'planifie' ? 'Planifié' :
                           chantier.statut === 'en_cours' ? 'En cours' :
                           chantier.statut === 'termine' ? 'Terminé' :
                           chantier.statut === 'suspendu' ? 'Suspendu' : 'Annulé'}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {formatDistanceToNow(new Date(chantier.datePrevue), { 
                            addSuffix: false, 
                            locale: fr 
                          })} restants
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-semibold text-fadem-black">{chantier.avancement}%</span>
                      </div>
                      <Progress value={chantier.avancement} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign size={16} className="text-fadem-red" />
                        <div>
                          <p className="text-sm text-muted-foreground">Budget Initial</p>
                          <p className="font-semibold text-fadem-black">{chantier.budgetInitial.toLocaleString()} CFA</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign size={16} className="text-warning" />
                        <div>
                          <p className="text-sm text-muted-foreground">Dépenses</p>
                          <p className="font-semibold text-fadem-black">{chantier.depensesTotales.toLocaleString()} CFA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="chantiers" className="space-y-6">
          {showChantierForm ? (
            <ChantierForm
              chantier={editingChantier}
              onSubmit={handleSubmitChantier}
              onCancel={cancelForms}
              isLoading={isLoading}
            />
          ) : (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fadem-black">
                  Tous les Chantiers ({chantiers.length})
                </h2>
                <Button 
                  onClick={handleAddChantier}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Chantier
                </Button>
              </div>
              
              {chantiers.length === 0 ? (
                <div className="text-center py-8">
                  <Hammer size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun chantier enregistré</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chantiers.map((chantier) => (
                    <div key={chantier.id} className="border border-card-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-fadem-black">{chantier.nom}</h3>
                          <p className="text-sm text-muted-foreground">Client: {chantier.client}</p>
                          <p className="text-sm text-muted-foreground">Adresse: {chantier.adresse}</p>
                          <p className="text-sm text-muted-foreground">Budget: {chantier.budgetInitial.toLocaleString()} CFA</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditChantier(chantier)}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteChantier(chantier.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BTP;