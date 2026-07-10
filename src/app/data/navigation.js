import {
  IconLayoutDashboard,
  IconUsers,
  IconShieldCheck,
  IconCreditCard,
  IconGift,
  IconBell,
  IconTicket,
  IconFileText,
  IconUserCheck,
  IconUserPlus,
  IconSettings,
} from "@tabler/icons-react";
import { LuUserRoundCheck, LuUserRoundPlus, LuUsersRound } from "react-icons/lu";

const navigationData = {
  user: {
    name: "Admin",
    email: "admin@keenasmustard.com",
    avatar: "/assets/web/dummyImg.webp",
  },
  navMain: [
    // {
    //   title: "Analytics",
    //   url: "/admin/analytics",
    //   icon: IconChartLine,
    //   badge: null,
    // },
  ],
  navManagement: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconLayoutDashboard,
      badge: null,
    },
    {
      title: "User management",
      url: "/admin/management/users-management",
      icon: LuUsersRound,
      badge: null,
    },
    {
      title: "Fake profiles",
      url: "/admin/management/fake-profiles",
      icon: LuUserRoundPlus,
      badge: null,
    },
    {
      title: "Profile reports",
      url: "/admin/management/profile-reports",
      icon: LuUserRoundCheck,
      badge: null,
      badgeVariant: "destructive",
    },
    {
      title: "KYC Verification",
      url: "/admin/management/kyc-verifications",
      icon: IconShieldCheck,
      badge: null,
      badgeVariant: "destructive",
    },
    {
      title: "Subscriptions",
      url: "/admin/management/subscription-management",
      icon: IconCreditCard,
      badge: null,
      items: [
        {
          title: "Dashboard",
          url: "/admin/management/subscription-management",
        },
        // {
        //   title: "Subscribers",
        //   url: "/admin/management/subscription-management/subscribers",
        // },
        {
          title: "Manage Subscribers",
          url: "/admin/management/subscription-management/manage-subscribers",
        },
        {
          title: "Products",
          url: "/admin/management/subscription-management/products",
        },
        {
          title: "Config",
          url: "/admin/management/subscription-management/config",
        },
        {
          title: "Transactions",
          url: "/admin/management/subscription-management/transactions",
        },
      ],
    },
    {
      title: "Notifications",
      url: "/admin/management/all-notifications",
      icon: IconBell,
      badge: null,
    },
    {
      title: "Support Tickets",
      url: "/admin/management/support",
      icon: IconTicket,
      badge: null,
      badgeVariant: "premium",
    },
    {
      title: "Giveaways",
      url: "/admin/management/giveaway",
      icon: IconGift,
      badge: null,
      // items: [
      //   {
      //     title: "Prizes",
      //     url: "/admin/management/giveaway/prizes",
      //     icon: Trophy,
      //   },
      //   {
      //     title: "Campaigns",
      //     url: "/admin/management/giveaway/campaigns",
      //     icon: Trophy,
      //   },
      //   {
      //     title: "Bulk",
      //     url: "/admin/management/giveaway/bulk-campaigns",
      //     icon: Trophy,
      //   },
      //   {
      //     title: "Winners",
      //     url: "/admin/management/giveaway/winner",
      //     icon: Trophy,
      //   },
      //   {
      //     title: "Pending Deliveries",
      //     url: "/admin/management/giveaway/pending-deliveries",
      //     icon: Trophy,
      //   },
      //   {
      //     title: "Participants",
      //     url: "/admin/management/giveaway/participants",
      //     icon: Trophy,
      //   },
      // ],
    },
  ],
  navPlateform: [
    {
      title: "CMS",
      url: "/admin/cms/faqs",
      icon: IconFileText,
      items: [
        {
          title: "FAQ's",
          url: "/admin/cms/faqs",
        },
        {
          title: "Privacy Policy",
          url: "/admin/cms/privacy-policy",
        },
        {
          title: "Terms & Conditions",
          url: "/admin/cms/terms-conditions",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings/general",
      icon: IconSettings,
      items: [
        {
          title: "General",
          url: "/admin/settings/general",
        },
        // {
        //   title: "Social Media",
        //   url: "/admin/settings/social-media",
        // },
        {
          title: "Email",
          url: "/admin/settings/email",
        },
        {
          title: "Ads",
          url: "/admin/settings/ads-mob",
        },
        // {
        //   title: "Storage",
        //   url: "/admin/settings/storage",
        // },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      icon: IconSettings,
      items: [
        {
          title: "General",
          url: "/admin/settings/general",
        },
        {
          title: "Social Media",
          url: "/admin/settings/social-media",
        },
        {
          title: "Email",
          url: "/admin/settings/email",
        },
        {
          title: "Ads",
          url: "/admin/settings/ads",
        },
        {
          title: "Storage",
          url: "/admin/settings/storage",
        },
      ],
    },
  ],
};

export default navigationData;
