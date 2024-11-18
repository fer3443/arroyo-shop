"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const OrderSummary = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { subTotal, tax, total, totalItems } = useCartStore(
    useShallow((state) => state.getSummaryItems())
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
      <h2 className="text-xl mb-2">Resumen de orden</h2>
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
        <Link
          href="/checkout/address"
          className={clsx("flex btn-primary justify-center",{
            "cursor-not-allowed": totalItems === 0
          })}
        >
         <button disabled={totalItems === 0}>Checkout</button>
        </Link>
      </div>
    </div>
  );
};
