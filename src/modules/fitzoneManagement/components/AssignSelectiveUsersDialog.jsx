import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useDebounce } from "../../../hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  getFitzoneAssignableUsersAPI,
  assignFitzoneToSelectedUsersAPI,
  unassignFitzoneUserAPI,
} from "../services/fitzone.services";
import { toast } from "sonner";
import {
  Search,
  Users,
  CheckCircle2,
  Loader2,
  UserCheck,
  UserPlus,
  Sparkles,
} from "lucide-react";

export const AssignSelectiveUsersDialog = ({ open, onOpenChange, fitzone, onSuccess }) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [filter, setFilter] = useState("all"); // 'all' | 'unassigned' | 'assigned'
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPage: 1 });
  const [fitzoneMeta, setFitzoneMeta] = useState(null);

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [actionInProgress, setActionInProgress] = useState({}); // { [userId]: 'assign' | 'unassign' }
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!fitzone?.id) return;
    setLoading(true);
    try {
      const res = await getFitzoneAssignableUsersAPI(fitzone.id, {
        search: debouncedSearch,
        filter,
        page,
        limit,
      });

      if (res && res.status === "success") {
        setUsersData(res.users || []);
        setPagination({
          page: res.pagination?.page || res.pagination?.current_page || page,
          total: res.pagination?.total || 0,
          totalPage: res.pagination?.totalPage || res.pagination?.last_page || 1,
        });
        if (res.fitzone) {
          setFitzoneMeta(res.fitzone);
        }
      } else {
        toast.error(res?.message || "Failed to load users for assignment.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error fetching users list.");
    } finally {
      setLoading(false);
    }
  }, [fitzone?.id, debouncedSearch, filter, page, limit]);

  useEffect(() => {
    if (open) {
      fetchUsers();
    } else {
      setSearch("");
      setFilter("all");
      setPage(1);
      setSelectedUserIds([]);
    }
  }, [open, fetchUsers]);

  // Reset page to 1 when search or filter or limit changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter, limit]);

  // Available unassigned users on current page
  const unassignedOnPage = useMemo(() => {
    return usersData.filter((u) => !u.is_assigned);
  }, [usersData]);

  const isAllUnassignedSelected = useMemo(() => {
    if (unassignedOnPage.length === 0) return false;
    return unassignedOnPage.every((u) => selectedUserIds.includes(u.id));
  }, [unassignedOnPage, selectedUserIds]);

  const handleToggleSelectAll = () => {
    if (isAllUnassignedSelected) {
      const unassignedIds = new Set(unassignedOnPage.map((u) => u.id));
      setSelectedUserIds((prev) => prev.filter((id) => !unassignedIds.has(id)));
    } else {
      const currentIds = new Set(selectedUserIds);
      unassignedOnPage.forEach((u) => currentIds.add(u.id));
      setSelectedUserIds(Array.from(currentIds));
    }
  };

  const handleToggleUser = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Assign single user
  const handleAssignSingle = async (userId) => {
    if (!fitzone?.id) return;
    setActionInProgress((prev) => ({ ...prev, [userId]: "assign" }));
    try {
      const res = await assignFitzoneToSelectedUsersAPI(fitzone.id, [userId]);
      if (res && res.status === "success") {
        toast.success(res.message || "User assigned to Fitzone successfully.");
        // Optimistic update
        setUsersData((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, is_assigned: true, assigned_categories_count: u.eligible_categories_count || 1 }
              : u
          )
        );
        setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
        fetchUsers();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res?.message || "Failed to assign Fitzone to user.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error assigning Fitzone.");
    } finally {
      setActionInProgress((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    }
  };

  // Unassign single user
  const handleUnassignSingle = async (userId) => {
    if (!fitzone?.id) return;
    setActionInProgress((prev) => ({ ...prev, [userId]: "unassign" }));
    try {
      const res = await unassignFitzoneUserAPI(fitzone.id, userId);
      if (res && res.status === "success") {
        toast.success(res.message || "User unassigned from Fitzone successfully.");
        // Optimistic update
        setUsersData((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, is_assigned: false, assigned_categories_count: 0 }
              : u
          )
        );
        fetchUsers();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res?.message || "Failed to unassign user.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error unassigning user.");
    } finally {
      setActionInProgress((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    }
  };

  // Bulk assign selected users
  const handleBulkAssign = async () => {
    if (selectedUserIds.length === 0 || !fitzone?.id) return;
    setIsBulkAssigning(true);
    try {
      const res = await assignFitzoneToSelectedUsersAPI(fitzone.id, selectedUserIds);
      if (res && res.status === "success") {
        toast.success(res.message || `Assigned Fitzone to ${selectedUserIds.length} user(s).`);
        const setIds = new Set(selectedUserIds);
        setUsersData((prev) =>
          prev.map((u) =>
            setIds.has(u.id)
              ? { ...u, is_assigned: true, assigned_categories_count: u.eligible_categories_count || 1 }
              : u
          )
        );
        setSelectedUserIds([]);
        fetchUsers();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res?.message || "Failed to complete bulk assignment.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error in bulk assignment.");
    } finally {
      setIsBulkAssigning(false);
    }
  };

  // Pagination calculation matching DataTablePagination
  const totalPages = pagination.totalPage || 1;
  const currentPage = pagination.page || 1;
  const rowCount = pagination.total || 0;
  const startRow = rowCount > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endRow = Math.min(currentPage * limit, rowCount);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-0 gap-0 overflow-hidden rounded-2xl border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-app-primary2">
                  <UserPlus className="w-5 h-5" />
                </span>
                <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
                  Assign Fitzone to Users
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-slate-600">
                Fitzone: <span className="font-semibold text-slate-800">{fitzone?.title || "Fitzone"}</span>
                {fitzoneMeta?.eligible_categories_count !== undefined && (
                  <span className="ml-2 text-slate-500">
                    ({fitzoneMeta.eligible_categories_count} active category/categories)
                  </span>
                )}
              </DialogDescription>
            </div>
            {fitzoneMeta && (
              <Badge
                variant="outline"
                className={`text-[11px] px-2.5 py-0.5 font-semibold ${
                  fitzoneMeta.is_available
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {fitzoneMeta.is_available ? "Ready for Assignment" : "Setup Incomplete"}
              </Badge>
            )}
          </div>

          {/* Search and Filters Bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-app-primary2"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 w-full sm:w-auto self-stretch">
              {[
                { id: "all", label: "All Users" },
                { id: "unassigned", label: "Not Assigned" },
                { id: "assigned", label: "Assigned" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`flex-1 sm:flex-none px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    filter === tab.id
                      ? "bg-white text-app-primary2 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* Selected info row if items selected */}
        {selectedUserIds.length > 0 && (
          <div className="px-6 py-2 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {selectedUserIds.length} user(s) selected
            </span>
            <button
              type="button"
              onClick={() => setSelectedUserIds([])}
              className="text-[11px] font-medium text-blue-700 hover:text-blue-900 underline"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Table Content */}
        <div className="px-6 py-3 max-h-[360px] min-h-[240px] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-app-primary2" />
              <span className="text-xs font-medium">Loading users list...</span>
            </div>
          ) : usersData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">No users found</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {search
                  ? `No matching users found for "${search}"`
                  : "No users available for the selected filter."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500">
                  <th className="py-2 px-2 w-10 text-center">
                    <Checkbox
                      checked={isAllUnassignedSelected}
                      onCheckedChange={handleToggleSelectAll}
                      disabled={unassignedOnPage.length === 0}
                      aria-label="Select all unassigned users"
                    />
                  </th>
                  <th className="py-2 px-2">User Details</th>
                  <th className="py-2 px-2 hidden sm:table-cell">Contact</th>
                  <th className="py-2 px-2 text-center">Status</th>
                  <th className="py-2 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersData.map((user) => {
                  const isChecked = selectedUserIds.includes(user.id);
                  const isAssigningThis = actionInProgress[user.id] === "assign";
                  const isUnassigningThis = actionInProgress[user.id] === "unassign";

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? "bg-blue-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-2 text-center">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleUser(user.id)}
                          disabled={user.is_assigned}
                          aria-label={`Select ${user.name}`}
                        />
                      </td>

                      {/* Name & Email */}
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center uppercase shrink-0">
                            {user.name ? user.name.charAt(0) : "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">
                              {user.name || "-"}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">{user.email || "-"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-2.5 px-2 hidden sm:table-cell text-xs text-slate-600">
                        {user.mobileNo || "-"}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-2 text-center">
                        {user.is_assigned ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Assigned
                          </span>
                        ) : user.partially_assigned ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            Partial ({user.assigned_categories_count}/{user.eligible_categories_count})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-2 text-right">
                        {user.is_assigned ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnassignSingle(user.id)}
                            disabled={isUnassigningThis}
                            className="h-7 px-2.5 text-[11px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                          >
                            {isUnassigningThis ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Unassign"
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignSingle(user.id)}
                            disabled={isAssigningThis}
                            className="h-7 px-3 text-[11px] font-semibold text-app-primary2 border-blue-200 hover:bg-app-primary2 hover:text-white rounded-md transition-all shadow-xs"
                          >
                            {isAssigningThis ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Assign"
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Consistent Pagination matching DataTablePagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:px-6 sm:py-3.5 border-t border-slate-300/60 gap-3 bg-slate-50/60">
          {/* Left Side: Showing results count */}
          <div className="text-xs font-medium text-slate-500 text-left w-full sm:w-auto">
            Showing {rowCount > 0 ? startRow : 0}-{endRow} of {rowCount} users
          </div>

          {/* Right Side: Rows + Page Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Rows Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                Rows
              </span>
              <Select
                value={`${limit}`}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-7 sm:h-8 w-[60px] border-slate-300/60 rounded-md bg-white text-xs font-semibold focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-300/60 shadow-xl">
                  {[10, 20, 50].map((size) => (
                    <SelectItem
                      key={size}
                      value={`${size}`}
                      className="text-xs font-medium rounded-lg"
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shrink-0"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || loading}
              >
                <IconChevronLeft size={16} />
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span
                        key={`dots-${idx}`}
                        className="px-1 text-slate-400 text-xs font-bold"
                      >
                        ...
                      </span>
                    );
                  }
                  const isActive = currentPage === p;
                  return (
                    <Button
                      key={p}
                      onClick={() => setPage(p)}
                      disabled={loading}
                      className={cn(
                        "h-7 min-w-[28px] sm:h-8 sm:min-w-[32px] px-2 text-[10px] sm:text-xs font-bold rounded-md transition-all",
                        isActive
                          ? "bg-app-primary2 text-white hover:bg-app-primary3 shadow-md shadow-blue-100 border-none"
                          : "bg-white border border-slate-300/60 text-slate-600 hover:bg-slate-50 hover:border-slate-300/60 shadow-none"
                      )}
                    >
                      {p}
                    </Button>
                  );
                })}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shrink-0"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || loading}
              >
                <IconChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {selectedUserIds.length > 0 ? (
              <span className="font-semibold text-blue-700">
                {selectedUserIds.length} user(s) selected for assignment
              </span>
            ) : (
              "Select checkboxes to assign multiple users"
            )}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs font-semibold rounded-lg px-4"
            >
              Close
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={selectedUserIds.length === 0 || isBulkAssigning}
              onClick={handleBulkAssign}
              className="h-8 text-xs font-semibold bg-app-primary2 hover:bg-blue-700 text-white rounded-lg px-4 shadow-sm transition-all"
            >
              {isBulkAssigning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                  Assign Selected {selectedUserIds.length > 0 ? `(${selectedUserIds.length})` : ""}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignSelectiveUsersDialog;
