export interface CommonDict {
  loading: string;
  close: string;
  cancel: string;
  save: string;
  reset: string;
  seeAll: string;
  loginLinkLabel: string;
}

export interface NavDict {
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

export interface ProductsDict {
  pageTitle: string;
  filters: {
    title: string;
    categoriesHeading: string;
    budgetHeading: string;
    brandsHeading: string;
    colorsHeading: string;
    sizesHeading: string;
    resetButton: string;
    mobileButton: string;
    closeAria: string;
    viewResults: (count: number) => string;
  };
  sort: {
    placeholder: string;
    newest: string;
    priceLow: string;
    priceHigh: string;
  };
  collectionTitle: (category: string) => string;
  searchPlaceholder: (category: string) => string;
  allColors: string;
  allMaterials: string;
  allPrices: string;
  noProductsInCategory: (category: string) => string;
  noResults: string;
  inStock: string;
  outOfStock: string;
  soldBy: (name: string) => string;
}

export interface SearchDict {
  ariaLabel: string;
  placeholder: string;
  productsHeading: string;
  shopsHeading: string;
  categoriesHeading: string;
  noResults: string;
  seeAllResults: (query: string) => string;
  resultsFor: (query: string) => string;
}

export interface StaticPagesDict {
  about: {
    title: string;
    intro: string;
    missionTitle: string;
    missionBody: string;
    storyTitle: string;
    storyBody: string;
    whyTitle: string;
    whyItems: string[];
  };
  careers: {
    title: string;
    intro: string;
    ctaTitle: string;
    becomeVendor: string;
    becomeVendorDesc: string;
    becomeCourier: string;
    becomeCourierDesc: string;
    contactCta: string;
    contactLinkLabel: string;
  };
  sustainability: {
    title: string;
    intro: string;
    pointsTitle: string;
    points: { title: string; body: string }[];
  };
  designers: {
    title: string;
    intro: string;
    ctaTitle: string;
    ctaBody: string;
    browseShops: string;
    becomeVendor: string;
  };
}

export interface CheckoutDict {
  pageTitle: string;
  emptyCart: string;
  discoverProducts: string;
  decreaseQtyAria: string;
  increaseQtyAria: string;
  removeAria: string;
  total: string;
  loginPrompt: string;
  fullName: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: string;
  cod: string;
  mobileMoney: string;
  transactionReference: string;
  transactionReferencePlaceholder: string;
  transactionReferenceNote: string;
  submitting: string;
  submit: string;
  errors: {
    emptyCart: string;
    missingReference: string;
    orderFailed: (message: string) => string;
  };
  successToast: string;
}

export interface AccountDict {
  myOrders: {
    title: string;
    loginSuffix: string;
    noOrders: string;
    discoverProducts: string;
    orderNumber: (id: number) => string;
    itemsCount: (count: number) => string;
  };
  orderConfirmation: {
    title: string;
    orderNumber: string;
    status: string;
    paymentMethod: string;
    delivery: string;
    items: string;
    total: string;
    contactNote: (phone: string) => string;
    paymentLabels: { cod: string; mobile_money: string };
  };
  myAccount: {
    title: string;
    loginSuffix: string;
    changePhoto: string;
    uploadingPhoto: string;
    email: string;
    fullName: string;
    phone: string;
    address: string;
    save: string;
    saving: string;
    viewOrders: string;
    avatarUpdated: string;
    profileUpdated: string;
    errors: {
      avatarUpload: (message: string) => string;
      profileSave: (message: string) => string;
    };
  };
  wishlist: {
    title: string;
    loginSuffix: string;
    empty: string;
    discoverProducts: string;
  };
  becomeCourier: {
    title: string;
    guestLinkLabel: string;
    guestSuffix: string;
    alreadyCourier: string;
    goToDashboard: string;
    pendingMessage: string;
    formIntro: string;
    phoneLabel: string;
    submit: string;
    submitting: string;
    successToast: string;
    errorToast: (message: string) => string;
  };
}

export interface AuthDict {
  login: {
    backHome: string;
    title: string;
    orEmail: string;
    emailLabel: string;
    passwordLabel: string;
    submit: string;
    submitting: string;
    noAccount: string;
    createAccount: string;
    errorToast: (message: string) => string;
    successToast: string;
  };
  register: {
    backHome: string;
    title: string;
    orEmail: string;
    fullNameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    addressLabel: string;
    submit: string;
    submitting: string;
    alreadyAccount: string;
    login: string;
    successToast: string;
    validation: {
      fullNameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
      passwordTooShort: string;
      passwordMismatch: string;
    };
  };
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
