import { snap } from "@/app/lib/payment-gateway";
import { sendMail } from "@/app/lib/send-mail";
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

interface IConfirmationEmailData {
  body: IBody;
  order: any;
  orderCode: string;
}

interface IBody {
  name: string;
  email: string;
  telpon: string;
  alamat: string;
  metode_pembayaran: string;
}

export async function sendConfirmationEmail({
  body,
  order,
  orderCode,
}: IConfirmationEmailData) {
  await sendMail({
    email: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
    subject: `[MochieByte] Konfirmasi Pesanan Anda di MochieByte [No. Pesanan: #${order.code}]`,
    text: `Halo ${body.name},

Terima kasih telah melakukan pemesanan di MochieByte! Pesanan Anda berhasil kami terima dan akan segera diproses.

Detail Pesanan:
- No. Pesanan: #${order.code}

Metode Pembayaran: ${body.metode_pembayaran}

Anda dapat melihat detail pesanan Anda dengan klik tautan berikut: ${process.env.NEXT_PUBLIC_API_URL}/pesanan?code=${orderCode}

Jika Anda memiliki pertanyaan atau ingin mengubah detail pesanan, silakan hubungi kami segera.

Salam hangat,
Tim MochieByte`.trim(),
    sendTo: body.email,
    html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
        .header { font-size: 24px; font-weight: bold; color: #ff6f61; text-align: center; margin-bottom: 20px; }
        .content { font-size: 16px; line-height: 1.5; }
        .button { background-color: #ff6f61; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { font-size: 12px; color: #666; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Konfirmasi Pesanan Anda di MochieByte</div>
        <div class="content">
            <p>Halo <strong>${body.name}</strong>,</p>
            <p>Terima kasih telah melakukan pemesanan di MochieByte! Pesanan Anda berhasil kami terima dan akan segera diproses.</p>

            <h3>Detail Pesanan:</h3>
            <p>
                <strong>No. Pesanan:</strong> #${orderCode}<br>
                <strong>Tanggal:</strong> ${order.createdAt}<br>
            </p>

            <p>
                <strong>Metode Pembayaran:</strong> ${body.metode_pembayaran}
            </p>

            <p>Anda dapat melihat detail pesanan dengan klik tombol di bawah ini:</p>
            <p>
                <a href="${process.env.NEXT_PUBLIC_API_URL}/pesanan?code=${orderCode}" class="button">Lihat Detail Pesanan</a>
            </p>

            <p>Jika Anda memiliki pertanyaan atau ingin mengubah detail pesanan, silakan hubungi kami segera.</p>
            <p>Salam hangat,</p>
            <p>Tim MochieByte</p>
        </div>
        <div class="footer">
            &copy; 2024 MochieByte. All rights reserved.
        </div>
    </div>
</body>
</html>`.trim(),
  });
}

