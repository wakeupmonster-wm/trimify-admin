import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from '@/components/common/headSubhead';
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

  const columns = useMemo(() => getViewUserProgramColumns(), []);

  const isManual = !!(serverPagination && serverPagination.total > 0);

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <PageHeader
            heading="View Users"
            icon={<Users className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="View the list of users assigned to this program."
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button 
              className="bg-[#0B1E36] hover:bg-[#152e4d] text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
          </div>
        </Header>

        <DataTable
          columns={columns}
          data={displayData}
          rowCount={
            isManual ? serverPagination.total : displayData?.length || 0
          }
          pagination={pagination}
          setPagination={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          loading={loading}
          manualPagination={isManual}
          pageCount={
            isManual
              ? serverPagination.totalPages
              : Math.ceil((displayData?.length || 0) / pagination.pageSize)
          }
        />
      </div>
    </Container>
  );
};

export default ViewUserProgramPage;
