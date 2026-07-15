import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { FileText, Plus } from "lucide-react";
import Header from "@/components/common/header";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/shared/datatable";
import { getManageBlogsColumns } from "@/components/columns/manage.blogs.columns";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPosts } from "../store/blog.slice";
import { Button } from "@/components/ui/button";

const dummyPosts = [
  {
    id: 1,
    title: "10 Best Foods for Weight Loss",
    category: "Nutrition",
    description: "Discover the top 10 foods to help you lose weight fast.",
    status: "Public",
  },
  {
    id: 2,
    title: "Beginner's Guide to Gym",
    category: "Workout",
    description: "How to start working out at the gym.",
    status: "Private",
  },
];

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

  useEffect(() => {
    dispatch(
      fetchBlogPosts({
        page: postPage.pageIndex + 1,
        limit: postPage.pageSize,
        search: postFilter,
      }),
    );
  }, [dispatch, postPage.pageIndex, postPage.pageSize, postFilter]);

  const handlePostAction = (row, action, value) => {
    if (action === "change-status") {
      console.log("Change post status for:", row.id, "to", value);
    } else if (action === "edit") {
      navigate(`/admin/blog-section/edit-post/${row.id}`, { state: { editData: row } });
    } else if (action === "delete") {
      console.log("Delete post:", row);
    }
  };

  const postColumns = useMemo(
    () => getManageBlogsColumns(handlePostAction),
    [],
  );
  const displayPosts = posts && posts.length > 0 ? posts : dummyPosts;
  const isPostManual = !!(postsPagination && postsPagination.total > 0);

  return (
    <Container>
     <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Manage Blogs"
              icon={<FileText className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-brand-hoverBlue"
              subheading="Manage blog posts for the platform."
            />
            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-4 h-10 flex items-center gap-2 font-semibold shadow-sm"
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
    </Container>
  );
};

export default ManageBlogsPage;
