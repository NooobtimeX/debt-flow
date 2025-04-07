"use client";

import DebtList from "@/components/DebtList";
import DebtModal from "@/components/DebtModal";
import DebtSummaryToggle from "@/components/summary/DebtSummaryToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Debt } from "@prisma/client";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  const userId = session?.user?.id;
  const token = session?.accessToken;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchDebts = async () => {
    if (!userId || !token) return;

    try {
      const res = await fetch(`/api/user/${userId}/debts`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ JWT จริง
        },
      });

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setDebts(data);
    } catch (err) {
      console.error("Failed to fetch debts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchDebts();
  }, [userId, token]);

  const handleDelete = async (debtId: string) => {
    if (!userId || !token) return;

    try {
      const res = await fetch(`/api/user/${userId}/debts/${debtId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      fetchDebts();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const openAddModal = () => {
    setSelectedDebt(null);
    setModalOpen(true);
  };

  const openEditModal = (debt: Debt) => {
    setSelectedDebt(debt);
    setModalOpen(true);
  };

  if (status === "loading" || !userId || !token) {
    return (
      <p className="text-center mt-10 text-muted-foreground">Loading...</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <DebtModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchDebts}
        userId={userId}
        token={token} // ✅ ส่ง JWT จริง
        initialData={selectedDebt || undefined}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📊 My Debt Dashboard</h1>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Debt
        </Button>
      </div>

      <DebtSummaryToggle debts={debts} />
      <Separator />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">📋 Debt List</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <DebtList
            debts={debts}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
