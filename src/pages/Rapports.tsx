import { BarChart3, FileText, Download, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Rapports = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg text-white">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-fadem-black">Module Rapports</h1>
            <p className="text-muted-foreground">Tableaux de bord et analyses</p>
          </div>
        </div>
        <Button className="bg-fadem-red hover:bg-fadem-red-dark text-white">
          <FileText size={20} className="mr-2" />
          Nouveau Rapport
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-fadem-black">Rapport Quotidien</h3>
            <Button size="sm" variant="outline">
              <Download size={16} className="mr-1" />
              PDF
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Activités du {new Date().toLocaleDateString('fr-FR')}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Revenus:</span>
              <span className="font-semibold text-success">485,000 CFA</span>
            </div>
            <div className="flex justify-between">
              <span>Dépenses:</span>
              <span className="font-semibold text-destructive">125,000 CFA</span>
            </div>
            <div className="flex justify-between">
              <span>Net:</span>
              <span className="font-semibold text-fadem-red">360,000 CFA</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-fadem-black">Rapport Mensuel</h3>
            <Button size="sm" variant="outline">
              <Download size={16} className="mr-1" />
              PDF
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Performance de {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>CA Total:</span>
              <span className="font-semibold text-success">4.8M CFA</span>
            </div>
            <div className="flex justify-between">
              <span>Marge:</span>
              <span className="font-semibold text-fadem-red">56.3%</span>
            </div>
            <div className="flex justify-between">
              <span>Croissance:</span>
              <span className="font-semibold text-success">+12%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-fadem-black">Rapport Personnalisé</h3>
            <Button size="sm" className="bg-fadem-red hover:bg-fadem-red-dark text-white">
              <Calendar size={16} className="mr-1" />
              Créer
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Générer un rapport sur mesure
          </p>
          <div className="space-y-2 text-sm">
            <p>• Période personnalisée</p>
            <p>• Modules sélectionnés</p>
            <p>• Métriques spécifiques</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-fadem-black mb-4">Historique des Rapports</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="text-fadem-red" size={20} />
                <div>
                  <h3 className="font-semibold text-fadem-black">Rapport Mensuel - Janvier 2025</h3>
                  <p className="text-sm text-muted-foreground">Généré le 01/02/2025</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Download size={16} />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Rapports;