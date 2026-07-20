import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { DataTable } from "@/components/shared/datatable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchProgramAssignedUsers } from "../store/program.slice";
import { getViewUserProgramColumns } from "@/components/columns/manage.program.view.user.columns";

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
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 w-full">
            <PageHeader
              heading="View Users"
              icon={<Users className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
              color="bg-app-primary2 shadow-blue-200"
              subheading="View the list of users assigned to this program."
            />
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={columns}
            data={displayData}
            rowCount={
              isManual ? serverPagination.total : displayData?.length || 0
            }
            searchPlaceholder="Search by user name..."
            pagination={pagination}
            setPagination={setPagination}
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
