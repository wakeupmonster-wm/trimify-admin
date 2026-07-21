import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import ConfirmModal from "@/components/common/ConfirmModal";
import { FileText, Plus } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/shared/datatable";
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

const ManageBlogsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, postsLoading, postsPagination } = useSelector(
    (state) => state.blogSection,
  );
  const [postFilter, setPostFilter] = useState("");
  const debouncedPostFilter = useDebounce(postFilter, 500);
  const [postPage, setPostPageState] = useState({
    pageIndex: Math.max(0, postsPagination.page - 1),
    pageSize: postsPagination.limit || 10,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    rowData: null,
  });

  useEffect(() => {
    dispatch(
      fetchBlogPosts({
        page: postPage.pageIndex + 1,
        limit: postPage.pageSize,
        search: debouncedPostFilter,
      }),
    );
  }, [dispatch, postPage.pageIndex, postPage.pageSize, debouncedPostFilter]);

  const handlePostAction = async (row, action, value) => {
    if (action === "change-status") {
      try {
        await dispatch(
          toggleBlogPostVisibility({ id: row.id, visibility_status: value }),
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
    try {
      await dispatch(deleteBlogPost(deleteModal.rowData.id)).unwrap();
      toast.success("Post deleted successfully!");
      setDeleteModal({ open: false, rowData: null });
      dispatch(
        fetchBlogPosts({
          page: postPage.pageIndex + 1,
          limit: postPage.pageSize,
          search: postFilter,
        }),
      );
    } catch (error) {
      toast.error(error || "Failed to delete post");
    }
  };

  const postColumns = useMemo(
    () => getManageBlogsColumns(handlePostAction),
    [],
  );
  const displayPosts = posts && posts.length > 0 ? posts : [];
  const isPostManual = !!(postsPagination && postsPagination.total > 0);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <PageHeader
                heading="Manage Blogs"
                icon={
                  <FileText className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />
                }
                color="bg-app-primary2 shadow-brand-hoverBlue"
                subheading="Manage blog posts for the platform."
              />
            </div>
            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0 mt-2 sm:mt-4 md:mt-0">
              <Button
                className="w-full sm:w-auto flex-1 md:flex-none bg-app-primary2 hover:bg-app-primary5 text-white rounded-xl px-4 sm:px-5 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
                onClick={() => navigate("/admin/blog-section/add-post")}
              >
                <Plus className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">Create Post</span>
              </Button>
            </div>
          </div>
        </Header>

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
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, rowData: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
      />
    </Container>
  );
};

export default ManageBlogsPage;
