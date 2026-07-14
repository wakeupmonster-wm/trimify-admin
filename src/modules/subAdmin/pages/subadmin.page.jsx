import { Container } from '@/components/common/container'
import { PageHeader } from '@/components/common/headSubhead'
import { UserCog, Plus, FileText } from 'lucide-react'
import Header from '@/components/common/header'
import React, { useState, useMemo, useEffect } from 'react'
import { DataTable } from '@/components/shared/datatable'
import { getSubAdminColumns } from '@/components/columns/sub.admin.columns'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubAdminList } from '../store/sub.admin.slice'
import { Button } from '@/components/ui/button'
import { AddSubAdminDialog } from '../components/add.subadmin.dialog'

// Simple utility to convert an array of objects to CSV
const downloadCSV = (data, filename = 'sub_admins.csv') => {
  if (!data || !data.length) return;
  const headers = ['S.No', 'Created At', 'User Name', 'Email ID', 'Hospital/Clinic Name', 'Designation', 'Country', 'Role', 'Status'];
  const rows = data.map((item, index) => [
    index + 1,
    item.created_at ? new Date(item.created_at).toLocaleDateString() : '-',
    item.name || '-',
    item.email || '-',
    item.hospital || '-',
    item.designation || '-',
    item.location || '-',
    item.role === 1 ? 'WhiteListing User' : 'Sub-Admin User',
    item.status === 'Active' ? 'Active' : 'Inactive'
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(str => `"${str}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const SubAdminManagementPage = () => {
    const dispatch = useDispatch();
    const { subAdmins, loading, pagination: serverPagination } = useSelector((state) => state.subAdmin);

    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    useEffect(() => {
      dispatch(fetchSubAdminList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter
      }));
    }, [dispatch, pagination.pageIndex, pagination.pageSize, globalFilter]);

    const handleAction = (row, action, checked) => {
      if (action === "toggle-status") {
        console.log("Toggle status for:", row.id || row._id, "to", checked);
        // TODO: Dispatch action to call toggle status API
      } else if (action === "edit") {
        console.log("Edit row:", row);
      } else if (action === "delete") {
        console.log("Delete row:", row);
      }
    };

    const handleAddSubAdmin = (formData) => {
      console.log("Adding Sub Admin with data:", formData);
      // TODO: Dispatch action to add sub admin API
    };

    const columns = useMemo(() => getSubAdminColumns(handleAction), []);

    // Check if the backend is doing manual pagination. 
    // If serverPagination.total exists, it's server-paginated.
    const isManual = !!(serverPagination && serverPagination.total > 0);

    return (
      <Container>
        <div className='space-y-8'>
          <Header>
            <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <PageHeader
                heading="Sub Admin Management"
                icon={<UserCog className="w-9 h-9 text-white" />}
                color="bg-brand-blue shadow-brand-aqua/30"
                subheading="Manage sub-administrators and their access roles."
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Sub Admin
                </Button>
                <Button 
                  onClick={() => downloadCSV(subAdmins)}
                  className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  Download CSV
                </Button>
              </div>
            </div>
          </Header>

          <DataTable
            columns={columns}
            data={subAdmins || []}
            rowCount={isManual ? serverPagination.total : (subAdmins?.length || 0)}
            pagination={pagination}
            onPaginationChange={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search sub admins..."
            itemName="entries"
            isLoading={loading}
            manualPagination={isManual}
            manualFiltering={isManual}
          />
        </div>

        <AddSubAdminDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddSubAdmin}
        />
      </Container>
    )
}

export default SubAdminManagementPage