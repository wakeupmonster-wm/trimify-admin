import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/modules/authentication/store/auth.slice";
// import usersReducer from "@/modules/users/store/user.slice";
import accountReducer from "@/modules/accounts/store/account.slice";
import dashboardReducer from "@/modules/dashboard/store/dashboard.slice";
import subAdminReducer from "@/modules/subAdmin/store/sub.admin.slice";
import userManagementReducer from "@/modules/userManagement/store/user.slice";
import manageProgramReducer from "@/modules/manageProgram/store/program.slice";
import manageFoodReducer from "@/modules/manageProgram/store/food.slice";
import manageDietReducer from "@/modules/manageProgram/store/diet.slice";
import manageIntroReducer from "@/modules/manageProgram/store/intro.slice";
import fitzoneManagementReducer from "@/modules/fitzoneManagement/store/fitzone.slice";
import fitzoneIntroReducer from "@/modules/fitzoneManagement/store/fitzone.intro.slice";
import fitzoneCategoryReducer from "@/modules/fitzoneManagement/store/fitzone.category.slice";
import fitzoneSessionReducer from "@/modules/fitzoneManagement/store/fitzone.session.slice";
import blogSectionReducer from "@/modules/blogSection/store/blog.slice";
import subscriptionManagementReducer from "@/modules/subscriptionManagement/store/subscription.slice";
import subscriptionDashboardReducer from "@/modules/subscriptionManagement/store/subscription-dashboard.slice";
import transactionManagementReducer from "@/modules/transactionManagement/store/transaction.slice";
import notificationManageReducer from "@/modules/notificationManage/store/notification.slice";
import faqManagementReducer from "@/modules/faqManagement/store/faq.slice";
import nutritionReducer from "@/modules/dataManagement/store/nutrition.slice";
import cmsManagementReducer from "@/modules/cmsManagement/store/cms.management.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  // users: usersReducer,
  account: accountReducer,
  dashboard: dashboardReducer,
  subAdmin: subAdminReducer,
  usersManagement: userManagementReducer,
  manageProgram: manageProgramReducer,
  manageFood: manageFoodReducer,
  manageDiet: manageDietReducer,
  manageIntro: manageIntroReducer,
  fitzoneManagement: fitzoneManagementReducer,
  fitzoneIntro: fitzoneIntroReducer,
  fitzoneCategory: fitzoneCategoryReducer,
  fitzoneSession: fitzoneSessionReducer,
  blogSection: blogSectionReducer,
  subscriptionManagement: subscriptionManagementReducer,
  subscriptionDashboard: subscriptionDashboardReducer,
  transactionManagement: transactionManagementReducer,
  notificationManage: notificationManageReducer,
  faqManagement: faqManagementReducer,
  nutrition: nutritionReducer,
  cmsManagement: cmsManagementReducer,
});
