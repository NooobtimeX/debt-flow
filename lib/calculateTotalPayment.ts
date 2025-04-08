import { Debt } from "@prisma/client";

export function calculateTotalPayment(debt: Debt): number {
  const {
    principal,
    interestRate,
    termMonths,
    interestRateType,
    isRevolving = false,
  } = debt;

  const extraPay = debt.extraMonthlyPay ?? 0;
  const monthlyRate =
    interestRate / 100 / (interestRateType === "YEARLY" ? 12 : 1);

  if (isRevolving) {
    let balance = principal;
    let totalPaid = 0;
    let months = 0;

    while (balance > 0 && months < 600) {
      const interest = balance * monthlyRate;
      const minPay = balance * 0.05;
      const actualPay = Math.min(balance + interest, minPay + extraPay);
      const principalPaid = actualPay - interest;

      if (actualPay <= interest) break;

      balance -= principalPaid;
      totalPaid += actualPay;
      months++;
    }

    return totalPaid;
  }

  const monthlyPay =
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths)) +
    extraPay;

  let balance = principal;
  let totalPaid = 0;

  for (let i = 0; i < termMonths && balance > 0; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(balance, monthlyPay - interest);
    balance = Math.max(0, balance - principalPaid);
    totalPaid += interest + principalPaid;
  }

  return totalPaid;
}
