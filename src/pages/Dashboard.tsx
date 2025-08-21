import { Building, Hammer, Car, Users, Calculator, BarChart3 } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const modules = [
    {
      icon: <Building size={24} />,
      title: "Immobilier",
      description: "Gestion des biens, locataires, propriétaires et contrats de location",
      path: "/immobilier",
      stats: { label: "Biens actifs", value: 0 }
    },
    {
      icon: <Hammer size={24} />,
      title: "BTP",
      description: "Suivi des chantiers, ouvriers, devis et facturation",
      path: "/btp",
      stats: { label: "Chantiers en cours", value: 0 }
    },
    {
      icon: <Car size={24} />,
      title: "Véhicules",
      description: "Location et vente de véhicules avec ou sans chauffeur",
      path: "/vehicules",
      stats: { label: "Véhicules disponibles", value: 0 }
    },
    {
      icon: <Users size={24} />,
      title: "Personnel",
      description: "Gestion RH, salaires, congés et dossiers employés",
      path: "/personnel",
      stats: { label: "Employés", value: 0 }
    },
    {
      icon: <Calculator size={24} />,
      title: "Comptabilité",
      description: "Centralisation des flux financiers et bilans",
      path: "/comptabilite",
      stats: { label: "CA du mois", value: "0 CFA" }
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Rapports",
      description: "Tableaux de bord et rapports d'activité automatisés",
      path: "/rapports",
      stats: { label: "Rapports générés", value: 0 }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fadem-black">
            Tableau de Bord FADEM
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestion centralisée de toutes vos activités
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
          <p className="font-semibold text-fadem-black">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-primary text-white">
          <h3 className="text-sm font-medium opacity-90">Revenus Aujourd'hui</h3>
          <p className="text-2xl font-bold mt-1">0 CFA</p>
        </Card>
        <Card className="p-4 border-success bg-success/5">
          <h3 className="text-sm font-medium text-success-foreground">Dépenses</h3>
          <p className="text-2xl font-bold mt-1 text-success">0 CFA</p>
        </Card>
        <Card className="p-4 border-warning bg-warning/5">
          <h3 className="text-sm font-medium text-warning-foreground">En Attente</h3>
          <p className="text-2xl font-bold mt-1 text-warning">0</p>
        </Card>
        <Card className="p-4 border-card-border">
          <h3 className="text-sm font-medium text-muted-foreground">Bénéfices Net</h3>
          <p className="text-2xl font-bold mt-1 text-fadem-black">0 CFA</p>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <ModuleCard key={index} {...module} />
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-fadem-black mb-4">
          Activité Récente
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-fadem-red rounded-full"></div>
              <span className="text-sm">Nouveau contrat de location - Villa Tokoin</span>
            </div>
            <span className="text-xs text-muted-foreground">Il y a 2h</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm">Paiement reçu - Chantier Agoenyivé</span>
            </div>
            <span className="text-xs text-muted-foreground">Il y a 4h</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm">Véhicule en maintenance - Toyota Corolla</span>
            </div>
            <span className="text-xs text-muted-forerence">Il y a 1j</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;