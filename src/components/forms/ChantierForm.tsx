import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Chantier } from '@/types';

interface ChantierFormProps {
  chantier?: Chantier;
  onSubmit: (data: Omit<Chantier, 'id' | 'dateDebut' | 'equipeAssignee' | 'materiaux' | 'depenses' | 'factures'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ChantierForm = ({ chantier, onSubmit, onCancel, isLoading }: ChantierFormProps) => {
  const [formData, setFormData] = useState({
    nom: chantier?.nom || '',
    client: chantier?.client || '',
    adresse: chantier?.adresse || '',
    typeChantier: chantier?.typeChantier || 'construction',
    datePrevue: chantier?.datePrevue ? new Date(chantier.datePrevue).toISOString().split('T')[0] : '',
    budgetInitial: chantier?.budgetInitial?.toString() || '',
    responsable: chantier?.responsable || '',
    description: chantier?.description || ''
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

    if (!formData.nom.trim()) newErrors.nom = 'Le nom du chantier est requis';
    if (!formData.client.trim()) newErrors.client = 'Le nom du client est requis';
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise';
    if (!formData.datePrevue) newErrors.datePrevue = 'La date prévue est requise';
    if (!formData.budgetInitial || isNaN(Number(formData.budgetInitial))) {
      newErrors.budgetInitial = 'Le budget initial doit être un nombre valide';
    }
    if (!formData.responsable.trim()) newErrors.responsable = 'Le responsable est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const processedData = {
      nom: formData.nom.trim(),
      client: formData.client.trim(),
      adresse: formData.adresse.trim(),
      typeChantier: formData.typeChantier as 'construction' | 'renovation' | 'demolition' | 'amenagement',
      datePrevue: new Date(formData.datePrevue),
      budgetInitial: Number(formData.budgetInitial),
      budgetActuel: Number(formData.budgetInitial),
      depensesTotales: 0,
      avancement: 0,
      statut: 'planifie' as const,
      responsable: formData.responsable.trim(),
      description: formData.description.trim() || undefined
    };

    onSubmit(processedData);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-fadem-black">
          {chantier ? 'Modifier le Chantier' : 'Nouveau Chantier'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du Chantier *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              placeholder="Ex: Villa Moderne Agoenyivé"
            />
            {errors.nom && <p className="text-sm text-destructive">{errors.nom}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => handleChange('client', e.target.value)}
              placeholder="Ex: M. Kwame Asante"
            />
            {errors.client && <p className="text-sm text-destructive">{errors.client}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="typeChantier">Type de Chantier</Label>
            <Select value={formData.typeChantier} onValueChange={(value) => handleChange('typeChantier', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="renovation">Rénovation</SelectItem>
                <SelectItem value="demolition">Démolition</SelectItem>
                <SelectItem value="amenagement">Aménagement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable *</Label>
            <Input
              id="responsable"
              value={formData.responsable}
              onChange={(e) => handleChange('responsable', e.target.value)}
              placeholder="Ex: Jean Kofi"
            />
            {errors.responsable && <p className="text-sm text-destructive">{errors.responsable}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="datePrevue">Date Prévue de Fin *</Label>
            <Input
              id="datePrevue"
              type="date"
              value={formData.datePrevue}
              onChange={(e) => handleChange('datePrevue', e.target.value)}
            />
            {errors.datePrevue && <p className="text-sm text-destructive">{errors.datePrevue}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetInitial">Budget Initial (CFA) *</Label>
            <Input
              id="budgetInitial"
              type="number"
              value={formData.budgetInitial}
              onChange={(e) => handleChange('budgetInitial', e.target.value)}
              placeholder="Ex: 15000000"
            />
            {errors.budgetInitial && <p className="text-sm text-destructive">{errors.budgetInitial}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse *</Label>
          <Input
            id="adresse"
            value={formData.adresse}
            onChange={(e) => handleChange('adresse', e.target.value)}
            placeholder="Ex: Quartier Agoenyivé, Rue 123"
          />
          {errors.adresse && <p className="text-sm text-destructive">{errors.adresse}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Description détaillée du projet..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-fadem-red hover:bg-fadem-red-dark text-white"
          >
            {isLoading ? 'Enregistrement...' : (chantier ? 'Modifier' : 'Créer')}
          </Button>
        </div>
      </form>
    </Card>
  );
};