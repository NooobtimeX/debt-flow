import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Debt } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";

interface DebtListProps {
  debts: Debt[];
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export default function DebtList({ debts, onEdit, onDelete }: DebtListProps) {
  if (debts.length === 0) {
    return <p className="text-muted-foreground">No debts found.</p>;
  }

  return (
    <div className="grid gap-4">
      {debts.map((debt) => (
        <Card key={debt.id}>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base font-medium">
                {debt.name}
              </CardTitle>
              <Badge variant="outline" className="text-xs mt-1">
                {debt.type}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(debt)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(debt.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>
              <span className="font-medium">Principal:</span> ฿
              {debt.principal.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Interest:</span> {debt.interestRate}
              % ({debt.interestRateType})
            </p>
            <p>
              <span className="font-medium">Start:</span>{" "}
              {new Date(debt.firstPaymentDate).toLocaleDateString()}
            </p>
            {debt.note && (
              <p>
                <span className="font-medium">Note:</span> {debt.note}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
