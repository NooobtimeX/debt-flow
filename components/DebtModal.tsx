"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Debt } from "@prisma/client";
import { useEffect, useState } from "react";

interface DebtModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: string;
  token: string;
  initialData?: Partial<Debt>;
}

export default function DebtModal({
  open,
  onClose,
  onSaved,
  userId,
  token,
  initialData,
}: DebtModalProps) {
  const isEdit = !!initialData?.id;
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    principal: 0,
    interestRate: 0,
    interestRateType: "MONTHLY",
    currency: "THB",
    termMonths: 12,
    firstPaymentDate: "",
    note: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "",
        principal: initialData.principal || 0,
        interestRate: initialData.interestRate || 0,
        interestRateType: initialData.interestRateType || "MONTHLY",
        currency: initialData.currency || "THB",
        termMonths: initialData.termMonths || 12,
        firstPaymentDate: initialData.firstPaymentDate
          ? new Date(initialData.firstPaymentDate).toISOString().split("T")[0]
          : "",
        note: initialData.note || "",
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `/api/user/${userId}/debts/${initialData?.id}`
      : `/api/user/${userId}/debts`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save debt:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Debt" : "Add New Debt"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, name: e.target.value }))
            }
          />
          <Label>Type</Label>
          <Input
            value={formData.type}
            onChange={(e) =>
              setFormData((p) => ({ ...p, type: e.target.value }))
            }
          />
          <Label>Principal</Label>
          <Input
            type="number"
            value={formData.principal}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                principal: parseFloat(e.target.value) || 0,
              }))
            }
          />
          <Label>Interest Rate (%)</Label>
          <Input
            type="number"
            value={formData.interestRate}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                interestRate: parseFloat(e.target.value) || 0,
              }))
            }
          />
          <Label>Interest Rate Type</Label>
          <select
            className="w-full border rounded px-3 py-2"
            value={formData.interestRateType}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                interestRateType: e.target.value as any,
              }))
            }
          >
            <option value="MONTHLY">MONTHLY</option>
            <option value="YEARLY">YEARLY</option>
          </select>
          <Label>Currency</Label>
          <Input
            value={formData.currency}
            onChange={(e) =>
              setFormData((p) => ({ ...p, currency: e.target.value }))
            }
          />
          <Label>Term Months</Label>
          <Input
            type="number"
            value={formData.termMonths}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                termMonths: parseInt(e.target.value) || 0,
              }))
            }
          />
          <Label>First Payment Date</Label>
          <Input
            type="date"
            value={formData.firstPaymentDate}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                firstPaymentDate: e.target.value,
              }))
            }
          />
          <Label>Note</Label>
          <Input
            value={formData.note}
            onChange={(e) =>
              setFormData((p) => ({ ...p, note: e.target.value }))
            }
          />

          <Button className="w-full mt-4" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Add Debt"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
