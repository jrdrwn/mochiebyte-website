import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // const product = await prisma.product.create({
  //   data: {
  //     id: 3,
  //     name: "JavaScript Syrup",
  //     price: 5000,
  //     description: "Sirup Jeruk",
  //     image: "http://localhost:3000/images/javascript-syrup.jpg",
  //   },
  // });
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

export default prisma;

