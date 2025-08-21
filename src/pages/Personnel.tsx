import { Users, Plus, UserCheck, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeForm } from "@/components/forms/EmployeForm";
import { usePersonnel } from "@/hooks/usePersonnel";
import { useState } from "react";

const Personnel = () => {
  const { 
    employes, 
    ajouterEmploye,
    modifierEmploye,
    supprimerEmploye,
    obtenirStatistiques 
  } = usePersonnel();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showEmployeForm, setShowEmployeForm] = useState(false);
  const [editingEmploye, setEditingEmploye] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stats = obtenirStatistiques();

  const handleAddEmploye = () => {
    setEditingEmploye(null);
    setShowEmployeForm(true);
    setActiveTab("employes");
  };

  const handleEditEmploye = (employe) => {
    setEditingEmploye(employe);
    setShowEmployeForm(true);
    setActiveTab("employes");
  };

  const handleDeleteEmploye = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      supprimerEmploye(id);
    }
  };

  const handleSubmitEmploye = async (employeData) => {
    setIsLoading(true);
    try {
      if (editingEmploye) {
        modifierEmploye(editingEmploye.id, employeData);
      } else {
        ajouterEmploye(employeData);
      }
      setShowEmployeForm(false);
      setEditingEmploye(null);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelForms = () => {
    setShowEmployeForm(false);
    setEditingEmploye(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg text-white">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-fadem-black">Module Personnel</h1>
            <p className="text-muted-foreground">Gestion RH et dossiers employés</p>
          </div>
        </div>
        <Button 
          onClick={handleAddEmploye}
          className="bg-fadem-red hover:bg-fadem-red-dark text-white"
        >
          <Plus size={20} className="mr-2" />
          Nouvel Employé
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Employés Actifs</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.employesActifs}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">En Congé</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.enConge}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Masse Salariale</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{(stats.masseSalariale / 1000000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Avances du Mois</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{(stats.avancesMois / 1000).toFixed(0)}K</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="employes">Employés</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-fadem-black mb-4">Employés Récents</h2>
            {employes.length === 0 ? (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun employé enregistré</p>
                <Button 
                  onClick={handleAddEmploye}
                  className="mt-4 bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  Ajouter le premier employé
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {employes.slice(0, 5).map((employe) => (
                  <div key={employe.id} className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white">
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-fadem-black">{employe.nom} {employe.prenom}</h3>
                        <p className="text-sm text-muted-foreground">{employe.poste}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-fadem-red">{employe.salaireMensuel.toLocaleString()} CFA/mois</p>
                      <p className={`text-sm ${
                        employe.statut === 'actif' ? 'text-success' :
                        employe.statut === 'conge' ? 'text-warning' : 'text-muted-foreground'
                      }`}>
                        {employe.statut === 'actif' ? 'Actif' :
                         employe.statut === 'conge' ? 'En congé' :
                         employe.statut === 'suspendu' ? 'Suspendu' : 'Démissionné'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="employes" className="space-y-6">
          {showEmployeForm ? (
            <EmployeForm
              employe={editingEmploye}
              onSubmit={handleSubmitEmploye}
              onCancel={cancelForms}
              isLoading={isLoading}
            />
          ) : (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fadem-black">
                  Tous les Employés ({employes.length})
                </h2>
                <Button 
                  onClick={handleAddEmploye}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouvel Employé
                </Button>
              </div>
              
              {employes.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun employé enregistré</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {employes.map((employe) => (
                    <div key={employe.id} className="border border-card-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-fadem-black">{employe.nom} {employe.prenom}</h3>
                          <p className="text-sm text-muted-foreground">Poste: {employe.poste}</p>
                          <p className="text-sm text-muted-foreground">Département: {employe.departement}</p>
                          <p className="text-sm text-muted-foreground">Salaire: {employe.salaireMensuel.toLocaleString()} CFA/mois</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEmploye(employe)}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteEmploye(employe.id)}
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

export default Personnel;