import { ProductsGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";

const products = initialData.products;

export default function HomePage() {
  return (
   <main>
    <Title title="Tienda" subtitle="Prendas" className="mb-5"/>
    <ProductsGrid products={products}/>
   </main>
  );
}
