// src/app/routes/index.js
import { Suspense, lazy } from "react"; // Added Suspense and lazy
import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import PrivateRoute from "./privateRoute";

// 1. Layouts (Keep these standard or lazy load them too)
import AdminLayout from "../layouts/AdminLayout";
import RootLayout from "../layouts/RootLayout";
import { PreLoader } from "../loader/preloader";
import RouteErrorBoundary from "@/components/common/RouteErrorBoundary";

// ======== New trimify imports =========
import SubAdminManagementPage from "@/modules/subAdmin/pages/subadmin.page";
import UsersManagementPage from "@/modules/userManagement/pages/users.management.page";
import AccountSettingsPage from "@/modules/accountSettings/pages/account.settings.page";
import FaqManagementPage from "@/modules/faqManagement/pages/faq.management.page";
import NotificationManagePage from "@/modules/notificationManage/pages/notification.manage.page";
import CMSManagementPage from "@/modules/cmsManagement/pages/cms.management.page";
import TransactionManagementPage from "@/modules/transactionManagement/pages/transaction.management.page";
import SubscriptionDashboardTabPage from "@/modules/subscriptionManagement/pages/subscription.dashboard.page";
import SubscriptionConfigTabPage from "@/modules/subscriptionManagement/pages/subscription.config.page";
import SubscriptionSubscribersTabPage from "@/modules/subscriptionManagement/pages/subscription.subscribers.page";
import SubscriptionTransactionsTabPage from "@/modules/subscriptionManagement/pages/subscription.transactions.page";
import ManageCategoryPage from "@/modules/blogSection/pages/manage.category.page";
import ManageBlogsPage from "@/modules/blogSection/pages/manage.blogs.page";
import DataManagementPage from "@/modules/dataManagement/pages/data.management.page";
import NutritionFoodPage from "@/modules/dataManagement/pages/nutrition.food.page";
import AddNutritionPage from "@/modules/dataManagement/pages/add.nutrition.page";
import FitzoneManagementPage from "@/modules/fitzoneManagement/pages/fitzone.management.page";
import AddFitzonePage from "@/modules/fitzoneManagement/pages/add.fitzone.page";
import ManageProgramPage from "@/modules/manageProgram/pages/manage.program.page";
import AddProgramPage from "@/modules/manageProgram/pages/add.program.page";
import AddCategoryPage from "@/modules/blogSection/pages/add.category.page";
import AddPostPage from "@/modules/blogSection/pages/add.post.page";
import PrivacyAndPolicyPage from "@/modules/cmsManagement/pages/privacy-policy.page";
import TermAndConditionsPage from "@/modules/cmsManagement/pages/terms-conditions.page";
import AboutUsPage from "@/modules/cmsManagement/pages/about-us.page";

// ======== New trimify imports =========

// 2. LAZY LOAD COMPONENTS
const Dashboard = lazy(() => import("@/modules/dashboard/pages/Dashboard"));
const App = lazy(() => import("@/App"));
const NotFoundPage = lazy(
  () => import("@/modules/not-found/Pages/not-found.page"),
);
// const PendingVerifications = lazy(
//   () => import("@/modules/users/pages/PendingVerifications"),
// );
// const UserManagementPage = lazy(
//   () => import("@/modules/users/pages/user-management.Page"),
// );
// const ViewProfilePage = lazy(
//   () => import("@/modules/users/pages/view-profile.Page"),
// );
// const GhostingUsersPage = lazy(
//   () => import("@/modules/users/pages/ghosting-users.Page"),
// );

const ChatReportedList = lazy(
  () => import("@/modules/chatManagement/pages/ChatReportedList"),
);
const ChatReviewDetail = lazy(
  () => import("@/modules/chatManagement/pages/ChatReviewDetail"),
);

// Auth
const LoginPage = lazy(
  () => import("@/modules/authentication/pages/login.page"),
);
const ForgotPasswordPage = lazy(
  () => import("@/modules/authentication/pages/forgot-password.page"),
);
const RequestResetEmailForm = lazy(
  () => import("@/modules/authentication/components/request-resetEmail"),
);
const VerifyEmailOtp = lazy(
  () => import("@/modules/authentication/components/verify-emailOTP"),
);
const ForgotPasswordForm = lazy(
  () => import("@/modules/authentication/components/forgotPasswordForm"),
);

