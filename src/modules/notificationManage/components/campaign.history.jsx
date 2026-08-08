import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  IconChartBar,
  IconMail,
  IconDeviceMobile,
  IconX,
} from "@tabler/icons-react";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCampaignDeliveryReport,
  clearCampaignLogs,
} from "../store/campaigns.slice";
import { DataTable } from "@/components/shared/datatable";
import { getNotificationColumns } from "@/components/columns/notification.columns";
import CampaignDeliveryLogs from "./campaign.delivery.logs";

export default function CampaignHistory({
  history,
  pagination,
  paginationState,
  onPaginationChange,
  channelFilter,
  setChannelFilter,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  pinnedTotalCampaigns,
}) {
  const dispatch = useDispatch();
  const { loading, campaignLogs, logsLoading } = useSelector(
    (state) => state.campaigns,
  );

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  const closeLogsModal = () => {
    setIsLogsModalOpen(false);
    setSelectedCampaign(null);
    dispatch(clearCampaignLogs());
  };

  const handleViewLogs = (channel, campaign) => {
    setSelectedCampaign(campaign);
    setIsLogsModalOpen(true);
    dispatch(fetchCampaignDeliveryReport({ channel, id: campaign.id }));
  };

  const columns = useMemo(
    () => getNotificationColumns({ statusFilter, handleViewLogs }),
    [statusFilter],
  );

  const kpiItems = useMemo(() => {
    const handleKpiClick = (channel) => {
      setSearchTerm("");
      setChannelFilter(channel);
      setStatusFilter("all");
      onPaginationChange((prev) => ({ ...prev, pageIndex: 0 }));
    };

    return [
      {
        label: "Total Campaigns",
        value: pinnedTotalCampaigns ?? pagination?.total ?? 0,
        icon: IconChartBar,
        tone: "blue",
        description: "Overall campaigns",
        onClick: () => handleKpiClick("all"),
        isSelected: channelFilter === "all",
      },
      {
        label: "Emails Dispatched",
        value: pagination?.emailCount || 0,
        icon: IconMail,
        tone: "email",
        description: "Email communications",
        onClick: () => handleKpiClick("email"),
        isSelected: channelFilter === "email",
      },
      {
        label: "Pushes Dispatched",
        value: pagination?.pushCount || 0,
        icon: IconDeviceMobile,
        tone: "push",
        description: "Mobile notifications",
        onClick: () => handleKpiClick("push"),
        isSelected: channelFilter === "push",
      },
    ];
  }, [
    pagination,
    channelFilter,
    pinnedTotalCampaigns,
    setSearchTerm,
    setChannelFilter,
    setStatusFilter,
    onPaginationChange,
  ]);

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <Card className="bg-white gap-5 border border-slate-200 rounded-xl shadow-sm overflow-hidden py-2">
        {/* Section Header */}
        <div className="px-6 space-y-1 py-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Campaign History Overview
          </h2>
          <p className="text-xs text-slate-500 font-medium ml-1">
            Log of all previously dispatched push and email campaigns with
            performance metrics
          </p>
        </div>

        <div className="px-6 pb-4">
          {/* History KPIs */}
          <ModuleKpiRow
            items={kpiItems}
            loading={loading && !history?.length}
          />
        </div>
      </Card>

      {/* History Table (Dynamic Data Table) */}
      <div className="pt-2">
        <DataTable
          columns={columns}
          data={history || []}
          rowCount={pagination?.total || history?.length || 0}
          pagination={paginationState}
          onPaginationChange={onPaginationChange}
          globalFilter={searchTerm}
          setGlobalFilter={setSearchTerm}
          searchPlaceholder="Search campaigns..."
          itemName="campaigns"
          isLoading={loading}
          manualPagination={true}
          manualFiltering={true}
          toolbarChildren={
            <>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-200 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all text-xs w-full sm:w-auto">
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs rounded-lg">
                    All Channels
                  </SelectItem>
                  <SelectItem value="email" className="text-xs rounded-lg">
                    Email
                  </SelectItem>
                  <SelectItem value="push" className="text-xs rounded-lg">
                    Push
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-200 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all text-xs w-full sm:w-auto">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs rounded-lg">
                    All Status
                  </SelectItem>
                  <SelectItem value="processing" className="text-xs rounded-lg">
                    Processing
                  </SelectItem>
                  <SelectItem value="completed" className="text-xs rounded-lg">
                    Completed
                  </SelectItem>
                  <SelectItem value="failed" className="text-xs rounded-lg">
                    Failed
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          }
          activeFiltersChildren={
            (channelFilter !== "all" || statusFilter !== "all") && (
              <>
                {channelFilter !== "all" && (
                  <Badge
                    variant="outline"
                    className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-200 text-slate-600 rounded-md flex items-center"
                  >
                    <span className="text-[10px] font-bold uppercase opacity-50">
                      Channel:
                    </span>
                    <span className="capitalize text-[11px] font-semibold">
                      {channelFilter}
                    </span>
                    <button
                      onClick={() => setChannelFilter("all")}
                      className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                    >
                      <IconX size={10} />
                    </button>
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge
                    variant="outline"
                    className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-200 text-slate-600 rounded-md flex items-center"
                  >
                    <span className="text-[10px] font-bold uppercase opacity-50">
                      Status:
                    </span>
                    <span className="capitalize text-[11px] font-semibold">
                      {statusFilter}
                    </span>
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                    >
                      <IconX size={10} />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[10px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 uppercase tracking-tight px-2 rounded-lg"
                  onClick={() => {
                    setChannelFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Clear All
                </Button>
              </>
            )
          }
        />
      </div>

      {/* DELIVERY LOGS MODAL */}
      <CampaignDeliveryLogs
        isOpen={isLogsModalOpen}
        onClose={closeLogsModal}
        campaign={selectedCampaign}
        logs={campaignLogs}
        loading={logsLoading}
      />
    </div>
  );
}
