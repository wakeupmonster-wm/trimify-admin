import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Dumbbell, Plus } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/shared/datatable";
import { getFitzoneManagementColumns } from "@/components/columns/fitzone.management.columns";
import { useDispatch, useSelector } from "react-redux";
import { fetchFitzoneList, toggleFitzoneStatus, deleteFitzone } from "../store/fitzone.slice";
import { Button } from "@/components/ui/button";
import { useDebounce } from "../../../hooks/useDebounce";

const FitzoneManagementPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    fitzones,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.fitzoneManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    dispatch(
      fetchFitzoneList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
      }),
    );
  }, [dispatch, pagination.pageIndex, pagination.pageSize, debouncedSearchTerm]);

  const handleAction = async (row, action, value) => {
    if (action === "toggle-status") {
      console.log("Toggle status for:", row.id, "to", value);
      const status = value ? "Active" : "Inactive";
      dispatch(toggleFitzoneStatus({ id: row.id, status }));
    } else if (action === "open-program") {
      navigate(`manage/${row.id}`);
    } else if (action === "edit") {
      navigate("edit-fitzone", { state: { editData: row } });
    } else if (action === "delete") {
      console.log("Delete fitzone:", row.id);
      const result = await dispatch(deleteFitzone(row.id));
      if (deleteFitzone.fulfilled.match(result)) {
        dispatch(fetchFitzoneList({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearchTerm
        }));
      }
    }
  };

  const columns = useMemo(() => getFitzoneManagementColumns(handleAction), []);

  // Check if the backend is doing manual pagination.
  // If serverPagination.total exists, it's server-paginated.
  const isManual = !!(serverPagination && serverPagination.total > 0);

  return (
    <Container>
      {/* Top Header Section outside of the white card */}

     <div className="space-y-6">
        <Header>
          <PageHeader
            heading="Fitzone Management"
            icon={<Dumbbell className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="Create, configure, and monitor Fitzone workouts and sessions."
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
              onClick={() => navigate("add-fitzone")}
            >
              <Plus className="w-4 h-4" />
              Create Fitzone
            </Button>
          </div>
        </Header>

        <DataTable
          columns={columns}
          data={fitzones || []}
          rowCount={
            isManual ? serverPagination.total : (fitzones?.length || 0)
          }
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder="Search fitzones..."
          itemName="entries"
          isLoading={loading}
          manualPagination={isManual}
          manualFiltering={isManual}
        />
      </div>
    </Container>
  );
};

export default FitzoneManagementPage;
