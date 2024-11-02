import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { handler as authOptions } from "../../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = params;
  const { status } = await request.json();

  if (!orderId || !status) {
    return NextResponse.json(
      { error: "Invalid order ID or status" },
      { status: 400 },
    );
  }

  try {
    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

