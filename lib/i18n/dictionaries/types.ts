export interface CommonDict {
  loading: string;
  close: string;
  cancel: string;
  save: string;
  reset: string;
  seeAll: string;
}

export interface NavDict {
  searchAria: string;
  languageAria: string;
  themeToLight: string;
  themeToDark: string;
  wishlistAria: string;
  cartAria: string;
  ordersAria: string;
  openMenu: string;
  closeMenu: string;
  allCollections: string;
  categories: {
    hijab: string;
    hijabClassic: string;
    hijabModern: string;
    hijabSport: string;
    abaya: string;
    abayaStyles: string;
    abayaLong: string;
    kaftans: string;
    kaftansCeremony: string;
    kaftansDaily: string;
    robe: string;
    robeFormal: string;
    robeOccasions: string;
  };
  roles: {
    admin: string;
    courier: string;
    vendor: string;
    customer: string;
  };
  menu: {
    adminDashboard: string;
    myDeliveries: string;
    myShop: string;
    becomeVendor: string;
    becomeCourier: string;
    myAccount: string;
    myOrders: string;
    logout: string;
  };
  login: string;
  register: string;
}

export interface FooterDict {
  shopHeading: string;
  newArrivals: string;
  abayas: string;
  hijabs: string;
  kaftans: string;
  dresses: string;
  helpHeading: string;
  shipping: string;
  returns: string;
  sizing: string;
  contact: string;
  aboutHeading: string;
  ourStory: string;
  designers: string;
  sustainability: string;
  careers: string;
  joinHeading: string;
  becomeVendor: string;
  becomeCourier: string;
  followHeading: string;
  copyright: (year: number) => string;
  backToTopAria: string;
}

export interface HomeDict {
  hero: {
    ariaLabel: string;
    kicker: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  featured: {
    heading: string;
    empty: string;
    viewDetails: (name: string) => string;
    soldBy: (name: string) => string;
  };
  categoriesShowcase: {
    heading: string;
    discover: (name: string) => string;
  };
  newsletter: {
    heading: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    submitting: string;
    alreadySubscribed: string;
    error: (message: string) => string;
    success: string;
    privacyNotice: string;
    privacyLink: string;
  };
}
