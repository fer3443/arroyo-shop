import { ProductMobileSlideShow, ProductSlideShow, QuantitySelector, SizeSelector } from "@/components";
import { titleFont } from "@/config/fonts";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{slug:string}>
}
export default async function ProductBySlugPage({params}:Props) {
  const {slug} = await params;
  const product = initialData.products.find(item => item.slug === slug);
  if(!product){
    notFound()
  }
  return (
    <div className="mt-5 mb-14 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="col-span-1 md:col-span-2">
        <ProductMobileSlideShow title={product.title} images={product.images} className="block md:hidden"/>
        <ProductSlideShow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>
      <div className="col-span-1 px-5">
        <h1 className={`${titleFont.className} antialiased font-bold text-md`}>{product.title}</h1>
        <p className="text-md mb-5">$ {product.price}</p>
        <SizeSelector selectedSize={product.sizes[0]} availableSizes={product.sizes}/>
        <QuantitySelector quantity={2}/>
        <button className="btn-primary my-5">Agregar a carrito</button>
        <h3 className="font-bold text-sm">Descripcion</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}