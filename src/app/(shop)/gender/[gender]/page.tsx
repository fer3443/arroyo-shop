export const revalidate = false

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductsGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ gender: string}>;
  searchParams: Promise<{page?:string}>;
}

export default async function GenderByIdPage({ params, searchParams }: Props) {
  const { gender } = await params;
  const page = (await searchParams).page ? Number((await searchParams).page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    gender,
    page,
  });
  if (!products) {
    redirect(`/gender/${gender}`);
  }
  //una forma de tipar un objeto literal
  const label: Record<string, string> = {
    men: "Hombres",
    women: "Mujeres",
    kid: "Niños",
    unisex: "Todos",
  };
  // if (id === "kids") {
  //   notFound();
  // }
  return (
    <main>
      <Title
        title={`Articulos de ${label[gender]}`}
        subtitle="Todos los productos"
        className="mb-5"
      />
      <ProductsGrid products={products} />
      <Pagination totalPages={totalPages} />
    </main>
  );
}
