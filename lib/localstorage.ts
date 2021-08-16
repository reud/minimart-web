import { Product } from "./product";

export interface Cart {
  products: Product[];
}

export const fetchCart = (): Cart | null => {
  const cartText = localStorage.getItem("cart");
  if (!cartText) {
    return null;
  }
  return JSON.parse(cartText) as Cart;
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