
import { useState } from 'react';
import { Calculator, Plus, TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TransactionForm } from '@/components/forms/TransactionForm';
import { CompteForm } from '@/components/forms/CompteForm';
import { useComptabiliteComplete } from '@/hooks/useComptabiliteComplete';
import { TransactionComptableComplete, Compte } from '@/types/comptabilite';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { resetAllData, exportAllData } from '@/utils/resetApp';
import { toast } from 'sonner';

const ComptabiliteComplete = () => {
  const {
    transactions,
    comptes,
    categories,
    ajouterTransaction,
    modifierTransaction,
    supprimerTransaction,
    ajouterCompte,
    modifierCompte,
    supprimerCompte,
    obtenirStatistiques,
    obtenirBilansComptes,
    obtenirRevenusParModule,
    obtenirDepensesParCategorie
  } = useComptabiliteComplete();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showCompteForm, setShowCompteForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionComptableComplete | null>(null);
  const [editingCompte, setEditingCompte] = useState<Compte | null>(null);

  const stats = obtenirStatistiques();
  const bilansComptes = obtenirBilansComptes();
  const revenusParModule = obtenirRevenusParModule();
  const depensesParCategorie = obtenirDepensesParCategorie();

  const handleAddTransaction = (type: 'recette' | 'depense') => {
    setEditingTransaction(null);
    setShowTransactionForm(true);
    setActiveTab('transactions');
  };

  const handleEditTransaction = (transaction: TransactionComptableComplete) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
    setActiveTab('transactions');
  };

  const handleSubmitTransaction = (data: Omit<TransactionComptableComplete, 'id'>) => {
    try {
      if (editingTransaction) {
        modifierTransaction(editingTransaction.id, data);
        toast.success('Transaction modifiée avec succès');
      } else {
        ajouterTransaction(data);
        toast.success('Transaction ajoutée avec succès');
      }
      setShowTransactionForm(false);
      setEditingTransaction(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        supprimerTransaction(id);
        toast.success('Transaction supprimée');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleAddCompte = () => {
    setEditingCompte(null);
    setShowCompteForm(true);
    setActiveTab('comptes');
  };

  const handleEditCompte = (compte: Compte) => {
    setEditingCompte(compte);
    setShowCompteForm(true);
    setActiveTab('comptes');
  };

  const handleSubmitCompte = (data: Omit<Compte, 'id' | 'dateOuverture' | 'soldeActuel'>) => {
    try {
      if (editingCompte) {
        modifierCompte(editingCompte.id, data);
        toast.success('Compte modifié avec succès');
      } else {
        ajouterCompte(data);
        toast.success('Compte créé avec succès');
      }
      setShowCompteForm(false);
      setEditingCompte(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteCompte = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      try {
        supprimerCompte(id);
        toast.success('Compte supprimé');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleResetApp = () => {
    if (window.confirm('⚠️ ATTENTION: Cette action supprimera TOUTES les données de l\'application. Êtes-vous sûr ?')) {
      resetAllData();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fadem-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Données exportées avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const cancelForms = () => {
    setShowTransactionForm(false);
    setShowCompteForm(false);
    setEditingTransaction(null);
    setEditingCompte(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg text-white">
            <Calculator size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-fadem-black">Module Comptabilité</h1>
            <p className="text-muted-foreground">Gestion complète des finances</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleAddTransaction('recette')}>
            <TrendingUp size={20} className="mr-2 text-success" />
            Recette
          </Button>
          <Button variant="outline" onClick={() => handleAddTransaction('depense')}>
            <TrendingDown size={20} className="mr-2 text-destructive" />
            Dépense
          </Button>
          <Button onClick={handleAddCompte} className="bg-fadem-red hover:bg-fadem-red-dark text-white">
            <Plus size={20} className="mr-2" />
            Nouveau Compte
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 border-success bg-success/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-success">Revenus du Jour</h3>
              <p className="text-2xl font-bold text-success mt-2">{formatCurrency(stats.revenusJour)}</p>
            </div>
            <TrendingUp className="text-success" size={24} />
          </div>
        </Card>
        
        <Card className="p-4 border-destructive bg-destructive/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-destructive">Dépenses du Jour</h3>
              <p className="text-2xl font-bold text-destructive mt-2">{formatCurrency(stats.depensesJour)}</p>
            </div>
            <TrendingDown className="text-destructive" size={24} />
          </div>
        </Card>
        
        <Card className="p-4 border-fadem-red bg-fadem-red/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-fadem-red">Revenus du Mois</h3>
              <p className="text-2xl font-bold text-fadem-red mt-2">{formatCurrency(stats.revenusMois)}</p>
            </div>
            <DollarSign className="text-fadem-red" size={24} />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Solde Total</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{formatCurrency(stats.soldeTotal)}</p>
          <p className="text-sm text-muted-foreground">{stats.nombreComptes} comptes</p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-fadem-black">Marge Nette</h3>
          <p className="text-2xl font-bold text-fadem-red mt-2">{stats.margeNette.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Ce mois</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            <Calculator size={16} className="mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <CreditCard size={16} className="mr-2" />
            Transactions ({transactions.length})
          </TabsTrigger>
          <TabsTrigger value="comptes">
            <Wallet size={16} className="mr-2" />
            Comptes ({comptes.length})
          </TabsTrigger>
          <TabsTrigger value="parametres">
            <Settings size={16} className="mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Revenus par Module</h2>
              <div className="space-y-3">
                {revenusParModule.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Aucune recette ce mois</p>
                ) : (
                  revenusParModule.map((item) => (
                    <div key={item.module} className="flex justify-between items-center">
                      <span className="text-muted-foreground capitalize">{item.module}</span>
                      <div className="text-right">
                        <span className="font-semibold text-fadem-black">{formatCurrency(item.montant)}</span>
                        <span className="text-sm text-muted-foreground ml-2">({item.pourcentage}%)</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-fadem-black mb-4">Dépenses par Catégorie</h2>
              <div className="space-y-3">
                {depensesParCategorie.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Aucune dépense ce mois</p>
                ) : (
                  depensesParCategorie.map((item) => (
                    <div key={item.categorie} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{item.categorie}</span>
                      <span className="font-semibold text-fadem-black">{formatCurrency(item.montant)}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Bilans par compte */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-fadem-black mb-4">Situation des Comptes</h2>
            {bilansComptes.length === 0 ? (
              <div className="text-center py-8">
                <Wallet size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun compte créé</p>
                <Button onClick={handleAddCompte} className="mt-4">
                  Créer le premier compte
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bilansComptes.map((bilan) => (
                  <div key={bilan.compteId} className="border border-card-border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-fadem-black">{bilan.nomCompte}</h3>
                        <p className="text-sm text-muted-foreground">
                          {bilan.nombreTransactions} transactions ce mois
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-fadem-red">{formatCurrency(bilan.soldeFin)}</p>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-success">+{formatCurrency(bilan.totalRecettes)}</span>
                          <span className="text-destructive">-{formatCurrency(bilan.totalDepenses)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {showTransactionForm ? (
            <TransactionForm
              transaction={editingTransaction || undefined}
              comptes={comptes}
              categories={categories}
              onSubmit={handleSubmitTransaction}
              onCancel={cancelForms}
            />
          ) : (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fadem-black">
                  Toutes les Transactions ({transactions.length})
                </h2>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleAddTransaction('recette')}
                  >
                    <TrendingUp size={20} className="mr-2 text-success" />
                    Recette
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleAddTransaction('depense')}
                  >
                    <TrendingDown size={20} className="mr-2 text-destructive" />
                    Dépense
                  </Button>
                </div>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune transaction enregistrée</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button onClick={() => handleAddTransaction('recette')}>
                      Première recette
                    </Button>
                    <Button variant="outline" onClick={() => handleAddTransaction('depense')}>
                      Première dépense
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((transaction) => {
                      const compte = comptes.find(c => c.id === transaction.compteId);
                      const categorie = categories.find(c => c.id === transaction.categorieId);
                      
                      return (
                        <div key={transaction.id} className="border border-card-border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Badge variant={transaction.type === 'recette' ? 'default' : 'destructive'}>
                                  {transaction.type === 'recette' ? 'Recette' : 'Dépense'}
                                </Badge>
                                <Badge variant="outline">
                                  {categorie?.nom || 'Sans catégorie'}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(transaction.date)}
                                </span>
                              </div>
                              <h3 className="font-semibold text-fadem-black">{transaction.description}</h3>
                              <p className="text-sm text-muted-foreground">
                                Compte: {compte?.nom || 'Compte inconnu'}
                              </p>
                              {transaction.tiers && (
                                <p className="text-sm text-muted-foreground">
                                  Tiers: {transaction.tiers}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                Mode: {transaction.modePaiement}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`text-2xl font-bold ${
                                transaction.type === 'recette' ? 'text-success' : 'text-destructive'
                              }`}>
                                {transaction.type === 'recette' ? '+' : '-'}{formatCurrency(transaction.montant)}
                              </p>
                              <div className="flex space-x-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditTransaction(transaction)}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteTransaction(transaction.id)}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comptes" className="space-y-6">
          {showCompteForm ? (
            <CompteForm
              compte={editingCompte || undefined}
              onSubmit={handleSubmitCompte}
              onCancel={cancelForms}
            />
          ) : (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fadem-black">
                  Tous les Comptes ({comptes.length})
                </h2>
                <Button 
                  onClick={handleAddCompte}
                  className="bg-fadem-red hover:bg-fadem-red-dark text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau Compte
                </Button>
              </div>
              
              {comptes.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun compte créé</p>
                  <Button onClick={handleAddCompte} className="mt-4">
                    Créer le premier compte
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {comptes.map((compte) => (
                    <div key={compte.id} className="border border-card-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-fadem-black">{compte.nom}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="outline">{compte.type}</Badge>
                            <Badge variant={
                              compte.statut === 'actif' ? 'default' : 
                              compte.statut === 'inactif' ? 'secondary' : 'destructive'
                            }>
                              {compte.statut}
                            </Badge>
                          </div>
                          {compte.banque && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Banque: {compte.banque}
                            </p>
                          )}
                          {compte.numeroCompte && (
                            <p className="text-sm text-muted-foreground">
                              N°: {compte.numeroCompte}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Ouvert le {formatDate(compte.dateOuverture)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-fadem-red">
                            {formatCurrency(compte.soldeActuel)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Solde initial: {formatCurrency(compte.soldeInitial)}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCompte(compte)}
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteCompte(compte.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="parametres" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-fadem-black mb-6">Gestion des Données</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-fadem-black mb-2">Export des Données</h3>
                <p className="text-muted-foreground mb-4">
                  Exportez toutes vos données pour sauvegarde ou transfert
                </p>
                <Button onClick={handleExportData} variant="outline">
                  Exporter les données
                </Button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-destructive mb-2">Zone Dangereuse</h3>
                <p className="text-muted-foreground mb-4">
                  ⚠️ Cette action supprimera définitivement TOUTES les données de l'application
                </p>
                <Button onClick={handleResetApp} variant="destructive">
                  Remettre à zéro l'application
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComptabiliteComplete;
