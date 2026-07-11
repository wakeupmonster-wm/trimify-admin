import { Container } from '@/components/common/container';
import { PageHeader } from '@/components/common/headSubhead';
import { FileText, Plus } from 'lucide-react';
import Header from '@/components/common/header';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/shared/datatable';
import { getManageCategoryColumns } from '@/components/columns/manage.category.columns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogCategories } from '../store/blog.slice';
import { Button } from '@/components/ui/button';

const dummyCategories = [
  {
    id: 1,
    title: "Nutrition",
    description: "All about healthy eating and diet plans.",
    status: true,
  },
  {
    id: 2,
    title: "Workout",
    description: "Workout routines and exercises.",
    status: true,
  }
];

const ManageCategoryPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { 
      categories, categoriesLoading, categoriesPagination
    } = useSelector((state) => state.blogSection);

    const [categoryFilter, setCategoryFilter] = useState("");
    const [categoryPage, setCategoryPageState] = useState({ pageIndex: Math.max(0, categoriesPagination.page - 1), pageSize: categoriesPagination.limit || 10 });

    useEffect(() => {
      dispatch(fetchBlogCategories({
        page: categoryPage.pageIndex + 1,
        limit: categoryPage.pageSize,
        search: categoryFilter
      }));
    }, [dispatch, categoryPage.pageIndex, categoryPage.pageSize, categoryFilter]);

    const handleCategoryAction = (row, action, value) => {
      if (action === "toggle-status") {
        console.log("Toggle category status for:", row.id, "to", value);
      } else if (action === "edit") {
        console.log("Edit category:", row);
      } else if (action === "delete") {
        console.log("Delete category:", row);
      }
    };

    const categoryColumns = useMemo(() => getManageCategoryColumns(handleCategoryAction), []);
    const displayCategories = categories && categories.length > 0 ? categories : dummyCategories;
    const isCategoryManual = !!(categoriesPagination && categoriesPagination.total > 0);

    return (
      <Container>
        <div className="flex justify-end w-full mb-6 mt-2">
           <Button 
             className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
             onClick={() => navigate("/admin/blog-section/add-category")}
           >
             <Plus className="w-4 h-4" />
             Create Category
           </Button>
        </div>

        <div className='space-y-8'>
          <Header>
            <div className="flex-1 min-w-0">
              <PageHeader
                heading="Manage Category"
                icon={<FileText className="w-9 h-9 text-white" />}
                color="bg-brand-blue shadow-md"
                subheading="Manage blog categories for the platform."
              />
            </div>
          </Header>

          <DataTable
            columns={categoryColumns}
            data={displayCategories}
            rowCount={isCategoryManual ? categoriesPagination.total : (displayCategories?.length || 0)}
            pagination={categoryPage}
            onPaginationChange={setCategoryPageState}
            globalFilter={categoryFilter}
            setGlobalFilter={setCategoryFilter}
            searchPlaceholder="Search categories..."
            itemName="categories"
            isLoading={categoriesLoading}
            manualPagination={isCategoryManual}
            manualFiltering={isCategoryManual}
          />
        </div>
      </Container>
    );
};

export default ManageCategoryPage;
