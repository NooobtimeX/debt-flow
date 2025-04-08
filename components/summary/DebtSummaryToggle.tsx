"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Debt } from "@prisma/client";
import { useState } from "react";
import {
  FaChartLine,
  FaChartPie,
  FaChevronDown,
  FaChevronUp,
  FaListUl,
} from "react-icons/fa";
import DebtPieChart from "./DebtPieChart";
import DebtSummaryDetails from "./DebtSummaryDetails";
import DebtTimelineChart from "./DebtTimelineChart";

interface DebtSummaryToggleProps {
  debts: Debt[];
}

export default function DebtSummaryToggle({ debts }: DebtSummaryToggleProps) {
  const [view, setView] = useState("summary");
  const [open, setOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">💰 Debt Overview</CardTitle>
              <CollapsibleTrigger className="text-blue-600">
                {open ? (
                  <FaChevronUp className="w-4 h-4" />
                ) : (
                  <FaChevronDown className="w-4 h-4" />
                )}
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {isDesktop ? (
              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(value) => value && setView(value)}
                className="w-full mb-4"
              >
                <ToggleGroupItem
                  value="summary"
                  className="flex-1 justify-center"
                >
                  <FaListUl className="w-4 h-4 mr-1" />
                  Summary
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="chart"
                  className="flex-1 justify-center"
                >
                  <FaChartPie className="w-4 h-4 mr-1" />
                  Pie Chart
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="timeline"
                  className="flex-1 justify-center"
                >
                  <FaChartLine className="w-4 h-4 mr-1" />
                  Timeline
                </ToggleGroupItem>
              </ToggleGroup>
            ) : (
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="w-full mb-4 border rounded-md px-3 py-2 text-sm"
              >
                <option value="summary">📋 Summary</option>
                <option value="chart">📊 Pie Chart</option>
                <option value="timeline">📈 Timeline</option>
              </select>
            )}

            {view === "summary" && <DebtSummaryDetails debts={debts} />}
            {view === "chart" && <DebtPieChart debts={debts} />}
            {view === "timeline" && <DebtTimelineChart debts={debts} />}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
