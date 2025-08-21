import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, FileText, Euro, Calendar as CalendarLucide, Home, User } from 'lucide-react';
import { Contrat, Bien, Locataire, Proprietaire } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '@/utils/helpers';

const contratSchema = z.object({
  bienId: z.string().min(1, 'Veuillez sélectionner un bien'),
  locataireId: z.string().min(1, 'Veuillez sélectionner un locataire'),
  type: z.enum(['location', 'vente']),
  montantMensuel: z.number().min(1, 'Le montant mensuel doit être supérieur à 0'),
  caution: z.number().min(0, 'La caution doit être positive'),
  avance: z.number().min(0, 'L\'avance doit être positive').optional(),
  dateDebut: z.date({ required_error: 'La date de début est requise' }),
  duree: z.number().min(1, 'La durée doit être d\'au moins 1 mois').max(120, 'La durée ne peut pas dépasser 120 mois'),
  clausesSpeciales: z.string().optional(),
});

type ContratFormData = z.infer<typeof contratSchema>;

interface ContratFormProps {
  contrat?: Contrat;
  biens: Bien[];
  locataires: Locataire[];
  proprietaires: Proprietaire[];
  onSubmit: (data: Omit<Contrat, 'id' | 'dateSignature' | 'statut' | 'paiements' | 'factures' | 'dateFin'>) => void;
  onCancel: () => void;
  preselectedBienId?: string;
  preselectedLocataireId?: string;
}

