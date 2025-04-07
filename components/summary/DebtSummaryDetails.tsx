"use client";

import { Debt, InterestRateType } from "@prisma/client";

interface DebtSummaryProps {
  debts: Debt[];
}

function calculateTotalPayment(debt: Debt): number {
  const principal = debt.principal;
  const rate = debt.interestRate / 100;
  const termMonths = debt.termMonths;

  let totalInterest = 0;

  if (debt.interestRateType === InterestRateType.MONTHLY) {
    totalInterest = principal * rate * termMonths;
  } else if (debt.interestRateType === InterestRateType.YEARLY) {
    const termYears = termMonths / 12;
    totalInterest = principal * rate * termYears;
  }

  return principal + totalInterest;
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
        <p className="text-sm text-blue-600">Total Principal</p>
        <p className="text-xl font-bold text-blue-800">
          ฿{totalPrincipal.toLocaleString()}
        </p>
      </div>
      <div className="bg-green-50 p-4 rounded-xl">
        <p className="text-sm text-green-600">Total Payment</p>
        <p className="text-xl font-bold text-green-800">
          ฿{totalAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
