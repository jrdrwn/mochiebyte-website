import { snap } from "@/app/lib/payment-gateway";
import { sendConfirmationEmail } from "@/app/lib/send-confirmation-email";
import prisma from "../../../../prisma";
export interface ICheckout {
  name: string;
  email: string;
  telpon: string;
  alamat: string;
  metode_pembayaran: string;
  bukti_pembayaran: string;
  cart: ICart[];
}

export interface ICart {
  productid: number;
  quantity: number;
  flavorid: number;
  toppingid: number;
}

export async function POST(req: Request) {
  const body: ICheckout = await req.json();
  const cart: ICart[] = body.cart;

  const orderCode = new Date().getTime() + Math.floor(Math.random() * 1000);

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      telpon: body.telpon,
      alamat: body.alamat,
      metode_pembayaran: body.metode_pembayaran,
      bukti_pembayaran: body.bukti_pembayaran,
    },
  });

  const order = await prisma.order.create({
    data: {
      code: orderCode.toString(),
      userId: user.id,
      status: "pending",
    },
  });

  await prisma.orderItem.createMany({
    data: cart.map((item) => {
      return {
        productid: item.productid,
        quantity: item.quantity,
        flavorid: item.flavorid <= 0 ? null : item.flavorid,
        toppingid: item.toppingid <= 0 ? null : item.toppingid,
        orderId: order.id,
      };
    }),
  });

  if (body.metode_pembayaran === "midtrans") {
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "menunggu-pembayaran",
      },
    });
    const check = await prisma.order.findFirst({
      where: {
        code: {
          endsWith: orderCode.toString(),
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
    const calculateTotalPrice = (order: any) => {
      if (!order) return 0;
      return order.orderItem.reduce((total: any, item: any) => {
        const toppingPrice = item.topping ? item.topping.price : 0;
        return total + (item.product.price + toppingPrice) * item.quantity;
      }, 0);
    };

    const totalPrice = calculateTotalPrice(check);

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderCode.toString(),
        gross_amount: totalPrice,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: body.name,
        email: body.email,
        phone: body.telpon,
      },
    });

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        midtransToken: transaction?.token,
      },
    });

    return Response.json({ orderCode, transaction });
  }

  await sendConfirmationEmail({ body, order, orderCode: orderCode.toString() });

  return Response.json({ orderCode });
}

