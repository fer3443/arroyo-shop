export const generatePagination = (currentPage: number, totalPages: number) => {
  //si el num total de paginas es 7 o menos, muestro todas las paginas sin putos suspensivos
  if(totalPages <= 7){
    return Array.from({length: totalPages},(_,i) => i + 1)
  }

  //Si la pagina actual esta entre las primeras 3 paginas, mostrar las primeras 3 , ... y las utlimas 2
  if(currentPage <= 3){
    return [1,2,3,'...', totalPages -1, totalPages]
  }

  //Si la pagina actual esta entre las ultimas 3 paginas muestro las dos primeras y puntos suspensivos, las ultimas 3 paginas
  if(currentPage >= totalPages -2){
    return [1,2,'...', totalPages -2, totalPages -1, totalPages]
  }

  //si la pagina esta en otro lugar del medio, muestro la primera, puntos suspensivos , etc
  return [1,'...',currentPage - 1, currentPage, currentPage +1,'...', totalPages]
}