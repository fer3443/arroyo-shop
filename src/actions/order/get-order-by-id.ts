"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const getOrderById = async (id:string) => {

  const session = await auth()
  if(!session?.user){
    return {
      ok:false,
      message:'No se ha iniciado sesión'
    }
  }
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: id
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price:true,
            quantity:true,
            size:true,

            product: {
              select: {
                title:true,
                slug:true,

                ProductImage: {
                  select: {
                    url:true,
                  },
                  take: 1
                }
              }
            }
          }
        }
      }
    })

    if(!order) throw `${ id } no existe`;
    if(session.user.role === "user"){
      if(session.user.id !== order.userId) throw `${id} la orden no pertenece al usuario`
    }
  
    return {
      ok:true,
      order:order,
    }

  } catch (error) {
    console.log(error)
    return {
      ok:false,
      message:'Hubo un error, orden inexistente'
    }
  }
}