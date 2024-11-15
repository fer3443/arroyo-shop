import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";


const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
]
export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
     <div className="flex flex-col w-[1000]">
      <Title title="Verificar Orden"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {/*Carrito*/}
        <div className="flex flex-col mt-5">
          <span className="text-md">Ajustar elementos</span>
          <Link href={'/cart'} className="underline mb-5">Editar carrito</Link>
       
        {
          productsInCart.map(product => (
            <div key={product.slug} className="flex mb-5">
              <Image
              src={`/products/${product.images[0]}`}
              width={100}
              height={100}
              style={{
                width:"100px",
                height:"100px"
              }}
              alt={product.title}
              className="mr-5 rounded"
              />
              <div>
                <p>{product.title}</p>
                <p>{product.price} * 3</p>
                <p className="font-bold">Subtotal: {product.price * 3}</p>
                <button className="underline mt-3">Remover</button>
              </div>
            </div>
          ))
        }
         </div>
         <div className="bg-white rounded-xl shadow-xl p-7">
          <h2 className="text-xl mb-2 font-bold">Dirección de entrega</h2>
          <div className="mb-10">
            <p className="text-lg">Fernando Arroyo</p>
            <p>Nicolas Avellaneda 325</p>
            <p>Yerba Buena</p>
            <p>Tucumán</p>
            <p>Cod. Postal: 4107</p>
          </div>
          {/*Diveder */}
          <div className="w-full h-0.5 bg-gray-200 rounded mb-10"/>
          <div className="grid grid-cols-2">
            <span>No Productos</span>
            <span className="text-right">3 articulos</span>

            <span>Subtotal</span>
            <span className="text-right">$ 100</span>
            <span>Impuestos (15%)</span>
            <span className="text-right">$ 100</span>
            <span className="mt-5 text-xl">Total</span>
            <span className="mt-5 text-xl text-right">$ 100</span>
          </div>

          <div className="mt-5 mb-2 w-full">
            <p className="mb-5">
              <span className="text-xs">
                Al hacer clic en &quot;Confirmar orden&quot;, aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
              </span>
            </p>
            <Link href="/orders/123" className="flex btn-primary justify-center">Confirmar orden</Link>
          </div>
         </div>
      </div>
     </div>
    </div>
  );
}