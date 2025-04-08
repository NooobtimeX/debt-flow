"use client";

import { calculateTotalPayment } from "@/lib/calculateTotalPayment";
import { Debt } from "@prisma/client";

interface DebtSummaryProps {
  debts: Debt[];
}

export default function DebtSummaryDetails({ debts }: DebtSummaryProps) {
  const totalPrincipal = debts.reduce((sum, d) => sum + d.principal, 0);
  const totalAmount = debts.reduce(
    (sum, d) => sum + calculateTotalPayment(d),
    0
  );

  return (
    <div className="text-center grid grid-cols-2 gap-4">
      <div className="bg-blue-50 p-4 rounded-xl">
        <p className="text-md text-blue-600">Total Principal</p>
        <p className="text-sm md:text-xl font-bold text-blue-800">
          ฿{totalPrincipal.toLocaleString()}
        </p>
      </div>
      <div className="bg-green-50 p-4 rounded-xl">
        <p className="text-md text-green-600">Total Payment</p>
        <p className="text-sm md:text-xl font-bold text-green-800">
          ฿{totalAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
