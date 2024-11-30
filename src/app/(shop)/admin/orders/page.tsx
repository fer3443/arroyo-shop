export const revalidate = 0;

import { getPaginatedOrders } from "@/actions";
import { Pagination, Title } from "@/components";
import clsx from "clsx";

import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

interface Props {
  searchParams:Promise<{page?:string}>
}

export default async function OrderPage({searchParams}:Props) {

  const page = (await searchParams).page ? Number((await searchParams).page) : 1;
  //TODO: agregar filtro para buscar ordenes por usuario o nombres.
  const { ok, orders, totalPages = 1 } = await getPaginatedOrders({page});
  if (!ok) {
    redirect("/auth/login");
  }
  return (
    <>
      <Title title="Orders" />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                #ID
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Nombre completo
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Estado
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((item) => (
              <tr key={item.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                 #{item.id.split('-').at(-1)}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                 {item.OrderAddress?.firstName} {item.OrderAddress?.lastName}
                </td>
                <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <IoCardOutline className="text-gray-500" />
                  <span className={clsx({
                    "mx-2 text-green-800": item.isPaid,
                    "mx-2 text-red-600": !item.isPaid
                  })}>{item.isPaid ? 'Pagada' : 'No pagada'}</span>
                </td>
                <td className="text-sm text-gray-900 font-light px-6 ">
                  <Link href={`/orders/${item.id}`} className="hover:underline">
                    Ver orden
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalPages={totalPages}/>
      </div>
    </>
  );
}
