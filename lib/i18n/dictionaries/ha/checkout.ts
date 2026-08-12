import { CheckoutDict } from "../types";

export const checkout: CheckoutDict = {
  pageTitle: "Kwandon ki",
  emptyCart: "Kwandonki babu kome a ciki.",
  discoverProducts: "Bincika kayayyakinmu →",
  decreaseQtyAria: "Rage adadi",
  increaseQtyAria: "Kara adadi",
  removeAria: "Cire daga kwando",
  total: "Jumla",
  loginPrompt: "Shiga don kammala odarki.",
  fullName: "Cikakken suna",
  phone: "Waya",
  deliveryAddress: "Adireshin isar da kaya",
  paymentMethod: "Hanyar biya",
  cod: "Biya lokacin isar da kaya",
  mobileMoney: "Mobile Money (Orange Money / Moov Money)",
  transactionReference: "Lambar ma'amala",
  transactionReferencePlaceholder: "Misali: lambar da aka samu ta SMS",
  transactionReferenceNote: "Bayan tabbatar da biyanki, za a tabbatar da odarki.",
  submitting: "Ana turawa…",
  submit: "Yi oda",
  errors: {
    emptyCart: "Kwandonki babu kome a ciki.",
    missingReference: "Da fatan za ki bayar da lambar ma'amalar Mobile Money.",
    orderFailed: (message) => `Kuskure wajen yin oda: ${message}`,
  },
  successToast: "An yi odar cikin nasara!",
};
