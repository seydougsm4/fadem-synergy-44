// Utilitaires pour l'application FADEM

import { format, addDays, addMonths, differenceInDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Génération d'ID unique
export function generateId(): string {
  return `fadem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Formatage des montants en CFA
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' CFA';
}

// Formatage des dates
export function formatDate(date: Date | string, formatStr = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy à HH:mm', { locale: fr });
}

// Calcul des commissions
export function calculateCommission(prixFadem: number, prixProprietaire: number): number {
  return prixFadem - prixProprietaire;
}

export function calculateCommissionPercentage(prixFadem: number, prixProprietaire: number): number {
  if (prixProprietaire === 0) return 0;
  return ((prixFadem - prixProprietaire) / prixProprietaire) * 100;
}

// Calcul des échéances
export function calculateNextPaymentDate(startDate: Date, monthsToAdd: number): Date {
  return addMonths(startDate, monthsToAdd);
}

export function calculateDaysOverdue(dueDate: Date): number {
  return Math.max(0, differenceInDays(new Date(), dueDate));
}

// Validation des données
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+228)?[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateCNI(cni: string): boolean {
  // Format CNI Togo: 8 chiffres
  const cniRegex = /^[0-9]{8}$/;
  return cniRegex.test(cni);
}

// Calcul des pénalités de retard
export function calculateLateFee(amount: number, daysLate: number, feeRate = 0.05): number {
  if (daysLate <= 0) return 0;
  return amount * feeRate * Math.ceil(daysLate / 30); // 5% par mois de retard
}

// Génération de numéros de facture
export function generateInvoiceNumber(prefix: string = 'FAC'): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${year}${month}-${timestamp}`;
}

// Génération de reçu de paiement
export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `REC-${timestamp.slice(-6)}${random}`;
}

// Calcul de pourcentage d'avancement
export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}

// Calcul de la marge bénéficiaire
export function calculateMargin(revenue: number, costs: number): number {
  if (revenue === 0) return 0;
  return ((revenue - costs) / revenue) * 100;
}

// Tri par date
export function sortByDate<T>(
  items: T[], 
  dateField: keyof T, 
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[dateField] as any);
    const dateB = new Date(b[dateField] as any);
    return order === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });
}

// Filtrage par période
export function filterByDateRange<T>(
  items: T[],
  dateField: keyof T,
  startDate: Date,
  endDate: Date
): T[] {
  return items.filter(item => {
    const itemDate = new Date(item[dateField] as any);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

// Groupement par mois
export function groupByMonth<T>(
  items: T[],
  dateField: keyof T
): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const date = new Date(item[dateField] as any);
    const monthKey = format(date, 'yyyy-MM');
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Calcul de statistiques basiques
export function calculateStats(numbers: number[]) {
  if (numbers.length === 0) return { sum: 0, average: 0, min: 0, max: 0 };
  
  const sum = numbers.reduce((a, b) => a + b, 0);
  const average = sum / numbers.length;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  
  return { sum, average, min, max };
}

// Export CSV
export function exportToCSV<T>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
): void {
  if (data.length === 0) return;
  
  const keys = Object.keys(data[0]) as (keyof T)[];
  const headerRow = keys.map(key => headers?.[key] || String(key));
  
  const csvContent = [
    headerRow.join(','),
    ...data.map(row => 
      keys.map(key => {
        const value = row[key];
        return typeof value === 'string' ? `"${value}"` : String(value);
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Notification toast helper
export function showToast(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
): void {
  // Cette fonction sera connectée au système de toast
  console.log(`[${type.toUpperCase()}] ${message}`);
}

// Débounce pour les recherches
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Vérification de connexion réseau
export function isOnline(): boolean {
  return navigator.onLine;
}

// Formatage des tailles de fichier
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Calcul de l'âge
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Génération de mot de passe temporaire
export function generateTempPassword(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Copie dans le presse-papier
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erreur copie presse-papier:', err);
    return false;
  }
}

// Couleurs de statut
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'actif': 'text-success',
    'inactif': 'text-muted-foreground',
    'en_cours': 'text-warning',
    'termine': 'text-success',
    'annule': 'text-destructive',
    'paye': 'text-success',
    'en_retard': 'text-destructive',
    'en_attente': 'text-warning',
    'disponible': 'text-success',
    'loue': 'text-warning',
    'maintenance': 'text-destructive',
    'vendu': 'text-muted-foreground'
  };
  
  return statusColors[status] || 'text-muted-foreground';
}