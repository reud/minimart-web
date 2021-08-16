import { Product } from "./product";

export interface Cart {
  products: Product[];
}

export const fetchCart = (): Cart | null => {
  const cartText = localStorage.getItem("cart");
  if (!cartText) {
    return null;
  }
  const c = JSON.parse(cartText) as Cart;
  if (!c.products) {
    c.products = [];
  }
  return c;
}

export const deleteCart = () => {
  localStorage.removeItem("cart");
}

export const pushProduct = (product: Product) => {
  let cart = fetchCart();

  if (!cart) {
    cart = {
      products: [product]
    }
    const cartText = JSON.stringify(cart);
    localStorage.setItem('cart',cartText);
    return;
  }

  cart.products.push(product);
  const cartText = JSON.stringify(cart);
  localStorage.setItem('cart',cartText);
}