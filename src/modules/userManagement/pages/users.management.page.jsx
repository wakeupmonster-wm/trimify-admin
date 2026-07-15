import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Users } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/shared/datatable";
import { getUserManagementColumns } from "@/components/columns/user.management.columns";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersList } from "../store/user.slice";
import { ViewUserDialog } from "../components/view.user.dialog";
import { useDebounce } from "../../../hooks/useDebounce";

const UsersManagementPage = () => {
  const dispatch = useDispatch();
  const {
    users,
    loading,
    pagination: serverPagination,
  } = useSelector((state) => state.usersManagement);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    dispatch(
      fetchUsersList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
  ]);

  const handleAction = (row, action) => {
    if (action === "view") {
      setViewData(row);
      setIsViewDialogOpen(true);
    } else {
      console.log("Action:", action, "Row:", row);
    }
  };

  const columns = useMemo(() => getUserManagementColumns(handleAction), []);

  // Check if the backend is doing manual pagination.
  // If serverPagination.total exists, it's server-paginated.
  const isManual = !!(serverPagination && serverPagination.total > 0);

  return (
    <Container>
     <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0">
            <PageHeader
              heading="User Management"
              icon={<Users className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-brand-blue"
              subheading="Manage application users, view their active plans, and modify their statuses."
            />
          </div>
        </Header>

        <DataTable
          columns={columns}
          data={users || []}
          rowCount={isManual ? serverPagination.total : users?.length || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder="Search users..."
          itemName="entries"
          isLoading={loading}
          manualPagination={isManual}
          manualFiltering={isManual}
        />
      </div>

      <ViewUserDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        userData={viewData}
      />
    </Container>
  );
};

export default UsersManagementPage;
