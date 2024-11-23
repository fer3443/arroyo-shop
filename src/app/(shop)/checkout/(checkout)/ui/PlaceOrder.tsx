"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";

import { currencyFormat } from "@/utils";
import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { useRouter } from "next/navigation";

export const PlaceOrder = () => {

  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const address = useAddressStore((state) => state.address);
  const { subTotal, tax, total, totalItems } = useCartStore(
    useShallow((state) => state.getSummaryItems())
  );
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore(state => state.clearCart)
  useEffect(() => {
    setLoaded(true);
  }, []);

  const placeToOrder = async () => {
    setIsPlacingOrder(true);

    // await sleep(2);
    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    //! Server action
    const resp = await placeOrder(productsToOrder, address);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return
    }

    //* si llega hasta aqui es que salio bien
    clearCart();
    router.replace('/orders/' + resp.order!.id)
  };

  if (!loaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-xl mb-2 font-bold">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-lg">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city} {address.country}
        </p>
      </div>
      {/*Diveder */}
      <div className="w-full h-0.5 bg-gray-200 rounded mb-10" />
      <div className="grid grid-cols-2">
        <span>Nº Productos</span>
        <span className="text-right">{totalItems} articulos</span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>
        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>
        <span className="mt-5 text-xl">Total</span>
        <span className="mt-5 text-xl text-right">{currencyFormat(total)}</span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          <span className="text-xs">
            Al hacer clic en &quot;Confirmar orden&quot;, aceptas nuestros{" "}
            <a href="#" className="underline">
              términos y condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="underline">
              política de privacidad
            </a>
          </span>
        </p>

        <p className="text-red-500 italic mb-2">{errorMessage}</p>
        <button
          //  href="/orders/123"
          onClick={placeToOrder}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
        >
          Confirmar orden
        </button>
      </div>
    </div>
  );
};
