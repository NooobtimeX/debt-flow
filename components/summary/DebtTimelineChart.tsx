"use client";

import { Debt } from "@prisma/client";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DebtTimelineChartProps {
  debt: Debt;
}

interface TimelinePoint {
  month: number;
  remaining: number;
}

function generatePaymentTimeline(
  principal: number,
  interestRate: number,
  months: number,
  type: "MONTHLY" | "YEARLY"
): TimelinePoint[] {
  const rate = interestRate / 100 / (type === "YEARLY" ? 12 : 1);
  const payment = (principal * rate) / (1 - Math.pow(1 + rate, -months));

  const timeline: TimelinePoint[] = [];
  let remaining = principal;

  for (let i = 1; i <= months; i++) {
    const interest = remaining * rate;
    const principalPaid = payment - interest;
    remaining = Math.max(0, remaining - principalPaid);

    timeline.push({
      month: i,
      remaining: parseFloat(remaining.toFixed(2)),
    });
  }

  return timeline;
}

export default function DebtTimelineChart({ debt }: DebtTimelineChartProps) {
  const data = generatePaymentTimeline(
    debt.principal,
    debt.interestRate,
    debt.termMonths,
    debt.interestRateType
  );

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="remaining"
            stroke="#8884d8"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
