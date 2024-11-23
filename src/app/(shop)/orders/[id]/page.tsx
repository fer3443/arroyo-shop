import { getOrderById } from "@/actions";
import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  params: Promise<{ id: string }>;
}
export default async function OrderByIdPage({ params }: Props) {
  const { id } = await params;
  //!todo: verificar
  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }

  // const { OrderItem, OrderAddress} = order

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000]">
        <Title title={`Orden #${id.split("-").at(-1)}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/*Carrito*/}
          <div className="flex flex-col mt-5">
            <OrderPaid isPaid={order!.isPaid} />

            {order?.OrderItem.map((prod) => (
              <div key={prod.product.slug + '-' + prod.size} className="flex mb-5">
                <Image
                  src={`/products/${prod.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                  alt={prod.product.title}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{prod.product.title}</p>
                  <p>
                   {currencyFormat(prod.price)} * {prod.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(prod.price * prod.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-lg">{order?.OrderAddress?.firstName} {order?.OrderAddress?.lastName}</p>
              <p>{order?.OrderAddress?.address}</p>
              <p>{order?.OrderAddress?.address2}</p>
              <p>{order?.OrderAddress?.city} {order?.OrderAddress?.countryId}</p>
              <p>{order?.OrderAddress?.postalCode}</p>
            </div>
            {/*Diveder */}
            <div className="w-full h-0.5 bg-gray-200 rounded mb-10" />
            <div className="grid grid-cols-2">
              <span>Nº Productos</span>
              <span className="text-right">{order?.itemsInOrder} Articulos</span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(order!.subTotal)}
              </span>
              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>
              <span className="mt-5 text-xl">Total</span>
              <span className="mt-5 text-xl text-right">
                {currencyFormat(order!.total)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              <OrderPaid isPaid={order!.isPaid} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const OrderPaid = ({ isPaid }: { isPaid: boolean }) => {
  return (
    <div
      className={clsx(
        "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
        { "bg-red-500": !isPaid, "bg-green-700": isPaid }
      )}
    >
      <IoCardOutline size={30} />
      {/* <span className="mx-2">Pendiente de pago</span> */}
      <span className="mx-2">{isPaid ? "Orden pagada" : "No pagada"}</span>
    </div>
  );
};
