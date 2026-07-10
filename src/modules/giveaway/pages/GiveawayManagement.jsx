import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GiftIcon,
  Gift,
  Truck,
  Crown,
  LayoutDashboard,
  Package,
  Award,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/headSubhead";
import PrizePage from "./prizes.page";
import CampaignsPage from "./campaigns.page";
import CampaignWinnerPage from "./campaign.winner.page";
import PendingDeliveriesPage from "./pending.deliveries.page";
import { useSelector } from "react-redux";
import { Container } from "@/components/common/container";

const TABS = [
  { key: "prizes", label: "Prizes", icon: GiftIcon },
  { key: "campaigns", label: "Campaigns", icon: LayoutDashboard },
  { key: "deliveries", label: "Deliveries", icon: Truck },
  { key: "winner", label: "Winners", icon: Crown },
];

export default function GiveawayManagement() {
  const { prizes } = useSelector((s) => s.prize);
  const { campaigns } = useSelector((s) => s.campaign);
  const { deliveries } = useSelector((s) => s.delivery);
  const { winner } = useSelector((s) => s.winner);

  const [tab, setTab] = useState(
    () => sessionStorage.getItem("giveawayManagementActiveTab") || "prizes",
  );

  // Save to sessionStorage whenever tab changes
  useEffect(() => {
    sessionStorage.setItem("giveawayManagementActiveTab", tab);
  }, [tab]);

  // Map the current tab to the corresponding count and label
  const getDynamicStat = () => {
    switch (tab) {
      case "prizes":
        return {
          count: prizes?.length || 0,
          label: "Total Prizes",
          icon: <Gift className="w-5 h-5 text-brand-aqua" strokeWidth={2.5} />,
        };
      case "campaigns":
        return {
          count: campaigns?.length || 0,
          label: "Total Campaigns",
          icon: (
            <LayoutDashboard
              className="w-5 h-5 text-brand-aqua"
              strokeWidth={2.5}
            />
          ),
        };
      case "deliveries":
        return {
          count: deliveries?.length || 0,
          label: "Pending Deliveries",
          icon: (
            <Package className="w-5 h-5 text-brand-aqua" strokeWidth={2.5} />
          ),
        };
      case "winner":
        return {
          count: winner?.length || 0,
          label: "Total Winners",
          icon: <Award className="w-5 h-5 text-brand-aqua" strokeWidth={2.5} />,
        };
      default:
        return {
          count: 0,
          label: "Items",
          icon: <Gift className="w-5 h-5 text-brand-aqua" strokeWidth={2.5} />,
        };
    }
  };

  const currentStat = getDynamicStat();

  return (
    <Container>
      <div className="w-full space-y-8">
        {/* ================= HEADER ================= */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <PageHeader
            heading="Giveaway Management"
            icon={<GiftIcon className="w-9 h-10 text-white" />}
            color="bg-brand-aqua shadow-brand-aqua/40"
            subheading="Manage prizes, campaigns, winners and deliveries from one centralized admin panel."
          />

          {/* Dynamic Quick Stats Summary */}
          <div className="gap-4 hidden lg:flex">
            <div className="group bg-white p-2 px-3 cursor-pointer rounded-xl border shadow-sm flex items-center gap-2 min-w-[130px] transition-all duration-300">
              <div className="p-1 rounded-lg transition-all duration-300">
                {currentStat.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold capitalize leading-tight">
                  {currentStat.label}
                </p>
                <p className="text-[11px] font-bold text-slate-600">
                  {currentStat.count} {tab === "winner" ? "Records" : "Items"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ================= TABS ================= */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="w-full">
            {/* Desktop Tab List (Restored to Old Design) */}
            <TabsList className="hidden lg:grid grid-cols-4 p-1 bg-slate-200/50 backdrop-blur-md rounded-2xl w-full max-w-xl h-12 border-none shadow-none">
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.key}
                  value={t.key}
                  className="rounded-xl px-2 py-2.5 flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brand-aqua text-slate-500 hover:text-slate-700 border-none shadow-none"
                >
                  <t.icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Mobile/Tablet Select Dropdown */}
            <div className="lg:hidden w-full max-w-full">
              <Select value={tab} onValueChange={setTab}>
                <SelectTrigger className="w-full h-11 bg-white border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-700 shadow-sm focus:ring-brand-aqua/20">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  {TABS.map((t) => (
                    <SelectItem
                      key={t.key}
                      value={t.key}
                      className="py-3 px-4 text-sm font-semibold text-slate-600 focus:bg-brand-aqua/5 focus:text-brand-aqua rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <t.icon className="w-4 h-4" />
                        {t.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Tabs>

        {/* ================= CONTENT SECTION ================= */}
        <main className="relative h-max">
          {tab === "prizes" && <PrizePage />}
          {tab === "campaigns" && <CampaignsPage />}
          {tab === "deliveries" && <PendingDeliveriesPage />}
          {tab === "winner" && <CampaignWinnerPage />}
        </main>
      </div>
    </Container>
  );
}
