import React from "react";
import { Box, Package } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";

export default function BestSellingProductsList({
  bestSellingProducts,
  bestSellingProductsTotalRevenue,
  isBestSellingProductsEmpty,
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden h-[440px] flex flex-col">
      <div className="px-5 py-4 border-b border-slate-300/60 flex items-center gap-[10px]">
        <DashboardHead
          title="Top Selling Products"
          subtitle="Highest performing packages"
          Icon={Box}
          iconColor="text-slate-600"
          iconBg="bg-slate-100/50"
        />
      </div>
      <div className="p-5 flex-1 overflow-y-auto flex flex-col">
        {isBestSellingProductsEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#9CA3AF]">
            <Package className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-bold text-center">
              No product data available
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {(bestSellingProducts || []).map((product, idx) => {
              // const styleMap = [
              //   {
              //     bg: "linear-gradient(135deg, #14B8A6, #0D9488)",
              //     text: "white",
              //     pctCol: "text-[#14B8A6]",
              //   },
              //   {
              //     bg: "#EFF6FF",
              //     text: "#3B82F6",
              //     pctCol: "text-[#3B82F6]",
              //   },
              //   {
              //     bg: "#FFF7ED",
              //     text: "#F97316",
              //     pctCol: "text-[#F97316]",
              //   },
              //   {
              //     bg: "#F5F3FF",
              //     text: "#8B5CF6",
              //     pctCol: "text-[#8B5CF6]",
              //   },
              // ];
              const styleMap = [
                {
                  bg: "linear-gradient(135deg, #007FC0, #04365F)",
                  text: "white",
                  pctCol: "text-[#007FC0]",
                },
                {
                  bg: "#E7F7F4",
                  text: "#15B097",
                  pctCol: "text-[#15B097]",
                },
                {
                  bg: "#FCEFE5",
                  text: "#DC6B1B",
                  pctCol: "text-[#DC6B1B]",
                },
                {
                  bg: "#FDF5EB",
                  text: "#EDA145",
                  pctCol: "text-[#EDA145]",
                },
              ];
              const style = styleMap[idx % styleMap.length];

              const pct =
                bestSellingProductsTotalRevenue > 0
                  ? (
                      ((product.revenue || 0) /
                        bestSellingProductsTotalRevenue) *
                      100
                    ).toFixed(1)
                  : "0.0";

              return (
                <div
                  key={idx}
                  className="flex items-center gap-[14px] p-[14px] rounded-[12px] border border-slate-300/60 bg-white transition-all duration-200 hover:border-[#14B8A6]"
                >
                  <div
                    className="w-[32px] h-[32px] rounded-[10px] flex items-center justify-center text-[13px] font-extrabold shrink-0"
                    style={{ background: style.bg, color: style.text }}
                  >
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1F2937] truncate">
                      {product.displayName
                        ? String(product.displayName)
                            .split(".")
                            .pop()
                            .replace(/_/g, " ")
                        : "Unknown Product"}
                    </p>
                    <p className="text-[11px] font-medium text-[#9CA3AF] mt-[2px]">
                      {product.salesCount} sales{" "}
                      {product.productType ? `${product.productType}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] font-extrabold text-[#1F2937]">
                      {product.revenue !== undefined
                        ? typeof product.revenue === "number"
                          ? `$${product.revenue.toFixed(2)}`
                          : `$${product.revenue}`
                        : "—"}
                    </p>
                    <p className={`text-[10px] font-semibold ${style.pctCol}`}>
                      {pct}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
