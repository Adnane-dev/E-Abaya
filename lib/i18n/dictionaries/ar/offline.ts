import { OfflineDict } from "../types";

export const offline: OfflineDict = {
  indicator: (count) => (count > 0 ? `غير متصل — ${count} إجراء قيد الانتظار` : "غير متصل"),
  offlinePage: {
    title: "أنتِ غير متصلة بالإنترنت",
    message: "لا يمكن تحميل هذه الصفحة بدون اتصال. تحققي من اتصالك بالإنترنت وحاولي مرة أخرى.",
    retry: "إعادة المحاولة",
  },
  checkoutQueued: "تم حفظ طلبك دون اتصال، وسيتم إرساله تلقائيًا عند استعادة الاتصال.",
  wishlistQueuedAdd: "تمت حفظ الإضافة إلى المفضلة، ستتم المزامنة عند استعادة الاتصال.",
  wishlistQueuedRemove: "تمت حفظ إزالة المفضلة، ستتم المزامنة عند استعادة الاتصال.",
  syncSuccess: (count) => `تمت مزامنة ${count} إجراء بنجاح.`,
};
