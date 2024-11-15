"use server";

import { prisma } from "@/lib/prisma";
import { Gender } from "@prisma/client";

interface PaginationOptions {
  gender?:string;
  page?: number;
  take?: number;
}

export const getPaginatedProductsWithImages = async ({
  gender,
  page = 1,
  take = 12,
}: PaginationOptions) => {
  if(isNaN(Number(page))) page = 1;
  if(page < 1) page = 1;
  try {
    const products = await prisma.product.findMany({
      take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where:{
        gender: gender as Gender
      }
    });
    const totalCount = await prisma.product.count({
      where: {gender: gender as Gender}
    })
    const totalPages = Math.ceil(totalCount / take)

    return {
      currentPage: page,
      totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    console.error(error)
    throw new Error('Error al realizar la petición');
  }
};
