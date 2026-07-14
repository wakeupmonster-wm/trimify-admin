import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/modules/authentication/store/auth.slice";
// import usersReducer from "@/modules/users/store/user.slice";
import dashboardReducer from "@/modules/dashboard/store/dashboard.slice";
import subAdminReducer from "@/modules/subAdmin/store/sub.admin.slice";
import userManagementReducer from "@/modules/userManagement/store/user.slice";
import manageProgramReducer from "@/modules/manageProgram/store/program.slice";
import fitzoneManagementReducer from "@/modules/fitzoneManagement/store/fitzone.slice";
import blogSectionReducer from "@/modules/blogSection/store/blog.slice";
import subscriptionManagementReducer from "@/modules/subscriptionManagement/store/subscription.slice";
import transactionManagementReducer from "@/modules/transactionManagement/store/transaction.slice";
import notificationManageReducer from "@/modules/notificationManage/store/notification.slice";
import faqManagementReducer from "@/modules/faqManagement/store/faq.slice";
import nutritionReducer from "@/modules/dataManagement/store/nutrition.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  // users: usersReducer,
  // account: accountReducer,
  dashboard: dashboardReducer,
  subAdmin: subAdminReducer,
  usersManagement: userManagementReducer,
  manageProgram: manageProgramReducer,
  fitzoneManagement: fitzoneManagementReducer,
  blogSection: blogSectionReducer,
  subscriptionManagement: subscriptionManagementReducer,
  transactionManagement: transactionManagementReducer,
  notificationManage: notificationManageReducer,
  faqManagement: faqManagementReducer,
  nutrition: nutritionReducer,
});
