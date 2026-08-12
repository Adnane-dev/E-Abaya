import { CheckoutDict } from "../types";

export const checkout: CheckoutDict = {
  pageTitle: "سلتك",
  emptyCart: "سلتك فارغة.",
  discoverProducts: "اكتشفي منتجاتنا ←",
  decreaseQtyAria: "تقليل الكمية",
  increaseQtyAria: "زيادة الكمية",
  removeAria: "إزالة من السلة",
  total: "الإجمالي",
  loginPrompt: "سجّلي الدخول لإتمام طلبك.",
  fullName: "الاسم الكامل",
  phone: "الهاتف",
  deliveryAddress: "عنوان التوصيل",
  paymentMethod: "طريقة الدفع",
  cod: "الدفع عند التوصيل",
  mobileMoney: "Mobile Money (Orange Money / Moov Money)",
  transactionReference: "مرجع المعاملة",
  transactionReferencePlaceholder: "مثال: الرمز المستلم عبر SMS",
  transactionReferenceNote: "سيتم تأكيد طلبك بعد التحقق اليدوي من دفعتك.",
  submitting: "جارٍ الإرسال…",
  submit: "إتمام الطلب",
  errors: {
    emptyCart: "سلتك فارغة.",
    missingReference: "يرجى إدخال مرجع دفعة Mobile Money.",
    orderFailed: (message) => `خطأ في الطلب: ${message}`,
  },
  successToast: "تم إرسال طلبك بنجاح!",
};
