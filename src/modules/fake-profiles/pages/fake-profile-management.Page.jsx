import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { IconUsersPlus } from "@tabler/icons-react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/headSubhead";
import StatsGrid from "@/components/common/stats.grid";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  fetchFakeProfiles,
  bulkCreateFakeProfiles,
  toggleFakeProfileStatus,
  deleteFakeProfile,
  fetchCities,
  addCity,
  deleteCustomCity,
} from "../store/fake-profile.slice";
import { fakeProfileColumns } from "../components/fake-profile-columns";
import { BulkCreateModal } from "../components/bulk-create-modal";
import { CityManagementModal } from "../components/city-management-modal";
import FakeProfileDataTable from "@/components/shared/data-tables/fake.profile.data.table";
import { Container } from "@/components/common/container";
import { LuUserRoundCheck, LuUserRoundX, LuUsersRound } from "react-icons/lu";
import { RiUserUnfollowLine } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import { SlUserFemale } from "react-icons/sl";
import { PreLoader } from "@/app/loader/preloader";

// ─── Animation variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export default function FakeProfileManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    items = [],
    pagination: serverPagination,
    kpiStats,
    loading,
    bulkLoading,
    cities,
    citiesLoading,
  } = useSelector((state) => state.fakeProfiles);

  // ─── Local UI State ───
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [newlyAddedCity, setNewlyAddedCity] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = useState(false);
  const [toggleTarget, setToggleTarget] = useState(null); // { id, status }
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // ─── Pagination ───
  const [pagination, setPagination] = useState(() => {
    const saved = sessionStorage.getItem("fakeProfileManagementPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });

  // ─── Filters ───
  const [search, setSearch] = useState(
    () => sessionStorage.getItem("fakeProfileManagementSearch") || "",
  );
  const [statusFilter, setStatusFilter] = useState(
    () => sessionStorage.getItem("fakeProfileManagementStatusFilter") || "",
  );
  const [genderFilter, setGenderFilter] = useState(
    () => sessionStorage.getItem("fakeProfileManagementGenderFilter") || "",
  );
  const [planFilter, setPlanFilter] = useState(
    () => sessionStorage.getItem("fakeProfileManagementPlanFilter") || "",
  );

  // ─── Sorting ───
  const [sorting, setSorting] = useState(() => {
    const saved = sessionStorage.getItem("fakeProfileManagementSorting");
    return saved ? JSON.parse(saved) : [];
  });

  // Debounced search state to prevent input typing lag
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Fetch Cities on Mount
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  // Clear location state once it has been consumed on mount
  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, location.state]);

  useEffect(() => {
    if (search && pagination.pageIndex !== 0) {
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Save to sessionStorage whenever filters change
  useEffect(() => {
    if (pagination && (pagination.pageIndex !== 0 || pagination.pageSize !== 10)) {
      sessionStorage.setItem("fakeProfileManagementPagination", JSON.stringify(pagination));
    } else {
      sessionStorage.removeItem("fakeProfileManagementPagination");
    }

    if (search) {
      sessionStorage.setItem("fakeProfileManagementSearch", search);
    } else {
      sessionStorage.removeItem("fakeProfileManagementSearch");
    }

    if (statusFilter) {
      sessionStorage.setItem("fakeProfileManagementStatusFilter", statusFilter);
    } else {
      sessionStorage.removeItem("fakeProfileManagementStatusFilter");
    }

    if (genderFilter) {
      sessionStorage.setItem("fakeProfileManagementGenderFilter", genderFilter);
    } else {
      sessionStorage.removeItem("fakeProfileManagementGenderFilter");
    }

    if (planFilter) {
      sessionStorage.setItem("fakeProfileManagementPlanFilter", planFilter);
    } else {
      sessionStorage.removeItem("fakeProfileManagementPlanFilter");
    }

    if (sorting && sorting.length > 0) {
      sessionStorage.setItem("fakeProfileManagementSorting", JSON.stringify(sorting));
    } else {
      sessionStorage.removeItem("fakeProfileManagementSorting");
    }
  }, [pagination, search, statusFilter, genderFilter, planFilter, sorting]);

  // ─── Fetch instantly on filters/sorting/page changes, debounced strictly for search ───
  useEffect(() => {
    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter) params.status = statusFilter;
    if (genderFilter) params.gender = genderFilter;
    if (planFilter) params.isPremium = planFilter === "premium" ? "true" : "false";
    if (sorting.length > 0) {
      const sortMap = {
        user: "nickname",
        gender: "gender",
        city: "city",
        status: "accountStatus",
        createdAt: "createdAt",
      };
      params.sortBy = sortMap[sorting[0].id] || "createdAt";
      params.sortOrder = sorting[0].desc ? "desc" : "asc";
    }

    dispatch(fetchFakeProfiles(params)).finally(() => {
      setIsInitialLoad(false);
    });
  }, [dispatch, pagination, debouncedSearch, statusFilter, genderFilter, planFilter, sorting]);

  // ─── Stats ───
  const stats = useMemo(() => {
    // Helper to safely calculate percentages or trends if needed
    const getTrend = (current, total) => {
      if (!total) return 0;
      return Math.round((current / total) * 100);
    };

    const total = kpiStats?.totalProfiles || 0;

    return [
      {
        label: "Total Profiles",
        val: total.toLocaleString(), // 1,234 format for better readability
        icon: <LuUsersRound size={20} />,
        color: "blue",
        bgColor: "bg-blue-50", // Added for subtle UI backgrounds
        description: "Grand total of all registered users",
      },
      {
        label: "Active Status",
        val: (kpiStats?.activeTotal || 0).toLocaleString(),
        icon: <LuUserRoundCheck size={20} />,
        color: "emerald",
        bgColor: "bg-emerald-50",
        // Dynamic description showing percentage of total
        description: `${getTrend(kpiStats?.activeTotal, total)}% of total user base`,
        trend: "positive",
      },
      {
        label: "Deactivated",
        val: (kpiStats?.deactivatedTotal || 0).toLocaleString(),
        icon: <RiUserUnfollowLine size={20} />,
        color: "rose",
        bgColor: "bg-rose-50",
        description: `${getTrend(kpiStats?.deactivatedTotal, total)}% of total user base`,
        trend: "neutral",
      },
      {
        label: "Men",
        val: (kpiStats?.menCount || 0).toLocaleString(),
        icon: <AiOutlineUser size={20} />,
        color: "blue",
        bgColor: "bg-blue-50",
        description: `${getTrend(kpiStats?.menCount, total)}% of total men's fake profiles`,
        trend: "neutral",
      },
      {
        label: "Women",
        val: (kpiStats?.womenCount || 0).toLocaleString(),
        icon: <SlUserFemale size={20} />,
        color: "pink",
        bgColor: "bg-pink-50",
        description: `${getTrend(kpiStats?.womenCount, total)}% of total women's fake profiles`,
        trend: "neutral",
      },
    ];
  }, [kpiStats]);

  // ─── Handlers ───
  const handleToggleStatusClick = (id, currentStatus) => {
    if (!id) {
      toast.error("Invalid profile ID");
      return;
    }
    setToggleTarget({ id, status: currentStatus });
    setIsToggleStatusModalOpen(true);
  };

  const handleToggleStatusConfirm = async () => {
    if (!toggleTarget?.id) return;
    setIsToggleLoading(true);
    try {
      const result = await dispatch(toggleFakeProfileStatus(toggleTarget.id)).unwrap();
      toast.success(result.message || "Profile status updated");
      setIsToggleStatusModalOpen(false);
      setToggleTarget(null);
    } catch (error) {
      toast.error(error || "Failed to update status");
    } finally {
      setIsToggleLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    if (!id) {
      toast.error("Invalid profile ID");
      return;
    }
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleteLoading(true);
    try {
      const result = await dispatch(deleteFakeProfile(deleteTargetId)).unwrap();
      toast.success(result.message || "Fake profile deleted");
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    } catch (error) {
      toast.error(error || "Failed to delete profile");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleBulkCreate = async (payload) => {
    try {
      await dispatch(bulkCreateFakeProfiles(payload)).unwrap();
      toast.success(`${payload.count} fake profiles created successfully`);
      setIsBulkModalOpen(false);
      // Reset to first page to see new profiles
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    } catch (error) {
      toast.error(error || "Failed to create profiles");
    }
  };

  // ─── Table columns ───
  const columns = useMemo(
    () => fakeProfileColumns(handleToggleStatusClick, handleDeleteClick),
    [],
  );

  // ─── Has active filter ───
  const hasActiveFilter = !!statusFilter || !!genderFilter || !!planFilter;

  // ─── Color maps ───
  const colorMap = {
    blue: "from-blue-500/40 to-blue-600/5 text-blue-600 border-blue-100",
    emerald:
      "from-emerald-500/40 to-emerald-600/5 text-emerald-600 border-emerald-100",
    rose: "from-rose-500/40 to-rose-600/5 text-rose-600 border-rose-100",
  };

  const bgMap = {
    blue: "from-blue-300/20 via-blue-500/10 to-transparent text-blue-600 border-blue-200 hover:border-blue-400",
    emerald:
      "from-emerald-300/20 via-emerald-500/10 to-transparent text-emerald-600 border-emerald-200 hover:border-emerald-400",
    rose: "from-rose-300/20 via-rose-500/10 to-transparent text-rose-600 border-rose-200 hover:border-rose-400",
  };

  if (isInitialLoad && loading) {
    return <PreLoader />;
  }

  return (
    <Container>
      <div className="@container/main space-y-6">
        {/* ─── HEADER ─── */}
        <motion.header variants={itemVariants} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full">
              <PageHeader
                heading="Fake Profile Management"
                icon={
                  <LuUserRoundX
                    strokeWidth={2}
                    className="w-9 h-9 text-white"
                  />
                }
                color="bg-brand-aqua shadow-brand-aqua/30"
                subheading="Create and manage simulated member accounts."
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                }
                disabled={loading}
                className="h-9 flex-1 md:flex-none group shadow-sm bg-white hover:bg-brand-aqua text-slate-400 hover:text-white border border-slate-200 hover:border-brand-aqua transition-all active:scale-95"
              >
                <IconRefresh
                  className={cn("h-4 w-4 mr-1", loading && "animate-spin")}
                />
                Refresh
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCityModalOpen(true)}
                className="h-9 flex-1 md:flex-none group shadow-sm bg-white hover:bg-brand-aqua text-slate-400 hover:text-white border border-slate-200 hover:border-brand-aqua transition-all active:scale-95"
              >
                <MapPin className="mr-1 h-4 w-4 text-slate-400 group-hover:text-white" />
                Manage Cities
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBulkModalOpen(true)}
                className="h-9 flex-1 md:flex-none group shadow-sm bg-white hover:bg-brand-aqua text-slate-400 hover:text-white border border-slate-200 hover:border-brand-aqua transition-all active:scale-95"
              >
                <IconUsersPlus className="mr-1 h-4 w-4 text-slate-400 group-hover:text-white" />
                Bulk Create
              </Button>
            </div>
          </div>
        </motion.header>

        {/* ─── STATS GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsGrid
            stats={stats}
            colorMap={colorMap}
            bgMap={bgMap}
            onCardClick={(label) => {
              // Reset all filters first
              setStatusFilter("");
              setGenderFilter("");
              setPlanFilter("");
              setSearch("");
              setSorting([]);

              if (label === "Active Status") {
                setStatusFilter("active");
              } else if (label === "Deactivated") {
                setStatusFilter("deactivated");
              } else if (label === "Men") {
                setGenderFilter("men");
              } else if (label === "Women") {
                setGenderFilter("women");
              }
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        </div>

        {/* ─── DATA TABLE ─── */}
        <motion.div variants={itemVariants}>
          <FakeProfileDataTable
            columns={columns}
            data={items}
            rowCount={serverPagination?.total ?? 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            searchPlaceholder="Search by nickname, city, phone, email..."
            globalFilter={search}
            setGlobalFilter={setSearch}
            isLoading={loading}
            filters={{
              statusFilter,
              setStatusFilter,
              genderFilter,
              setGenderFilter,
              planFilter,
              setPlanFilter,
              setGlobalFilter: setSearch,
              setPagination,
              setSorting,
            }}
            sorting={sorting}
            setSorting={setSorting}
          />
        </motion.div>

        {/* ─── MODALS ─── */}
        <BulkCreateModal
          isOpen={isBulkModalOpen}
          onClose={() => {
            setIsBulkModalOpen(false);
            setNewlyAddedCity(null); // Reset when bulk modal closes
          }}
          onConfirm={handleBulkCreate}
          cities={cities}
          selectedCityOverride={newlyAddedCity}
          onManageCitiesClick={() => setIsCityModalOpen(true)}
        />

        <CityManagementModal
          isOpen={isCityModalOpen}
          onClose={() => setIsCityModalOpen(false)}
          cities={cities}
          isLoading={citiesLoading}
          onAddCity={(cityData) => {
            return dispatch(addCity(cityData))
              .unwrap()
              .then((newCity) => {
                // If it was opened from BulkCreateModal, navigating back is just closing this modal.
                // It will reveal the BulkCreateModal underneath, and auto-select the new city.
                setNewlyAddedCity(newCity.name);
                setIsCityModalOpen(false);
              });
          }}
          onDeleteCity={(id) => dispatch(deleteCustomCity(id)).unwrap()}
        />

        <ConfirmModal
          isOpen={isToggleStatusModalOpen}
          onClose={() => {
            if (isToggleLoading) return;
            setIsToggleStatusModalOpen(false);
            setToggleTarget(null);
          }}
          onConfirm={handleToggleStatusConfirm}
          title={toggleTarget?.status === "active" ? "Deactivate Fake Profile?" : "Activate Fake Profile?"}
          message={
            toggleTarget?.status === "active"
              ? "Are you sure you want to deactivate this fake profile? It will lose access to matches and discovery."
              : "Are you sure you want to activate this fake profile? It will become visible on the platform again."
          }
          confirmText={toggleTarget?.status === "active" ? "Deactivate" : "Activate"}
          type={toggleTarget?.status === "active" ? "danger" : "brand"}
          loading={isToggleLoading}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            if (isDeleteLoading) return;
            setIsDeleteModalOpen(false);
            setDeleteTargetId(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Fake Profile?"
          message="This action is permanent and cannot be undone. The profile will be completely removed from the system."
          confirmText="Delete Permanently"
          type="danger"
          loading={isDeleteLoading}
        />
      </div>
    </Container>
  );
}
