import { Container } from '@/components/common/container';
import { PageHeader } from '@/components/common/headSubhead';
import { LayoutDashboard, Plus } from 'lucide-react';
import Header from '@/components/common/header';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/shared/datatable';
import { getManageProgramColumns } from '@/components/columns/manage.program.columns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgramList } from '../store/program.slice';
import { Button } from '@/components/ui/button';


const ManageProgramPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { programs, loading, pagination: serverPagination } = useSelector((state) => state.manageProgram);

    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    
    // Fallback to empty array if no data
    const displayData = programs || [];

    useEffect(() => {
      dispatch(fetchProgramList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter
      }));
    }, [dispatch, pagination.pageIndex, pagination.pageSize, globalFilter]);

    const handleAction = (row, action, value) => {
      if (action === "toggle-status") {
        console.log("Toggle status for:", row.id, "to", value);
        // TODO: Dispatch action to call toggle status API
      } else if (action === "toggle-food-visibility") {
        console.log("Toggle food visibility for:", row.id, "to", value);
        // TODO: Dispatch action to call toggle food visibility API
      } else if (action === "view-user") {
        console.log("View users for program:", row.id);
      } else if (action === "open-program") {
        console.log("Open program:", row.id);
      } else if (action === "edit") {
        navigate("edit-program", { state: { editData: row } });
      } else if (action === "delete") {
        console.log("Delete program:", row);
      }
    };

    const columns = useMemo(() => getManageProgramColumns(handleAction), []);

    // Check if the backend is doing manual pagination. 
    // If serverPagination.total exists, it's server-paginated.
    const isManual = !!(serverPagination && serverPagination.total > 0);

    return (
      <Container>
        {/* Top Header Section outside of the white card */}
       

        <div className='space-y-8'>
          <Header>
              <PageHeader
                heading="Manage Program"
                icon={<LayoutDashboard className="w-9 h-9 text-white" />}
                color="bg-brand-blue shadow-blue-200"
                subheading="Create, configure, and monitor health and wellness programs."
              />

              <div className="flex flex-wrap items-center gap-3">
                <Button 
                  className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
                  onClick={() => navigate("add-program")}
                >
                 <Plus className="w-4 h-4" />
                  Create Program
                </Button>
              </div>
          </Header>

          <DataTable
            columns={columns}
            data={displayData}
            rowCount={isManual ? serverPagination.total : (displayData?.length || 0)}
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search programs..."
            itemName="entries"
            isLoading={loading}
            manualPagination={isManual}
            manualFiltering={isManual}
          />
        </div>
      </Container>
    );
};

export default ManageProgramPage;
