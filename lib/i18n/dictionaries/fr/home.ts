import { HomeDict } from "../types";

export const home: HomeDict = {
  hero: {
    ariaLabel: "Présentation de la boutique Islamic Style-Girls",
    kicker: "Mode modeste, Afrique & monde arabe",
    title: "L'élégance voilée, réinventée",
    subtitle:
      "Abayas, hijabs, kaftans et robes soigneusement sélectionnés, entre héritage africain et raffinement arabe.",
    ctaPrimary: "Voir les nouveautés",
    ctaSecondary: "Notre histoire",
  },
  featured: {
    heading: "Nos coups de cœur",
    empty: "Le catalogue arrive très bientôt — revenez vite !",
    viewDetails: (name) => `Voir les détails de ${name}`,
    soldBy: (name) => `Vendu par ${name}`,
  },
  categoriesShowcase: {
    heading: "Nos univers",
    discover: (name) => `Découvrir ${name}`,
  },
  newsletter: {
    heading: "Restez informée",
    subtitle:
      "Inscrivez-vous pour découvrir nos nouvelles collections et offres exclusives en avant-première.",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "Votre adresse e-mail",
    submit: "S'abonner",
    submitting: "Envoi…",
    alreadySubscribed: "Vous êtes déjà inscrit(e) à notre newsletter.",
    error: (message) => `Erreur lors de l'inscription : ${message}`,
    success: "Merci ! Vous êtes inscrit(e) à notre newsletter.",
    privacyNotice: "Nous respectons votre vie privée. Consultez notre",
    privacyLink: "politique de confidentialité",
  },
};
