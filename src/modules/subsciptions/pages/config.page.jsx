/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchConfig,
  saveConfig,
  upsertFeature,
  deleteFeature,
  fetchSubscriptionKPIs,
} from "../store/subscription.slice";
import { PageHeader } from "@/components/common/headSubhead";
import {
  Settings,
  Save,
  Loader2,
  RefreshCcw,
  Sparkles,
  Crown,
  Heart,
  Eye,
  Globe2,
  SlidersHorizontal,
  BanIcon,
  Trophy,
  Users,
  Calendar,
  RotateCcw,
  Zap,
  Star,
  Rocket,
  Shield,
  Info,
  Plus,
  Edit,
  Ellipsis,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FeatureDialog } from "../components/FeatureDialog";
import { PreLoader } from "@/app/loader/preloader";
import { Container } from "@/components/common/container";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiConnector } from "@/services/axios/axios.connector";
import { SUBSCRIPTION_ENDPOINTS } from "@/services/api-endpoints/subscriptions.endpoints";
import DashboardHead from "@/components/shared/dashboard.head";

export default function ConfigPage() {
  const dispatch = useDispatch();
  const {
    config,
    dynamicFeatures,
    configLoading,
    actionLoading,
    featuresLoading,
    subscriptionStats,
  } = useSelector((state) => state.subscription);

  // Local editable state — mirrors exact schema
  const [freeLimits, setFreeLimits] = useState({
    swipesPerDay: 30,
    rewindsPerDay: 3,
    superKeensPerWeek: 1,
    boostsPerMonth: 0,
  });
  const [premiumLimits, setPremiumLimits] = useState({
    swipesPerDay: -1,
    rewindsPerDay: -1,
    superKeensPerDay: 3,
    boostsPerMonth: 2,
  });
  const [premiumFeatures, setPremiumFeatures] = useState({
    seeWhoLikedYou: true,
    passport: true,
    advancedFilters: true,
    noAds: true,
  });
  const [milestone, setMilestone] = useState({
    targetUserCount: 1000,
    grantDurationDays: 30,
    isActive: true,
  });

  // ➕ Local Dynamic Features for Batch Saving
  const [localDynamicFeatures, setLocalDynamicFeatures] = useState([]);

  const [hasChanges, setHasChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState(null);

  // Feature Modal State
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [featureFormData, setFeatureFormData] = useState({
    key: "",
    name: "",
    description: "",
    icon: "",
    isActive: true,
    isPremiumOnly: true,
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Scroll visibility logic
  const [scrolled, setScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const sentinelRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: [0], rootMargin: "-1px 0px 0px 0px" },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    const handleScroll = () => {
      const currentScrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (currentScrollY <= 20) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, []);

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    key: null,
    loading: false,
    success: false,
  });

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const response = await apiConnector(
        "POST",
        SUBSCRIPTION_ENDPOINTS.UPLOAD_IMAGE,
        formData,
        { "Content-Type": "multipart/form-data" },
      );

      if (response && response.success) {
        setFeatureFormData((prev) => ({ ...prev, icon: response.url }));
        toast.success("Icon uploaded successfully");
      } else {
        toast.error(response?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchConfig());
    dispatch(fetchSubscriptionKPIs({ timeFilter: "today" }));
    // We don't fetchFeatures separately here anymore if we want batch save
  }, [dispatch]);

  // When config loads from API, populate local state
  useEffect(() => {
    if (config) {
      setFreeLimits({
        swipesPerDay: config.freeLimits?.swipesPerDay ?? 30,
        rewindsPerDay: config.freeLimits?.rewindsPerDay ?? 3,
        superKeensPerWeek: config.freeLimits?.superKeensPerWeek ?? 1,
        boostsPerMonth: config.freeLimits?.boostsPerMonth ?? 0,
      });
      setPremiumLimits({
        swipesPerDay: config.premiumLimits?.swipesPerDay ?? -1,
        rewindsPerDay: config.premiumLimits?.rewindsPerDay ?? -1,
        superKeensPerDay: config.premiumLimits?.superKeensPerDay ?? 3,
        boostsPerMonth: config.premiumLimits?.boostsPerMonth ?? 2,
      });
      setPremiumFeatures({
        seeWhoLikedYou: config.premiumFeatures?.seeWhoLikedYou ?? true,
        passport: config.premiumFeatures?.passport ?? true,
        advancedFilters: config.premiumFeatures?.advancedFilters ?? true,
        noAds: config.premiumFeatures?.noAds ?? true,
      });
      setMilestone({
        targetUserCount: config.milestone?.targetUserCount ?? 1000,
        grantDurationDays: config.milestone?.grantDurationDays ?? 30,
        isActive: config.milestone?.isActive ?? true,
      });

      // Load Dynamic Features into local state
      setLocalDynamicFeatures(config.dynamicFeatures || []);

      setOriginalConfig(config);
      setHasChanges(false);
    }
  }, [config]);

  // Track changes
  const markChanged = useCallback(() => setHasChanges(true), []);

  const updateFree = (key, value) => {
    const parsed = parseInt(value, 10);
    setFreeLimits((prev) => ({ ...prev, [key]: isNaN(parsed) ? 0 : parsed }));
    markChanged();
  };
  const updatePremium = (key, value) => {
    const parsed = parseInt(value, 10);
    setPremiumLimits((prev) => ({
      ...prev,
      [key]: isNaN(parsed) ? 0 : parsed,
    }));
    markChanged();
  };
  const updateFeature = (key, value) => {
    setPremiumFeatures((prev) => ({ ...prev, [key]: value }));
    markChanged();
  };
  const updateMilestone = (key, value) => {
    if (typeof value === "boolean") {
      setMilestone((prev) => ({ ...prev, [key]: value }));
    } else {
      const parsed = parseInt(value, 10);
      setMilestone((prev) => ({ ...prev, [key]: isNaN(parsed) ? 0 : parsed }));
    }
    markChanged();
  };

  // ➕ Update Local Dynamic Feature Toggle
  const updateDynamicFeatureLocal = (key, val) => {
    setLocalDynamicFeatures((prev) =>
      prev.map((f) => (f.key === key ? { ...f, isActive: val } : f)),
    );
    markChanged();
  };

  // PATCH — sends only changed sections
  const handleSave = async () => {
    const payload = {};

    if (
      JSON.stringify(freeLimits) !== JSON.stringify(originalConfig?.freeLimits)
    )
      payload.freeLimits = freeLimits;
    if (
      JSON.stringify(premiumLimits) !==
      JSON.stringify(originalConfig?.premiumLimits)
    )
      payload.premiumLimits = premiumLimits;
    if (
      JSON.stringify(premiumFeatures) !==
      JSON.stringify(originalConfig?.premiumFeatures)
    )
      payload.premiumFeatures = premiumFeatures;
    if (JSON.stringify(milestone) !== JSON.stringify(originalConfig?.milestone))
      payload.milestone = milestone;

    // Check for Dynamic Features Changes
    if (
      JSON.stringify(localDynamicFeatures) !==
      JSON.stringify(originalConfig?.dynamicFeatures)
    ) {
      payload.dynamicFeatures = localDynamicFeatures;
    }

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      return;
    }

    const result = await dispatch(saveConfig(payload));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Configuration updated successfully!");
      setHasChanges(false);
      setOriginalConfig(result.payload);
    } else {
      toast.error(result.payload || "Failed to update config");
    }
  };

  const handleReset = () => {
    if (originalConfig) {
      setFreeLimits(originalConfig.freeLimits);
      setPremiumLimits(originalConfig.premiumLimits);
      setPremiumFeatures(originalConfig.premiumFeatures);
      setMilestone(originalConfig.milestone);
      setLocalDynamicFeatures(originalConfig.dynamicFeatures || []); // Reset local dynamic features
      setHasChanges(false);
      toast.info("All changes reverted");
    }
  };

  // For Add/Edit, we still Use immediate save for structural changes to be safe
  const handleFeatureSubmit = async () => {
    const res = await dispatch(upsertFeature(featureFormData));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success(editingFeature ? "Feature updated" : "Feature created");
      setIsFeatureModalOpen(false);
      // Refresh local state to match backend
      setLocalDynamicFeatures(res.payload);
    } else {
      toast.error(res.payload || "Save failed");
    }
  };

  const handleDeleteFeature = async () => {
    const { key } = deleteConfirm;
    if (!key) return;

    try {
      setDeleteConfirm((prev) => ({ ...prev, loading: true, success: false }));
      const res = await dispatch(deleteFeature(key));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Perk deleted successfully");
        setLocalDynamicFeatures((prev) => prev.filter((f) => f.key !== key));
        setDeleteConfirm((prev) => ({
          ...prev,
          loading: false,
          success: true,
        }));
        setTimeout(() => {
          setDeleteConfirm({
            isOpen: false,
            key: null,
            loading: false,
            success: false,
          });
        }, 1500);
      } else {
        setDeleteConfirm((prev) => ({
          ...prev,
          loading: false,
          success: false,
        }));
        toast.error(res.payload || "Delete failed");
      }
    } catch (err) {
      setDeleteConfirm((prev) => ({ ...prev, loading: false, success: false }));
      toast.error("Delete failed");
    }
  };

  /* ======================== LOADING STATE ======================== */
  if (configLoading || !originalConfig) {
    return <PreLoader />;
  }

  return (
    <div className="flex flex-1 flex-col font-jakarta bg-slate-50 min-h-screen max-w-[100vw] relative">
      <div
        ref={sentinelRef}
        className="h-px w-full absolute top-0 pointer-events-none"
      />
      <motion.div
        className="@container/main space-y-4 relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <header
          className={cn(
            "sticky top-0 z-[50] px-3 md:px-6 py-3 transition-all duration-300 ease-in-out",
            scrolled
              ? "backdrop-blur-md bg-white/95 border-b border-slate-50"
              : "bg-slate-50 backdrop-blur-none border-b border-transparent",
            !isHeaderVisible && scrolled
              ? "-translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100",
          )}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <PageHeader
              heading="Subscription Config"
              subheading="Control quotas, feature toggles, and milestone programs"
              icon={<Settings className="w-10 h-10 text-white" />}
              color="bg-app-primary2"
            />
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {hasChanges && (
                <Button
                  variant="outline"
                  className="rounded-lg h-9 flex-1 lg:flex-none px-4 font-semibold border gap-2 bg-white hover:bg-brand-hoverAqua border-slate-300/60 text-muted-foreground hover:text-white shadow-sm"
                  onClick={handleReset}
                >
                  <RefreshCcw className="w-4 h-4" /> Revert
                </Button>
              )}
              <Button
                size="sm"
                className={cn(
                  "rounded-md h-9 flex-1 lg:flex-none px-4 font-semibold border gap-2 transition-all duration-300",
                  hasChanges
                    ? "bg-app-primary2 text-white hover:bg-brand-hoverAqua"
                    : "bg-white hover:bg-white/50 text-slate-400 hover:text-slate-600 border-slate-300/60 hover:border-slate-400 cursor-not-allowed shadow-none scale-95",
                )}
                onClick={handleSave}
                disabled={!hasChanges || actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {hasChanges ? "Save Changes" : "No Changes"}
              </Button>
            </div>
          </div>
        </header>

        {/* Config Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-6">
          {/* ─────────── CARD 1: Free User Limits ─────────── */}
          <ConfigCard
            Icon={Heart}
            title="Free User Limits"
            subtitle="Quota restrictions for non-premium users"
          >
            <QuotaField
              label="Swipes Per Day"
              description="Daily swipe quota for free users"
              value={freeLimits.swipesPerDay}
              onChange={(v) => updateFree("swipesPerDay", v)}
              min={0}
              max={100}
              icon={<Heart className="w-3.5 h-3.5" />}
            />
            <QuotaField
              label="Rewinds Per Day"
              description="How many times they can undo a swipe"
              value={freeLimits.rewindsPerDay}
              onChange={(v) => updateFree("rewindsPerDay", v)}
              min={0}
              max={20}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            />
            <QuotaField
              label="Super Keens Per Week"
              description="Weekly super keen allowance"
              value={freeLimits.superKeensPerWeek}
              onChange={(v) => updateFree("superKeensPerWeek", v)}
              min={0}
              max={10}
              icon={<Star className="w-3.5 h-3.5" />}
            />
            <QuotaField
              label="Super Charge Per Month"
              description="Monthly profile super charge (0 = disabled)"
              value={freeLimits.boostsPerMonth}
              onChange={(v) => updateFree("boostsPerMonth", v)}
              min={0}
              max={10}
              icon={<Rocket className="w-3.5 h-3.5" />}
            />
          </ConfigCard>

          {/* ─────────── CARD 2: Premium User Limits ─────────── */}
          <ConfigCard
            Icon={Crown}
            title="Premium User Limits"
            subtitle="Quota limits for subscribed users"
          >
            <QuotaField
              label="Swipes Per Day"
              description="-1 means unlimited swipes"
              value={premiumLimits.swipesPerDay}
              onChange={(v) => updatePremium("swipesPerDay", v)}
              min={-1}
              max={999}
              icon={<Heart className="w-3.5 h-3.5" />}
              allowUnlimited
            />
            <QuotaField
              label="Rewinds Per Day"
              description="-1 means unlimited rewinds"
              value={premiumLimits.rewindsPerDay}
              onChange={(v) => updatePremium("rewindsPerDay", v)}
              min={-1}
              max={999}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              allowUnlimited
            />
            <QuotaField
              label="Super Keens Per Day"
              description="Daily super keens for premium"
              value={premiumLimits.superKeensPerDay}
              onChange={(v) => updatePremium("superKeensPerDay", v)}
              min={-1}
              max={999}
              icon={<Star className="w-3.5 h-3.5" />}
              allowUnlimited
            />
            <QuotaField
              label="Super Charge Per Month"
              description="Monthly super charge quota for premium"
              value={premiumLimits.boostsPerMonth}
              onChange={(v) => updatePremium("boostsPerMonth", v)}
              min={-1}
              max={100}
              icon={<Rocket className="w-3.5 h-3.5" />}
              allowUnlimited
            />
          </ConfigCard>

          {/* ─────────── CARD 3: DYNAMIC Perk Manager ─────────── */}
          <ConfigCard
            Icon={Sparkles}
            title="Premium Feature Manager"
            subtitle="Fully dynamic perks shown to users"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <p className="text-[10px] font-medium text-slate-400">
                Manage all app-wide features dynamically.
              </p>
              <Button
                size="sm"
                className="h-9 w-full sm:w-auto rounded-lg bg-white hover:bg-brand-hoverAqua text-slate-500 hover:text-white shadow-sm border hover:border-none text-[10px] font-bold uppercase tracking-tight gap-1 transition-all duration-300"
                onClick={() => {
                  setEditingFeature(null);
                  setFeatureFormData({
                    key: "",
                    name: "",
                    description: "",
                    icon: "",
                    isActive: true,
                    isPremiumOnly: true,
                  });
                  setIsFeatureModalOpen(true);
                }}
              >
                <Plus className="w-3 h-3" /> Add Perk
              </Button>
            </div>
            <div className="space-y-3">
              {localDynamicFeatures?.map((feature) => (
                <DynamicFeatureItem
                  key={feature.key}
                  feature={feature}
                  onEdit={(f) => {
                    setEditingFeature(f);
                    setFeatureFormData(f);
                    setIsFeatureModalOpen(true);
                  }}
                  onToggle={(key, val) => updateDynamicFeatureLocal(key, val)}
                  onDelete={(key) => setDeleteConfirm({ isOpen: true, key })}
                />
              ))}
            </div>
          </ConfigCard>

          {/* ─────────── CARD 4: Milestone Program ─────────── */}
          <ConfigCard
            Icon={Trophy}
            title="Milestone Program"
            subtitle="Grant free premium to early adopters"
          >
            <FeatureToggle
              label="Program Active"
              description="Enable / disable the milestone program"
              checked={milestone.isActive}
              onCheckedChange={(v) => updateMilestone("isActive", v)}
              icon={<Shield className="w-4 h-4" />}
            />
            <QuotaField
              label="Target User Count"
              description="First 1000 signups get free premium"
              value={milestone.targetUserCount}
              onChange={(v) => updateMilestone("targetUserCount", v)}
              min={1}
              max={100000}
              icon={<Users className="w-3.5 h-3.5" />}
            />
            <QuotaField
              label="Grant Duration (Days)"
              description="How many days of free premium they get"
              value={milestone.grantDurationDays}
              onChange={(v) => updateMilestone("grantDurationDays", v)}
              min={1}
              max={365}
              icon={<Calendar className="w-3.5 h-3.5" />}
            />
            <div className="bg-emerald-50/10 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Milestone Progress
                </span>
                <Badge className="bg-emerald-100/50 rounded-xl text-emerald-600 border-none font-bold text-[10px]">
                  {milestone.isActive ? "LIVE" : "PAUSED"}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress
                  value={
                    ((subscriptionStats?.kpis?.milestone?.currentCount || 0) /
                      milestone.targetUserCount) *
                    100
                  }
                  className="h-2 flex-1 bg-emerald-200"
                />
                <span className="text-xs font-black text-emerald-800">
                  {subscriptionStats?.kpis?.milestone?.currentCount || 0} /{" "}
                  {milestone.targetUserCount}
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 font-medium">
                Each qualifying user receives {milestone.grantDurationDays} days
                of free premium access.
              </p>
            </div>
          </ConfigCard>
        </div>

        <div className="pb-10 mx-6">
          <div className="bg-slate-800 rounded-xl p-6 flex items-start gap-4 shadow-xl">
            <div className="p-2 bg-app-primary2 rounded-xl mt-0.5">
              <Info className="w-5 h-5 text-brand-blue" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-black text-white">
                How Config Changes Work
              </h4>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                Changes take effect{" "}
                <span className="text-brand-blue font-bold">immediately</span>{" "}
                after saving. Free/Premium limits control daily quotas.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <FeatureDialog
        open={isFeatureModalOpen}
        setOpen={setIsFeatureModalOpen}
        editing={!!editingFeature}
        formData={featureFormData}
        setFormData={setFeatureFormData}
        onSubmit={handleFeatureSubmit}
        loading={actionLoading}
        isUploading={isUploading}
        onFileUpload={handleIconUpload}
        fileInputRef={fileInputRef}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => {
          if (deleteConfirm.loading || deleteConfirm.success) return;
          setDeleteConfirm({
            isOpen: false,
            key: null,
            loading: false,
            success: false,
          });
        }}
        onConfirm={handleDeleteFeature}
        title="Delete Premium Perk"
        message="Are you sure you want to delete this perk? This will remove it from all subscription plans immediately."
        confirmText="Delete Perk"
        type="danger"
        loading={deleteConfirm.loading}
        success={deleteConfirm.success}
      />
    </div>
  );
}

