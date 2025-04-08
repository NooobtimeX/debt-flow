"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Debt } from "@prisma/client";
import currencyCodes from "currency-codes";
import { format } from "date-fns";
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const allCurrencies = currencyCodes.codes();

  const [formData, setFormData] = useState({
    name: "",
    principal: 0,
    interestRate: 0,
    interestRateType: "MONTHLY",
    currency: "THB",
    termMonths: 12,
    note: "",
    extraMonthlyPay: 0,
    isRevolving: false,
    startDate: new Date().toISOString(),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        principal: initialData.principal || 0,
        interestRate: initialData.interestRate || 0,
        interestRateType: initialData.interestRateType || "MONTHLY",
        currency: initialData.currency || "THB",
        termMonths: initialData.termMonths || 12,
        note: initialData.note || "",
        extraMonthlyPay: initialData.extraMonthlyPay || 0,
        isRevolving: initialData.isRevolving || false,
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString()
          : new Date().toISOString(),
      });
    }
  }, [initialData, open]);

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

  const Form = (
    <div className="space-y-2 p-1">
      <div className="flex flex-row gap-4">
        <div className="w-full">
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, name: e.target.value }))
            }
          />
        </div>
        <div className="w-2/5">
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
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-full">
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
        </div>
        <div className="w-2/5">
          <Label>Currency</Label>
          <select
            className="w-full h-10 rounded-md border px-3 py-2 text-sm"
            value={formData.currency}
            onChange={(e) =>
              setFormData((p) => ({ ...p, currency: e.target.value }))
            }
          >
            {allCurrencies.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-full">
          <Label className="mb-1 block">Interest Rate Type</Label>
          <select
            className="w-full h-10 rounded-md border px-3 py-2 text-sm"
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
        </div>
        <div className="w-2/5">
          <Label className="mb-1 block">Interest Rate (%)</Label>
          <Input
            type="number"
            className="h-10"
            value={formData.interestRate}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                interestRate: parseFloat(e.target.value) || 0,
              }))
            }
          />
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-full">
          <Label>Extra Monthly Payment</Label>
          <Input
            type="number"
            value={formData.extraMonthlyPay}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                extraMonthlyPay: parseFloat(e.target.value) || 0,
              }))
            }
          />
        </div>
        <div className="w-2/5 flex flex-col justify-between items-center">
          <Label htmlFor="revolving" className="text-center">
            Credit-style debt
          </Label>
          <input
            id="revolving"
            type="checkbox"
            className="w-4 h-4 mb-3"
            checked={formData.isRevolving}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                isRevolving: e.target.checked,
              }))
            }
          />
        </div>
      </div>

      <div className="w-full">
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.startDate && "text-muted-foreground"
              )}
            >
              {formData.startDate
                ? format(new Date(formData.startDate), "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={new Date(formData.startDate)}
              onSelect={(date) =>
                date &&
                setFormData((p) => ({
                  ...p,
                  startDate: format(date, "yyyy-MM-dd'T'HH:mm:ssXXX"),
                }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Label>Note</Label>
      <Input
        value={formData.note}
        onChange={(e) => setFormData((p) => ({ ...p, note: e.target.value }))}
        placeholder="Optional note"
        className="min-h-20"
      />

      <Button className="w-full mt-4" onClick={handleSubmit}>
        {isEdit ? "Save Changes" : "Add Debt"}
      </Button>
    </div>
  );

  return isDesktop ? (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Debt" : "Add New Debt"}</DialogTitle>
        </DialogHeader>
        {Form}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="p-2">
        <DrawerHeader>
          <DrawerTitle className="text-center">
            {isEdit ? "Edit Debt" : "Add New Debt"}
          </DrawerTitle>
        </DrawerHeader>
        {Form}
      </DrawerContent>
    </Drawer>
  );
}
