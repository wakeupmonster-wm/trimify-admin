import {
  IconLayoutDashboard,
  IconClipboardCheck,
  IconYoga,
  IconDatabaseCog,
  IconNews,
  IconCreditCard,
  IconDeviceDesktop,
  IconBell,
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
        { title: "Plans", url: "/admin/subscription-management/products" },
        { title: "Subscribers", url: "/admin/subscription-management/subscribers" },
        { title: "Transactions", url: "/admin/subscription-management/transactions" },
      ],
    },
    {
      title: "Notification Management",
      url: "/admin/notification-manage",
      icon: IconBell,
      badge: null,
    },
  ],
  navPlateform: [
    {
      title: "Content Management",
      url: "/admin/faq-management",
      icon: IconDeviceDesktop,
      badge: null,
      items: [
        { title: "FAQ", url: "/admin/faq-management" },
        { title: "CMS", url: "/admin/cms-management" },
      ],
    },
    // {
    //   title: "Account Settings",
    //   url: "/admin/account-settings",
    //   icon: IconSettings,
    //   badge: null,
    // },
  ],
  navSecondary: [],
};

export default navigationData;
