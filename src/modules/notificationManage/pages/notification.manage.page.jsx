import React, { useState, useMemo } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bell } from "lucide-react";
import { DataTable } from "@/components/shared/datatable";
import { getNotificationColumns } from "@/components/columns/notification.columns";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationList } from "../store/notification.slice";
import { useEffect } from "react";

const mockData = [
  {
    id: 1,
    createDate: "2026-04-12T00:00:00Z",
    message: "Your daily workout is waiting for you...",
  },
  { id: 2, createDate: "2026-04-12T00:00:00Z", message: "Happy Sunday..." },
  { id: 3, createDate: "2026-04-12T00:00:00Z", message: "Fitness Check..." },
  { id: 4, createDate: "2026-04-12T00:00:00Z", message: "Stay active..." },
  {
    id: 5,
    createDate: "2026-04-12T00:00:00Z",
    message: "Stay active today—your body will thank you!...",
  },
  {
    id: 6,
    createDate: "2026-04-12T00:00:00Z",
    message: "Stay active today—your body will thank you!...",
  },
  {
    id: 7,
    createDate: "2026-04-11T00:00:00Z",
    message:
      "Your daily workout is waiting for you! 🏋️‍♀️ Don't miss out on your progress—hit the Fitzone and le...",
  },
  {
    id: 8,
    createDate: "2026-04-11T00:00:00Z",
    message:
      "Your daily workout is waiting for you! 🏋️‍♀️ Don't miss out on your progress—hit the Fitzone and le...",
  },
];

const NotificationManagePage = () => {
  const dispatch = useDispatch();
  const {
    notifications,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.notificationManage);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    dispatch(
      fetchNotificationList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
      }),
    );
  }, [dispatch, pagination.pageIndex, pagination.pageSize, globalFilter]);

  const columns = useMemo(() => getNotificationColumns(), []);

  return (
    <Container>
      <div className="space-y-6">
        {/* Header Title */}
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Manage Notification"
              icon={<Bell className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-brand-aqua/30"
              subheading="Create and manage notifications sent to users."
            />
          </div>
        </Header>

        {/* Add Message Card */}
        <div className="bg-white shadow-sm border border-slate-100">
          {/* Top Header Bar */}
          <div className="bg-brand-blue text-white py-3 text-center font-bold text-[15px]">
            Add Message
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-800">
                Message
              </Label>
              <Textarea
                placeholder="Enter Message Here"
                className="min-h-[120px] bg-white border-slate-200 resize-y"
              />
            </div>

            <div className="flex justify-center pt-2">
              <Button className="bg-brand-blue hover:bg-brand-hoverBlue text-white px-8 font-bold text-xs h-9 rounded-sm flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="pt-2">
          <DataTable
            columns={columns}
            data={notifications || []}
            rowCount={
              serverPagination
                ? serverPagination.total
                : notifications?.length || 0
            }
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search notifications..."
            itemName="entries"
            isLoading={loading}
            manualPagination={!!serverPagination}
            manualFiltering={!!serverPagination}
          />
        </div>
      </div>
    </Container>
  );
};

export default NotificationManagePage;
