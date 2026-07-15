import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Utensils, Plus } from "lucide-react";
import { DataTable } from "@/components/shared/datatable";
import { getFoodCategories } from "../store/food.slice";
import { getManageFoodCategoryColumns } from "@/components/columns/manage.food.category.columns";
import { useDebounce } from "@/hooks/useDebounce";

const ManageFoodProgramPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    categories,
    pagination: serverPagination,
    loading,
  } = useSelector((state) => state.manageFood);

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearchTerm = useDebounce(globalFilter, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    dispatch(
      getFoodCategories({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
  ]);

  const handleAction = (row, action) => {
    if (action === "manage-food") {
      // Navigate to manage specific foods for this program and category
      navigate(`/admin/manage-program/manage/food/add-food/${id}/${row.id}`);
    } else if (action === "edit") {
      navigate(`/admin/manage-program/manage/food/edit-food-category/${id}/${row.id}`, { state: { editData: row } });
    } else if (action === "delete") {
      console.log("Delete category", row);
      // Open delete modal
    }
  };

  const columns = useMemo(() => getManageFoodCategoryColumns(handleAction), [id]);

  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading="Food Category"
            icon={<Utensils className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="Manage approved and non-approved foods and food categories for this program."
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
              onClick={() =>
                navigate("/admin/manage-program/manage/food/add-food-category")
              }
            >
              <Plus className="w-4 h-4" />
              Add Food Category
            </Button>
          </div>
        </Header>

        <DataTable
          columns={columns}
          data={categories}
          rowCount={serverPagination.total || categories.length}
          pagination={pagination}
          setPagination={setPagination}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          loading={loading}
          manualPagination={true}
          pageCount={serverPagination.totalPages || 1}
        />
      </div>
    </Container>
  );
};

export default ManageFoodProgramPage;
