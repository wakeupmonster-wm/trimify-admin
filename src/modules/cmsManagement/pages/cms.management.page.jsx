import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/shared/datatable";
import { getCmsManagementColumns } from "@/components/columns/cms.management.columns";
import { FileEdit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCmsPages } from "../store/cms.management.slice";
import { toast } from "sonner";

const CMSManagementPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, loading, error } = useSelector((state) => state.cmsManagement);

  useEffect(() => {
    dispatch(fetchCmsPages({ 
      page: pagination.pageIndex + 1, 
      search: globalFilter 
    }));
  }, [dispatch, pagination.pageIndex, globalFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Map API fields (page_name) to table accessor (pageName)
  const displayData = useMemo(() => {
    return data?.map(item => ({
      ...item,
      pageName: item.page_name,
    })) || [];
  }, [data]);

  const handleAction = (row, action) => {
    if (action === "edit") {
      // Direct exact match to route names or ID based navigation
      const name = row.pageName?.toLowerCase() || "";
      if (name.includes("privacy")) {
        navigate("/admin/cms-management/privacy-policy");
      } else if (name.includes("terms")) {
        navigate("/admin/cms-management/terms-conditions");
      } else if (name.includes("about")) {
        navigate("/admin/cms-management/about-us");
      } else {
        toast.info("No specific editor for this page yet.");
      }
    }
  };

  const columns = useMemo(() => getCmsManagementColumns(handleAction), []);

  return (
    <Container>
      <div className="space-y-8">
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
          isLoading={loading}
        />
      </div>
    </Container>
  );
};

export default CMSManagementPage;
