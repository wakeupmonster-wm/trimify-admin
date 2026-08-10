import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import { FileText, Plus, CheckCircle, EyeOff, Flame } from "lucide-react";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import { getManageBlogsColumns } from "@/components/columns/manage.blogs.columns";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogPosts,
  toggleBlogPostVisibility,
  deleteBlogPost,
} from "../store/blog.slice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { LuNewspaper } from "react-icons/lu";
import CTAButton from "@/components/common/CTAButton";
import { getBlogPostsAPI } from "../services/blog.services";

const ManageBlogsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { posts, postsLoading, postsPagination, postsKpis } = useSelector(
    (state) => state.blogSection,
  );
  const [postFilter, setPostFilter] = useState("");
  const debouncedPostFilter = useDebounce(postFilter, 500);
  const [postPage, setPostPageState] = useState({
    pageIndex: Math.max(0, postsPagination.page - 1),
    pageSize: postsPagination.limit || 10,
  });
  const [statusFilter, setStatusFilter] = useState("");
  // Optional dateRange from Dashboard KPI navigation
  const [dateRangeFilter, setDateRangeFilter] = useState(
    location.state?.dateRange || null,
  );
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    rowData: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [globalKpisData, setGlobalKpisData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchGlobalKpis = async () => {
      try {
        const response = await getBlogPostsAPI({ limit: 1 });
        if (isMounted && response && (response.success || response.status === "success")) {
          if (response.kpis) {
            setGlobalKpisData(response.kpis);
          } else {
            const list = response.blogs || response.data || response.posts || [];
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            setGlobalKpisData({
              totalBlogs: response.pagination?.total ?? list.length,
              publishedBlogs: list.filter((p) => String(p.visibility_status).toLowerCase() === "publish").length,
              draftBlogs: list.filter((p) => String(p.visibility_status).toLowerCase() !== "publish").length,
              recentBlogs: list.filter((p) => p.updated_at && new Date(p.updated_at) >= thirtyDaysAgo).length,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch global KPIs", error);
      }
    };
    fetchGlobalKpis();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    dispatch(
      fetchBlogPosts({
        page: postPage.pageIndex + 1,
        limit: postPage.pageSize,
        search: debouncedPostFilter,
        ...(dateRangeFilter?.preset ? { preset: dateRangeFilter.preset } : {}),
        ...(dateRangeFilter?.from ? { from: dateRangeFilter.from } : {}),
        ...(dateRangeFilter?.to ? { to: dateRangeFilter.to } : {}),
      }),
    );
  }, [dispatch, postPage.pageIndex, postPage.pageSize, debouncedPostFilter, dateRangeFilter]);

  const handlePostAction = async (row, action, value) => {
    if (action === "change-status") {
      try {
        await dispatch(
          toggleBlogPostVisibility({ id: row.id, status: value }),
        ).unwrap();
        toast.success(`Post visibility changed to ${value}!`);
        dispatch(
          fetchBlogPosts({
            page: postPage.pageIndex + 1,
            limit: postPage.pageSize,
            search: postFilter,
          }),
        );
      } catch (error) {
        toast.error(error || "Failed to update post visibility");
      }
    } else if (action === "edit") {
      navigate(`/admin/blog-section/edit-post/${row.id}`, {
        state: { editData: row },
      });
    } else if (action === "delete") {
      setDeleteModal({ open: true, rowData: row });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.rowData) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteBlogPost(deleteModal.rowData.id)).unwrap();
      toast.success("Post deleted successfully!");
      dispatch(
        fetchBlogPosts({
          page: postPage.pageIndex + 1,
          limit: postPage.pageSize,
          search: postFilter,
        }),
      );
    } catch (error) {
      toast.error(error || "Failed to delete post");
    } finally {
      setIsDeleting(false);
      setDeleteModal({ open: false, rowData: null });
    }
  };

  const postColumns = useMemo(() => getManageBlogsColumns(handlePostAction), []);
  
  const displayPosts = useMemo(() => {
    let list = posts && posts.length > 0 ? posts : [];
    if (statusFilter === "Publish") {
      list = list.filter(
        (p) => String(p.visibility_status).toLowerCase() === "publish",
      );
    } else if (statusFilter === "Draft") {
      list = list.filter(
        (p) => String(p.visibility_status).toLowerCase() !== "publish",
      );
    } else if (statusFilter === "Recent") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      list = list.filter(
        (p) => p.updated_at && new Date(p.updated_at) >= thirtyDaysAgo,
      );
    }
    return list;
  }, [posts, statusFilter]);

  const filterConfig = [
    {
      type: "select",
      id: "statusFilter",
      label: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "Published", value: "Publish" },
        { label: "Draft / Hidden", value: "Draft" },
        { label: "Recent", value: "Recent" },
      ],
      placeholder: "All Status",
    },
    {
      type: "dateRange",
      id: "dateRangeFilter",
      label: "Date",
      value: dateRangeFilter,
      onChange: (val) => {
        setDateRangeFilter(val);
        // Clear navigation state by replacing it without dateRange
        if (location.state?.dateRange) {
          navigate(".", { replace: true, state: { ...location.state, dateRange: null } });
        }
      },
    },
  ];

  const isPostManual = !!(postsPagination && postsPagination.total > 0);

  // KPI Calculations
  const kpiItems = useMemo(() => {
    const list = posts || [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const localKpis = globalKpisData || postsKpis;

    const total = localKpis?.totalBlogs ?? postsPagination?.total ?? list.length;
    const published = localKpis?.publishedBlogs ?? list.filter(
      (p) => String(p.visibility_status).toLowerCase() === "publish",
    ).length;
    const drafts = localKpis?.draftBlogs ?? list.filter(
      (p) => String(p.visibility_status).toLowerCase() !== "publish",
    ).length;
    const recent = localKpis?.recentBlogs ?? list.filter(
      (p) => p.updated_at && new Date(p.updated_at) >= thirtyDaysAgo,
    ).length;

    return [
      {
        label: "Total Blogs",
        value: total,
        icon: FileText,
        tone: statusFilter === "" ? "blue" : "slate",
        description: "All platform blogs",
        onClick: () => setStatusFilter(""),
        isSelected: statusFilter === "",
      },
      {
        label: "Published Blogs",
        value: published,
        icon: CheckCircle,
        tone:
          statusFilter === "Publish"
            ? "emerald"
            : statusFilter === ""
              ? "emerald"
              : "slate",
        description: "Live on app",
        onClick: () =>
          setStatusFilter((prev) => (prev === "Publish" ? "" : "Publish")),
        isSelected: statusFilter === "Publish",
      },
      {
        label: "Draft / Hidden",
        value: drafts,
        icon: EyeOff,
        tone:
          statusFilter === "Draft"
            ? "amber"
            : statusFilter === ""
              ? "amber"
              : "slate",
        description: "Not visible to users",
        onClick: () =>
          setStatusFilter((prev) => (prev === "Draft" ? "" : "Draft")),
        isSelected: statusFilter === "Draft",
      },
      {
        label: "Recently Updated",
        value: recent,
        icon: Flame,
        tone:
          statusFilter === "Recent"
            ? "rose"
            : statusFilter === ""
              ? "rose"
              : "slate",
        description: "Modified in last 30 days",
        onClick: () =>
          setStatusFilter((prev) => (prev === "Recent" ? "" : "Recent")),
        isSelected: statusFilter === "Recent",
      },
    ];
  }, [posts, postsPagination?.total, postsKpis, globalKpisData, statusFilter]);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Manage Blogs"
                icon={<LuNewspaper className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Manage blog posts for the platform."
              />
            </div>
            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <CTAButton
                icon={Plus}
                label="Create Post"
                onClick={() => navigate("/admin/blog-section/add-post")}
              />
            </div>
          </div>
        </Header>

        {/* KPIs Row */}
        <ModuleKpiRow
          items={kpiItems}
          loading={postsLoading && !posts?.length}
        />

        <div className="w-full min-w-0 flex-1">
          <DataTable
            columns={postColumns}
            data={displayPosts}
            rowCount={
              isPostManual ? postsPagination.total : displayPosts?.length || 0
            }
            pagination={postPage}
            onPaginationChange={setPostPageState}
            globalFilter={postFilter}
            setGlobalFilter={setPostFilter}
            searchPlaceholder="Search by title or description..."
            itemName="posts"
            isLoading={postsLoading}
            manualPagination={isPostManual}
            manualFiltering={isPostManual}
            toolbarChildren={<DataTableFilters filterConfig={filterConfig} />}
            activeFiltersChildren={
              <DataTableActiveChips
                filterConfig={filterConfig}
                onClearAll={() => {
                  setStatusFilter("");
                  setDateRangeFilter(null);
                  if (location.state) {
                    navigate(".", { replace: true, state: null });
                  }
                }}
              />
            }
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() =>
          !isDeleting && setDeleteModal({ open: false, rowData: null })
        }
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Confirm Deletion"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
      />
    </Container>
  );
};

export default ManageBlogsPage;
