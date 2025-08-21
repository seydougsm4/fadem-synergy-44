import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Vehicule, ProprietaireVehicule } from '@/types';

interface VehiculeFormProps {
  vehicule?: Vehicule;
  proprietaires: ProprietaireVehicule[];
  onSubmit: (data: Omit<Vehicule, 'id' | 'dateEnregistrement' | 'contratsLocation' | 'historiqueLocation'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const VehiculeForm = ({ vehicule, proprietaires, onSubmit, onCancel, isLoading }: VehiculeFormProps) => {
  const [formData, setFormData] = useState({
    proprietaireVehiculeId: vehicule?.proprietaireVehiculeId || '',
    marque: vehicule?.marque || '',
    modele: vehicule?.modele || '',
    annee: vehicule?.annee?.toString() || '',
    couleur: vehicule?.couleur || '',
    immatriculation: vehicule?.immatriculation || '',
    numeroSerie: vehicule?.numeroSerie || '',
    typeVehicule: vehicule?.typeVehicule || 'berline',
    prixProprietaire: vehicule?.prixProprietaire?.toString() || '',
    prixFadem: vehicule?.prixFadem?.toString() || '',
    kilometrage: vehicule?.kilometrage?.toString() || '',
    carburant: vehicule?.carburant || 'essence'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.proprietaireVehiculeId) newErrors.proprietaireVehiculeId = 'Le propriétaire est requis';
    if (!formData.marque.trim()) newErrors.marque = 'La marque est requise';
    if (!formData.modele.trim()) newErrors.modele = 'Le modèle est requis';
    if (!formData.annee || isNaN(Number(formData.annee))) newErrors.annee = 'L\'année doit être valide';
    if (!formData.immatriculation.trim()) newErrors.immatriculation = 'L\'immatriculation est requise';
    if (!formData.numeroSerie.trim()) newErrors.numeroSerie = 'Le numéro de série est requis';
    if (!formData.prixProprietaire || isNaN(Number(formData.prixProprietaire))) {
      newErrors.prixProprietaire = 'Le prix propriétaire doit être valide';
    }
    if (!formData.prixFadem || isNaN(Number(formData.prixFadem))) {
      newErrors.prixFadem = 'Le prix FADEM doit être valide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const prixProp = Number(formData.prixProprietaire);
    const prixFadem = Number(formData.prixFadem);

    const processedData = {
      proprietaireVehiculeId: formData.proprietaireVehiculeId,
      marque: formData.marque.trim(),
      modele: formData.modele.trim(),
      annee: Number(formData.annee),
      couleur: formData.couleur.trim(),
      immatriculation: formData.immatriculation.trim(),
      numeroSerie: formData.numeroSerie.trim(),
      typeVehicule: formData.typeVehicule as 'berline' | 'suv' | 'pickup' | 'moto' | 'camion',
      prixProprietaire: prixProp,
      prixFadem: prixFadem,
      commission: prixFadem - prixProp,
      kilometrage: Number(formData.kilometrage) || 0,
      carburant: formData.carburant as 'essence' | 'diesel' | 'hybride' | 'electrique',
      documents: [],
      statut: 'disponible' as const
    };

    onSubmit(processedData);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-fadem-black">
          {vehicule ? 'Modifier le Véhicule' : 'Nouveau Véhicule'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="proprietaire">Propriétaire *</Label>
            <Select value={formData.proprietaireVehiculeId} onValueChange={(value) => handleChange('proprietaireVehiculeId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un propriétaire" />
              </SelectTrigger>
              <SelectContent>
                {proprietaires.map(proprietaire => (
                  <SelectItem key={proprietaire.id} value={proprietaire.id}>
                    {proprietaire.nom} {proprietaire.prenom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.proprietaireVehiculeId && <p className="text-sm text-destructive">{errors.proprietaireVehiculeId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="typeVehicule">Type de Véhicule</Label>
            <Select value={formData.typeVehicule} onValueChange={(value) => handleChange('typeVehicule', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="berline">Berline</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="moto">Moto</SelectItem>
                <SelectItem value="camion">Camion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marque">Marque *</Label>
            <Input
              id="marque"
              value={formData.marque}
              onChange={(e) => handleChange('marque', e.target.value)}
              placeholder="Ex: Toyota"
            />
            {errors.marque && <p className="text-sm text-destructive">{errors.marque}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="modele">Modèle *</Label>
            <Input
              id="modele"
              value={formData.modele}
              onChange={(e) => handleChange('modele', e.target.value)}
              placeholder="Ex: Corolla"
            />
            {errors.modele && <p className="text-sm text-destructive">{errors.modele}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="annee">Année *</Label>
            <Input
              id="annee"
              type="number"
              value={formData.annee}
              onChange={(e) => handleChange('annee', e.target.value)}
              placeholder="Ex: 2020"
            />
            {errors.annee && <p className="text-sm text-destructive">{errors.annee}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="couleur">Couleur</Label>
            <Input
              id="couleur"
              value={formData.couleur}
              onChange={(e) => handleChange('couleur', e.target.value)}
              placeholder="Ex: Blanc"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="immatriculation">Immatriculation *</Label>
            <Input
              id="immatriculation"
              value={formData.immatriculation}
              onChange={(e) => handleChange('immatriculation', e.target.value)}
              placeholder="Ex: ABC 123 TG"
            />
            {errors.immatriculation && <p className="text-sm text-destructive">{errors.immatriculation}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroSerie">Numéro de Série *</Label>
            <Input
              id="numeroSerie"
              value={formData.numeroSerie}
              onChange={(e) => handleChange('numeroSerie', e.target.value)}
              placeholder="Ex: VIN123456789"
            />
            {errors.numeroSerie && <p className="text-sm text-destructive">{errors.numeroSerie}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="carburant">Carburant</Label>
            <Select value={formData.carburant} onValueChange={(value) => handleChange('carburant', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essence">Essence</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybride">Hybride</SelectItem>
                <SelectItem value="electrique">Électrique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kilometrage">Kilométrage</Label>
            <Input
              id="kilometrage"
              type="number"
              value={formData.kilometrage}
              onChange={(e) => handleChange('kilometrage', e.target.value)}
              placeholder="Ex: 50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prixProprietaire">Prix Propriétaire (CFA/jour) *</Label>
            <Input
              id="prixProprietaire"
              type="number"
              value={formData.prixProprietaire}
              onChange={(e) => handleChange('prixProprietaire', e.target.value)}
              placeholder="Ex: 20000"
            />
            {errors.prixProprietaire && <p className="text-sm text-destructive">{errors.prixProprietaire}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prixFadem">Prix FADEM (CFA/jour) *</Label>
            <Input
              id="prixFadem"
              type="number"
              value={formData.prixFadem}
              onChange={(e) => handleChange('prixFadem', e.target.value)}
              placeholder="Ex: 25000"
            />
            {errors.prixFadem && <p className="text-sm text-destructive">{errors.prixFadem}</p>}
          </div>
        </div>

        {formData.prixProprietaire && formData.prixFadem && (
          <div className="bg-surface-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Commission FADEM: <span className="font-semibold text-fadem-red">
                {(Number(formData.prixFadem) - Number(formData.prixProprietaire)).toLocaleString()} CFA/jour
              </span>
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-fadem-red hover:bg-fadem-red-dark text-white"
          >
            {isLoading ? 'Enregistrement...' : (vehicule ? 'Modifier' : 'Créer')}
          </Button>
        </div>
      </form>
    </Card>
  );
};