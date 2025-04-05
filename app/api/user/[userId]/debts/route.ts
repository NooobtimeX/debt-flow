import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET /api/user/[userId]/debts → Get all debts for a user
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId) {
    return new NextResponse("Missing userId", { status: 400 });
  }

  const debts = await prisma.debt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(debts);
}

// POST /api/user/[userId]/debts → Create new debt for a user
export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const body = await req.json();

  const {
    name,
    type,
    principal,
    interestRate,
    interestRateType,
    currency,
    termMonths,
    firstPaymentDate,
    note,
  } = body;

  if (!userId) {
    return new NextResponse("Missing userId", { status: 400 });
  }

  const newDebt = await prisma.debt.create({
    data: {
      name,
      type,
      principal,
      interestRate,
      interestRateType,
      currency,
      termMonths,
      firstPaymentDate: new Date(firstPaymentDate),
      note,
      userId,
    },
  });

  return NextResponse.json(newDebt);
}