// CMS & Others
const FAQSPage = lazy(() => import("@/modules/cms/pages/faqs.page"));
const FAQEditView = lazy(
  () => import("@/modules/cms/components/faqs-edit-view.page"),
);


const ReportsProfilesPage = lazy(
  () => import("@/modules/profileReview/pages/reports.profiles.page"),
);
const ProfileReviewPage = lazy(
  () => import("@/modules/profileReview/pages/profile.review.page"),
);
const KYCVerificationPage = lazy(
  () => import("@/modules/verification/pages/kyc.verification.page"),
);
const SupportTicketsPage = lazy(
  () => import("@/modules/support/pages/supports.page"),
);
const ViewTicketDetails = lazy(
  () => import("@/modules/support/pages/view.ticket.details"),
);
const SubscriptionsPage = lazy(
  () => import("@/modules/subsciptions/pages/subscription.page"),
);
const SubscriptionDashboardPage = lazy(
  () => import("@/modules/subsciptions/pages/subscription.dashboard"),
);
// const EntitlementPage = lazy(
//   () => import("@/modules/membership/pages/entitlements.page"),
// );
const ViewSubscriptionsPage = lazy(
  () => import("@/modules/subsciptions/pages/view.subscription.detail.page"),
);
const SubscriptionProductsPage = lazy(
  () => import("@/modules/subsciptions/pages/products.page"),
);
const SubscriptionConfigPage = lazy(
  () => import("@/modules/subsciptions/pages/config.page"),
);
const SubscriberManagementPage = lazy(
  () => import("@/modules/subsciptions/pages/subscriber.management.page"),
);
const TransactionsPage = lazy(
  () => import("@/modules/subsciptions/pages/transactions.page"),
);
const TransactionDetailPage = lazy(
  () => import("@/modules/subsciptions/pages/transaction.detail.page"),
);
const AnalyticsPage = lazy(
  () => import("@/modules/dashboard/pages/analytics.page"),
);

const AccountsPage = lazy(
  () => import("@/modules/accounts/page/accounts.page"),
);

