import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Proprietaire } from '@/types';
import { validateEmail, validatePhone, validateCNI } from '@/utils/helpers';
import { X } from 'lucide-react';

interface ProprietaireFormProps {
  proprietaire?: Proprietaire;
  onSubmit: (data: Omit<Proprietaire, 'id' | 'dateCreation' | 'biensConfies' | 'commissionsRecues'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProprietaireForm({ proprietaire, onSubmit, onCancel, isLoading = false }: ProprietaireFormProps) {
  const [formData, setFormData] = useState({
    nom: proprietaire?.nom || '',
    prenom: proprietaire?.prenom || '',
    telephone: proprietaire?.telephone || '',
    email: proprietaire?.email || '',
    adresse: proprietaire?.adresse || '',
    cni: proprietaire?.cni || '',
    documentsSupplementaires: proprietaire?.documentsSupplementaires || []
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

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    else if (!validatePhone(formData.telephone)) newErrors.telephone = 'Format téléphone invalide';
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise';
    if (!formData.cni.trim()) newErrors.cni = 'La CNI est requise';
    else if (!validateCNI(formData.cni)) newErrors.cni = 'Format CNI invalide (8 chiffres)';
    if (formData.email && !validateEmail(formData.email)) newErrors.email = 'Format email invalide';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-fadem-black">
          {proprietaire ? 'Modifier le propriétaire' : 'Nouveau propriétaire'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              className={errors.nom ? 'border-destructive' : ''}
            />
            {errors.nom && <p className="text-sm text-destructive mt-1">{errors.nom}</p>}
          </div>

          <div>
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
              className={errors.prenom ? 'border-destructive' : ''}
            />
            {errors.prenom && <p className="text-sm text-destructive mt-1">{errors.prenom}</p>}
          </div>

          <div>
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              placeholder="+228 XX XX XX XX"
              className={errors.telephone ? 'border-destructive' : ''}
            />
            {errors.telephone && <p className="text-sm text-destructive mt-1">{errors.telephone}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="cni">CNI *</Label>
            <Input
              id="cni"
              value={formData.cni}
              onChange={(e) => handleChange('cni', e.target.value)}
              placeholder="8 chiffres"
              className={errors.cni ? 'border-destructive' : ''}
            />
            {errors.cni && <p className="text-sm text-destructive mt-1">{errors.cni}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="adresse">Adresse *</Label>
          <Textarea
            id="adresse"
            value={formData.adresse}
            onChange={(e) => handleChange('adresse', e.target.value)}
            className={errors.adresse ? 'border-destructive' : ''}
            rows={3}
          />
          {errors.adresse && <p className="text-sm text-destructive mt-1">{errors.adresse}</p>}
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
            {isLoading ? 'Sauvegarde...' : (proprietaire ? 'Modifier' : 'Créer')}
          </Button>
        </div>
      </form>
    </Card>
  );
}