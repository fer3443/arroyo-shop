"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const getOrderByUser = async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        ok: false,
        message: "No se inicio sesión",
      };
    }
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return {
      ok:true,
      orders
    }
  } catch (error) {
    return {
      ok:false,
      message:'Hubo un problema'
    }
  }
};
