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
import { CalendarIcon, CreditCard, Euro, Phone, Building } from 'lucide-react';
import { Paiement, Contrat, Bien, Locataire } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '@/utils/helpers';

const paiementSchema = z.object({
  contratId: z.string().min(1, 'Veuillez sélectionner un contrat'),
  montant: z.number().min(1, 'Le montant doit être supérieur à 0'),
  datePaiement: z.date({ required_error: 'La date de paiement est requise' }),
  dateEcheance: z.date({ required_error: 'La date d\'échéance est requise' }),
  modePaiement: z.enum(['tmoney', 'moovmoney', 'especes', 'virement', 'cheque']),
  referenceTransaction: z.string().optional(),
  statut: z.enum(['paye', 'en_retard', 'partiel', 'annule']),
  penalites: z.number().min(0).optional(),
  remarques: z.string().optional(),
});

type PaiementFormData = z.infer<typeof paiementSchema>;

interface PaiementFormProps {
  paiement?: Paiement;
  contrats: Contrat[];
  biens: Bien[];
  locataires: Locataire[];
  onSubmit: (data: Omit<Paiement, 'id' | 'recu'>) => void;
  onCancel: () => void;
  preselectedContratId?: string;
}

export function PaiementForm({ 
  paiement, 
  contrats, 
  biens, 
  locataires, 
  onSubmit, 
  onCancel,
  preselectedContratId 
}: PaiementFormProps) {
  const [datePaiement, setDatePaiement] = useState<Date | undefined>(
    paiement?.datePaiement ? new Date(paiement.datePaiement) : new Date()
  );
  const [dateEcheance, setDateEcheance] = useState<Date | undefined>(
    paiement?.dateEcheance ? new Date(paiement.dateEcheance) : undefined
  );

  const activeContracts = contrats.filter(c => c.statut === 'actif');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<PaiementFormData>({
    resolver: zodResolver(paiementSchema),
    defaultValues: paiement ? {
      contratId: paiement.contratId,
      montant: paiement.montant,
      datePaiement: new Date(paiement.datePaiement),
      dateEcheance: new Date(paiement.dateEcheance),
      modePaiement: paiement.modePaiement,
      referenceTransaction: paiement.referenceTransaction || '',
      statut: paiement.statut,
      penalites: paiement.penalites || 0,
      remarques: paiement.remarques || '',
    } : {
      contratId: preselectedContratId || '',
      montant: 0,
      datePaiement: new Date(),
      modePaiement: 'especes' as const,
      statut: 'paye' as const,
      penalites: 0,
    }
  });

  const watchedContratId = watch('contratId');
  const watchedMontant = watch('montant');
  const watchedModePaiement = watch('modePaiement');

  const selectedContrat = contrats.find(c => c.id === watchedContratId);
  const selectedBien = selectedContrat ? biens.find(b => b.id === selectedContrat.bienId) : null;
  const selectedLocataire = selectedContrat ? locataires.find(l => l.id === selectedContrat.locataireId) : null;

  // Suggestions automatiques basées sur le contrat
  const suggestMontant = (contrat: Contrat) => {
    setValue('montant', contrat.montantMensuel);
    // Suggestion d'échéance pour le mois suivant
    const nextMonth = addMonths(new Date(), 1);
    const dayOfMonth = new Date(contrat.dateDebut).getDate();
    const suggestedEcheance = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), dayOfMonth);
    setDateEcheance(suggestedEcheance);
    setValue('dateEcheance', suggestedEcheance);
  };

  const getModeOptions = () => [
    { value: 'tmoney', label: 'T-Money', icon: Phone },
    { value: 'moovmoney', label: 'Moov Money', icon: Phone },
    { value: 'especes', label: 'Espèces', icon: Euro },
    { value: 'virement', label: 'Virement', icon: Building },
    { value: 'cheque', label: 'Chèque', icon: CreditCard },
  ];

  const handleFormSubmit = (data: PaiementFormData) => {
    onSubmit({
      contratId: data.contratId,
      montant: data.montant,
      datePaiement: data.datePaiement,
      dateEcheance: data.dateEcheance,
      modePaiement: data.modePaiement,
      statut: data.statut,
      referenceTransaction: data.referenceTransaction || undefined,
      penalites: data.penalites || undefined,
      remarques: data.remarques || undefined,
    });
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-fadem-red/10 rounded-lg">
          <CreditCard className="text-fadem-red" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-fadem-black">
            {paiement ? 'Modifier le Paiement' : 'Nouveau Paiement'}
          </h2>
          <p className="text-muted-foreground">
            {paiement ? 'Modifiez les détails du paiement' : 'Enregistrez un nouveau paiement de loyer'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Sélection du contrat */}
        <div className="space-y-2">
          <Label htmlFor="contratId">Contrat *</Label>
          <Select 
            onValueChange={(value) => {
              setValue('contratId', value);
              const contrat = contrats.find(c => c.id === value);
              if (contrat) suggestMontant(contrat);
            }}
            defaultValue={watchedContratId}
          >
            <SelectTrigger className={errors.contratId ? 'border-destructive' : ''}>
              <SelectValue placeholder="Sélectionner un contrat" />
            </SelectTrigger>
            <SelectContent>
              {activeContracts.map((contrat) => {
                const bien = biens.find(b => b.id === contrat.bienId);
                const locataire = locataires.find(l => l.id === contrat.locataireId);
                return (
                  <SelectItem key={contrat.id} value={contrat.id}>
                    <div className="flex flex-col">
                      <div className="font-medium">
                        {locataire?.nom} {locataire?.prenom}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {bien?.type} - {bien?.quartier} | {formatCurrency(contrat.montantMensuel)}/mois
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.contratId && <p className="text-sm text-destructive">{errors.contratId.message}</p>}
          
          {selectedContrat && selectedBien && selectedLocataire && (
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <div className="font-medium">Locataire: {selectedLocataire.nom} {selectedLocataire.prenom}</div>
                  <div className="text-muted-foreground">Tel: {selectedLocataire.telephone}</div>
                </div>
                <div>
                  <div className="font-medium">Bien: {selectedBien.type} - {selectedBien.quartier}</div>
                  <div className="text-success font-medium">Loyer: {formatCurrency(selectedContrat.montantMensuel)}/mois</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Informations du paiement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant (CFA) *</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="montant"
                  type="number"
                  {...register('montant', { valueAsNumber: true })}
                  className={`pl-10 ${errors.montant ? 'border-destructive' : ''}`}
                  placeholder="0"
                />
              </div>
              {errors.montant && <p className="text-sm text-destructive">{errors.montant.message}</p>}
              {selectedContrat && watchedMontant !== selectedContrat.montantMensuel && (
                <p className="text-xs text-warning">
                  ⚠️ Montant différent du loyer mensuel ({formatCurrency(selectedContrat.montantMensuel)})
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date de paiement *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !datePaiement && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {datePaiement ? format(datePaiement, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={datePaiement}
                    onSelect={(date) => {
                      setDatePaiement(date);
                      if (date) setValue('datePaiement', date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.datePaiement && <p className="text-sm text-destructive">{errors.datePaiement.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Date d'échéance *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !dateEcheance && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateEcheance ? format(dateEcheance, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateEcheance}
                    onSelect={(date) => {
                      setDateEcheance(date);
                      if (date) setValue('dateEcheance', date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateEcheance && <p className="text-sm text-destructive">{errors.dateEcheance.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modePaiement">Mode de paiement *</Label>
              <Select onValueChange={(value: any) => setValue('modePaiement', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  {getModeOptions().map((mode) => {
                    const IconComponent = mode.icon;
                    return (
                      <SelectItem key={mode.value} value={mode.value}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{mode.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {(['tmoney', 'moovmoney', 'virement'].includes(watchedModePaiement)) && (
              <div className="space-y-2">
                <Label htmlFor="referenceTransaction">Référence de transaction</Label>
                <Input
                  id="referenceTransaction"
                  {...register('referenceTransaction')}
                  placeholder="Numéro de référence"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="statut">Statut du paiement</Label>
              <Select onValueChange={(value: any) => setValue('statut', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paye">Payé</SelectItem>
                  <SelectItem value="en_retard">En retard</SelectItem>
                  <SelectItem value="partiel">Paiement partiel</SelectItem>
                  <SelectItem value="annule">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="penalites">Pénalités (CFA)</Label>
              <Input
                id="penalites"
                type="number"
                {...register('penalites', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Remarques */}
        <div className="space-y-2">
          <Label htmlFor="remarques">Remarques</Label>
          <Textarea
            id="remarques"
            {...register('remarques')}
            placeholder="Remarques sur le paiement..."
            rows={3}
          />
        </div>

        {/* Résumé */}
        {watchedMontant > 0 && (
          <div className="bg-fadem-red/5 border border-fadem-red/20 rounded-lg p-4">
            <h3 className="font-semibold text-fadem-black mb-2">Résumé du paiement</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Montant</div>
                <div className="font-semibold text-fadem-red">{formatCurrency(watchedMontant)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Mode</div>
                <div className="font-semibold">{getModeOptions().find(m => m.value === watchedModePaiement)?.label}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Date paiement</div>
                <div className="font-semibold">
                  {datePaiement ? format(datePaiement, "dd/MM/yyyy", { locale: fr }) : '-'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Échéance</div>
                <div className="font-semibold">
                  {dateEcheance ? format(dateEcheance, "dd/MM/yyyy", { locale: fr }) : '-'}
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
            {isSubmitting ? 'Enregistrement...' : paiement ? 'Modifier' : 'Enregistrer le Paiement'}
          </Button>
        </div>
      </form>
    </Card>
  );
}