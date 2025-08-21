import { Settings, Shield, Users, FileText, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Parametres = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg text-white">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-fadem-black">Paramètres</h1>
            <p className="text-muted-foreground">Configuration et administration</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-fadem-red" size={20} />
            <h2 className="text-xl font-semibold text-fadem-black">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-password">Mot de passe administrateur</Label>
              <Input 
                id="admin-password" 
                type="password" 
                placeholder="••••••••••••••••" 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="module-password">Mot de passe modules</Label>
              <Input 
                id="module-password" 
                type="password" 
                placeholder="••••••••••••••••" 
                className="mt-1"
              />
            </div>
            <Button className="bg-fadem-red hover:bg-fadem-red-dark text-white">
              Mettre à jour les mots de passe
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="text-fadem-red" size={20} />
            <h2 className="text-xl font-semibold text-fadem-black">Accès Utilisateurs</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
              <div>
                <p className="font-semibold text-fadem-black">Immobilier</p>
                <p className="text-sm text-muted-foreground">Gestionnaire immobilier</p>
              </div>
              <Button size="sm" variant="outline">Configurer</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
              <div>
                <p className="font-semibold text-fadem-black">BTP</p>
                <p className="text-sm text-muted-foreground">Chef de projet</p>
              </div>
              <Button size="sm" variant="outline">Configurer</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
              <div>
                <p className="font-semibold text-fadem-black">Comptabilité</p>
                <p className="text-sm text-muted-foreground">Comptable</p>
              </div>
              <Button size="sm" variant="outline">Configurer</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="text-fadem-red" size={20} />
            <h2 className="text-xl font-semibold text-fadem-black">Modèles de Documents</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Contrat de location</span>
              <Button size="sm" variant="outline">Modifier</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Devis BTP</span>
              <Button size="sm" variant="outline">Modifier</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Facture véhicule</span>
              <Button size="sm" variant="outline">Modifier</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="text-fadem-red" size={20} />
            <h2 className="text-xl font-semibold text-fadem-black">Base de Données</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-surface-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Dernière sauvegarde</p>
              <p className="font-semibold text-fadem-black">Aujourd'hui à 14:30</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                Sauvegarder maintenant
              </Button>
              <Button className="bg-fadem-red hover:bg-fadem-red-dark text-white flex-1">
                Synchroniser cloud
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Parametres;