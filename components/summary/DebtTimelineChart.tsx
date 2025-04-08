"use client";

import { Debt } from "@prisma/client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DebtTimelineChartProps {
  debts: Debt[];
}

interface TimelinePoint {
  month: number;
  totalRemaining: number;
  [debtId: string]: number | string;
}

// 🎨 Color generator
function generateColorByIndex(index: number): string {
  const palette = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#d0ed57",
    "#a4de6c",
    "#ffbb28",
  ];
  return palette[index % palette.length];
}

// 📊 Generate timeline for each debt
function generateDebtTimeline(debt: Debt): {
  id: string;
  name: string;
  timeline: { month: number; remaining: number }[];
} {
  const {
    principal,
    interestRate,
    termMonths,
    interestRateType,
    extraMonthlyPay,
    isRevolving = false,
    id,
    name,
  } = debt;

  const extraPay = extraMonthlyPay ?? 0;
  const rate = interestRate / 100 / (interestRateType === "YEARLY" ? 12 : 1);
  const timeline: { month: number; remaining: number }[] = [];

  let remaining = principal;
  let month = 0;

  if (isRevolving) {
    while (remaining > 0 && month < 600) {
      const interest = remaining * rate;
      const minPay = remaining * 0.05;
      const actualPay = Math.min(remaining + interest, minPay + extraPay);
      const principalPaid = actualPay - interest;
      if (actualPay <= interest) break;

      remaining = Math.max(0, remaining - principalPaid);
      timeline.push({
        month: ++month,
        remaining: parseFloat(remaining.toFixed(2)),
      });
    }
  } else {
    const payment =
      (principal * rate) / (1 - Math.pow(1 + rate, -termMonths)) + extraPay;
    for (let i = 1; i <= termMonths && remaining > 0; i++) {
      const interest = remaining * rate;
      const principalPaid = payment - interest;
      remaining = Math.max(0, remaining - principalPaid);
      timeline.push({ month: i, remaining: parseFloat(remaining.toFixed(2)) });
    }
  }

  return { id, name, timeline };
}

// 🔀 Merge timelines & compute totalRemaining
function mergeTimelines(debts: Debt[]): TimelinePoint[] {
  const merged: Record<number, TimelinePoint> = {};

  debts.forEach((debt) => {
    const { id, timeline } = generateDebtTimeline(debt);
    timeline.forEach(({ month, remaining }) => {
      if (!merged[month]) merged[month] = { month, totalRemaining: 0 };
      merged[month][id] = remaining;
    });
  });

  Object.values(merged).forEach((point) => {
    let total = 0;
    debts.forEach((debt) => {
      const val = point[debt.id];
      if (typeof val === "number") {
        total += val;
      }
    });
    point.totalRemaining = parseFloat(total.toFixed(2));
  });

  return Object.values(merged).sort((a, b) => a.month - b.month);
}

// ✅ Chart component
export default function DebtTimelineChart({ debts }: DebtTimelineChartProps) {
  const data = mergeTimelines(debts);

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <BarChart data={data} stackOffset="sign">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          {debts.map((debt, index) => (
            <Bar
              key={debt.id}
              dataKey={debt.id}
              stackId="total"
              fill={generateColorByIndex(index)}
              name={debt.name}
            />
          ))}
          <Line
            type="monotone"
            dataKey="totalRemaining"
            stroke="#ff0000"
            strokeWidth={2}
            dot
            strokeDasharray="4 2"
            name="Total Remaining"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
