"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Debt } from "@prisma/client";
import { Pencil, StickyNote, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "./ui/card";

interface DebtListProps {
  debts: Debt[];
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export default function DebtList({ debts, onEdit, onDelete }: DebtListProps) {
  const [selectedNote, setSelectedNote] = useState<string>("");

  if (debts.length === 0) {
    return <p className="text-muted-foreground">No debts found.</p>;
  }

  return (
    <Card>
      <Dialog>
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Extra Payment</TableHead>
                <TableHead>Credit-style</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debts.map((debt) => (
                <TableRow key={debt.id}>
                  <TableCell className="font-medium">{debt.name}</TableCell>
                  <TableCell>฿{debt.principal.toLocaleString()}</TableCell>
                  <TableCell>
                    {debt.interestRate}% ({debt.interestRateType})
                  </TableCell>
                  <TableCell>
                    {debt.extraMonthlyPay
                      ? `฿${debt.extraMonthlyPay.toLocaleString()}`
                      : "–"}
                  </TableCell>
                  <TableCell>{debt.isRevolving ? "✅ Yes" : "❌ No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() =>
                            setSelectedNote(
                              debt.note?.trim()
                                ? debt.note
                                : "No note provided."
                            )
                          }
                        >
                          <StickyNote className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
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
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📝 Note</DialogTitle>
          </DialogHeader>
          {selectedNote && selectedNote.trim() !== "" ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {selectedNote}
            </p>
          ) : (
            <p className="text-sm text-destructive">No note found.</p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
