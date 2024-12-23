// app/types/customer.ts
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string; // Optionnel si vous voulez ajouter le numéro de téléphone
  address?: string; // Optionnel si vous voulez ajouter l'adresse
  status?: string; // Optionnel si vous voulez ajouter le statut
}
