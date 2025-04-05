"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Debt } from "@prisma/client";

interface DebtSummaryProps {
  debts: Debt[];
}

export default function DebtSummary({ debts }: DebtSummaryProps) {
  const totalPrincipal = debts.reduce((sum, d) => sum + d.principal, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">💰 Summary</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-blue-600">Total Principal</p>
          <p className="text-xl font-bold text-blue-800">
            ฿{totalPrincipal.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
