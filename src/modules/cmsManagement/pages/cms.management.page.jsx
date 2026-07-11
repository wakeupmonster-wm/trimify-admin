import { Container } from '@/components/common/container';
import { PageHeader } from '@/components/common/headSubhead';
import Header from '@/components/common/header';
import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/shared/datatable';
import { getCmsManagementColumns } from '@/components/columns/cms.management.columns';
import { FileEdit } from 'lucide-react';

const dummyCmsPages = [
  {
    id: 1,
    pageName: "Privacy Policy",
  },
  {
    id: 2,
    pageName: "Terms & Conditions",
  },
  {
    id: 3,
    pageName: "About Us",
  }
];

const CMSManagementPage = () => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    
    // Fallback to dummy data
    const displayData = dummyCmsPages;

    const handleAction = (row, action) => {
      if (action === "edit") {
        console.log("Edit CMS Page:", row);
      }
    };

    const columns = useMemo(() => getCmsManagementColumns(handleAction), []);

    return (
      <Container>
        <div className='space-y-8 mt-4'>
          {/* Top Header matching standard design (since we updated FAQ to this) */}
          <Header>
            <div className="flex-1 min-w-0">
              <PageHeader
                heading="CMS"
                icon={<FileEdit className="w-9 h-9 text-white" />}
                color="bg-brand-blue shadow-md"
                subheading="Manage Content Management System pages like Privacy Policy and Terms & Conditions."
              />
            </div>
          </Header>

          {/* DataTable */}
          <div className="bg-white rounded-md shadow-sm border border-slate-100 p-4">
            <DataTable
              columns={columns}
              data={displayData}
              rowCount={displayData.length}
              pagination={pagination}
              onPaginationChange={setPagination}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              searchPlaceholder="Search pages..."
              itemName="entries"
            />
          </div>
        </div>
      </Container>
    );
};

export default CMSManagementPage;