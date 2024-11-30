"use server"

import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deleteProductImage = async (imageId:number, imageUrl:string) => {
  if(!imageUrl.startsWith('http')){
    //!NOTA: solo voy a borrar los archivos subidos a cloud, por eso realizo esta condicion
    return {
      ok:false,
      error: 'No se pueden borrar imagenes de FS'
    }
  }

  const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';
  try {
    //primero elimino la imagen de cloud y despues de prisma;
    await cloudinary.uploader.destroy(imageName);
    const deleteImage = await prisma.productImage.delete({
      where: {
        id: imageId
      },
      select:{
        product:{
          select:{
            slug:true
          }
        }
      }
    })

    //revalidar paths
    revalidatePath(`/admin/products`)
    revalidatePath(`/admin/product/${deleteImage.product.slug}`)
    revalidatePath(`/product/${deleteImage.product.slug}`)
    
  } catch (error) {
    console.log(error)
    return {
      ok:false,
      message:'No se pudo eliminar la imagen'
    }
  }
}