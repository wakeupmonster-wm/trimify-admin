import CampaignsDataTables from "@/components/shared/data-tables/campaigns.data.table";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  createCampaign,
  deleteCampaign,
  disableCampaign,
  activateCampaign,
  fetchCampaigns,
  updateCampaign,
} from "../store/campaign.slice";
import {
  bulkCreateCampaign,
  clearGiveawayStatus,
} from "../store/giveaway.slice";
import { campaignColumns } from "@/components/columns/campaignColumns";
import CampaignDialog from "../components/Dialogs/CampaignDialog";
import { fetchPrizes } from "../store/prizes.slice";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "sonner";
import { format, isValid, parseISO } from "date-fns";
import { PageHeader } from "@/components/common/headSubhead";

export default function CampaignsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const { prizes } = useSelector((s) => s.prize);
  const {
    campaigns,
    pagination: reduxPagination,
    loading,
  } = useSelector((s) => s.campaign);
  const { bulkCampaignLoading } = useSelector((s) => s.giveaway);

  // Table & Filter States
  const [pagination, setPagination] = useState(() => {
    const saved = sessionStorage.getItem("campaignsManagementPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });
  const [globalFilter, setGlobalFilter] = useState(
    () => sessionStorage.getItem("campaignsManagementGlobalFilter") || "",
  );
  const [drawStatus, setDrawStatus] = useState(
    () => sessionStorage.getItem("campaignsManagementDrawStatus") || "",
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
      "campaignsManagementPagination",
      JSON.stringify(pagination),
    );
    sessionStorage.setItem("campaignsManagementGlobalFilter", globalFilter);
    sessionStorage.setItem("campaignsManagementDrawStatus", drawStatus);
  }, [pagination, globalFilter, drawStatus]);

  // Form & Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    prizeId: "",
  });

  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    id: null,
    name: "",
    date: "",
  });

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [confirmDisable, setConfirmDisable] = useState({
    isOpen: false,
    id: null,
    name: "",
    date: "",
  });

  const [disableLoading, setDisableLoading] = useState(false);
  const [disableSuccess, setDisableSuccess] = useState(false);

  const [confirmActivate, setConfirmActivate] = useState({
    isOpen: false,
    id: null,
    name: "",
    date: "",
  });

  const [activateLoading, setActivateLoading] = useState(false);
  const [activateSuccess, setActivateSuccess] = useState(false);

  // 1. Fetch Prizes once on mount
  useEffect(() => {
    dispatch(fetchPrizes());
  }, [dispatch]);

  // Fetch instantly on filters/page changes, debounced strictly for search input
  useEffect(() => {
    dispatch(
      fetchCampaigns({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        drawStatus,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    drawStatus,
  ]);

  const resetForm = () => {
    setForm({ title: "", date: "", prizeId: "" });
    setEditingId(null);
  };

  // ─── Bulk Create Handler ───
  const handleBulkSubmit = async (formData) => {
    try {
      const result = await dispatch(
        bulkCreateCampaign({
          // [FIX] formData was being spread flat — backend expects a `ranges` array
          // Old: ...formData (sent { title, startDate, endDate, prizeId } flat)
          // New: wrapped in ranges array to match bulkCreateCampaignByRanges controller
          title: formData.title,
          ranges: [
            {
              startDate: formData.startDate,
              endDate: formData.endDate,
              prizeId: formData.prizeId,
              supportiveItems: formData.supportiveItems || [],
            },
          ],
          isActive: true,
        }),
      ).unwrap();

      const { summary, skippedDates } = result;
      const created = summary?.created || 0;
      const skipped = summary?.skipped || 0;

      const skippedInfo = skippedDates
        ?.map(
          (d) =>
            `${new Date(d.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}: ${d.reason}`,
        )
        .join("\n");

      if (created > 0 && skipped === 0) {
        toast.success(
          `Successfully generated weekly campaigns for all Fridays in the selected range. (${created} total)`,
        );
      } else if (created > 0 && skipped > 0) {
        toast.success(
          `Successfully generated weekly campaigns. (${created} created, ${skipped} non-Fridays/duplicates ignored)`,
          {
            description: skippedInfo,
            duration: 8000,
          },
        );
      } else {
        toast.error(
          `No campaigns created. Ensure selected range includes Fridays.`,
          {
            description: skippedInfo,
            duration: 8000,
          },
        );
      }

      setIsDialogOpen(false);
      // Refresh campaigns list
      dispatch(
        fetchCampaigns({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter,
          drawStatus,
        }),
      );
    } catch (err) {
      toast.error(err || "Bulk campaign creation failed");
    } finally {
      dispatch(clearGiveawayStatus());
    }
  };

  const handleEdit = (campaign) => {
    let dateStr = "";
    if (campaign.date) {
      // Parse the date and format as YYYY-MM-DD for the input
      // Use T12:00:00 to avoid timezone rollback to previous day
      const d = new Date(
        campaign.date + (campaign.date.includes("T") ? "" : "T12:00:00"),
      );
      dateStr = d.toISOString().split("T")[0];
    }
    setForm({
      title: campaign.title || "",
      date: dateStr,
      prizeId: campaign.prize?._id || campaign.prizeId,
    });
    setEditingId(campaign._id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    // Append T12:00:00 to date to prevent timezone rollback
    // e.g., "2026-03-25" → "2026-03-25T12:00:00" (noon local avoids day shift)
    const payload = {
      ...form,
      date: form.date ? `${form.date}T12:00:00` : form.date,
    };

    try {
      if (editingId) {
        const res = await dispatch(
          updateCampaign({ id: editingId, data: payload }),
        ).unwrap();
        toast.success(res.message || "Campaign updated successfully");
      } else {
        const res = await dispatch(createCampaign(payload)).unwrap();
        toast.success(res.message || "Campaign created successfully");
      }
      setIsDialogOpen(false);
      resetForm();

      // Ensure the table automatically refreshes to get fully populated relations (e.g. Prize objects, exact dates)
      dispatch(
        fetchCampaigns({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter,
          drawStatus,
        }),
      );
    } catch (err) {
      toast.error(err);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteClick = (id, name, date) => {
    if (!id) {
      toast.error("Cannot delete: campaign ID is missing");
      return;
    }

    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

    const displayDate = isValid(dateObj)
      ? format(dateObj, "dd MMM, yyyy")
      : "Unknown Date";

    setDeleteLoading(false);
    setDeleteSuccess(false);
    setConfirmDelete({
      isOpen: true,
      id,
      name: name || "Untitled Campaign",
      date: displayDate,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete?.id) {
      toast.error("Invalid campaign ID");
      setConfirmDelete({ isOpen: false, id: null, name: "", date: "" });
      return;
    }
    try {
      setDeleteLoading(true);
      setDeleteSuccess(false);
      await dispatch(deleteCampaign(confirmDelete.id)).unwrap();
      toast.success("Campaign deleted successfully");
      setDeleteSuccess(true);
      setDeleteLoading(false);
      // Re-fetch campaigns to sync UI with backend
      dispatch(
        fetchCampaigns({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter,
          drawStatus,
        }),
      );
      setTimeout(() => {
        setConfirmDelete({ isOpen: false, id: null, name: "", date: "" });
        setDeleteSuccess(false);
      }, 1500);
    } catch (err) {
      setDeleteLoading(false);
      setDeleteSuccess(false);
      toast.error(err || "Failed to delete campaign");
    }
  };

  // Disable Handler
  const handleDisableClick = (id, name, date) => {
    if (!id) {
      toast.error("Cannot disable: campaign ID is missing");
      return;
    }

    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

    const displayDate = isValid(dateObj)
      ? format(dateObj, "dd MMM, yyyy")
      : "Unknown Date";

    setDisableLoading(false);
    setDisableSuccess(false);
    setConfirmDisable({
      isOpen: true,
      id,
      name: name || "Untitled Campaign",
      date: displayDate,
    });
  };

  const handleConfirmDisable = async () => {
    if (!confirmDisable?.id) {
      toast.error("Invalid campaign ID");
      setConfirmDisable({ isOpen: false, id: null, name: "", date: "" });
      return;
    }
    try {
      setDisableLoading(true);
      setDisableSuccess(false);
      await dispatch(disableCampaign(confirmDisable.id)).unwrap();
      toast.success("Campaign disabled successfully");
      setDisableSuccess(true);
      setDisableLoading(false);
      // Re-fetch campaigns to sync UI with backend
      dispatch(
        fetchCampaigns({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter,
          drawStatus,
        }),
      );
      setTimeout(() => {
        setConfirmDisable({ isOpen: false, id: null, name: "", date: "" });
        setDisableSuccess(false);
      }, 1500);
    } catch (err) {
      setDisableLoading(false);
      setDisableSuccess(false);
      toast.error(err || "Failed to disable campaign");
    }
  };

  // Activate Handler
  const handleActivateClick = (id, name, date) => {
    if (!id) {
      toast.error("Cannot activate: campaign ID is missing");
      return;
    }

    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

    const displayDate = isValid(dateObj)
      ? format(dateObj, "dd MMM, yyyy")
      : "Unknown Date";

    setActivateLoading(false);
    setActivateSuccess(false);
    setConfirmActivate({
      isOpen: true,
      id,
      name: name || "Untitled Campaign",
      date: displayDate,
    });
  };

  const handleConfirmActivate = async () => {
    if (!confirmActivate?.id) {
      toast.error("Invalid campaign ID");
      setConfirmActivate({ isOpen: false, id: null, name: "", date: "" });
      return;
    }
    try {
      setActivateLoading(true);
      setActivateSuccess(false);
      await dispatch(activateCampaign(confirmActivate.id)).unwrap();
      toast.success("Campaign activated successfully");
      setActivateSuccess(true);
      setActivateLoading(false);
      // Re-fetch campaigns to sync UI with backend
      dispatch(
        fetchCampaigns({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter,
          drawStatus,
        }),
      );
      setTimeout(() => {
        setConfirmActivate({ isOpen: false, id: null, name: "", date: "" });
        setActivateSuccess(false);
      }, 1500);
    } catch (err) {
      setActivateLoading(false);
      setActivateSuccess(false);
      toast.error(err || "Failed to activate campaign");
    }
  };

  // View Handler — navigate to detail page
  const handleView = (campaign) => {
    const id = campaign._id || campaign.id;
    if (id) {
      navigate(`view-campaign/${id}`, {
        state: { campaignId: id },
      });
    } else {
      toast.error("Invalid campaign ID");
    }
  };

  const columns = useMemo(
    () =>
      campaignColumns(
        handleEdit,
        handleDeleteClick,
        handleDisableClick,
        handleActivateClick,
        handleView,
        pagination.pageIndex + 1,
        pagination.pageSize,
      ),
    [
      handleEdit,
      handleDeleteClick,
      handleDisableClick,
      handleActivateClick,
      handleView,
      pagination.pageIndex,
      pagination.pageSize,
    ],
  );

  // console.log("confirmActivate: ", confirmActivate)

  return (
    <div className="relative w-full py-4 space-y-4 sm:space-y-6 min-h-[500px] max-w-[100vw] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <PageHeader
          heading="Campaigns"
          icon={
            <LayoutDashboard
              className="h-4 w-4 sm:h-5 sm:w-5 text-white"
              strokeWidth={2.5}
            />
          }
          color="bg-brand-aqua shadow-brand-aqua/40"
          subheading="Manage your giveaway campaigns"
        />
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-slate-50 hover:bg-brand-aqua border hover:border-none text-xs text-slate-500 hover:text-white font-semibold gap-2 h-10 px-2 shadow-sm transition-all duration-300"
        >
          <Plus className="h-4 w-4" /> Create New Campaign
        </Button>
      </div>

      <div className="overflow-hidden">
        <CampaignsDataTables
          columns={columns}
          data={campaigns || []}
          rowCount={reduxPagination?.total ?? 0}
          isLoading={loading}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={(val) => {
            setGlobalFilter(val);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          searchPlaceholder="Search by title..."
          filters={{
            drawStatus,
            setDrawStatus: (val) => {
              setDrawStatus(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
          }}
        />
      </div>

      {/* Dialogs */}
      <CampaignDialog
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
        form={form}
        setForm={setForm}
        prizes={prizes}
        campaigns={campaigns}
        onSubmit={handleSubmit}
        loading={loading}
        isEditing={!!editingId}
        onBulkSubmit={handleBulkSubmit}
        bulkLoading={bulkCampaignLoading}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => {
          if (deleteLoading || deleteSuccess) return;
          setConfirmDelete((prev) => ({ ...prev, isOpen: false }));
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Campaign"
        message={`Are you sure you want to delete the campaign "${confirmDelete.name}" scheduled for ${confirmDelete.date}?`}
        confirmText="Delete Permanently"
        type="danger" // This usually makes the button red in a reusable ConfirmModal
        loading={deleteLoading}
        success={deleteSuccess}
      />

      {/* Confirm Disable Dialog */}
      <ConfirmModal
        isOpen={confirmDisable.isOpen}
        onClose={() => {
          if (disableLoading || disableSuccess) return;
          setConfirmDisable((prev) => ({ ...prev, isOpen: false }));
        }}
        onConfirm={handleConfirmDisable}
        title="Disable Campaign"
        message={`Are you sure you want to disable the campaign "${confirmDisable.name}" scheduled for ${confirmDisable.date}?`}
        confirmText="Disable Campaign"
        type="warning"
        loading={disableLoading}
        success={disableSuccess}
      />

      {/* Confirm Activate Dialog */}
      <ConfirmModal
        isOpen={confirmActivate.isOpen}
        onClose={() => {
          if (activateLoading || activateSuccess) return;
          setConfirmActivate((prev) => ({ ...prev, isOpen: false }));
        }}
        onConfirm={handleConfirmActivate}
        title="Activate Campaign"
        message={`Are you sure you want to activate the campaign "${confirmActivate.name}" scheduled for ${confirmActivate.date}?`}
        confirmText="Activate Campaign"
        type="success"
        loading={activateLoading}
        success={activateSuccess}
      />
    </div>
  );
}
