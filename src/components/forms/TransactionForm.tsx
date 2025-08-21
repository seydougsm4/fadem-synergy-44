
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionComptableComplete, Compte, CategorieTransaction } from '@/types/comptabilite';

interface TransactionFormProps {
  transaction?: TransactionComptableComplete;
  comptes: Compte[];
  categories: CategorieTransaction[];
  onSubmit: (data: Omit<TransactionComptableComplete, 'id'>) => void;
  onCancel: () => void;
}

export const TransactionForm = ({
  transaction,
  comptes,
  categories,
  onSubmit,
  onCancel
}: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    compteId: transaction?.compteId || '',
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    type: transaction?.type || 'recette' as const,
    montant: transaction?.montant || 0,
    categorieId: transaction?.categorieId || '',
    sousCategorieId: transaction?.sousCategorieId || '',
    module: transaction?.module || 'autre' as const,
    referenceId: transaction?.referenceId || '',
    description: transaction?.description || '',
    modePaiement: transaction?.modePaiement || 'especes' as const,
    numeroTransaction: transaction?.numeroTransaction || '',
    statut: transaction?.statut || 'validee' as const,
    pieceJustificative: transaction?.pieceJustificative || '',
    tiers: transaction?.tiers || '',
    remarques: transaction?.remarques || ''
  });

  const categoriesFiltrees = categories.filter(c => c.type === formData.type);
  const categorieSelectionnee = categories.find(c => c.id === formData.categorieId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: new Date(formData.date),
      montant: Number(formData.montant)
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-fadem-black mb-6">
        {transaction ? 'Modifier' : 'Nouvelle'} Transaction
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type de transaction</Label>
            <Select value={formData.type} onValueChange={(value: 'recette' | 'depense') => 
              setFormData(prev => ({ ...prev, type: value, categorieId: '', sousCategorieId: '' }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recette">Recette</SelectItem>
                <SelectItem value="depense">Dépense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="compteId">Compte</Label>
            <Select value={formData.compteId} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, compteId: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un compte" />
              </SelectTrigger>
              <SelectContent>
                {comptes.filter(c => c.statut === 'actif').map((compte) => (
                  <SelectItem key={compte.id} value={compte.id}>
                    {compte.nom} ({compte.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="montant">Montant (CFA)</Label>
            <Input
              id="montant"
              type="number"
              min="0"
              step="1"
              value={formData.montant}
              onChange={(e) => setFormData(prev => ({ ...prev, montant: Number(e.target.value) }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="categorieId">Catégorie</Label>
            <Select value={formData.categorieId} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, categorieId: value, sousCategorieId: '' }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categoriesFiltrees.map((categorie) => (
                  <SelectItem key={categorie.id} value={categorie.id}>
                    {categorie.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="modePaiement">Mode de paiement</Label>
            <Select value={formData.modePaiement} onValueChange={(value: any) => 
              setFormData(prev => ({ ...prev, modePaiement: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especes">Espèces</SelectItem>
                <SelectItem value="tmoney">T-Money</SelectItem>
                <SelectItem value="moovmoney">Moov Money</SelectItem>
                <SelectItem value="virement">Virement</SelectItem>
                <SelectItem value="cheque">Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tiers">Tiers</Label>
            <Input
              id="tiers"
              value={formData.tiers}
              onChange={(e) => setFormData(prev => ({ ...prev, tiers: e.target.value }))}
              placeholder="Nom du client/fournisseur"
            />
          </div>

          <div>
            <Label htmlFor="numeroTransaction">Numéro de transaction</Label>
            <Input
              id="numeroTransaction"
              value={formData.numeroTransaction}
              onChange={(e) => setFormData(prev => ({ ...prev, numeroTransaction: e.target.value }))}
              placeholder="Référence bancaire/mobile"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description de la transaction"
            required
          />
        </div>

        <div>
          <Label htmlFor="remarques">Remarques</Label>
          <Textarea
            id="remarques"
            value={formData.remarques}
            onChange={(e) => setFormData(prev => ({ ...prev, remarques: e.target.value }))}
            placeholder="Remarques supplémentaires"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-fadem-red hover:bg-fadem-red-dark text-white"
          >
            {transaction ? 'Modifier' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
