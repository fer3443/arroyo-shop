import { initialData } from "../src/seed/seed";
import { prisma } from "../src/lib/prisma";
async function main() {
  // 1. Borrar registros previos
  await Promise.all([
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
  ]);

  // 2 . Insertar categorias
  const { categories, products } = initialData;
  const categoriesData = categories.map((category) => ({
    name: category,
  }));
  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDb = await prisma.category.findMany();
  const categoriesMap = categoriesDb.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>);

  // 3. Insertar productos
  //paso previo: agregar categoryId
  // const newProducts = products.map((product) => {
  //   const { type, images, ...rest } = product;
  //   const newProduct = {
  //     ...rest,
  //     categoryId: categoriesMap[type],
  //   };
  //   return newProduct;
  // });

  // await prisma.product.createMany({
  //   data: newProducts,
  // });
  products.forEach(async (product) => {
    const { type, images, ...rest } = product;
    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    //images
    const imagesData = images.map(image => ({
      url:image,
      productId: dbProduct.id
    }))

    await prisma.productImage.createMany({
      data:imagesData
    })
  });

  console.log("seed executed");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
