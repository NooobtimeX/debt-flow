"use client";

import { Debt } from "@prisma/client";
import { addMonths, format, parseISO } from "date-fns";
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
  monthKey: string;
  totalPayment: number;
  [debtId: string]: number | string;
}

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

function generateDebtTimeline(debt: Debt): {
  id: string;
  name: string;
  timeline: { monthKey: string; payment: number }[];
} {
  const {
    principal,
    interestRate,
    termMonths,
    interestRateType,
    extraMonthlyPay,
    isRevolving = false,
    startDate,
    id,
    name,
  } = debt;

  const extraPay = extraMonthlyPay ?? 0;
  const rate = interestRate / 100 / (interestRateType === "YEARLY" ? 12 : 1);
  const timeline: { monthKey: string; payment: number }[] = [];

  let remaining = principal;
  let month = 0;
  const baseDate = parseISO(
    typeof startDate === "string" ? startDate : new Date().toISOString()
  );

  if (isRevolving) {
    while (remaining > 0 && month < 600) {
      const interest = remaining * rate;
      const minPay = remaining * 0.05;
      const actualPay = Math.min(remaining + interest, minPay + extraPay);
      const principalPaid = actualPay - interest;
      if (actualPay <= interest) break;

      remaining = Math.max(0, remaining - principalPaid);
      const currentDate = addMonths(baseDate, month);
      timeline.push({
        monthKey: format(currentDate, "yyyy-MM"),
        payment: parseFloat(actualPay.toFixed(2)),
      });
      month++;
    }
  } else {
    const fixedPayment =
      (principal * rate) / (1 - Math.pow(1 + rate, -termMonths)) + extraPay;

    for (let i = 0; i < termMonths && remaining > 0; i++) {
      const interest = remaining * rate;
      const principalPaid = Math.min(remaining, fixedPayment - interest);
      const actualPay = principalPaid + interest;
      remaining = Math.max(0, remaining - principalPaid);
      const currentDate = addMonths(baseDate, i);
      timeline.push({
        monthKey: format(currentDate, "yyyy-MM"),
        payment: parseFloat(actualPay.toFixed(2)),
      });
    }
  }

  return { id, name, timeline };
}

function mergeTimelines(debts: Debt[]): TimelinePoint[] {
  const merged: Record<string, TimelinePoint> = {};

  debts.forEach((debt) => {
    const { id, timeline } = generateDebtTimeline(debt);
    timeline.forEach(({ monthKey, payment }) => {
      if (!merged[monthKey]) merged[monthKey] = { monthKey, totalPayment: 0 };
      merged[monthKey][id] = payment;
    });
  });

  Object.values(merged).forEach((point) => {
    let total = 0;
    debts.forEach((debt) => {
      const val = point[debt.id];
      if (typeof val === "number") total += val;
    });
    point.totalPayment = parseFloat(total.toFixed(2));
  });

  return Object.values(merged).sort(
    (a, b) => new Date(a.monthKey).getTime() - new Date(b.monthKey).getTime()
  );
}

export default function DebtTimelineChart({ debts }: DebtTimelineChartProps) {
  const data = mergeTimelines(debts);

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <BarChart data={data} stackOffset="sign">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthKey" tick={false} />
          <YAxis />
          <Tooltip
            labelFormatter={(key) => format(new Date(key + "-01"), "MMMM yyyy")}
            formatter={(value: any) => `฿${value.toLocaleString()}`}
          />
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
            dataKey="totalPayment"
            stroke="#ff0000"
            strokeWidth={2}
            dot
            strokeDasharray="4 2"
            name="Total Monthly Payment"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
