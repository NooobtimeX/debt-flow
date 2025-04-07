import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Principal</TableHead>
          <TableHead>Interest</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Note</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {debts.map((debt) => (
          <TableRow key={debt.id}>
            <TableCell className="font-medium">{debt.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {debt.type}
              </Badge>
            </TableCell>
            <TableCell>฿{debt.principal.toLocaleString()}</TableCell>
            <TableCell>
              {debt.interestRate}% ({debt.interestRateType})
            </TableCell>
            <TableCell>
              {new Date(debt.firstPaymentDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {debt.note || "-"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
