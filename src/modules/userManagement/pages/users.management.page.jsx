import { Container } from '@/components/common/container';
import { PageHeader } from '@/components/common/headSubhead';
import { Users } from 'lucide-react';
import Header from '@/components/common/header';
import React, { useState, useMemo, useEffect } from 'react';
import { DataTable } from '@/components/shared/datatable';
import { getUserManagementColumns } from '@/components/columns/user.management.columns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersList } from '../store/user.slice';

const dummyData = [
  {
    id: 1,
    userId: "5meie",
    userName: "Amina Ajkic",
    emailId: "Minaajkic@gmail.com",
    contactNo: "0451980101",
    activePlan: "No-Active Plan",
    planBuy: "No",
    planExpiry: "No",
    addedBy: "Omaid Zamani",
    status: "Active",
  },
  {
    id: 2,
    userId: "GxWBw",
    userName: "Test1998 U...",
    emailId: "rajintech19@gmail.com",
    contactNo: "9876543210",
    activePlan: "No-Active Plan",
    planBuy: "No",
    planExpiry: "No",
    addedBy: "",
    status: "Active",
  },
  {
    id: 9,
    userId: "rX7Q6",
    userName: "Rajeev pat...",
    emailId: "rajeevwm23112@gmail.com",
    contactNo: "8085047777",
    activePlan: "Premium",
    planBuy: "2026-06-30T00:00:00Z",
    planExpiry: "2026-09-30T00:00:00Z",
    addedBy: "",
    status: "Active",
  }
];

const UsersManagementPage = () => {
    const dispatch = useDispatch();
    const { users, loading, pagination: serverPagination } = useSelector((state) => state.usersManagement);

    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    
    // Fallback to dummy data if API returns nothing (useful for development)
    const displayData = users && users.length > 0 ? users : dummyData;

    useEffect(() => {
      dispatch(fetchUsersList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter
      }));
    }, [dispatch, pagination.pageIndex, pagination.pageSize, globalFilter]);

    const handleAction = (row, action) => {
      console.log("Action:", action, "Row:", row);
    };

    const columns = useMemo(() => getUserManagementColumns(handleAction), []);

    // Check if the backend is doing manual pagination. 
    // If serverPagination.total exists, it's server-paginated.
    const isManual = !!(serverPagination && serverPagination.total > 0);

    return (
      <Container>
        <div className='space-y-8'>
          <Header>
            <div className="flex-1 min-w-0">
              <PageHeader
                heading="User Management"
                icon={<Users className="w-9 h-9 text-white" />}
                color="bg-brand-blue shadow-brand-aqua/30"
                subheading="Manage application users, view their active plans, and modify their statuses."
              />
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
            searchPlaceholder="Search users..."
            itemName="entries"
            isLoading={loading}
            manualPagination={isManual}
            manualFiltering={isManual}
          />
        </div>
      </Container>
    );
};

export default UsersManagementPage;