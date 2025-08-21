import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bien, Proprietaire } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import { X } from 'lucide-react';

interface BienFormProps {
  bien?: Bien;
  proprietaires: Proprietaire[];
  onSubmit: (data: Omit<Bien, 'id' | 'dateEnregistrement' | 'statut' | 'commission'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BienForm({ bien, proprietaires, onSubmit, onCancel, isLoading = false }: BienFormProps) {
  const [formData, setFormData] = useState({
    proprietaireId: bien?.proprietaireId || '',
    type: bien?.type || 'appartement' as const,
    adresse: bien?.adresse || '',
    quartier: bien?.quartier || '',
    superficie: bien?.superficie?.toString() || '',
    chambres: bien?.chambres?.toString() || '',
    sallesBain: bien?.sallesBain?.toString() || '',
    prixProprietaire: bien?.prixProprietaire?.toString() || '',
    prixFadem: bien?.prixFadem?.toString() || '',
    description: bien?.description || '',
    equipements: bien?.equipements?.join(', ') || ''
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

    if (!formData.proprietaireId) newErrors.proprietaireId = 'Le propriétaire est requis';
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise';
    if (!formData.quartier.trim()) newErrors.quartier = 'Le quartier est requis';
    if (!formData.prixProprietaire) newErrors.prixProprietaire = 'Le prix propriétaire est requis';
    else if (isNaN(Number(formData.prixProprietaire)) || Number(formData.prixProprietaire) <= 0) {
      newErrors.prixProprietaire = 'Prix invalide';
    }
    if (!formData.prixFadem) newErrors.prixFadem = 'Le prix FADEM est requis';
    else if (isNaN(Number(formData.prixFadem)) || Number(formData.prixFadem) <= 0) {
      newErrors.prixFadem = 'Prix invalide';
    }
    if (Number(formData.prixFadem) <= Number(formData.prixProprietaire)) {
      newErrors.prixFadem = 'Le prix FADEM doit être supérieur au prix propriétaire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        superficie: formData.superficie ? Number(formData.superficie) : undefined,
        chambres: formData.chambres ? Number(formData.chambres) : undefined,
        sallesBain: formData.sallesBain ? Number(formData.sallesBain) : undefined,
        prixProprietaire: Number(formData.prixProprietaire),
        prixFadem: Number(formData.prixFadem),
        equipements: formData.equipements.split(',').map(e => e.trim()).filter(e => e)
      };
      onSubmit(submitData);
    }
  };

  const commission = Number(formData.prixFadem) - Number(formData.prixProprietaire);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-fadem-black">
          {bien ? 'Modifier le bien' : 'Nouveau bien'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="proprietaireId">Propriétaire *</Label>
            <Select value={formData.proprietaireId} onValueChange={(value) => handleChange('proprietaireId', value)}>
              <SelectTrigger className={errors.proprietaireId ? 'border-destructive' : ''}>
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
            {errors.proprietaireId && <p className="text-sm text-destructive mt-1">{errors.proprietaireId}</p>}
          </div>

          <div>
            <Label htmlFor="type">Type de bien</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="bureau">Bureau</SelectItem>
                <SelectItem value="commerce">Commerce</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="adresse">Adresse *</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={(e) => handleChange('adresse', e.target.value)}
              className={errors.adresse ? 'border-destructive' : ''}
            />
            {errors.adresse && <p className="text-sm text-destructive mt-1">{errors.adresse}</p>}
          </div>

          <div>
            <Label htmlFor="quartier">Quartier *</Label>
            <Input
              id="quartier"
              value={formData.quartier}
              onChange={(e) => handleChange('quartier', e.target.value)}
              className={errors.quartier ? 'border-destructive' : ''}
            />
            {errors.quartier && <p className="text-sm text-destructive mt-1">{errors.quartier}</p>}
          </div>

          <div>
            <Label htmlFor="superficie">Superficie (m²)</Label>
            <Input
              id="superficie"
              type="number"
              value={formData.superficie}
              onChange={(e) => handleChange('superficie', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="chambres">Nombre de chambres</Label>
            <Input
              id="chambres"
              type="number"
              value={formData.chambres}
              onChange={(e) => handleChange('chambres', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="sallesBain">Salles de bain</Label>
            <Input
              id="sallesBain"
              type="number"
              value={formData.sallesBain}
              onChange={(e) => handleChange('sallesBain', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="prixProprietaire">Prix propriétaire (CFA) *</Label>
            <Input
              id="prixProprietaire"
              type="number"
              value={formData.prixProprietaire}
              onChange={(e) => handleChange('prixProprietaire', e.target.value)}
              className={errors.prixProprietaire ? 'border-destructive' : ''}
            />
            {errors.prixProprietaire && <p className="text-sm text-destructive mt-1">{errors.prixProprietaire}</p>}
          </div>

          <div>
            <Label htmlFor="prixFadem">Prix FADEM (CFA) *</Label>
            <Input
              id="prixFadem"
              type="number"
              value={formData.prixFadem}
              onChange={(e) => handleChange('prixFadem', e.target.value)}
              className={errors.prixFadem ? 'border-destructive' : ''}
            />
            {errors.prixFadem && <p className="text-sm text-destructive mt-1">{errors.prixFadem}</p>}
          </div>
        </div>

        {commission > 0 && (
          <div className="p-3 bg-success/10 border border-success rounded-lg">
            <p className="text-sm text-success-foreground">
              <strong>Commission FADEM:</strong> {formatCurrency(commission)}
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="equipements">Équipements (séparés par virgule)</Label>
          <Input
            id="equipements"
            value={formData.equipements}
            onChange={(e) => handleChange('equipements', e.target.value)}
            placeholder="Climatisation, Cuisine équipée, Parking..."
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-fadem-red hover:bg-fadem-red-dark text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Sauvegarde...' : (bien ? 'Modifier' : 'Créer')}
          </Button>
        </div>
      </form>
    </Card>
  );
}