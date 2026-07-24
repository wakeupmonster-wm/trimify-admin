import React, { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { DataTable } from "@/components/shared/datatable";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";
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

  const filteredData = useMemo(() => {
    if (!globalFilter) return staticData;
    const searchStr = globalFilter.toLowerCase();
    return staticData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchStr) ||
        item.description.toLowerCase().includes(searchStr),
    );
  }, [globalFilter]);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Manage Program Modules"
                icon={<Settings className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Manage program details like Introduction,   Foods, and Diet Plan."
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-max shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
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
            data={filteredData}
            rowCount={filteredData.length}
            loading={false}
            manualPagination={false}
            pagination={pagination}
            setPagination={setPagination}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchable={true}
            searchPlaceholder="Search by manage title..."
            itemName="modules"
            pageCount={Math.ceil(filteredData.length / pagination.pageSize)}
          />
        </div>
      </div>
    </Container>
  );
};

export default ManageProgramDetailsPage;