/* ======================== REUSABLE COMPONENTS ======================== */

const ConfigCard = ({ Icon, title, subtitle, children }) => {
  return (
    <Card className="rounded-xl border-slate-300/60 gap-2 shadow-sm overflow-hidden bg-white py-5 transition-all duration-300">
      <CardHeader className="px-5 border-b border-slate-300/60">
        <div className="flex items-center justify-between pb-2">
          <DashboardHead
            title={title}
            subtitle={subtitle}
            Icon={Icon}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
          />
        </div>
      </CardHeader>
      <CardContent className="px-5 space-y-5">{children}</CardContent>
    </Card>
  );
};

const QuotaField = ({
  label,
  description,
  value,
  onChange,
  min,
  max,
  icon,
  allowUnlimited,
}) => {
  const isUnlimited = value === -1;

  return (
    <div className="group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-slate-100/50 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors">
            {icon}
          </span>
          <Label
            className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
            // className="text-xs font-semibold text-foreground/80"
          >
            {label}
          </Label>
        </div>

        {allowUnlimited && isUnlimited && (
          <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 animate-pulse">
            Unlimited
          </Badge>
        )}
      </div>

      {description && (
        <p className="text-[10px] font-medium text-slate-400 mb-2 pl-[34px]">
          {description}
        </p>
      )}

      <div className="flex items-center gap-2 my-3 mx-4">
        <Input
          type="number"
          className={cn(
            "h-10 rounded-lg border font-bold text-xs transition-all focus:ring-0 focus-visible:ring-0 focus:border-slate-500 focus-visible:border-slate-500 outline-none",
            isUnlimited
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-slate-50 text-slate-800 border-slate-300/60",
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
        />
        {allowUnlimited && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "rounded-lg h-10 px-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
              isUnlimited
                ? "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
                : "bg-slate-50 text-slate-400 border-slate-300/60 hover:bg-slate-100",
            )}
            onClick={() => onChange(isUnlimited ? "0" : "-1")}
          >
            {isUnlimited ? "Set Limit" : "∞ Unlimited"}
          </Button>
        )}
      </div>
    </div>
  );
};

