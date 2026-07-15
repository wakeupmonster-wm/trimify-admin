import React, { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DashboardHead from "./dashboard.head";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PiCurrencyDollarBold } from "react-icons/pi";

export function RevenueTrendChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || !data.revenueTrend) return [];
    return data.revenueTrend.map(d => ({
      ...d,
      revenue: parseFloat(d.revenue) || 0,
      displayDate: d.date // The backend now provides formatted date labels
    }));
  }, [data]);

  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <Card className="rounded-xl border border-slate-200 hover:border-brand-aqua/50 transition-all duration-300 shadow-sm py-5 bg-white overflow-hidden flex flex-col h-full gap-0">
      <CardHeader className="flex flex-col px-0 tracking-tight shrink-0">
        <div className="w-full flex items-center justify-between gap-2 pb-4 px-5 border-b border-slate-200">
          <DashboardHead
            title="Revenue Trend"
            subtitle="Daily revenue generation"
            Icon={PiCurrencyDollarBold}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-500">Total</span>
            <span className="text-xl font-bold text-slate-900">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-end px-4 pb-2 mt-4 relative">
        {chartData.length === 0 ? (
          <div className="h-[220px] w-full flex flex-col items-center justify-center text-slate-400 gap-2 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <PiCurrencyDollarBold className="w-10 h-10" />
            <p className="text-[11px] font-medium tracking-wide">
              No revenue data available
            </p>
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 11 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  formatter={(value, name) => {
                    if (name === "revenue") return [`$${value.toFixed(2)}`, "Revenue"];
                    if (name === "transactions") return [value, "Transactions"];
                    return [value, name];
                  }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
