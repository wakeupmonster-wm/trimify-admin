import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  updateProduct,
} from "../store/subscription.slice";
import { Plus } from "lucide-react";
import {
  IconSearch,
  IconX,
  IconPackage,
  IconShoppingBag,
  IconArchive,
  IconStack2,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "../components/Dialogs/ProductDialog";
import { getProductsColumns } from "../components/products.columns";
import { ProductsDataTable } from "../components/ProductsDataTable";
import { PageHeader } from "@/components/common/headSubhead";
import StatsGrid from "@/components/common/stats.grid";
import { Container } from "@/components/common/container";
import { bgMap, colorMap } from "@/constants/colors";
import { GrCatalog } from "react-icons/gr";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────── */
const EMPTY_PRODUCT = {
  productKey: "",
  type: "SUBSCRIPTION",
  category: "PREMIUM_PLAN",
  displayName: "",
  displayPrice: "",
  currency: "AUD",
  isActive: true,
  sortOrder: 0,
  planType: "monthly",
  durationDays: 30,
  itemCategory: "SUPER_KEEN",
  quantity: 10,
  appleProductId: "",
  googleProductId: "",
  badgeText: "",
  badgeColor: "#00BCD4",
  subtitle: "",
  badge: "",
  features: [],
};

const CATEGORY_MAP = {
  PREMIUM_PLAN: {
    label: "Premium Plan",
    color: "text-brand-blue",
  },
  SUPER_KEEN: { label: "Super Keen", color: "text-amber-600" },
  SUPERCHARGE: {
    label: "Supercharge",
    color: "text-amber-600",
  },
};

/* ────────────────── MAIN PAGE ────────────────── */
export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, productsLoading, actionLoading } = useSelector(
    (state) => state.subscription,
  );

  const [activeTab, setActiveTab] = useState(
    () => sessionStorage.getItem("productsManagementActiveTab") || "all",
  );
  const [searchQuery, setSearchQuery] = useState(
    () => sessionStorage.getItem("productsManagementSearchQuery") || "",
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_PRODUCT });
  const [pagination, setPagination] = useState(() => {
    const saved = sessionStorage.getItem("productsManagementPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });
  const [editTargetKey, setEditTargetKey] = useState(null);
  const [sortCol, setSortCol] = useState("sortOrder");
  const [sortDir, setSortDir] = useState("asc");

  // Save to sessionStorage whenever filters change
  useEffect(() => {
    sessionStorage.setItem("productsManagementActiveTab", activeTab);
    sessionStorage.setItem("productsManagementSearchQuery", searchQuery);
    sessionStorage.setItem(
      "productsManagementPagination",
      JSON.stringify(pagination),
    );
  }, [activeTab, searchQuery, pagination]);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 100 }));
  }, [dispatch]);

  const allProducts = products || [];

  const stats = useMemo(() => {
    return {
      total: allProducts.length,
      subs: allProducts.filter((p) => p.type === "SUBSCRIPTION" && p.isActive)
        .length,
      consumables: allProducts.filter(
        (p) => p.type === "CONSUMABLE" && p.isActive,
      ).length,
      archived: allProducts.filter((p) => !p.isActive).length,
    };
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (activeTab === "subscriptions")
      result = result.filter((p) => p.type === "SUBSCRIPTION" && p.isActive);
    else if (activeTab === "consumables")
      result = result.filter((p) => p.type === "CONSUMABLE" && p.isActive);
    else if (activeTab === "archived")
      result = result.filter((p) => !p.isActive);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.displayName?.toLowerCase().includes(q) ||
          p.productKey?.toLowerCase().includes(q) ||
          p.appleProductId?.toLowerCase().includes(q) ||
          p.googleProductId?.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      let aVal = a[sortCol];
      let bVal = b[sortCol];
      if (typeof aVal === "number" || typeof bVal === "number") {
        aVal = aVal ?? 0;
        bVal = bVal ?? 0;
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      aVal = aVal ?? "";
      bVal = bVal ?? "";
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [allProducts, activeTab, searchQuery, sortCol, sortDir]);

  const paginatedProducts = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return filteredProducts.slice(start, start + pagination.pageSize);
  }, [filteredProducts, pagination]);

  const totalPages = Math.ceil(filteredProducts.length / pagination.pageSize);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({ ...EMPTY_PRODUCT });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setIsEditMode(true);
    setEditTargetKey(product.productKey);
    setFormData({
      ...EMPTY_PRODUCT,
      ...product,
      features: product.features || [],
      badgeText: product.badgeText || "",
      badgeColor: product.badgeColor || "#00BCD4",
      subtitle: product.subtitle || null,
      badge: product.badge || null,
      category:
        product.category ||
        (product.type === "SUBSCRIPTION"
          ? "PREMIUM_PLAN"
          : product.consumableType === "BOOST"
            ? "SUPERCHARGE"
            : product.consumableType || "SUPER_KEEN"),
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.productKey || !formData.displayName || !formData.displayPrice)
      return toast.error("Product Key, Name and Reference Price are required");
    if (!formData.appleProductId || !formData.googleProductId)
      return toast.error("Apple and Google Product IDs are required");

    const payload = { ...formData };
    if (payload.type === "SUBSCRIPTION") {
      delete payload.itemCategory;
      delete payload.quantity;
      delete payload.consumableType;
    } else {
      delete payload.planType;
      delete payload.durationDays;
      delete payload.features;
      payload.consumableType =
        payload.category === "SUPERCHARGE" || payload.category === "BOOST"
          ? "BOOST"
          : "SUPER_KEEN";
    }

    if (isEditMode) {
      const result = await dispatch(
        updateProduct({ productKey: editTargetKey, data: payload }),
      );
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(`'${formData.displayName}' updated!`);
        setIsFormOpen(false);
      } else toast.error(result.payload || "Failed to update");
    } else {
      const result = await dispatch(createProduct(payload));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(`'${formData.displayName}' created!`);
        setIsFormOpen(false);
      } else toast.error(result.payload || "Failed to create");
    }
  };

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addFeature = () =>
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), ""],
    }));

  const updateFeature = (i, val) =>
    setFormData((prev) => {
      const f = [...(prev.features || [])];
      f[i] = val;
      return { ...prev, features: f };
    });

  const removeFeature = (i) =>
    setFormData((prev) => {
      const f = [...(prev.features || [])];
      f.splice(i, 1);
      return { ...prev, features: f };
    });

  const tabs = [
    { key: "all", label: "All", count: stats.total },
    { key: "subscriptions", label: "Subscriptions", count: stats.subs },
    { key: "consumables", label: "Consumables", count: stats.consumables },
    { key: "archived", label: "Archived", count: stats.archived },
  ];

  const statsData = useMemo(
    () => [
      {
        label: "Total Products",
        val: stats.total,
        icon: <IconStack2 size={22} />,
        color: "blue",
        description: "All products in catalog",
      },
      {
        label: "Subscriptions",
        val: stats.subs,
        icon: <IconPackage size={22} />,
        color: "emerald",
        description: "Active subscription plans",
      },
      {
        label: "Consumables",
        val: stats.consumables,
        icon: <IconShoppingBag size={22} />,
        color: "rose",
        description: "Active consumable packs",
      },
      {
        label: "Archived",
        val: stats.archived,
        icon: <IconArchive size={22} />,
        color: "blue",
        description: "Inactive products",
      },
    ],
    [stats],
  );

  return (
    <Container>
      <div className="@container/main space-y-5">
        {/* ─── HEADER ─── */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <PageHeader
              heading="Product Catalog"
              icon={
                <GrCatalog strokeWidth={2} className="w-9 h-9 text-white" />
              }
              color="bg-app-primary2 shadow-brand-blue"
              subheading="Manage subscription plans & consumable packs."
            />
            <div className="flex items-center gap-2 w-full lg:w-auto">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(fetchProducts({ page: 1, limit: 100 }))}
                disabled={productsLoading}
                className="h-9 flex-1 lg:flex-none border border-slate-300/60 hover:bg-app-primary5 text-slate-400 hover:text-white transition-all active:scale-95"
              >
                <IconRefresh
                  className={cn(
                    "h-4 w-4 mr-1.5",
                    productsLoading && "animate-spin",
                  )}
                />
                Refresh
              </Button> */}
              <Button
                size="sm"
                onClick={handleOpenCreate}
                className="h-9 flex-1 lg:flex-none border border-slate-300/60 shadow-sm bg-slate-50 hover:bg-app-primary5 text-slate-400 hover:text-white transition-all active:scale-95"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        </header>

        {/* ─── STATS GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsGrid
            stats={statsData}
            colorMap={colorMap}
            bgMap={bgMap}
            onCardClick={(label) => {
              // Reset filters first
              setSearchQuery("");
              if (label === "Total Products") {
                setActiveTab("all");
              } else if (label === "Subscriptions") {
                setActiveTab("subscriptions");
              } else if (label === "Consumables") {
                setActiveTab("consumables");
              } else if (label === "Archived") {
                setActiveTab("archived");
              }
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
          />
        </div>

        {/* ─── TOOLBAR (Tabs + Search) ─── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 ">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
              <Input
                placeholder="Search by name, key or product ID..."
                className="pl-9 pr-10 bg-white border-slate-300/60 h-9 3xl:h-10 placeholder:text-slate-400 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-brand-blue rounded-md w-full transition-all outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination((p) => ({ ...p, pageIndex: 0 }));
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 group flex items-center justify-center rounded-full p-0.5 bg-slate-100 transition-colors"
                >
                  <IconX className="h-3 w-3 text-slate-600 group-hover:text-white transition-colors" />
                </button>
              )}
            </div>

            {/* Tabs & Select Dropdown */}
            <div className="w-full md:w-auto">
              {/* Mobile Select */}
              <div className="lg:hidden w-max">
                <Select
                  value={activeTab}
                  onValueChange={(val) => {
                    setActiveTab(val);
                    setPagination((p) => ({ ...p, pageIndex: 0 }));
                  }}
                >
                  <SelectTrigger className="h-10 w-full bg-white border-slate-300/60 text-xs font-black uppercase tracking-wider focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 rounded-lg shadow-sm">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-300/60">
                    {tabs.map((tab) => (
                      <SelectItem
                        key={tab.key}
                        value={tab.key}
                        className="text-[10px] font-black uppercase tracking-widest focus:bg-app-primary2 focus:text-brand-blue"
                      >
                        <div className="flex flex-1 items-center justify-between w-full gap-8">
                          <span>{tab.label}</span>
                          <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full text-[9px]">
                            {tab.count}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop Tabs */}
              <div className="hidden lg:flex items-center gap-2 bg-white border border-slate-300/60 rounded-lg p-1 shadow-sm scrollbar-none">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setPagination((p) => ({ ...p, pageIndex: 0 }));
                    }}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
                      activeTab === tab.key
                        ? "bg-app-primary2 text-white shadow-md shadow-brand-blue"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    {tab.label}
                    <span
                      className={cn(
                        "text-[9px] font-black px-1.5 py-0.5 rounded-full transition-colors",
                        activeTab === tab.key
                          ? "bg-white text-brand-blue"
                          : "bg-slate-100 text-slate-400",
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── DATA TABLE ─── */}
        <div>
          <ProductsDataTable
            columns={getProductsColumns(
              handleOpenEdit,
              handleSort,
              sortCol,
              sortDir,
            )}
            data={paginatedProducts}
            loading={productsLoading}
            searchQuery={searchQuery}
            pagination={pagination}
            setPagination={setPagination}
            totalPages={totalPages}
            filteredCount={filteredProducts.length}
          />
        </div>

        {/* ── EDIT / CREATE DIALOG ── */}
        <ProductDialog
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          isEditMode={isEditMode}
          editTargetKey={editTargetKey}
          formData={formData}
          updateField={updateField}
          addFeature={addFeature}
          updateFeature={updateFeature}
          removeFeature={removeFeature}
          handleSubmit={handleSubmit}
          actionLoading={actionLoading}
          CATEGORY_MAP={CATEGORY_MAP}
        />
      </div>
    </Container>
  );
}
