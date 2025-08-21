import { useState } from 'react';
import { Proprietaire } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { Search, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';

interface ProprietairesTableProps {
  proprietaires: Proprietaire[];
  onEdit: (proprietaire: Proprietaire) => void;
  onDelete: (id: string) => void;
}

export function ProprietairesTable({ proprietaires, onEdit, onDelete }: ProprietairesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProprietaires = proprietaires.filter(prop =>
    prop.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.telephone.includes(searchTerm) ||
    prop.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-fadem-black">
          Liste des Propriétaires ({proprietaires.length})
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredProprietaires.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'Aucun propriétaire trouvé' : 'Aucun propriétaire enregistré'}
          </div>
        ) : (
          filteredProprietaires.map((proprietaire) => (
            <div key={proprietaire.id} className="border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-fadem-black">
                      {proprietaire.nom} {proprietaire.prenom}
                    </h3>
                    <Badge variant="outline">
                      {proprietaire.biensConfies.length} bien{proprietaire.biensConfies.length > 1 ? 's' : ''}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-fadem-red" />
                      <span>{proprietaire.telephone}</span>
                    </div>
                    
                    {proprietaire.email && (
                      <div className="flex items-center space-x-2">
                        <Mail size={16} className="text-fadem-red" />
                        <span>{proprietaire.email}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-fadem-red" />
                      <span className="truncate">{proprietaire.adresse}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-card-border">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>CNI: {proprietaire.cni}</span>
                      <span>Inscrit le: {formatDate(proprietaire.dateCreation)}</span>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Commissions reçues</p>
                      <p className="font-semibold text-fadem-red">
                        {formatCurrency(proprietaire.commissionsRecues)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(proprietaire)}
                  >
                    <Edit size={16} />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le propriétaire</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer {proprietaire.nom} {proprietaire.prenom} ?
                          Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(proprietaire.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}