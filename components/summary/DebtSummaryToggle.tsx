"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Debt } from "@prisma/client";
import { useState } from "react";
import { FaChartPie, FaListUl } from "react-icons/fa"; // React Icons
import DebtPieChart from "./DebtPieChart";
import DebtSummaryDetails from "./DebtSummaryDetails";

interface DebtSummaryToggleProps {
  debts: Debt[];
}

export default function DebtSummaryToggle({ debts }: DebtSummaryToggleProps) {
  const [view, setView] = useState("summary");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">💰 Debt Overview</CardTitle>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => value && setView(value)}
          >
            <ToggleGroupItem value="summary">
              <FaListUl className="w-4 h-4 mr-1" />
              Summary
            </ToggleGroupItem>
            <ToggleGroupItem value="chart">
              <FaChartPie className="w-4 h-4 mr-1" />
              Pie Chart
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {view === "summary" && <DebtSummaryDetails debts={debts} />}
        {view === "chart" && <DebtPieChart debts={debts} />}
      </CardContent>
    </Card>
  );
}
