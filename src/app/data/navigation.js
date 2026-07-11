import {
  IconLayoutDashboard,
  IconUsersGroup,
  IconUsers,
  IconClipboardCheck,
  IconYoga,
  IconDatabaseCog,
  IconNews,
  IconCreditCard,
  IconReceipt,
  IconDeviceDesktop,
  IconBell,
  IconInfoCircle,
  IconUserCog,
} from "@tabler/icons-react";

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
      icon: IconUsersGroup,
      badge: null,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUsers,
      badge: null,
    },
    {
      title: "Manage Program",
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
      url: "/admin/data-management",
      icon: IconDatabaseCog,
      badge: null,
      items: [
        {
          title: "Overview",
          url: "/admin/data-management/overview",
        },
      ],
    },
    {
      title: "Blog Section",
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
      title: "Subscription Management",
      url: "/admin/subscription-management",
      icon: IconCreditCard,
      badge: null,
    },
    {
      title: "Transaction Management",
      url: "/admin/transaction-management",
      icon: IconReceipt,
      badge: null,
    },
    {
      title: "CMS Management",
      url: "/admin/cms-management",
      icon: IconDeviceDesktop,
      badge: null,
    },
    {
      title: "Notification Manage",
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
      icon: IconUserCog,
      badge: null,
    },
  ],
  navPlateform: [],
  navSecondary: [],
};

export default navigationData;
