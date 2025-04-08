"use client";

import { calculateTotalPayment } from "@/lib/calculateTotalPayment";
import { Debt } from "@prisma/client";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#d0ed57",
  "#a4de6c",
];

interface DebtPieChartProps {
  debts: Debt[];
}

export default function DebtPieChart({ debts }: DebtPieChartProps) {
  const principalData = debts.map((debt) => ({
    name: debt.name,
    value: parseFloat(debt.principal.toFixed(2)),
  }));

  const totalPaymentData = debts.map((debt) => ({
    name: debt.name,
    value: parseFloat(calculateTotalPayment(debt).toFixed(2)),
  }));

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Pie 1: Principal Only */}
      <div className="w-full h-72">
        <h3 className="text-center text-sm text-blue-600 font-medium mb-2">
          📘 Principal Breakdown
        </h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={principalData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {principalData.map((_, index) => (
                <Cell
                  key={`principal-cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Pie 2: Principal + Interest */}
      <div className="w-full h-72">
        <h3 className="text-center text-sm text-green-600 font-medium mb-2">
          💰 Total Payment (Principal + Interest)
        </h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={totalPaymentData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {totalPaymentData.map((_, index) => (
                <Cell
                  key={`total-cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
