"use client";

import { ProductComponentImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const productsInCart = useCartStore((state) => state.cart);
  const updateQuantityProduct = useCartStore(state => state.updateProductQuantity)
  const removeProductInCart = useCartStore(state => state.removeCartProduct)

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>cargando...</p>;
  }
  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <ProductComponentImage
            src={product.image}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div>
            <Link
            className="hover:underline cursor-pointer"
            href={`/product/${product.slug}`}>
            {product.size} - {product.title}
            </Link>
            <p>{product.price}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChanged={(quantity) => updateQuantityProduct(product, quantity)}
            />
            <button 
            onClick={() => removeProductInCart(product)}
            className="underline mt-3">Remover</button>
          </div>
        </div>
      ))}
    </>
  );
};
