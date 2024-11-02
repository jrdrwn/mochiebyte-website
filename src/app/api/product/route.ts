import prisma from "../../../../prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    relationLoadStrategy: "join",
    include: {
      flavors: true,
      toppings: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  return Response.json(products);
}

