import React, { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { DataTable } from "@/components/shared/datatable";
import { Settings } from "lucide-react";
import { getProgramFoodVisibility } from "../store/program.slice";
import { getManageProgramDetailsColumns } from "@/components/columns/manage.program.details.columns";

const ManageProgramDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");

  const { programFoodVisibility } = useSelector((state) => state.manageProgram);

  useEffect(() => {
    if (id) {
      // Fetch visibility state just in case it's needed for child pages
      dispatch(getProgramFoodVisibility(id));
    }
  }, [dispatch, id]);

  const handleAction = (actionId) => {
    if (actionId === "intro") {
      navigate(`/admin/manage-program/manage/edit-intro/${id}`);
    } else if (actionId === "foods") {
      navigate(`/admin/manage-program/manage/food/${id}`);
    } else if (actionId === "diet") {
      navigate(`/admin/manage-program/manage/diet-plan/${id}`);
    } else {
      console.log(`Navigate to ${actionId} for program ${id}`);
    }
  };

  const columns = useMemo(
    () => getManageProgramDetailsColumns(handleAction),
    [],
  );

  const staticData = [
    {
      id: "intro",
      title: "Introduction",
      description: "View and edit the introduction content for this program.",
    },
    {
      id: "foods",
      title: "Approved / Non-Approved Foods",
      description: "Configure which foods are approved or non-approved.",
    },
    {
      id: "diet",
      title: "Diet Plan",
      description: "Manage the daily diet plans and meals for this program.",
    },
  ];

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 w-full">
            <PageHeader
              heading="Manage Program Modules"
              icon={<Settings className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />}
              color="bg-app-primary2 shadow-blue-200"
              subheading="Manage program details like Introduction,   Foods, and Diet Plan."
            />
          </div>
        </Header>

        <div className="w-full min-w-0 flex-1">
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
      </div>
    </Container>
  );
};

export default ManageProgramDetailsPage;
