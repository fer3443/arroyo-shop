import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  getTotalItems: () => number;
  getSummaryItems: () => {
    subTotal: number;
    tax: number;
    total: number;
    totalItems: number;
  };
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeCartProduct: (product: CartProduct) => void;

  clearCart: () => void;
}

export const useCartStore = create<State>()(
  //middleware persist
  persist(
    (set, get) => ({
      cart: [],

      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      getSummaryItems: () => {
        const { cart } = get();
        const subTotal = cart.reduce(
          (subTotal, product) => product.price * product.quantity + subTotal,
          0
        );
        //impuestos
        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const totalItems = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        return { subTotal, tax, total, totalItems };
      },
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();
        //1. Revisar si el prod existe en el carrito con la talla seleccionada.
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );
        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }
        //2. Se que el producto existe por tall, tengo que aumentar la cant.
        const updatedCartProduct = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }
          return item;
        });
        set({ cart: updatedCartProduct });
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        const updatedCartProducts = cart.map((item) => {
          //busco el producto en cart con el mismo id y size para retonar una cantidad pero que sea igual al valor que recibo como argu, si no existe retorno el item
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: quantity };
          }
          return item;
        });
        set({ cart: updatedCartProducts });
      },
      removeCartProduct: (product: CartProduct) => {
        const { cart } = get();
        const removedCartProduct = cart.filter((item) => {
          if (item.id !== product.id || item.size !== product.size) {
            return item;
          }
        });
        set({ cart: removedCartProduct });
      },

      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
