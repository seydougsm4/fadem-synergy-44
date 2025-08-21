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
import { CalendarIcon, User, Phone, MapPin, Briefcase, FileText } from 'lucide-react';
import { Locataire } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const locataireSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  telephone: z.string().min(8, 'Le téléphone doit contenir au moins 8 chiffres'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  adresse: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  profession: z.string().min(2, 'La profession est requise'),
  entreprise: z.string().optional(),
  cni: z.string().min(8, 'Le numéro CNI est requis'),
  passeport: z.string().optional(),
  dateNaissance: z.date({ required_error: 'La date de naissance est requise' }),
  situationMatrimoniale: z.string().min(1, 'La situation matrimoniale est requise'),
  personnesACharge: z.number().min(0, 'Le nombre de personnes à charge doit être positif'),
  revenus: z.number().min(0, 'Les revenus doivent être positifs').optional(),
});

type LocataireFormData = z.infer<typeof locataireSchema>;

interface LocataireFormProps {
  locataire?: Locataire;
  onSubmit: (data: Omit<Locataire, 'id' | 'dateCreation' | 'contratsActifs' | 'documentsSupplementaires'>) => void;
  onCancel: () => void;
}

export function LocataireForm({ locataire, onSubmit, onCancel }: LocataireFormProps) {
  const [dateNaissance, setDateNaissance] = useState<Date | undefined>(
    locataire?.dateNaissance ? new Date(locataire.dateNaissance) : undefined
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<LocataireFormData>({
    resolver: zodResolver(locataireSchema),
    defaultValues: locataire ? {
      nom: locataire.nom,
      prenom: locataire.prenom,
      telephone: locataire.telephone,
      email: locataire.email || '',
      adresse: locataire.adresse,
      profession: locataire.profession,
      entreprise: locataire.entreprise || '',
      cni: locataire.cni,
      passeport: locataire.passeport || '',
      dateNaissance: new Date(locataire.dateNaissance),
      situationMatrimoniale: locataire.situationMatrimoniale,
      personnesACharge: locataire.personnesACharge,
      revenus: locataire.revenus || 0,
    } : {
      personnesACharge: 0,
      revenus: 0,
    }
  });

  const handleFormSubmit = (data: LocataireFormData) => {
    onSubmit({
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      email: data.email || undefined,
      adresse: data.adresse,
      profession: data.profession,
      entreprise: data.entreprise || undefined,
      cni: data.cni,
      passeport: data.passeport || undefined,
      dateNaissance: data.dateNaissance,
      situationMatrimoniale: data.situationMatrimoniale,
      personnesACharge: data.personnesACharge,
      revenus: data.revenus || undefined,
    });
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-fadem-red/10 rounded-lg">
          <User className="text-fadem-red" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-fadem-black">
            {locataire ? 'Modifier le Locataire' : 'Nouveau Locataire'}
          </h2>
          <p className="text-muted-foreground">
            {locataire ? 'Modifiez les informations du locataire' : 'Ajoutez un nouveau locataire au système'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              {...register('nom')}
              className={errors.nom ? 'border-destructive' : ''}
              placeholder="Nom de famille"
            />
            {errors.nom && <p className="text-sm text-destructive">{errors.nom.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              {...register('prenom')}
              className={errors.prenom ? 'border-destructive' : ''}
              placeholder="Prénom"
            />
            {errors.prenom && <p className="text-sm text-destructive">{errors.prenom.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="telephone"
                {...register('telephone')}
                className={`pl-10 ${errors.telephone ? 'border-destructive' : ''}`}
                placeholder="+228 XX XX XX XX"
              />
            </div>
            {errors.telephone && <p className="text-sm text-destructive">{errors.telephone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
              placeholder="email@exemple.com"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cni">CNI *</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="cni"
                {...register('cni')}
                className={`pl-10 ${errors.cni ? 'border-destructive' : ''}`}
                placeholder="Numéro CNI"
              />
            </div>
            {errors.cni && <p className="text-sm text-destructive">{errors.cni.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passeport">Passeport</Label>
            <Input
              id="passeport"
              {...register('passeport')}
              placeholder="Numéro de passeport"
            />
          </div>

          <div className="space-y-2">
            <Label>Date de Naissance *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !dateNaissance && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateNaissance ? format(dateNaissance, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateNaissance}
                  onSelect={(date) => {
                    setDateNaissance(date);
                    if (date) setValue('dateNaissance', date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.dateNaissance && <p className="text-sm text-destructive">{errors.dateNaissance.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="situationMatrimoniale">Situation Matrimoniale *</Label>
            <Select onValueChange={(value) => setValue('situationMatrimoniale', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir la situation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celibataire">Célibataire</SelectItem>
                <SelectItem value="marie">Marié(e)</SelectItem>
                <SelectItem value="divorce">Divorcé(e)</SelectItem>
                <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                <SelectItem value="concubinage">En concubinage</SelectItem>
              </SelectContent>
            </Select>
            {errors.situationMatrimoniale && <p className="text-sm text-destructive">{errors.situationMatrimoniale.message}</p>}
          </div>
        </div>

        {/* Adresse */}
        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea
              id="adresse"
              {...register('adresse')}
              className={`pl-10 ${errors.adresse ? 'border-destructive' : ''}`}
              placeholder="Adresse complète du locataire"
              rows={2}
            />
          </div>
          {errors.adresse && <p className="text-sm text-destructive">{errors.adresse.message}</p>}
        </div>

        {/* Informations professionnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profession">Profession *</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="profession"
                {...register('profession')}
                className={`pl-10 ${errors.profession ? 'border-destructive' : ''}`}
                placeholder="Profession du locataire"
              />
            </div>
            {errors.profession && <p className="text-sm text-destructive">{errors.profession.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entreprise">Entreprise</Label>
            <Input
              id="entreprise"
              {...register('entreprise')}
              placeholder="Nom de l'entreprise"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenus">Revenus Mensuels (CFA)</Label>
            <Input
              id="revenus"
              type="number"
              {...register('revenus', { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.revenus && <p className="text-sm text-destructive">{errors.revenus.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="personnesACharge">Personnes à Charge</Label>
            <Input
              id="personnesACharge"
              type="number"
              {...register('personnesACharge', { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.personnesACharge && <p className="text-sm text-destructive">{errors.personnesACharge.message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-fadem-red hover:bg-fadem-red-dark">
            {isSubmitting ? 'Enregistrement...' : locataire ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Card>
  );
}