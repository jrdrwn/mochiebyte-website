import { sendConfirmationEmail } from "@/app/lib/send-confirmation-email";
import { NextRequest } from "next/server";
import prisma from "../../../../../../prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id, transaction_status } = body;

  console.log(body);
  if (transaction_status === "settlement" || transaction_status === "capture") {
    const order = await prisma.order.findFirst({
      where: {
        code: {
          equals: order_id,
        },
      },
      include: {
        user: true,
      },
    });
    if (order?.status === "menunggu-pembayaran") {
      sendConfirmationEmail({
        body: order.user,
        order: order,
        orderCode: order.code,
      });
      await prisma.order.update({
        where: {
          id: order?.id,
        },
        data: {
          status: "pending",
        },
      });
    }
    return Response.json({ message: "Success" });
  } else {
    return Response.json({ message: "Test" });
  }
}

