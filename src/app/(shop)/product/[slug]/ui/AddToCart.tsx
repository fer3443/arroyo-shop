"use client"

import { QuantitySelector, SizeSelector } from "@/components"
import { CartProduct, Product, Sizes } from "@/interfaces"
import { useCartStore } from "@/store"
import { useState } from "react"

interface Props {
  product:Product
}

export const AddToCart = ({product}:Props) => {
  const addProductToCart = useCartStore(state => state.addProductToCart)
  const [quantity, setQuantity] = useState<number>(1)
  const [size, setSize] = useState<Sizes | undefined>();
  const [posted, setPosted] = useState<boolean>(false);

  const addToCart = () => {
    setPosted(true)
    if(!size) return
    // console.log({size, quantity})
    const cartProduct:CartProduct = {
      id: product.id,
      slug:product.slug,
      title:product.title,
      price: product.price,
      quantity,
      size,
      image: product.images[0]
    }
    addProductToCart(cartProduct);
    setPosted(false);
    setSize(undefined);
    setQuantity(1)
  }

  return (
    <>
    {
      posted && !size && (
        <span className="mt-4 italic fade-in text-red-500 text-sm">Debe seleccionar un talle*</span>
      )
    }
      <SizeSelector
          selectedSize={size}
          availableSizes={product.sizes}
          onSizeChanged={setSize}
        />
        <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity}/>
        <button 
        onClick={addToCart}
        className="btn-primary my-5">Agregar a carrito</button>
    </>
  )
}