const FeatureToggle = ({
  label,
  description,
  checked,
  onCheckedChange,
  icon,
}) => (
  <div className="flex items-center justify-between py-3 rounded-2xl transition-all group">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div
        className={cn(
          "p-2 rounded-xl transition-all duration-300",
          checked
            ? "bg-app-primary2 text-brand-blue"
            : "bg-slate-200/60 text-slate-400",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-slate-800 truncate">{label}</p>
        {description && (
          <p className="text-[10px] font-medium text-slate-400 truncate">
            {description}
          </p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2 ml-3">
      <span
        className={cn(
          "text-[10px] font-black uppercase tracking-widest transition-colors",
          checked ? "text-brand-blue" : "text-slate-400",
        )}
      >
        {checked ? "ON" : "OFF"}
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={"bg-app-primary2"}
      />
    </div>
  </div>
);

/* ======================== DYNAMIC FEATURE COMPONENTS ======================== */

const DynamicFeatureItem = ({ feature, onEdit, onToggle, onDelete }) => (
  <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-xl group hover:border-brand-blue transition-all shadow-sm">
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "p-2 rounded-lg flex items-center justify-center",
          feature.isActive
            ? "bg-app-primary2 text-brand-blue"
            : "bg-slate-100 text-slate-400",
        )}
      >
        {LucideIcon(feature.icon)}
      </div>
      <div>
        <h5 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
          {feature.name}
          {feature.isPremiumOnly && (
            <Badge className="h-4 bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 uppercase border-none">
              Premium
            </Badge>
          )}
        </h5>
        <p className="text-[10px] font-medium text-slate-400 line-clamp-1">
          {feature.description}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg text-slate-400 hover:text-brand-blue"
        onClick={() => onEdit(feature)}
      >
        <Edit className="w-3.5 h-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-slate-400"
          >
            <Ellipsis className="w-3.5 h-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-xl border-slate-100"
        >
          <DropdownMenuItem
            className="text-xs font-bold gap-2"
            onClick={() => onToggle(feature.key, !feature.isActive)}
          >
            {feature.isActive ? "Disable" : "Enable"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs font-bold gap-2 text-rose-600"
            onClick={() => onDelete(feature.key)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Switch
        checked={feature.isActive}
        onCheckedChange={(val) => onToggle(feature.key, val)}
        className="scale-75 data-[state=checked]:bg-app-primary2"
      />
    </div>
  </div>
);

const LucideIcon = (name) => {
  if (
    name &&
    (name.startsWith("http") ||
      name.startsWith("//") ||
      name.startsWith("data:") ||
      name.startsWith("/"))
  ) {
    const src = name.startsWith("//") ? `https:${name}` : name;
    return <img src={src} alt="icon" className="w-5 h-5 object-contain" />;
  }
  const icons = {
    Sparkles: <Sparkles className="w-5 h-5" />,
    Eye: <Eye className="w-5 h-5" />,
    Globe2: <Globe2 className="w-5 h-5" />,
    SlidersHorizontal: <SlidersHorizontal className="w-5 h-5" />,
    BanIcon: <BanIcon className="w-5 h-5" />,
    Heart: <Heart className="w-5 h-5" />,
    Crown: <Crown className="w-5 h-5" />,
    Zap: <Zap className="w-5 h-5" />,
    Star: <Star className="w-5 h-5" />,
    Shield: <Shield className="w-5 h-5" />,
    Rocket: <Rocket className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
    Trophy: <Trophy className="w-5 h-5" />,
  };
  return icons[name] || <Sparkles className="w-5 h-5 text-slate-300" />;
};
