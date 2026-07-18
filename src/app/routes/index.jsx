// src/app/routes/index.js
import { Suspense, lazy } from "react"; // Added Suspense and lazy
import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import PrivateRoute from "./privateRoute";

// 1. Layouts (Keep these standard or lazy load them too)
import AdminLayout from "../layouts/AdminLayout";
import RootLayout from "../layouts/RootLayout";
import { PreLoader } from "../loader/preloader";
import RouteErrorBoundary from "@/components/common/RouteErrorBoundary";


// ======== New trimify imports ===========//
const AccountsPage = lazy(() => import("@/modules/accounts/page/accounts.page"));
const SubAdminManagementPage = lazy(() => import("@/modules/subAdmin/pages/subadmin.page"));
const UsersManagementPage = lazy(() => import("@/modules/userManagement/pages/users.management.page"));
const AccountSettingsPage = lazy(() => import("@/modules/accountSettings/pages/account.settings.page"));
const FaqManagementPage = lazy(() => import("@/modules/faqManagement/pages/faq.management.page"));
const NotificationManagePage = lazy(() => import("@/modules/notificationManage/pages/notification.manage.page"));
const CMSManagementPage = lazy(() => import("@/modules/cmsManagement/pages/cms.management.page"));
const TransactionManagementPage = lazy(() => import("@/modules/transactionManagement/pages/transaction.management.page"));
const SubscriptionDashboardTabPage = lazy(() => import("@/modules/subscriptionManagement/pages/subscription.dashboard.page"));
const SubscriptionConfigTabPage = lazy(() => import("@/modules/subscriptionManagement/pages/subscription.config.page"));
const SubscriptionSubscribersTabPage = lazy(() => import("@/modules/subscriptionManagement/pages/subscription.subscribers.page"));
const SubscriptionTransactionsTabPage = lazy(() => import("@/modules/subscriptionManagement/pages/subscription.transactions.page"));
const ManageCategoryPage = lazy(() => import("@/modules/blogSection/pages/manage.category.page"));
const ManageBlogsPage = lazy(() => import("@/modules/blogSection/pages/manage.blogs.page"));
const NutritionFoodPage = lazy(() => import("@/modules/dataManagement/pages/nutrition.food.page"));
const AddNutritionPage = lazy(() => import("@/modules/dataManagement/pages/add.nutrition.page"));
const AiFoodUploadPage = lazy(() => import("@/modules/aiFoodUpload/pages/ai.food.upload.page"));
const AiFoodViewPage = lazy(() => import("@/modules/aiFoodUpload/pages/ai.food.view.page"));
const FitzoneManagementPage = lazy(() => import("@/modules/fitzoneManagement/pages/fitzone.management.page"));
const AddFitzonePage = lazy(() => import("@/modules/fitzoneManagement/pages/add.fitzone.page"));
const ManageProgramPage = lazy(() => import("@/modules/manageProgram/pages/manage.program.page"));
const AddProgramPage = lazy(() => import("@/modules/manageProgram/pages/add.program.page"));
const ViewUserProgramPage = lazy(() => import("@/modules/manageProgram/pages/view.user.program.page"));
const ManageProgramDetailsPage = lazy(() => import("@/modules/manageProgram/pages/manage.program.details.page"));
const EditIntroProgramPage = lazy(() => import("@/modules/manageProgram/pages/edit.intro.program.page"));
const AddFoodCategoryPage = lazy(() => import("@/modules/manageProgram/pages/add.food.category.page"));
const ManageFoodProgramPage = lazy(() => import("@/modules/manageProgram/pages/manage.food.program.page"));
const ManageFoodItemsPage = lazy(() => import("@/modules/manageProgram/pages/manage.food.items.page"));
const ManageDietProgramPage = lazy(() => import("@/modules/manageProgram/pages/manage.diet.program.page"));
const AddDietProgramPage = lazy(() => import("@/modules/manageProgram/pages/add.diet.program.page"));
const EditDietProgramPage = lazy(() => import("@/modules/manageProgram/pages/edit.diet.program.page"));

const ManageFitzoneDetailsPage = lazy(() => import("@/modules/fitzoneManagement/pages/manage.fitzone.details.page"));
const EditFitzoneIntroPage = lazy(() => import("@/modules/fitzoneManagement/pages/edit.fitzone.intro.page"));
const ManageFitzoneCategoryPage = lazy(() => import("@/modules/fitzoneManagement/pages/manage.fitzone.category.page"));
const AddFitzoneCategoryPage = lazy(() => import("@/modules/fitzoneManagement/pages/add.fitzone.category.page"));
const ManageFitzoneSessionPage = lazy(() => import("@/modules/fitzoneManagement/pages/manage.fitzone.session.page"));
const AddFitzoneSessionPage = lazy(() => import("@/modules/fitzoneManagement/pages/add.fitzone.session.page"));

