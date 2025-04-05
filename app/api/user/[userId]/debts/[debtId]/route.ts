import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET /api/user/[userId]/debts/[debtId]
export async function GET(
  _: Request,
  { params }: { params: { userId: string; debtId: string } }
) {
  const { userId, debtId } = params;

  const debt = await prisma.debt.findFirst({
    where: {
      id: debtId,
      userId: userId,
    },
  });

  if (!debt) return new NextResponse("Debt not found", { status: 404 });

  return NextResponse.json(debt);
}

// PUT /api/user/[userId]/debts/[debtId]
export async function PUT(
  req: Request,
  { params }: { params: { userId: string; debtId: string } }
) {
  const { userId, debtId } = params;
  const data = await req.json();

  const updated = await prisma.debt.updateMany({
    where: {
      id: debtId,
      userId: userId,
    },
    data: {
      ...data,
      firstPaymentDate: data.firstPaymentDate
        ? new Date(data.firstPaymentDate)
        : undefined,
    },
  });

  if (updated.count === 0)
    return new NextResponse("Debt not found", { status: 404 });

  const updatedDebt = await prisma.debt.findUnique({ where: { id: debtId } });
  return NextResponse.json(updatedDebt);
}

// DELETE /api/user/[userId]/debts/[debtId]
export async function DELETE(
  _: Request,
  { params }: { params: { userId: string; debtId: string } }
) {
  const { userId, debtId } = params;

  const deleted = await prisma.debt.deleteMany({
    where: {
      id: debtId,
      userId: userId,
    },
  });

  if (deleted.count === 0)
    return new NextResponse("Debt not found", { status: 404 });

  return new NextResponse("Debt deleted", { status: 200 });
}
