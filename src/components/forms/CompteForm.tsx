
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Compte } from '@/types/comptabilite';

interface CompteFormProps {
  compte?: Compte;
  onSubmit: (data: Omit<Compte, 'id' | 'dateOuverture' | 'soldeActuel'>) => void;
  onCancel: () => void;
}

export const CompteForm = ({ compte, onSubmit, onCancel }: CompteFormProps) => {
  const [formData, setFormData] = useState({
    nom: compte?.nom || '',
    type: compte?.type || 'banque' as const,
    numeroCompte: compte?.numeroCompte || '',
    banque: compte?.banque || '',
    soldeInitial: compte?.soldeInitial || 0,
    statut: compte?.statut || 'actif' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      soldeInitial: Number(formData.soldeInitial)
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-fadem-black mb-6">
        {compte ? 'Modifier' : 'Nouveau'} Compte
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nom">Nom du compte</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
            placeholder="Ex: Compte principal UBA"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type de compte</Label>
          <Select value={formData.type} onValueChange={(value: any) => 
            setFormData(prev => ({ ...prev, type: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="banque">Compte Bancaire</SelectItem>
              <SelectItem value="caisse">Caisse</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type === 'banque' && (
          <>
            <div>
              <Label htmlFor="banque">Nom de la banque</Label>
              <Input
                id="banque"
                value={formData.banque}
                onChange={(e) => setFormData(prev => ({ ...prev, banque: e.target.value }))}
                placeholder="Ex: UBA, Ecobank, BTCI..."
              />
            </div>
            <div>
              <Label htmlFor="numeroCompte">Numéro de compte</Label>
              <Input
                id="numeroCompte"
                value={formData.numeroCompte}
                onChange={(e) => setFormData(prev => ({ ...prev, numeroCompte: e.target.value }))}
                placeholder="Numéro de compte bancaire"
              />
            </div>
          </>
        )}

        {formData.type === 'mobile_money' && (
          <div>
            <Label htmlFor="numeroCompte">Numéro de téléphone</Label>
            <Input
              id="numeroCompte"
              value={formData.numeroCompte}
              onChange={(e) => setFormData(prev => ({ ...prev, numeroCompte: e.target.value }))}
              placeholder="Ex: +228 XX XX XX XX"
            />
          </div>
        )}

        <div>
          <Label htmlFor="soldeInitial">Solde initial (CFA)</Label>
          <Input
            id="soldeInitial"
            type="number"
            step="1"
            value={formData.soldeInitial}
            onChange={(e) => setFormData(prev => ({ ...prev, soldeInitial: Number(e.target.value) }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select value={formData.statut} onValueChange={(value: any) => 
            setFormData(prev => ({ ...prev, statut: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
              <SelectItem value="clos">Clos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-fadem-red hover:bg-fadem-red-dark text-white"
          >
            {compte ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
