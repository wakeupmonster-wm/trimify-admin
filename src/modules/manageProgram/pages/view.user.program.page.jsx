import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { DataTable } from "@/components/shared/datatable";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchProgramAssignedUsers } from "../store/program.slice";
import { getViewUserProgramColumns } from "@/components/columns/manage.program.view.user.columns";
import { LuUsersRound } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ViewUserProgramPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    assignedUsers,
    loading,
    usersPagination: serverPagination,
  } = useSelector((state) => state.manageProgram);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const displayData = assignedUsers || [];

  useEffect(() => {
    if (id) {
      dispatch(
        fetchProgramAssignedUsers({
          id,
          params: {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearchTerm,
          },
        }),
      );
    }
  }, [
    dispatch,
    id,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
  ]);

  const handleAction = (row, action) => {
    if (action === "view") {
      navigate(`/admin/users/view-user/${row.user_id || row.id}`);
    }
  };

  const columns = useMemo(() => getViewUserProgramColumns(handleAction), []);

  const isManual = !!(serverPagination && serverPagination.total > 0);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="View Users"
                icon={<LuUsersRound className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="View the list of users assigned to this program."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-2.5 h-10 flex items-center justify-center gap-1 text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back</span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={displayData}
            rowCount={
              isManual ? serverPagination.total : displayData?.length || 0
            }
            searchPlaceholder="Search by username..."
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            loading={loading}
            manualPagination={isManual}
            onRowClick={(row) => handleAction(row.original, "view")}
            pageCount={
              isManual
                ? serverPagination.totalPages
                : Math.ceil((displayData?.length || 0) / pagination.pageSize)
            }
          />
        </div>
      </div>
    </Container>
  );
};

export default ViewUserProgramPage;
