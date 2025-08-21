import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Employe } from '@/types';

interface EmployeFormProps {
  employe?: Employe;
  onSubmit: (data: Omit<Employe, 'id' | 'dateEmbauche' | 'documents' | 'formations' | 'evaluations' | 'historiquePoste'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EmployeForm = ({ employe, onSubmit, onCancel, isLoading }: EmployeFormProps) => {
  const [formData, setFormData] = useState({
    nom: employe?.nom || '',
    prenom: employe?.prenom || '',
    telephone: employe?.telephone || '',
    email: employe?.email || '',
    adresse: employe?.adresse || '',
    cni: employe?.cni || '',
    dateNaissance: employe?.dateNaissance ? new Date(employe.dateNaissance).toISOString().split('T')[0] : '',
    poste: employe?.poste || '',
    departement: employe?.departement || 'administration',
    salaireMensuel: employe?.salaireMensuel?.toString() || '',
    typeContrat: employe?.typeContrat || 'cdi',
    competences: employe?.competences?.join(', ') || ''
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
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise';
    if (!formData.cni.trim()) newErrors.cni = 'Le CNI est requis';
    if (!formData.dateNaissance) newErrors.dateNaissance = 'La date de naissance est requise';
    if (!formData.poste.trim()) newErrors.poste = 'Le poste est requis';
    if (!formData.salaireMensuel || isNaN(Number(formData.salaireMensuel))) {
      newErrors.salaireMensuel = 'Le salaire mensuel doit être un nombre valide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const processedData = {
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      telephone: formData.telephone.trim(),
      email: formData.email.trim() || undefined,
      adresse: formData.adresse.trim(),
      cni: formData.cni.trim(),
      dateNaissance: new Date(formData.dateNaissance),
      poste: formData.poste.trim(),
      departement: formData.departement as 'immobilier' | 'btp' | 'vehicules' | 'comptabilite' | 'administration',
      salaireMensuel: Number(formData.salaireMensuel),
      typeContrat: formData.typeContrat as 'cdi' | 'cdd' | 'stage' | 'freelance',
      statut: 'actif' as const,
      documents: [],
      competences: formData.competences ? formData.competences.split(',').map(c => c.trim()).filter(c => c) : undefined
    };

    onSubmit(processedData);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-fadem-black">
          {employe ? 'Modifier l\'Employé' : 'Nouvel Employé'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              placeholder="Ex: Kofi"
            />
            {errors.nom && <p className="text-sm text-destructive">{errors.nom}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
              placeholder="Ex: Mensah"
            />
            {errors.prenom && <p className="text-sm text-destructive">{errors.prenom}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              placeholder="Ex: +228 90 12 34 56"
            />
            {errors.telephone && <p className="text-sm text-destructive">{errors.telephone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Ex: kofi.mensah@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cni">CNI *</Label>
            <Input
              id="cni"
              value={formData.cni}
              onChange={(e) => handleChange('cni', e.target.value)}
              placeholder="Ex: 123456789"
            />
            {errors.cni && <p className="text-sm text-destructive">{errors.cni}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de Naissance *</Label>
            <Input
              id="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleChange('dateNaissance', e.target.value)}
            />
            {errors.dateNaissance && <p className="text-sm text-destructive">{errors.dateNaissance}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="poste">Poste *</Label>
            <Input
              id="poste"
              value={formData.poste}
              onChange={(e) => handleChange('poste', e.target.value)}
              placeholder="Ex: Chef de chantier BTP"
            />
            {errors.poste && <p className="text-sm text-destructive">{errors.poste}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="departement">Département</Label>
            <Select value={formData.departement} onValueChange={(value) => handleChange('departement', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immobilier">Immobilier</SelectItem>
                <SelectItem value="btp">BTP</SelectItem>
                <SelectItem value="vehicules">Véhicules</SelectItem>
                <SelectItem value="comptabilite">Comptabilité</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaireMensuel">Salaire Mensuel (CFA) *</Label>
            <Input
              id="salaireMensuel"
              type="number"
              value={formData.salaireMensuel}
              onChange={(e) => handleChange('salaireMensuel', e.target.value)}
              placeholder="Ex: 180000"
            />
            {errors.salaireMensuel && <p className="text-sm text-destructive">{errors.salaireMensuel}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="typeContrat">Type de Contrat</Label>
            <Select value={formData.typeContrat} onValueChange={(value) => handleChange('typeContrat', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cdi">CDI</SelectItem>
                <SelectItem value="cdd">CDD</SelectItem>
                <SelectItem value="stage">Stage</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse *</Label>
          <Input
            id="adresse"
            value={formData.adresse}
            onChange={(e) => handleChange('adresse', e.target.value)}
            placeholder="Ex: Quartier Be, Rue 123"
          />
          {errors.adresse && <p className="text-sm text-destructive">{errors.adresse}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="competences">Compétences (séparées par des virgules)</Label>
          <Input
            id="competences"
            value={formData.competences}
            onChange={(e) => handleChange('competences', e.target.value)}
            placeholder="Ex: Maçonnerie, Conduite, Gestion d'équipe"
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
            {isLoading ? 'Enregistrement...' : (employe ? 'Modifier' : 'Créer')}
          </Button>
        </div>
      </form>
    </Card>
  );
};