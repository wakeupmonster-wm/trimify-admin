import {
  IconLayoutDashboard,
  IconClipboardCheck,
  IconYoga,
  IconDatabaseCog,
  IconNews,
  IconCreditCard,
  IconReceipt,
  IconDeviceDesktop,
  IconBell,
  IconInfoCircle,
  IconSettings,
} from "@tabler/icons-react";
import { LuUsersRound } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";

const navigationData = {
  user: {
    name: "Admin",
    email: "admin@trimify.com.au",
    avatar: "/assets/web/dummyImg.webp",
  },
  navMain: [],
  navManagement: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconLayoutDashboard,
      badge: null,
      // items: [
      //   {
      //     title: "Sample Dashbaord",
      //     url: "/admin/dashboard/sample-dashboard",
      //   },
      // ]
    },
    {
      title: "Sub Admin Management",
      url: "/admin/sub-admin-management",
      icon: PiUsersThree,
      badge: null,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: LuUsersRound,
      badge: null,
    },
    {
      title: "Program Management",
      url: "/admin/manage-program",
      icon: IconClipboardCheck,
      badge: null,
    },
    {
      title: "Fitzone Management",
      url: "/admin/fitzone-management",
      icon: IconYoga,
      badge: null,
    },
    {
      title: "Data Management",
      url: "/admin/data-management/nutrition-food",
      icon: IconDatabaseCog,
      badge: null,
      items: [
        {
          title: "Nutrition Food",
          url: "/admin/data-management/nutrition-food",
        },
        {
          title: "AI Food Upload",
          url: "/admin/data-management/ai-food-upload",
        },
      ],
    },
    {
      title: "Blog Management",
      url: "/admin/blog-section",
      icon: IconNews,
      badge: null,
      items: [
        {
          title: "Manage Category",
          url: "/admin/blog-section/manage-category",
        },
        {
          title: "Manage Blogs",
          url: "/admin/blog-section/manage-blogs",
        },
      ],
    },
    {
      title: "Subscription",
      url: "/admin/subscription-management",
      icon: IconCreditCard,
      badge: null,
      items: [
        { title: "Dashboard", url: "/admin/subscription-management" },
        { title: "Products", url: "/admin/subscription-management/products" },
        { title: "Subscribers", url: "/admin/subscription-management/subscribers" },
        { title: "Transactions", url: "/admin/subscription-management/transactions" },
      ],
    },
    // {
    //   title: "Transaction Management",
    //   url: "/admin/transaction-management",
    //   icon: IconReceipt,
    //   badge: null,
    // },
    {
      title: "Content Management",
      url: "/admin/cms-management",
      icon: IconDeviceDesktop,
      badge: null,
    },
    {
      title: "Notification Management",
      url: "/admin/notification-manage",
      icon: IconBell,
      badge: null,
    },
    {
      title: "FAQ Management",
      url: "/admin/faq-management",
      icon: IconInfoCircle,
      badge: null,
    },
    {
      title: "Account Settings",
      url: "/admin/account-settings",
      icon: IconSettings,
      badge: null,
    },
  ],
  navPlateform: [],
  navSecondary: [],
};

export default navigationData;
