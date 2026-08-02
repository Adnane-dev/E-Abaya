import { Product } from "@/types/product";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  shop_id: number | null;
}

const CART_EVENT = "cart-updated";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

export function addToCart(product: Product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      shop_id: product.shop_id ?? null,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function updateQuantity(id: number, quantity: number) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }

  item.quantity = quantity;
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function removeFromCart(id: number) {
  const cart = getCart().filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function clearCart() {
  localStorage.setItem("cart", "[]");
  window.dispatchEvent(new Event(CART_EVENT));
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function onCartUpdate(callback: () => void) {
  window.addEventListener(CART_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
