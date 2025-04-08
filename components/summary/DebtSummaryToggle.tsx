"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
              <ToggleGroupItem value="chart" className="flex-1 justify-center">
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

            {view === "summary" && <DebtSummaryDetails debts={debts} />}
            {view === "chart" && <DebtPieChart debts={debts} />}
            {view === "timeline" && debts.length > 0 && (
              <DebtTimelineChart debt={debts[0]} />
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
