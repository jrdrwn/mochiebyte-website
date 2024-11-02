import { NextRequest } from "next/server";
import prisma from "../../../../prisma";
export async function GET(req: NextRequest) {
  const orderCode = req.nextUrl.searchParams.get("code");

  if (!orderCode) {
    return Response.json({ error: "Invalid order code" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        code: {
          endsWith: orderCode.replace("#", ""),
        },
      },
      include: {
        user: true,
        orderItem: {
          include: {
            product: {
              include: {
                flavors: true,
                toppings: true,
              },
            },
            flavor: true,
            topping: true,
          },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json(order);
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

