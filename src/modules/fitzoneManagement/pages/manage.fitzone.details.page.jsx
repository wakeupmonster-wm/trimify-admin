import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { DataTable } from "@/components/shared/datatable";
import { getManageFitzoneDetailsColumns } from "@/components/columns/manage.fitzone.details.columns";
import { Settings } from "lucide-react";

const ManageFitzoneDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");

  const handleAction = (actionId) => {
    if (actionId === "intro") {
      navigate(`/admin/fitzone-management/manage/edit-intro/${id}`);
    } else if (actionId === "category") {
      navigate(`/admin/fitzone-management/manage/category/${id}`);
    } else if (actionId === "session") {
      navigate(`/admin/fitzone-management/manage/session/${id}`);
    } else {
      console.log(`Navigate to ${actionId} for fitzone ${id}`);
    }
  };

  const columns = useMemo(
    () => getManageFitzoneDetailsColumns(handleAction),
    [],
  );

  const staticData = [
    {
      id: "intro",
      title: "Introduction",
      description: "View and edit the introduction content for this fitzone.",
    },
    {
      id: "category",
      title: "WorkOut Session Categories",
      description: "Manage categories for workout sessions.",
    },
    {
      id: "session",
      title: "Session Management",
      description: "Manage individual workout sessions for this fitzone.",
    },
  ];

  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading="Manage Fitzone Modules"
            icon={<Settings className="w-9 h-9 text-white" />}
            color="bg-app-primary2 shadow-blue-200"
            subheading="Manage Introduction, Workout Categories, and Sessions for this Fitzone."
          />
        </Header>

        <DataTable
          columns={columns}
          data={staticData}
          rowCount={staticData.length}
          loading={false}
          manualPagination={false}
          pagination={pagination}
          setPagination={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          pageCount={Math.ceil(staticData.length / pagination.pageSize)}
        />
      </div>
    </Container>
  );
};

export default ManageFitzoneDetailsPage;
