export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductsGrid, Title } from "@/components";
interface Props {
  searchParams:Promise<{page?:string}>
}

export default async function HomePage({searchParams}:Props) {
  const page = (await searchParams).page ? Number((await searchParams).page) : 1;

  const {products, totalPages} = await getPaginatedProductsWithImages({page})
  return (
   <main>
    <Title title="Tienda" subtitle="Prendas" className="mb-5"/>
    <ProductsGrid products={products}/>
    <Pagination totalPages={totalPages}/>
   </main>
  );
}
