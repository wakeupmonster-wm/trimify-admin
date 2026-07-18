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

const ManageBlogsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, postsLoading, postsPagination } = useSelector(
    (state) => state.blogSection,
  );

  const [postFilter, setPostFilter] = useState("");
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
        search: postFilter,
      }),
    );
  }, [dispatch, postPage.pageIndex, postPage.pageSize, postFilter]);

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
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Manage Blogs"
              icon={<FileText className="w-9 h-9 text-white" />}
              color="bg-app-primary2 shadow-brand-hoverBlue"
              subheading="Manage blog posts for the platform."
            />
            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button
                className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-4 h-10 flex items-center gap-2 text-xs font-semibold shadow-sm"
                onClick={() => navigate("/admin/blog-section/add-post")}
              >
                <Plus className="w-4 h-4" />
                Create Post
              </Button>
            </div>
          </div>
        </Header>

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
          searchPlaceholder="Search blog posts..."
          itemName="posts"
          isLoading={postsLoading}
          manualPagination={isPostManual}
          manualFiltering={isPostManual}
        />
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
