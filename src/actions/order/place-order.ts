"use server";

import { auth } from "@/auth.config";
import type { Address, Sizes } from "@/interfaces";
import { prisma } from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Sizes;
}
export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  try {
    const session = await auth();
    const userId = session?.user.id;
    //verifico session de usuario
    if (!userId) {
      return {
        ok: false,
        message: "No hay sesión de usuario",
      };
    }
    //Obtener info de prod. Recordar que puedo llevar mas de un prod con el mismo id
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds.map((p) => p.productId),
        },
      },
    });

    //calcular los montos
    const itemsInOrder = productIds.reduce(
      (count, prod) => count + prod.quantity,
      0
    );

    //calcular total, tax, etc
    const { subTotal, tax, total } = productIds.reduce(
      (totals, item) => {
        const productQuantity = item.quantity;
        //esto no deberia fallar pero si falla es por una alteracion del lado del cliente.
        const product = products.find(
          (product) => product.id === item.productId
        );

        if (!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;
        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15; //puedo guardar el impuesto en variable de entorno para que reciba el valor que quiero
        totals.total += subTotal * 1.15;

        return totals;
      },
      { subTotal: 0, tax: 0, total: 0 }
    );

    //Crear la transaccion de base de datos
    try {
      const prismaTx = await prisma.$transaction(async (tx) => {
        //1. Actualizar el stock de productos
  
        const updatedProductsPromise = products.map((product) => {
          //acumulo cantidad de productos a restar en la db
          const productQuantity = productIds
            .filter((prod) => prod.productId === product.id)
            .reduce((acc, item) => item.quantity + acc, 0);
  
          if (productQuantity === 0) {
            throw new Error(`${product.id} no tiene cantidad definida`);
          }
          return tx.product.update({
            where: { id: product.id },
            data: {
              inStock: {
                decrement: productQuantity,
              },
            },
          });
        });
  
        const updatedProducts = await Promise.all(updatedProductsPromise)
  
        //verificar valores negativos en las existencias = no hay stock
  
        updatedProducts.forEach(product => {
          if(product.inStock < 0){
            throw new Error(`${product.title} no hay stock suficiente`)
          }
        })
        //2. Crear la orden - Encabezado - Detalles
        const order = await tx.order.create({
          data: {
            userId: userId,
            itemsInOrder: itemsInOrder,
            subTotal: subTotal,
            tax: tax,
            total: total,
  
            OrderItem: {
              createMany: {
                data: productIds.map((prod) => ({
                  quantity: prod.quantity,
                  size: prod.size,
                  productId: prod.productId,
                  price:
                    products.find((product) => product.id === prod.productId)
                      ?.price ?? 0,
                })),
              },
            },
          },
        });
        //verificar si el precio es 0 retornar un error y cancela toda la transaccion
  
        //3. Crear la direccion de la orden
        const orderAddress = await tx.orderAddress.create({
          data: {
            orderId: order.id,
            firstName: address.firstName,
            lastName: address.lastName,
            address: address.address,
            address2: address.address2,
            city: address.city,
            postalCode: address.postalCode,
            phone: address.phone,
            countryId: address.country,
          },
        });
  
        return {
          order: order,
          updatedProducts: updatedProducts,
          orderAddress: orderAddress,
        };
      });
      return {
        ok:true,
        order: prismaTx.order,
        prismaTx: prismaTx
      }
    } catch (error:any) {
      return {
        ok:false,
        message: error?.message
      }
    }
  } catch (error) {
    return {
      ok: false,
      message: "",
    };
  }
};