// import { PreLoader } from "../loader/preloader";
const GeneralPage = lazy(() => import("@/modules/settings/pages/general.page"));
const PlatformSettingsLayout = lazy(
  () => import("@/modules/settings/pages/platform.settings.layout"),
);
const SocialMediaPage = lazy(
  () => import("@/modules/settings/pages/social.media.page"),
);
const EmailPage = lazy(() => import("@/modules/settings/pages/email.page"));
const ADSMobPage = lazy(() => import("@/modules/settings/pages/ads.mob.page"));
const StoragePage = lazy(() => import("@/modules/settings/pages/storage.page"));
const NotificationManagementPages = lazy(
  () =>
    import("@/modules/notificationManagement/pages/NotificationManagementPages"),
);

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
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PreLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      /*====================== New Tirimfy Tabs ======================*/
      {
        path: "sub-admin-management",
        element: (
          <Suspense fallback={<PreLoader />}>
            <SubAdminManagementPage />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<PreLoader />}>
            <UsersManagementPage />
          </Suspense>
        ),
      },
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
        ],
      },
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
        ],
      },
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
        ],
      },
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
            path: "add-post",
            element: (
              <Suspense fallback={<PreLoader />}>
                <AddPostPage />
              </Suspense>
            ),
          },
        ],
      },
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
      {
        path: "transaction-management",
        element: (
          <Suspense fallback={<PreLoader />}>
            <TransactionManagementPage />
          </Suspense>
        ),
      },
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
      {
        path: "notification-manage",
        element: (
          <Suspense fallback={<PreLoader />}>
            <NotificationManagePage />
          </Suspense>
        ),
      },
      {
        path: "faq-management",
        element: (
          <Suspense fallback={<PreLoader />}>
            <FaqManagementPage />
          </Suspense>
        ),
      },
      {
        path: "account-settings",
        element: (
          <Suspense fallback={<PreLoader />}>
            <AccountSettingsPage />
          </Suspense>
        ),
      },

      /*====================== Old Tabs ======================*/
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "kpi", element: <>KPI's</> },
      { path: "quick-actions", element: <>Quick Actions</> },
      {
        path: "management",
        children: [
          {
            index: true,
            element: <Navigate to="users-management" />,
          },
          // ======================================================
          {
            path: "kyc-verifications",
            element: (
              <Suspense fallback={<PreLoader />}>
                <KYCVerificationPage />
              </Suspense>
            ),
          },
          {
            path: "support",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <SupportTicketsPage />
                  </Suspense>
                ),
              },
              {
                path: "view-ticket/:ticketId",
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <ViewTicketDetails />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "profile-reports",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <ReportsProfilesPage />
                  </Suspense>
                ),
              },
              {
                path: "review/:userId",
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <ProfileReviewPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "chat",
            children: [
              { index: true, element: <ChatReportedList /> },
              { path: ":matchId", element: <ChatReviewWrapper /> },
            ],
          },
          {
            path: "all-notifications",
            element: <NotificationManagementPages />,
          },
          // {
          //   path: "all-notifications",
          //   element: (
          //     <Suspense fallback={<PreLoader />}>
          //       <NotificationManagementPage />
          //     </Suspense>
          //   ),
          // },
          {
            path: "subscription-management",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <SubscriptionDashboardPage />
                  </Suspense>
                ),
              },
              {
                path: "subscribers",
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <SubscriptionsPage />
                  </Suspense>
                ),
              },
              {
                path: "view-subscription/:userId",
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <ViewSubscriptionsPage />
                  </Suspense>
                ),
              },
              {
                path: "manage-subscribers",
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <SubscriberManagementPage />
                  </Suspense>
                ),
              },
              {
                path: "products",
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <SubscriptionProductsPage />
                  </Suspense>
                ),
              },
              {
                path: "config",
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <SubscriptionConfigPage />
                  </Suspense>
                ),
              },
              {
                path: "transactions",
                children: [
                  {
                    index: true,
                    element: (
                      <Suspense fallback={<PreLoader />}>
                        <TransactionsPage />
                      </Suspense>
                    ),
                  },
                  {
                    path: "view/:transactionId",
                    element: (
                      <Suspense fallback={<PreLoader />}>
                        <TransactionDetailPage />
                      </Suspense>
                    ),
                  },
                ],
              },
            ],
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        path: "membership",
        children: [
          { index: true, element: <Navigate to="billing" replace /> },
          { path: "billing", element: <>Billings</> },
          { path: "subscriptions", element: <>View Subscriptions</> },
          { path: "pricing", element: <>Configure SKUs & Pricing</> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        path: "report-moderation",
        children: [
          { index: true, element: <Navigate to="report-queue" replace /> },
          { path: "report-queue", element: <>Report Queue</> },
          { path: "block-banned-users", element: <>Blocked & Banned Users</> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        path: "cms",
        children: [
          { index: true, element: <Navigate to="faqs" replace /> },
          {
            path: "faqs",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<PreLoader />}>
                    <FAQSPage />
                  </Suspense>
                ),
              },
              { path: "edit", element: <FAQEditView /> },
              { path: "edit/:id", element: <FAQEditView /> },
            ],
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
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PreLoader />}>
            <PlatformSettingsLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="general" replace /> },
          {
            path: "general",
            element: (
              <Suspense fallback={<PreLoader />}>
                <GeneralPage />
              </Suspense>
            ),
          },
          {
            path: "social-media",
            element: (
              <Suspense fallback={<PreLoader />}>
                <SocialMediaPage />
              </Suspense>
            ),
          },
          {
            path: "email",
            element: (
              <Suspense fallback={<PreLoader />}>
                <EmailPage />
              </Suspense>
            ),
          },
          {
            path: "ads-mob",
            element: (
              <Suspense fallback={<PreLoader />}>
                <ADSMobPage />
              </Suspense>
            ),
          },
          {
            path: "storage",
            element: (
              <Suspense fallback={<PreLoader />}>
                <StoragePage />
              </Suspense>
            ),
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
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
