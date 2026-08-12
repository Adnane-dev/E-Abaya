import { HomeDict } from "../types";

export const home: HomeDict = {
  hero: {
    ariaLabel: "Gabatarwar shagon Islamic Style-Girls",
    kicker: "Kayan sutura na kunya, Afirka & duniyar Larabawa",
    title: "Kyan hijabi, sabon salo",
    subtitle:
      "Abaya, hijabi, kaftan da riguna da aka zaɓa da kyau, tsakanin al'adar Afirka da kyawun Larabawa.",
    ctaPrimary: "Duba sabbin kayayyaki",
    ctaSecondary: "Labarinmu",
  },
  featured: {
    heading: "Zaɓaɓɓun kayanmu",
    empty: "Kayayyaki suna zuwa nan da nan — ku dawo daga baya!",
    viewDetails: (name) => `Duba cikakken bayani na ${name}`,
    soldBy: (name) => `An sayar da shi daga ${name}`,
  },
  categoriesShowcase: {
    heading: "Nau'ukan kayanmu",
    discover: (name) => `Bincika ${name}`,
  },
  newsletter: {
    heading: "Ku kasance da sani",
    subtitle:
      "Yi rijista don sanin sabbin kayayyaki da tayin na musamman kafin kowa.",
    emailLabel: "Adireshin imel",
    emailPlaceholder: "Adireshin imel naki",
    submit: "Yi rijista",
    submitting: "Ana turawa…",
    alreadySubscribed: "Kin riga kin yi rijista a wasiƙarmu.",
    error: (message) => `An kasa yin rijista: ${message}`,
    success: "Na gode! Kin yi rijista a wasiƙarmu.",
    privacyNotice: "Muna girmama sirrinki. Duba",
    privacyLink: "manufar sirri",
  },
};
