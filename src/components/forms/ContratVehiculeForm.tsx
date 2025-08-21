
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { X, Calculator } from 'lucide-react';
import { ContratVehicule, Vehicule } from '@/types';

interface ContratVehiculeFormProps {
  vehiculesDisponibles: Vehicule[];
  onSubmit: (data: Omit<ContratVehicule, 'id' | 'paiements'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ContratVehiculeForm = ({ vehiculesDisponibles, onSubmit, onCancel, isLoading }: ContratVehiculeFormProps) => {
  const [formData, setFormData] = useState({
    vehiculeId: '',
    clientNom: '',
    clientTelephone: '',
    clientCNI: '',
    type: 'location' as 'location' | 'vente',
    avecChauffeur: false,
    chauffeurId: '',
    duree: '1',
    caution: '',
    kilometrageDebut: '',
    remarques: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [vehiculeSelectionne, setVehiculeSelectionne] = useState<Vehicule | null>(null);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Mettre à jour le véhicule sélectionné
    if (field === 'vehiculeId' && typeof value === 'string') {
      const vehicule = vehiculesDisponibles.find(v => v.id === value);
      setVehiculeSelectionne(vehicule || null);
    }
  };

  const calculerMontantTotal = () => {
    if (!vehiculeSelectionne || !formData.duree) return 0;
    return vehiculeSelectionne.prixFadem * Number(formData.duree);
  };

  const calculerCautionSuggere = () => {
    if (!vehiculeSelectionne) return 0;
    return Math.round(vehiculeSelectionne.prixFadem * 2); // 2 jours de location
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehiculeId) newErrors.vehiculeId = 'Veuillez sélectionner un véhicule';
    if (!formData.clientNom.trim()) newErrors.clientNom = 'Le nom du client est requis';
    if (!formData.clientTelephone.trim()) newErrors.clientTelephone = 'Le téléphone du client est requis';
    if (!formData.clientCNI.trim()) newErrors.clientCNI = 'La CNI du client est requise';
    if (!formData.duree || Number(formData.duree) <= 0) newErrors.duree = 'La durée doit être positive';
    if (!formData.kilometrageDebut || Number(formData.kilometrageDebut) < 0) {
      newErrors.kilometrageDebut = 'Le kilométrage de début est requis';
    }

    // Validation du format téléphone
    if (formData.clientTelephone && !/^\d{8,}$/.test(formData.clientTelephone.replace(/\s/g, ''))) {
      newErrors.clientTelephone = 'Format de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const now = new Date();
    const dateFin = new Date(now);
    dateFin.setDate(dateFin.getDate() + Number(formData.duree));

    const processedData: Omit<ContratVehicule, 'id' | 'paiements'> = {
      vehiculeId: formData.vehiculeId,
      clientNom: formData.clientNom.trim(),
      clientTelephone: formData.clientTelephone.trim(),
      clientCNI: formData.clientCNI.trim(),
      type: formData.type,
      avecChauffeur: formData.avecChauffeur,
      chauffeurId: formData.chauffeurId || undefined,
      montant: calculerMontantTotal(),
      caution: Number(formData.caution) || calculerCautionSuggere(),
      dateDebut: now,
      dateFin: dateFin,
      duree: Number(formData.duree),
      kilometrageDebut: Number(formData.kilometrageDebut),
      statut: 'actif'
    };

    onSubmit(processedData);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-fadem-black">
          Nouveau Contrat de Location
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection du véhicule */}
        <div className="space-y-2">
          <Label htmlFor="vehicule">Véhicule à louer *</Label>
          <Select value={formData.vehiculeId} onValueChange={(value) => handleChange('vehiculeId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un véhicule disponible" />
            </SelectTrigger>
            <SelectContent>
              {vehiculesDisponibles.map(vehicule => (
                <SelectItem key={vehicule.id} value={vehicule.id}>
                  {vehicule.marque} {vehicule.modele} ({vehicule.immatriculation}) - {vehicule.prixFadem.toLocaleString()} CFA/jour
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vehiculeId && <p className="text-sm text-destructive">{errors.vehiculeId}</p>}
        </div>

        {/* Informations client */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-fadem-black">Informations Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientNom">Nom complet *</Label>
              <Input
                id="clientNom"
                value={formData.clientNom}
                onChange={(e) => handleChange('clientNom', e.target.value)}
                placeholder="Nom et prénom du client"
              />
              {errors.clientNom && <p className="text-sm text-destructive">{errors.clientNom}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientTelephone">Téléphone *</Label>
              <Input
                id="clientTelephone"
                value={formData.clientTelephone}
                onChange={(e) => handleChange('clientTelephone', e.target.value)}
                placeholder="Numéro de téléphone"
              />
              {errors.clientTelephone && <p className="text-sm text-destructive">{errors.clientTelephone}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="clientCNI">CNI *</Label>
              <Input
                id="clientCNI"
                value={formData.clientCNI}
                onChange={(e) => handleChange('clientCNI', e.target.value)}
                placeholder="Numéro de CNI"
              />
              {errors.clientCNI && <p className="text-sm text-destructive">{errors.clientCNI}</p>}
            </div>
          </div>
        </div>

        {/* Détails de la location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-fadem-black">Détails de la Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duree">Durée (jours) *</Label>
              <Input
                id="duree"
                type="number"
                min="1"
                value={formData.duree}
                onChange={(e) => handleChange('duree', e.target.value)}
                placeholder="Nombre de jours"
              />
              {errors.duree && <p className="text-sm text-destructive">{errors.duree}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kilometrageDebut">Kilométrage actuel *</Label>
              <Input
                id="kilometrageDebut"
                type="number"
                min="0"
                value={formData.kilometrageDebut}
                onChange={(e) => handleChange('kilometrageDebut', e.target.value)}
                placeholder="Kilométrage de départ"
              />
              {errors.kilometrageDebut && <p className="text-sm text-destructive">{errors.kilometrageDebut}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="caution">Caution (CFA)</Label>
              <Input
                id="caution"
                type="number"
                min="0"
                value={formData.caution}
                onChange={(e) => handleChange('caution', e.target.value)}
                placeholder={`Suggéré: ${calculerCautionSuggere().toLocaleString()}`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="avecChauffeur"
              checked={formData.avecChauffeur}
              onCheckedChange={(checked) => handleChange('avecChauffeur', checked as boolean)}
            />
            <Label htmlFor="avecChauffeur">Location avec chauffeur</Label>
          </div>
        </div>

        {/* Calcul automatique */}
        {vehiculeSelectionne && formData.duree && (
          <div className="bg-surface-secondary p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator size={16} className="text-fadem-red" />
              <h4 className="font-semibold text-fadem-black">Calcul du Montant</h4>
            </div>
            <div className="space-y-1 text-sm">
              <p>Prix par jour: <span className="font-semibold">{vehiculeSelectionne.prixFadem.toLocaleString()} CFA</span></p>
              <p>Durée: <span className="font-semibold">{formData.duree} jour(s)</span></p>
              <p className="text-lg font-bold text-fadem-red">
                Total: {calculerMontantTotal().toLocaleString()} CFA
              </p>
            </div>
          </div>
        )}

        {/* Remarques */}
        <div className="space-y-2">
          <Label htmlFor="remarques">Remarques</Label>
          <Textarea
            id="remarques"
            value={formData.remarques}
            onChange={(e) => handleChange('remarques', e.target.value)}
            placeholder="Remarques ou conditions particulières..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || vehiculesDisponibles.length === 0}
            className="bg-fadem-red hover:bg-fadem-red-dark text-white"
          >
            {isLoading ? 'Création...' : 'Créer le Contrat'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
