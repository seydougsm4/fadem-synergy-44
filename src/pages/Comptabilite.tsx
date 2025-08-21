import { Calculator, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

const Comptabilite = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg text-white">
            <Calculator size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-fadem-black">Module Comptabilité</h1>
            <p className="text-muted-foreground">Centralisation des flux financiers</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-success bg-success/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-success">Revenus du Mois</h3>
              <p className="text-2xl font-bold text-success mt-2">4.8M CFA</p>
            </div>
            <TrendingUp className="text-success" size={24} />
          </div>
        </Card>
        <Card className="p-4 border-destructive bg-destructive/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-destructive">Dépenses du Mois</h3>
              <p className="text-2xl font-bold text-destructive mt-2">2.1M CFA</p>
            </div>
            <TrendingDown className="text-destructive" size={24} />
          </div>
        </Card>
        <Card className="p-4 border-fadem-red bg-fadem-red/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-fadem-red">Bénéfices</h3>
              <p className="text-2xl font-bold text-fadem-red mt-2">2.7M CFA</p>
            </div>
            <DollarSign className="text-fadem-red" size={24} />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Marge Nette</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">56.3%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-fadem-black mb-4">Revenus par Secteur</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Immobilier</span>
              <span className="font-semibold text-fadem-black">2.2M CFA (46%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">BTP</span>
              <span className="font-semibold text-fadem-black">1.8M CFA (38%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Véhicules</span>
              <span className="font-semibold text-fadem-black">800K CFA (16%)</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-fadem-black mb-4">Dépenses par Catégorie</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Salaires</span>
              <span className="font-semibold text-fadem-black">950K CFA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Matériaux BTP</span>
              <span className="font-semibold text-fadem-black">680K CFA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Carburant</span>
              <span className="font-semibold text-fadem-black">320K CFA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Autres</span>
              <span className="font-semibold text-fadem-black">150K CFA</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Comptabilite;