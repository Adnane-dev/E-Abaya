import { CheckoutDict } from "../types";

export const checkout: CheckoutDict = {
  pageTitle: "Your cart",
  emptyCart: "Your cart is empty.",
  discoverProducts: "Discover our products →",
  decreaseQtyAria: "Decrease quantity",
  increaseQtyAria: "Increase quantity",
  removeAria: "Remove from cart",
  total: "Total",
  loginPrompt: "Sign in to complete your order.",
  fullName: "Full name",
  phone: "Phone",
  deliveryAddress: "Delivery address",
  paymentMethod: "Payment method",
  cod: "Cash on delivery",
  mobileMoney: "Mobile Money (Orange Money / Moov Money)",
  transactionReference: "Transaction reference",
  transactionReferencePlaceholder: "E.g.: ID received by SMS",
  transactionReferenceNote: "Your order will be confirmed after manual verification of your payment.",
  submitting: "Sending…",
  submit: "Place order",
  errors: {
    emptyCart: "Your cart is empty.",
    missingReference: "Please provide your Mobile Money payment reference.",
    orderFailed: (message) => `Order error: ${message}`,
  },
  successToast: "Order placed successfully!",
};
