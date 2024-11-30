"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";

interface PaginationOptions {
  page?:number;
  take?:number;
}

export const getPaginatedOrders = async ({page = 1, take = 10}:PaginationOptions) => {
  if(page < 1) page = 1;
  if(isNaN(Number(page))) page = 1;
  try {
    const session = await auth();
    if (session?.user.role !== 'admin') {
      return {
        ok: false,
        message: "No posee autorización",
      };
    }
    const orders = await prisma.order.findMany({
      take,
      skip: (page - 1) * take,
      orderBy:{
        createdAt:'desc'
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

    const totalCount = await prisma.order.count()
    const totalPages = Math.ceil(totalCount / take)
    return {
      ok:true,
      orders,
      totalPages
    }
  } catch (error) {
    return {
      ok:false,
      message:'Hubo un problema'
    }
  }
}