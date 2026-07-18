import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/headSubhead";
import { Inbox } from "lucide-react";
import SupportTicketsDataTables from "@/components/shared/data-tables/support.ticket.data.table";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  adminReplyToTicket,
  clearSupportStatus,
  fetchMyTickets,
  deleteTicket,
} from "../store/support.slice";
import { supportColumns } from "@/components/columns/support.columns";
import { TicketAction } from "../components/dialogs/tickets.action";
import ConfirmModal from "@/components/common/ConfirmModal";
import { ImagePreviewModal } from "../components/image.preview.modal";
import {
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconTicket,
} from "@tabler/icons-react";
import StatsGrid from "@/components/common/stats.grid";
import { bgMap, colorMap } from "@/constants/colors";
import { Container } from "@/components/common/container";
import { FiLoader } from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function SupportTicketsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    tickets,
    pagination: reduxPagination,
    kpiStats,
    loading,
  } = useSelector((s) => s.support);
  const [success, setSuccess] = useState(false);

  // 2. Local Filter/Pagination State
  const [globalFilter, setGlobalFilter] = useState(
    () => sessionStorage.getItem("supportManagementGlobalFilter") || "",
  );
  const [statusFilter, setStatusFilter] = useState(
    () => sessionStorage.getItem("supportManagementStatusFilter") || "",
  );
  const [categoryFilter, setCategoryFilter] = useState(
    () => sessionStorage.getItem("supportManagementCategoryFilter") || "",
  );
  const [pagination, setPagination] = useState(() => {
    const saved = sessionStorage.getItem("supportManagementPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });

  // Debounced search term state to prevent input typing lag
  const [debouncedSearch, setDebouncedSearch] = useState(globalFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Save to sessionStorage whenever filters change
  useEffect(() => {
    if (globalFilter) {
      sessionStorage.setItem("supportManagementGlobalFilter", globalFilter);
    } else {
      sessionStorage.removeItem("supportManagementGlobalFilter");
    }

    if (statusFilter) {
      sessionStorage.setItem("supportManagementStatusFilter", statusFilter);
    } else {
      sessionStorage.removeItem("supportManagementStatusFilter");
    }

    if (categoryFilter) {
      sessionStorage.setItem("supportManagementCategoryFilter", categoryFilter);
    } else {
      sessionStorage.removeItem("supportManagementCategoryFilter");
    }

    if (
      pagination &&
      (pagination.pageIndex !== 0 || pagination.pageSize !== 10)
    ) {
      sessionStorage.setItem(
        "supportManagementPagination",
        JSON.stringify(pagination),
      );
    } else {
      sessionStorage.removeItem("supportManagementPagination");
    }
  }, [globalFilter, statusFilter, categoryFilter, pagination]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [reply, setReply] = useState("");

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    ticketId: null,
    nickname: "",
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const [imageModal, setImageModal] = useState({
    open: false,
    src: "",
    title: "",
  });

  // --- Optimized Stats Calculation ---
  const ticketStats = useMemo(() => {
    return [
      {
        label: "Total Tickets",
        val: kpiStats?.totalTickets || 0,
        icon: <IconTicket size={22} />, // Represents the whole collection
        color: "blue",
        description: "All tickets in system",
      },
      {
        label: "Open",
        val: kpiStats?.openTickets || 0,
        icon: <IconExclamationCircle size={22} />, // Represents something needing attention
        color: "indigo",
        description: "Awaiting assignment",
      },
      {
        label: "In Progress",
        val: kpiStats?.inProgressTickets || 0,
        icon: <FiLoader size={22} />, // Represents active work
        color: "emerald",
        description: "Currently being handled",
      },
      {
        label: "Resolved",
        val: kpiStats?.resolvedTickets || 0,
        icon: <IconCircleCheck size={22} />, // Represents successful completion
        color: "amber",
        description: "Fixed, pending closure",
      },
      {
        label: "Closed",
        val: kpiStats?.closedTickets || 0,
        icon: <IconCircleX size={22} />, // Represents finalized/archived
        color: "rose",
        description: "Finalized tickets",
      },
    ];
  }, [kpiStats]);

  useEffect(() => {
    dispatch(
      fetchMyTickets({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        status: statusFilter,
        category: categoryFilter,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    statusFilter,
    categoryFilter,
  ]);

  useEffect(() => {
    const initialFilter = location?.state;
    if (!initialFilter) return;

    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    if (initialFilter === "Tickets") setStatusFilter("open");
  }, [location?.state]);

  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, location.state]);

  useEffect(() => {
    if (selectedTicket) {
      setStatusUpdate(selectedTicket.status);
      setReply(""); // Clear previous reply
    }
  }, [selectedTicket]);

  const columns = useMemo(
    () =>
      supportColumns(
        (modalConfig) => setImageModal(modalConfig), // Ye second parameter hai
      ),
    [], // Dependencies: Sirf navigate agar setImageModal stable hai
  );

  const handleActionSubmit = async () => {
    if (!reply.trim()) return false;

    try {
      const resultAction = await dispatch(
        adminReplyToTicket({
          ticketId: selectedTicket._id,
          reply: reply,
          status: statusUpdate,
        }),
      );

      if (adminReplyToTicket.fulfilled.match(resultAction)) {
        setReply("");

        dispatch(
          fetchMyTickets({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: globalFilter,
            status: statusFilter,
          }),
        );

        setTimeout(() => dispatch(clearSupportStatus()), 3000);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update ticket:", error);
      return false;
    }
  };

  const handleConfirmAction = async () => {
    if (confirmConfig.action === "delete") {
      setIsDeleting(true);
      try {
        const resultAction = await dispatch(
          deleteTicket(confirmConfig.ticketId),
        );
        if (deleteTicket.fulfilled.match(resultAction)) {
          toast.success("Ticket deleted successfully");
          // Refetch to update KPIs and pagination correctly
          dispatch(
            fetchMyTickets({
              page: pagination.pageIndex + 1,
              limit: pagination.pageSize,
              search: globalFilter,
              status: statusFilter,
            }),
          );
          setConfirmConfig({ ...confirmConfig, isOpen: false });
        } else {
          toast.error("Failed to delete ticket");
        }
      } catch (error) {
        toast.error("An error occurred while deleting");
      } finally {
        setIsDeleting(false);
      }
    } else {
      setConfirmConfig({ ...confirmConfig, isOpen: false });
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div className="w-full">
            <PageHeader
              heading="Support Management"
              icon={<Inbox className="w-9 h-9 text-white" />}
              color="bg-app-primary2 shadow-brand-blue-500/20"
              subheading="Track and manage customer queries."
            />
          </div>
        </header>

        {/* --- STATS GRID (Staggered) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsGrid
            stats={ticketStats.filter((stat) => stat.label !== "Closed")}
            colorMap={colorMap}
            bgMap={bgMap}
            onCardClick={(label) => {
              // Reset filters first
              setStatusFilter("");
              setGlobalFilter("");

              if (label === "Open") {
                setStatusFilter("open");
              } else if (label === "In Progress") {
                setStatusFilter("in_progress");
              } else if (label === "Closed") {
                setStatusFilter("closed");
              } else if (label === "Resolved") {
                setStatusFilter("resolved");
              }
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        </div>

        <SupportTicketsDataTables
          columns={columns}
          data={tickets || []}
          rowCount={reduxPagination?.total ?? 0}
          isLoading={loading}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={(val) => {
            setGlobalFilter(val);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          searchPlaceholder="Search by name, subject or email..."
          filters={{
            statusFilter,
            setStatusFilter: (val) => {
              (setStatusFilter(val),
                setPagination((prev) => ({ ...prev, pageIndex: 0 })));
            },
            categoryFilter,
            setCategoryFilter: (val) => {
              setCategoryFilter(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            setGlobalFilter,
            setPagination,
          }}
          meta={{
            setSelectedTicket: (ticket) => setSelectedTicket(ticket),
            setConfirmConfig, // Pass this to the columns
            setImageModal: (config) => setImageModal(config),
          }}
        />

        <TicketAction
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          statusUpdate={statusUpdate}
          setStatusUpdate={setStatusUpdate}
          reply={reply}
          setReply={setReply}
          handleActionSubmit={handleActionSubmit}
          loading={loading}
        />
      </div>

      {/* // Add this before the final </div> of your return statement */}
      <ImagePreviewModal
        config={imageModal}
        onClose={() => setImageModal({ ...imageModal, open: false })}
      />

      {/* Updated ConfirmModal UI */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={handleConfirmAction}
        success={success}
        title={"Delete Ticket?"}
        message={`Are you sure you want to delete the ticket from ${confirmConfig.nickname}? This action is permanent and cannot be undone.`}
        confirmText={"Delete Permanently"}
        type={"danger"}
        loading={isDeleting}
      />
    </Container>
  );
}