export function ContratForm({ 
  contrat, 
  biens, 
  locataires, 
  proprietaires, 
  onSubmit, 
  onCancel,
  preselectedBienId,
  preselectedLocataireId 
}: ContratFormProps) {
  const [dateDebut, setDateDebut] = useState<Date | undefined>(
    contrat?.dateDebut ? new Date(contrat.dateDebut) : new Date()
  );

  const availableBiens = biens.filter(bien => bien.statut === 'disponible' || bien.id === contrat?.bienId);
  const availableLocataires = locataires.filter(locataire => 
    locataire.contratsActifs.length === 0 || locataire.id === contrat?.locataireId
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ContratFormData>({
    resolver: zodResolver(contratSchema),
    defaultValues: contrat ? {
      bienId: contrat.bienId,
      locataireId: contrat.locataireId,
      type: contrat.type,
      montantMensuel: contrat.montantMensuel,
      caution: contrat.caution,
      avance: contrat.avance || 0,
      dateDebut: new Date(contrat.dateDebut),
      duree: contrat.duree,
      clausesSpeciales: contrat.clausesSpeciales?.join('\n') || '',
    } : {
      bienId: preselectedBienId || '',
      locataireId: preselectedLocataireId || '',
      type: 'location' as const,
      montantMensuel: 0,
      caution: 0,
      avance: 0,
      duree: 12,
    }
  });

  const watchedBienId = watch('bienId');
  const watchedMontant = watch('montantMensuel');
  const watchedDuree = watch('duree');

  const selectedBien = biens.find(b => b.id === watchedBienId);
  const selectedProprietaire = selectedBien ? proprietaires.find(p => p.id === selectedBien.proprietaireId) : null;

  // Calcul automatique de la date de fin
  const dateFin = dateDebut && watchedDuree ? addMonths(dateDebut, watchedDuree) : null;

  // Suggestions de montants basés sur le bien sélectionné
  const suggestMontant = (bien: Bien) => {
    setValue('montantMensuel', bien.prixFadem);
    setValue('caution', bien.prixFadem * 2); // 2 mois de caution par défaut
  };

  const handleFormSubmit = (data: ContratFormData) => {
    const selectedBien = biens.find(b => b.id === data.bienId);
    if (!selectedBien) return;

    onSubmit({
      bienId: data.bienId,
      locataireId: data.locataireId,
      proprietaireId: selectedBien.proprietaireId,
      type: data.type,
      montantMensuel: data.montantMensuel,
      caution: data.caution,
      avance: data.avance || undefined,
      dateDebut: data.dateDebut,
      duree: data.duree,
      clausesSpeciales: data.clausesSpeciales ? data.clausesSpeciales.split('\n').filter(c => c.trim()) : undefined,
    });
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-fadem-red/10 rounded-lg">
          <FileText className="text-fadem-red" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-fadem-black">
            {contrat ? 'Modifier le Contrat' : 'Nouveau Contrat'}
          </h2>
          <p className="text-muted-foreground">
            {contrat ? 'Modifiez les détails du contrat' : 'Créez un nouveau contrat de location'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Sélection Bien et Locataire */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bienId">Bien à louer *</Label>
              <Select 
                onValueChange={(value) => {
                  setValue('bienId', value);
                  const bien = biens.find(b => b.id === value);
                  if (bien) suggestMontant(bien);
                }}
                defaultValue={watchedBienId}
              >
                <SelectTrigger className={errors.bienId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Sélectionner un bien" />
                </SelectTrigger>
                <SelectContent>
                  {availableBiens.map((bien) => (
                    <SelectItem key={bien.id} value={bien.id}>
                      <div className="flex items-center space-x-2">
                        <Home className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{bien.type} - {bien.quartier}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(bien.prixFadem)}/mois
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bienId && <p className="text-sm text-destructive">{errors.bienId.message}</p>}
              
              {selectedBien && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <div className="font-medium">{selectedBien.adresse}</div>
                  <div className="text-muted-foreground">
                    Propriétaire: {selectedProprietaire?.nom} {selectedProprietaire?.prenom}
                  </div>
                  <div className="text-success font-medium">
                    Prix proposé: {formatCurrency(selectedBien.prixFadem)}/mois
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="locataireId">Locataire *</Label>
              <Select 
                onValueChange={(value) => setValue('locataireId', value)}
                defaultValue={preselectedLocataireId || contrat?.locataireId}
              >
                <SelectTrigger className={errors.locataireId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Sélectionner un locataire" />
                </SelectTrigger>
                <SelectContent>
                  {availableLocataires.map((locataire) => (
                    <SelectItem key={locataire.id} value={locataire.id}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{locataire.nom} {locataire.prenom}</div>
                          <div className="text-sm text-muted-foreground">
                            {locataire.profession} - {locataire.telephone}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.locataireId && <p className="text-sm text-destructive">{errors.locataireId.message}</p>}
            </div>
          </div>

          {/* Informations du contrat */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de contrat</Label>
              <Select onValueChange={(value: 'location' | 'vente') => setValue('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="vente">Vente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date de début *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !dateDebut && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateDebut ? format(dateDebut, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateDebut}
                    onSelect={(date) => {
                      setDateDebut(date);
                      if (date) setValue('dateDebut', date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateDebut && <p className="text-sm text-destructive">{errors.dateDebut.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duree">Durée (mois) *</Label>
              <Input
                id="duree"
                type="number"
                {...register('duree', { valueAsNumber: true })}
                className={errors.duree ? 'border-destructive' : ''}
                placeholder="12"
              />
              {errors.duree && <p className="text-sm text-destructive">{errors.duree.message}</p>}
              
              {dateFin && (
                <p className="text-sm text-muted-foreground">
                  Fin prévue: {format(dateFin, "PPP", { locale: fr })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Montants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="montantMensuel">Loyer mensuel (CFA) *</Label>
            <div className="relative">
              <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="montantMensuel"
                type="number"
                {...register('montantMensuel', { valueAsNumber: true })}
                className={`pl-10 ${errors.montantMensuel ? 'border-destructive' : ''}`}
                placeholder="0"
              />
            </div>
            {errors.montantMensuel && <p className="text-sm text-destructive">{errors.montantMensuel.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="caution">Caution (CFA) *</Label>
            <div className="relative">
              <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="caution"
                type="number"
                {...register('caution', { valueAsNumber: true })}
                className={`pl-10 ${errors.caution ? 'border-destructive' : ''}`}
                placeholder="0"
              />
            </div>
            {errors.caution && <p className="text-sm text-destructive">{errors.caution.message}</p>}
            <p className="text-xs text-muted-foreground">
              Suggestion: {formatCurrency((watchedMontant || 0) * 2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avance">Avance (CFA)</Label>
            <div className="relative">
              <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="avance"
                type="number"
                {...register('avance', { valueAsNumber: true })}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Clauses spéciales */}
        <div className="space-y-2">
          <Label htmlFor="clausesSpeciales">Clauses spéciales</Label>
          <Textarea
            id="clausesSpeciales"
            {...register('clausesSpeciales')}
            placeholder="Conditions particulières du contrat (une par ligne)"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Ajoutez les conditions spéciales du contrat, une par ligne
          </p>
        </div>

        {/* Résumé du contrat */}
        {watchedMontant > 0 && watchedDuree && (
          <div className="bg-fadem-red/5 border border-fadem-red/20 rounded-lg p-4">
            <h3 className="font-semibold text-fadem-black mb-2">Résumé du contrat</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Loyer mensuel</div>
                <div className="font-semibold">{formatCurrency(watchedMontant)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total sur {watchedDuree} mois</div>
                <div className="font-semibold">{formatCurrency(watchedMontant * watchedDuree)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Caution</div>
                <div className="font-semibold">{formatCurrency(watch('caution') || 0)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total initial</div>
                <div className="font-semibold text-fadem-red">
                  {formatCurrency((watch('caution') || 0) + (watch('avance') || 0) + watchedMontant)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-fadem-red hover:bg-fadem-red-dark">
            {isSubmitting ? 'Création...' : contrat ? 'Modifier' : 'Créer le Contrat'}
          </Button>
        </div>
      </form>
    </Card>
  );
}