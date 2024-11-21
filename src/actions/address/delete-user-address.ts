"use server"

import { prisma } from "@/lib/prisma"

export const deleteUserAddress = async (userId:string) => {
  try {
    const user = await prisma.userAddress.delete({
      where: {userId},
    })
    if(!user){
      return {
        ok:true,
        message:'No se encontro direccion para el usuario'
      }
    }
    return {
      ok:true,
      message:'Dirección borrada con exito'
    }

  } catch (error) {
    console.log(error)
   throw new Error('No se pudo eliminar la dirección')
  }
}