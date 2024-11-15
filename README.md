## Para correr en dev


1. Clonar el repositorio
2. Crear una copia del ``` .env.template ``` renombrarlo a ``` .env ``` y cambiar las variables de entorno.
3. Instalar dependencias ``` npm install ```
4. Correr las migraciones de Prisma ``` npx prisma migrate dev ```
5. Generar el clente de prisma ``` npx prisma generate ```
6. Ejecutar seed ``` npx prisma db seed ```
7. Correr el proyecto ``` npm run dev ```