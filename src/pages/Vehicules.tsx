
import { Car, Plus, Calendar, DollarSign, Users, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehiculeForm } from "@/components/forms/VehiculeForm";
import { ProprietaireVehiculeForm } from "@/components/forms/ProprietaireVehiculeForm";
import { ContratVehiculeForm } from "@/components/forms/ContratVehiculeForm";
import { useVehicules } from "@/hooks/useVehicules";
import { useState } from "react";

const Vehicules = () => {
  const { 
    vehicules, 
    proprietaires,
    contrats,
    ajouterVehicule,
    ajouterProprietaire,
    modifierVehicule,
    supprimerVehicule,
    creerContrat,
    terminerLocation,
    obtenirStatistiques,
    obtenirVehiculesDisponibles,
    obtenirContratsActifs
  } = useVehicules();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showVehiculeForm, setShowVehiculeForm] = useState(false);
  const [showProprietaireForm, setShowProprietaireForm] = useState(false);
  const [showContratForm, setShowContratForm] = useState(false);
  const [editingVehicule, setEditingVehicule] = useState(null);
  const [editingProprietaire, setEditingProprietaire] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stats = obtenirStatistiques();
  const vehiculesDisponibles = obtenirVehiculesDisponibles();
  const contratsActifs = obtenirContratsActifs();

  const handleAddVehicule = () => {
    setEditingVehicule(null);
    setShowVehiculeForm(true);
    setActiveTab("vehicules");
  };

  const handleAddProprietaire = () => {
    setEditingProprietaire(null);
    setShowProprietaireForm(true);
    setActiveTab("proprietaires");
  };

  const handleAddContrat = () => {
    setShowContratForm(true);
    setActiveTab("locations");
  };

  const handleEditVehicule = (vehicule) => {
    setEditingVehicule(vehicule);
    setShowVehiculeForm(true);
    setActiveTab("vehicules");
  };

  const handleEditProprietaire = (proprietaire) => {
    setEditingProprietaire(proprietaire);
    setShowProprietaireForm(true);
    setActiveTab("proprietaires");
  };

  const handleDeleteVehicule = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      supprimerVehicule(id);
    }
  };

  const handleSubmitVehicule = async (vehiculeData) => {
    setIsLoading(true);
    try {
      if (editingVehicule) {
        modifierVehicule(editingVehicule.id, vehiculeData);
      } else {
        ajouterVehicule(vehiculeData);
      }
      setShowVehiculeForm(false);
      setEditingVehicule(null);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitProprietaire = async (proprietaireData) => {
    setIsLoading(true);
    try {
      ajouterProprietaire(proprietaireData);
      setShowProprietaireForm(false);
      setEditingProprietaire(null);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitContrat = async (contratData) => {
    setIsLoading(true);
    try {
      creerContrat(contratData);
      
      // Mettre le véhicule en location
      modifierVehicule(contratData.vehiculeId, { statut: 'loue' });
      
      setShowContratForm(false);
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminerLocation = (contratId) => {
    if (window.confirm('Êtes-vous sûr de vouloir terminer cette location ?')) {
      terminerLocation(contratId);
    }
  };

  const cancelForms = () => {
    setShowVehiculeForm(false);
    setShowProprietaireForm(false);
    setShowContratForm(false);
    setEditingVehicule(null);
    setEditingProprietaire(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg text-white">
            <Car size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-fadem-black">Module Véhicules</h1>
            <p className="text-muted-foreground">Location et vente de véhicules</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleAddProprietaire}
            variant="outline"
            className="border-fadem-red text-fadem-red hover:bg-fadem-red hover:text-white"
          >
            <Users size={20} className="mr-2" />
            Nouveau Propriétaire
          </Button>
          <Button 
            onClick={handleAddVehicule}
            className="bg-fadem-red hover:bg-fadem-red-dark text-white"
          >
            <Plus size={20} className="mr-2" />
            Nouveau Véhicule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Véhicules Total</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.vehiculesTotal}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">En Location</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.enLocation}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Disponibles</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.disponibles}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Revenus Mensuels</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{(stats.revenusMensuels / 1000).toFixed(0)}K</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="vehicules">Véhicules</TabsTrigger>
          <TabsTrigger value="proprietaires">Propriétaires</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Véhicules récents */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-fadem-black mb-4">Véhicules Actifs</h2>
            {vehicules.length === 0 ? (
              <div className="text-center py-8">
                <Car size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun véhicule enregistré</p>
                <Button 
                  onClick={handleAddVehicule}
                  className="mt-4 bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  Ajouter le premier véhicule
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {vehicules.slice(0, 5).map((vehicule) => (
                  <div key={vehicule.id} className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white">
                        <Car size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-fadem-black">{vehicule.marque} {vehicule.modele} {vehicule.annee}</h3>
                        <p className="text-sm text-muted-foreground">Plaque: {vehicule.immatriculation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-fadem-red">{vehicule.prixFadem.toLocaleString()} CFA/jour</p>
                      <p className={`text-sm ${
                        vehicule.statut === 'disponible' ? 'text-success' :
                        vehicule.statut === 'loue' ? 'text-warning' : 'text-muted-foreground'
                      }`}>
                        {vehicule.statut === 'disponible' ? 'Disponible' :
                         vehicule.statut === 'loue' ? 'En location' :
                         vehicule.statut === 'maintenance' ? 'En maintenance' : 
                         vehicule.statut === 'en_vente' ? 'En vente' : 'Vendu'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Locations actives */}
          {contratsActifs.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Locations Actives</h2>
              <div className="space-y-4">
                {contratsActifs.slice(0, 3).map((contrat) => {
                  const vehicule = vehicules.find(v => v.id === contrat.vehiculeId);
                  return (
                    <div key={contrat.id} className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                      <div>
                        <h3 className="font-semibold text-fadem-black">{contrat.clientNom}</h3>
                        <p className="text-sm text-muted-foreground">
                          {vehicule ? `${vehicule.marque} ${vehicule.modele}` : 'Véhicule non trouvé'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-fadem-red">{contrat.montant.toLocaleString()} CFA</p>
                        <p className="text-sm text-muted-foreground">
                          Jusqu'au {contrat.dateFin?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="vehicules" className="space-y-6">
          {showVehiculeForm ? (
            <VehiculeForm
              vehicule={editingVehicule}
              proprietaires={proprietaires}
              onSubmit={handleSubmitVehicule}
              onCancel={cancelForms}
              isLoading={isLoading}
            />
          ) : (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fadem-black">
                  Tous les Véhicules ({vehicules.length})
                </h2>
                <Button 
                  onClick={handleAddVehicule}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Véhicule
                </Button>
              </div>
              
              {vehicules.length === 0 ? (
                <div className="text-center py-8">
                  <Car size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun véhicule enregistré</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vehicules.map((vehicule) => (
                    <div key={vehicule.id} className="border border-card-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-fadem-black">{vehicule.marque} {vehicule.modele}</h3>
                          <p className="text-sm text-muted-foreground">Année: {vehicule.annee}</p>
                          <p className="text-sm text-muted-foreground">Immatriculation: {vehicule.immatriculation}</p>
                          <p className="text-sm text-muted-foreground">Prix: {vehicule.prixFadem.toLocaleString()} CFA/jour</p>
                          <p className={`text-sm font-medium ${
                            vehicule.statut === 'disponible' ? 'text-success' :
                            vehicule.statut === 'loue' ? 'text-warning' : 'text-muted-foreground'
                          }`}>
                            Statut: {vehicule.statut === 'disponible' ? 'Disponible' :
                                     vehicule.statut === 'loue' ? 'En location' :
                                     vehicule.statut === 'maintenance' ? 'En maintenance' : 
                                     vehicule.statut === 'en_vente' ? 'En vente' : 'Vendu'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {vehicule.statut === 'disponible' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveTab("locations");
                                setShowContratForm(true);
                              }}
                              className="border-fadem-red text-fadem-red hover:bg-fadem-red hover:text-white"
                            >
                              Louer
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVehicule(vehicule)}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteVehicule(vehicule.id)}
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

        <TabsContent value="proprietaires" className="space-y-6">
          {showProprietaireForm ? (
            <ProprietaireVehiculeForm
              proprietaire={editingProprietaire}
              onSubmit={handleSubmitProprietaire}
              onCancel={cancelForms}
              isLoading={isLoading}
            />
          ) : (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fadem-black">
                  Propriétaires de Véhicules ({proprietaires.length})
                </h2>
                <Button 
                  onClick={handleAddProprietaire}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Propriétaire
                </Button>
              </div>
              
              {proprietaires.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun propriétaire enregistré</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proprietaires.map((proprietaire) => (
                    <div key={proprietaire.id} className="border border-card-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-fadem-black">{proprietaire.nom} {proprietaire.prenom}</h3>
                          <p className="text-sm text-muted-foreground">Téléphone: {proprietaire.telephone}</p>
                          <p className="text-sm text-muted-foreground">CNI: {proprietaire.cni}</p>
                          <p className="text-sm text-muted-foreground">
                            Véhicules confiés: {proprietaire.vehiculesConfies.length}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProprietaire(proprietaire)}
                        >
                          Modifier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          {showContratForm ? (
            <ContratVehiculeForm
              vehiculesDisponibles={vehiculesDisponibles}
              onSubmit={handleSubmitContrat}
              onCancel={cancelForms}
              isLoading={isLoading}
            />
          ) : (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fadem-black">
                  Contrats de Location ({contrats.length})
                </h2>
                <Button 
                  onClick={handleAddContrat}
                  disabled={vehiculesDisponibles.length === 0}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouvelle Location
                </Button>
              </div>
              
              {vehiculesDisponibles.length === 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800">Aucun véhicule disponible pour la location.</p>
                </div>
              )}
              
              {contrats.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun contrat de location</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contrats.map((contrat) => {
                    const vehicule = vehicules.find(v => v.id === contrat.vehiculeId);
                    return (
                      <div key={contrat.id} className="border border-card-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-fadem-black">{contrat.clientNom}</h3>
                            <p className="text-sm text-muted-foreground">
                              Véhicule: {vehicule ? `${vehicule.marque} ${vehicule.modele} (${vehicule.immatriculation})` : 'Non trouvé'}
                            </p>
                            <p className="text-sm text-muted-foreground">Téléphone: {contrat.clientTelephone}</p>
                            <p className="text-sm text-muted-foreground">
                              Période: {contrat.dateDebut.toLocaleDateString()} - {contrat.dateFin?.toLocaleDateString()}
                            </p>
                            <p className="text-sm font-medium text-fadem-red">
                              Montant: {contrat.montant.toLocaleString()} CFA
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              contrat.statut === 'actif' ? 'bg-green-100 text-green-800' :
                              contrat.statut === 'termine' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {contrat.statut === 'actif' ? 'Actif' :
                               contrat.statut === 'termine' ? 'Terminé' : 'Annulé'}
                            </span>
                            {contrat.statut === 'actif' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTerminerLocation(contrat.id)}
                              >
                                Terminer
                              </Button>
                            )}
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
      </Tabs>
    </div>
  );
};

export default Vehicules;
