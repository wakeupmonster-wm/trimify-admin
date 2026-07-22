import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from "lucide-react";

export function PerformanceInsights({ data }) {
  if (!data) return null;

  return (
    <Card className="flex flex-col h-full bg-white border border-slate-300/60 hover:border-brand-blue transition-all duration-300 shadow-sm rounded-2xl">
      <CardHeader className="pb-4 gap-1">
        <CardTitle className="text-base font-bold text-primary">
          Performance Insights
        </CardTitle>
        <CardDescription className="text-[11px] font-medium text-muted-foreground">
          What's working, what needs focus
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-5">
        {data.metrics.map((metric, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-bold text-slate-700">
                {metric.label}
              </span>
              <span className="text-[14px] font-black text-slate-900">
                {metric.value}
              </span>
            </div>
            <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              {/* Custom progress implementation to support dynamic colors more easily while staying shadcn-like */}
              <div
                className="h-full rounded-full transition-all duration-1000 ease-in-out"
                style={{
                  width: `${metric.percentage}%`,
                  backgroundColor: metric.color,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="pt-2">
        <div className="mt-2 w-full flex items-center gap-2 px-3 py-2 bg-app-primary2 border border-brand-blue rounded-xl text-muted-foreground text-[10px] font-bold">
          <div className="w-5 h-5 rounded-full flex items-center justify-center">
            <Info size={14} className="text-brand-blue shrink-0" />
          </div>
          {data.insight}
        </div>
      </CardFooter>
    </Card>
  );
}