const AddCategoryPage = lazy(() => import("@/modules/blogSection/pages/add.category.page"));
const AddPostPage = lazy(() => import("@/modules/blogSection/pages/add.post.page"));
const PrivacyAndPolicyPage = lazy(() => import("@/modules/cmsManagement/pages/privacy-policy.page"));
const TermAndConditionsPage = lazy(() => import("@/modules/cmsManagement/pages/terms-conditions.page"));
const AboutUsPage = lazy(() => import("@/modules/cmsManagement/pages/about-us.page"));

// ======== New trimify imports =========

// 2. LAZY LOAD COMPONENTS
const Dashboard = lazy(() => import("@/modules/dashboard/pages/Dashboard"));
const App = lazy(() => import("@/App"));
const NotFoundPage = lazy(() => import("@/modules/not-found/Pages/not-found.page"));

// Auth
const LoginPage = lazy(() => import("@/modules/authentication/pages/login.page"));
const ForgotPasswordPage = lazy(() => import("@/modules/authentication/pages/forgot-password.page"));
const RequestResetEmailForm = lazy(() => import("@/modules/authentication/components/request-resetEmail"));
const VerifyEmailOtp = lazy(() => import("@/modules/authentication/components/verify-emailOTP"));
const ForgotPasswordForm = lazy(() => import("@/modules/authentication/components/forgotPasswordForm"));


