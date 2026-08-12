import { CheckoutDict } from "../types";

export const checkout: CheckoutDict = {
  pageTitle: "Votre panier",
  emptyCart: "Votre panier est vide.",
  discoverProducts: "Découvrir nos produits →",
  decreaseQtyAria: "Diminuer la quantité",
  increaseQtyAria: "Augmenter la quantité",
  removeAria: "Retirer du panier",
  total: "Total",
  loginPrompt: "Connectez-vous pour finaliser votre commande.",
  fullName: "Nom complet",
  phone: "Téléphone",
  deliveryAddress: "Adresse de livraison",
  paymentMethod: "Mode de paiement",
  cod: "Paiement à la livraison",
  mobileMoney: "Mobile Money (Orange Money / Moov Money)",
  transactionReference: "Référence de la transaction",
  transactionReferencePlaceholder: "Ex : identifiant reçu par SMS",
  transactionReferenceNote: "Après vérification manuelle de votre paiement, votre commande sera confirmée.",
  submitting: "Envoi…",
  submit: "Passer la commande",
  errors: {
    emptyCart: "Votre panier est vide.",
    missingReference: "Merci d'indiquer la référence de votre paiement Mobile Money.",
    orderFailed: (message) => `Erreur lors de la commande : ${message}`,
  },
  successToast: "Commande passée avec succès !",
};
