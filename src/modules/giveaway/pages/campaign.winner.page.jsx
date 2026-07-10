import { getWinnerColumns } from "@/components/columns/winnerColumns";
import WinnerDataTables from "@/components/shared/data-tables/winner.data.table";
import { Award, CheckCircle2, Clock, Layers, Users } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { fetchWinner } from "../store/winner.slice";
import { useDispatch, useSelector } from "react-redux";
import { PageHeader } from "@/components/common/headSubhead";
import { LuUsersRound } from "react-icons/lu";

export default function CampaignWinnerPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const {
    winner,
    stats,
    pagination: reduxPagination,
    loading,
  } = useSelector((s) => s.winner);

  // States
  const [pagination, setPagination] = useState(() => {
    const saved = sessionStorage.getItem("campaignWinnerManagementPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });
  const [globalFilter, setGlobalFilter] = useState(
    () => sessionStorage.getItem("campaignWinnerManagementGlobalFilter") || "",
  );
  const [statusFilter, setStatusFilter] = useState(
    () => sessionStorage.getItem("campaignWinnerManagementStatusFilter") || "",
  );

  // Debounced search term state to prevent input typing lag
  const [debouncedSearch, setDebouncedSearch] = useState(globalFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter);
    }, 400);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Save to sessionStorage whenever filters change
  useEffect(() => {
    sessionStorage.setItem(
      "campaignWinnerManagementPagination",
      JSON.stringify(pagination),
    );
    sessionStorage.setItem(
      "campaignWinnerManagementGlobalFilter",
      globalFilter,
    );
    sessionStorage.setItem(
      "campaignWinnerManagementStatusFilter",
      statusFilter,
    );
  }, [pagination, globalFilter, statusFilter]);

  // 1. Fetch Data (executes instantly on filter/page changes, debounced strictly for search input)
  useEffect(() => {
    dispatch(
      fetchWinner({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        status: statusFilter,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    statusFilter,
  ]);

  const columns = useMemo(
    () =>
      getWinnerColumns(pagination.pageIndex + 1, pagination.pageSize, navigate),
    [pagination.pageIndex, pagination.pageSize, navigate],
  );

  // --- Stats Configuration ---
  const statCards = [
    {
      label: "Total Campaigns",
      value: stats?.totalCampaigns || 0,
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
    },
    {
      label: "Completed",
      value: stats?.completed || 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
    },
    {
      label: "Pending",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50/50",
    },
    {
      label: "Winners",
      value: stats?.withWinner || 0,
      icon: LuUsersRound,
      color: "text-indigo-600",
      bg: "bg-indigo-50/50",
    },
  ];

  return (
    <div className="relative py-4 space-y-6 min-h-[500px]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          heading="Campaign Winners"
          icon={<Award className="h-5 w-5 text-white" />}
          color="bg-brand-aqua shadow-brand-aqua/40"
          subheading="Track all giveaway results"
        />
      </header>

      {/* STATS BADGES SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all"
          >
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {card.label}
              </p>
              <h3 className="text-xl font-bold text-slate-900">
                {loading ? "..." : card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden">
        <WinnerDataTables
          columns={columns}
          data={winner || []}
          rowCount={reduxPagination?.total ?? 0}
          isLoading={loading}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={(val) => {
            setGlobalFilter(val);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          searchPlaceholder="Search by campaign name, prize, phone..."
          filters={{
            statusFilter,
            setStatusFilter: (val) => {
              setStatusFilter(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
          }}
        />
      </div>

      {/* Confirm Delete Dialog */}
      {/* <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Campaign"
        message={`Are you sure you want to delete the campaign for ${confirmDelete.title}?`}
        confirmText="Delete Permanently"
        type="danger" // This usually makes the button red in a reusable ConfirmModal
        loading={loading}
      /> */}
    </div>
  );
}
