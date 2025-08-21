import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Edit, Trash2, Phone, Mail, MapPin, Briefcase, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Locataire } from '@/types';
import { formatCurrency } from '@/utils/helpers';

interface LocatairesTableProps {
  locataires: Locataire[];
  contrats?: any[];
  onEdit: (locataire: Locataire) => void;
  onDelete: (id: string) => void;
  onCreateContract?: (locataireId: string) => void;
}

export function LocatairesTable({ locataires, contrats = [], onEdit, onDelete, onCreateContract }: LocatairesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nom' | 'dateCreation' | 'profession'>('nom');

  const filteredLocataires = locataires
    .filter(locataire => 
      locataire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locataire.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locataire.telephone.includes(searchTerm) ||
      locataire.profession.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'dateCreation') {
        return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
      }
      if (sortBy === 'profession') {
        return a.profession.localeCompare(b.profession);
      }
      return `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`);
    });

  const getLocataireStatus = (locataire: Locataire) => {
    const activeContracts = locataire.contratsActifs?.length || 0;
    return activeContracts > 0 ? 'actif' : 'libre';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif':
        return 'bg-success/10 text-success';
      case 'libre':
        return 'bg-muted/10 text-muted-foreground';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-fadem-black">
            Liste des Locataires ({filteredLocataires.length})
          </h2>
          
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-input rounded-md text-sm bg-background"
            >
              <option value="nom">Trier par nom</option>
              <option value="dateCreation">Plus récents</option>
              <option value="profession">Par profession</option>
            </select>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, téléphone ou profession..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredLocataires.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-muted-foreground">
            {searchTerm ? 'Aucun locataire trouvé' : 'Aucun locataire enregistré'}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchTerm ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter votre premier locataire'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Locataire</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Profession</TableHead>
                <TableHead>Situation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date Création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocataires.map((locataire) => {
                const status = getLocataireStatus(locataire);
                return (
                  <TableRow key={locataire.id} className="group hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-fadem-black">
                          {locataire.nom} {locataire.prenom}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{locataire.adresse}</span>
                        </div>
                        {locataire.dateNaissance && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Né(e) le {format(new Date(locataire.dateNaissance), 'dd/MM/yyyy', { locale: fr })}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{locataire.telephone}</span>
                        </div>
                        {locataire.email && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{locataire.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{locataire.profession}</span>
                        </div>
                        {locataire.entreprise && (
                          <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {locataire.entreprise}
                          </div>
                        )}
                        {locataire.revenus && (
                          <div className="text-xs text-success font-medium">
                            {formatCurrency(locataire.revenus)}/mois
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {locataire.situationMatrimoniale}
                        </div>
                        {locataire.personnesACharge > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{locataire.personnesACharge} pers. à charge</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={getStatusColor(status)}>
                        {status === 'actif' ? 'Locataire Actif' : 'Disponible'}
                      </Badge>
                      {locataire.contratsActifs && locataire.contratsActifs.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {locataire.contratsActifs.length} contrat(s)
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(locataire.dateCreation), 'dd/MM/yyyy', { locale: fr })}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {onCreateContract && status === 'libre' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCreateContract(locataire.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Créer Contrat
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(locataire)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer le locataire</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer <strong>{locataire.nom} {locataire.prenom}</strong> ?
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDelete(locataire.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}