export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PreLoader />}>
        <RootLayout />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      // { index: true, element: <App /> }, // Now renders landing page your stylized hero
      // 1. Jab koi "/" par aaye, usse redirect kar do login par
      {
        index: true,
        element: (
          <Suspense fallback={<PreLoader />}>
            <Navigate to="/auth/login" replace />
          </Suspense>
        ),
      },
      {
        path: "auth",
        element: <App />,
        children: [
          { index: true, element: <NotFoundPage /> },
          { path: "login", element: <LoginPage /> },
          {
            path: "forgot-password",
            element: <ForgotPasswordPage />, // This is the layout/parent
            children: [
              { index: true, element: <RequestResetEmailForm /> }, // The initial "Enter Email" step
              { path: "verify-email", element: <VerifyEmailOtp /> }, // The "Enter Code" step
              { path: "new-password", element: <ForgotPasswordForm /> }, // The "Set New Password" step
              { path: "*", element: <NotFoundPage /> },
            ],
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
  {
    path: "admin",
    element: (
      <PrivateRoute>
        <Suspense fallback={<PreLoader />}>
          <AdminLayout />
        </Suspense>
      </PrivateRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      
      /*====================== Dashboard Module ======================*/
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PreLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },

      /*====================== Sub-Admin Management Module ======================*/
      {
        path: "sub-admin-management",
        element: (
          <Suspense fallback={<PreLoader />}>
            <SubAdminManagementPage />
          </Suspense>
        ),
      },

      /*====================== User Management Module ======================*/
      {
        path: "users",
        element: (
          <Suspense fallback={<PreLoader />}>
            <UsersManagementPage />
          </Suspense>
        ),
      },

      /*====================== Program Management Module ======================*/
      {
        path: "manage-program",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PreLoader />}>
                <ManageProgramPage />
              </Suspense>
            ),
          },
          {
            path: "add-program",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddProgramPage />
              </Suspense>
            ),
          },
          {
            path: "edit-program",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddProgramPage />
              </Suspense>
            ),
          },
          {
            path: "view-user/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ViewUserProgramPage />
              </Suspense>
            ),
          },
          {
            path: "manage/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ManageProgramDetailsPage />
              </Suspense>
            ),
          },
          {
            path: "manage/edit-intro/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <EditIntroProgramPage />
              </Suspense>
            ),
          },
          {
            path: "manage/food/add-food-category",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddFoodCategoryPage />
              </Suspense>
            ),
          },
          {
            path: "manage/food/edit-food-category/:id/:categoryId",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddFoodCategoryPage />
              </Suspense>
            ),
          },
          {
            path: "manage/food/add-food/:programId/:categoryId",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ManageFoodItemsPage />
              </Suspense>
            ),
          },
          {
            path: "manage/food/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ManageFoodProgramPage />
              </Suspense>
            ),
          },
          {
            path: "manage/diet-plan/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ManageDietProgramPage />
              </Suspense>
            ),
          },
          {
            path: "manage/diet-plan/add-diet/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddDietProgramPage />
              </Suspense>
            ),
          },
          {
            path: "manage/diet-plan/edit-diet/:id/:dietId",
            element: (
              <Suspense fallback={<PreLoader />}>
                <EditDietProgramPage />
              </Suspense>
            ),
          },
          {
            path: "manage/edit-intro/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <EditIntroProgramPage />
              </Suspense>
            ),
          },
        ],
      },

      /*====================== Fitzone Management Module ======================*/
      {
        path: "fitzone-management",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PreLoader />}>
                <FitzoneManagementPage />
              </Suspense>
            ),
          },
          {
            path: "add-fitzone",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddFitzonePage />
              </Suspense>
            ),
          },
          {
            path: "edit-fitzone",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddFitzonePage />
              </Suspense>
            ),
          },
          {
            path: "manage/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ManageFitzoneDetailsPage />
              </Suspense>
            ),
          },
          {
            path: "manage/edit-intro/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <EditFitzoneIntroPage />
              </Suspense>
            ),
          },
          {
            path: "manage/category/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ManageFitzoneCategoryPage />
              </Suspense>
            ),
          },
          {
            path: "manage/category/add-category/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddFitzoneCategoryPage />
              </Suspense>
            ),
          },
          {
            path: "manage/category/edit-category/:id/:categoryId",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddFitzoneCategoryPage />
              </Suspense>
            ),
          },
          {
            path: "manage/session/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ManageFitzoneSessionPage />
              </Suspense>
            ),
          },
          {
            path: "manage/session/add-session/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddFitzoneSessionPage />
              </Suspense>
            ),
          },
          {
            path: "manage/session/edit-session/:id/:sessionId",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddFitzoneSessionPage />
              </Suspense>
            ),
          },
        ],
      },

      /*====================== Data Management Module ======================*/
      {
        path: "data-management",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PreLoader />}>
                <Navigate to="nutrition-food" replace />
              </Suspense>
            ),
          },
          {
            path: "nutrition-food",
            element: (
              <Suspense fallback={<PreLoader />}>
                <NutritionFoodPage />
              </Suspense>
            ),
          },
          {
            path: "add-nutrition",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddNutritionPage />
              </Suspense>
            ),
          },
          {
            path: "edit-nutrition/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddNutritionPage />
              </Suspense>
            ),
          },
          {
            path: "ai-food-upload",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AiFoodUploadPage />
              </Suspense>
            ),
          },
          {
            path: "ai-food-upload/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AiFoodViewPage />
              </Suspense>
            ),
          },
        ],
      },

      /*====================== Blog Section Module ======================*/
      {
        path: "blog-section",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PreLoader />}>
                <Navigate to="manage-category" replace />
              </Suspense>
            ),
          },
          {
            path: "manage-category",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ManageCategoryPage />
              </Suspense>
            ),
          },
          {
            path: "manage-blogs",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ManageBlogsPage />
              </Suspense>
            ),
          },
          {
            path: "add-category",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddCategoryPage />
              </Suspense>
            ),
          },
          {
            path: "edit-category/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddCategoryPage />
              </Suspense>
            ),
          },
          {
            path: "add-post",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddPostPage />
              </Suspense>
            ),
          },
          {
            path: "edit-post/:id",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddPostPage />
              </Suspense>
            ),
          },
        ],
      },

      /*====================== Subscription Management Module ======================*/
      {
        path: "subscription-management",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PreLoader />}>
                <SubscriptionDashboardTabPage />
              </Suspense>
            ),
          },
          {
            path: "config",
            element: (
              <Suspense fallback={<PreLoader />}>
                <SubscriptionConfigTabPage />
              </Suspense>
            ),
          },
          {
            path: "subscribers",
            element: (
              <Suspense fallback={<PreLoader />}>
                <SubscriptionSubscribersTabPage />
              </Suspense>
            ),
          },
          {
            path: "transactions",
            element: (
              <Suspense fallback={<PreLoader />}>
                <SubscriptionTransactionsTabPage />
              </Suspense>
            ),
          },
        ],
      },

      /*====================== Transaction Management Module ======================*/
      {
        path: "transaction-management",
        element: (
          <Suspense fallback={<PreLoader />}>
            <TransactionManagementPage />
          </Suspense>
        ),
      },

      /*====================== CMS Management Module ======================*/
      {
        path: "cms-management",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PreLoader />}>
                <CMSManagementPage />
              </Suspense>
            ),
          },
          {
            path: "privacy-policy",
            element: (
              <Suspense fallback={<PreLoader />}>
                <PrivacyAndPolicyPage />
              </Suspense>
            ),
          },
          {
            path: "terms-conditions",
            element: (
              <Suspense fallback={<PreLoader />}>
                <TermAndConditionsPage />
              </Suspense>
            ),
          },
          {
            path: "about-us",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AboutUsPage />
              </Suspense>
            ),
          },
        ],
      },

      /*====================== Notification Management Module ======================*/
      {
        path: "notification-manage",
        element: (
          <Suspense fallback={<PreLoader />}>
            <NotificationManagePage />
          </Suspense>
        ),
      },

      /*====================== FAQ Management Module ======================*/
      {
        path: "faq-management",
        element: (
          <Suspense fallback={<PreLoader />}>
            <FaqManagementPage />
          </Suspense>
        ),
      },

      /*====================== Account Settings Module ======================*/
      {
        path: "account-settings",
        element: (
          <Suspense fallback={<PreLoader />}>
            <AccountSettingsPage />
          </Suspense>
        ),
      },

      /*====================== Admin Accounts Profile Module ======================*/
      {
        path: "accounts",
        element: (
          <Suspense fallback={<PreLoader />}>
            <AccountsPage />
          </Suspense>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

// eslint-disable-next-line react-refresh/only-export-components
function ChatReviewWrapper() {
  const { matchId } = useParams();
  return <ChatReviewDetail matchId={matchId} />;
}
