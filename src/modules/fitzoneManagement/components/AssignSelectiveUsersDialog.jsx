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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { STATUS_BADGE_STYLE } from "@/config/theme.config";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  getFitzoneAssignableUsersAPI,
  assignFitzoneToSelectedUsersAPI,
  assignFitzoneToAllUsersAPI,
  unassignFitzoneUserAPI,
} from "../services/fitzone.services";
import { toast } from "sonner";
import {
  Search,
  Users,
  Mail,
  Loader2,
  UserPlus,
  UserCheck,
  UsersRound,
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
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [actionInProgress, setActionInProgress] = useState({}); // { [userId]: 'assign' | 'unassign' }
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);
  const [confirmAssignAll, setConfirmAssignAll] = useState(false);
  const [isAssigningAll, setIsAssigningAll] = useState(false);

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

  // Reset page to 1 when search, filter or limit changes
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
        // Optimistic instant status update
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

  // Unassign single user
  const handleUnassignSingle = async (userId) => {
    if (!fitzone?.id) return;
    setActionInProgress((prev) => ({ ...prev, [userId]: "unassign" }));
    try {
      const res = await unassignFitzoneUserAPI(fitzone.id, userId);
      if (res && res.status === "success") {
        toast.success(res.message || "User unassigned from Fitzone successfully.");
        // Optimistic instant status update
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

  // Assign to All users
  const handleConfirmAssignAll = async () => {
    if (!fitzone?.id) return;
    setIsAssigningAll(true);
    try {
      const res = await assignFitzoneToAllUsersAPI(fitzone.id);
      if (res && (res.status === "success" || res.success)) {
        toast.success("Assignment queued for all users. Users will be assigned in the background.");
        setConfirmAssignAll(false);
        fetchUsers();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res?.message || "Failed to queue all-user assignment.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error assigning Fitzone to all users.");
    } finally {
      setIsAssigningAll(false);
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-full p-0 gap-0 overflow-hidden rounded-2xl border-slate-300/60 bg-white shadow-2xl">
          {/* Clean Header without Ready for Assignment badge */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-300/60 bg-white">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-app-primary2/10 text-app-primary2">
                    <UserPlus className="w-5 h-5" />
                  </span>
                  <DialogTitle className="text-base sm:text-lg font-bold text-foreground/90 tracking-tight">
                    Assign Users to Fitzone
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs font-medium text-slate-500">
                  Fitzone: <span className="font-bold text-app-primary2">{fitzone?.title || "Fitzone"}</span>
                </DialogDescription>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs bg-white border-slate-300/60 rounded-md focus-visible:ring-1 focus-visible:ring-app-primary2"
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

              {/* Filter Tabs matching theme colors */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-300/60 w-full sm:w-auto self-stretch">
                {[
                  { id: "all", label: "All Users" },
                  { id: "unassigned", label: "Not Assigned" },
                  { id: "assigned", label: "Assigned" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={cn(
                      "flex-1 sm:flex-none px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all",
                      filter === tab.id
                        ? "bg-white text-app-primary2 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selection Count shown directly below Search Bar */}
            {selectedUserIds.length > 0 && (
              <div className="mt-3 flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200/80">
                <span className="text-xs font-semibold text-app-primary2 flex items-center gap-1.5">
                  selected : {selectedUserIds.length} user{selectedUserIds.length > 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedUserIds([])}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-800 underline transition-colors"
                >
                  Clear selection
                </button>
              </div>
            )}
          </DialogHeader>

          {/* Table Content styled identically to User Management DataTable */}
          <div className="max-h-[380px] min-h-[240px] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-app-primary2" />
                <span className="text-xs font-semibold text-slate-600">Loading users list...</span>
              </div>
            ) : usersData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-app-primary2/5 flex items-center justify-center mb-2.5 text-slate-400">
                  <Users className="w-6 h-6 text-app-primary2/60" />
                </div>
                <p className="text-xs font-bold text-slate-700">No users found</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {search
                    ? `No matching users found for "${search}"`
                    : "No users available for the selected filter."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-app-primary2/5 hover:bg-app-primary2/5 border-b border-slate-300/60">
                    <th className="w-10 px-3 py-2.5 text-center">
                      <Checkbox
                        checked={isAllUnassignedSelected}
                        onCheckedChange={handleToggleSelectAll}
                        disabled={unassignedOnPage.length === 0}
                        aria-label="Select all unassigned users"
                      />
                    </th>
                    <th className="w-14 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-left text-foreground/80">
                      SR.No
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-left text-foreground/80">
                      User Details
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-center text-foreground/80">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-right text-foreground/80">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300/60">
                  {usersData.map((user, index) => {
                    const serialNumber = (currentPage - 1) * limit + index + 1;
                    const isChecked = selectedUserIds.includes(user.id);
                    const isAssigningThis = actionInProgress[user.id] === "assign";
                    const isUnassigningThis = actionInProgress[user.id] === "unassign";

                    return (
                      <tr
                        key={user.id}
                        className={cn(
                          "even:bg-slate-50/50 hover:bg-slate-100/70 transition-all duration-150",
                          isChecked ? "bg-blue-50/40" : ""
                        )}
                      >
                        {/* Selection Checkbox */}
                        <td className="w-10 px-3 py-3 text-center">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => handleToggleUser(user.id)}
                            disabled={user.is_assigned}
                            aria-label={`Select ${user.name}`}
                          />
                        </td>

                        {/* SR.No */}
                        <td className="w-14 px-3 py-3 text-left font-bold text-[11px] text-foreground/90">
                          {serialNumber}
                        </td>

                        {/* User Details */}
                        <td className="px-4 py-3">
                          <div className="space-y-0.5">
                            <div className="capitalize font-bold text-slate-700 text-[11px] tracking-tight truncate max-w-[260px]">
                              {user.name || "-"}
                            </div>
                            {user.email && (
                              <div
                                className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 tracking-tight"
                                title={user.email}
                              >
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[240px]">{user.email}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status Badge without dot */}
                        <td className="px-4 py-3 text-center">
                          {user.is_assigned ? (
                            <Badge
                              className={cn(
                                "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border-none shadow-none inline-flex items-center",
                                STATUS_BADGE_STYLE.active || "bg-emerald-500/10 text-emerald-600"
                              )}
                            >
                              Assigned
                            </Badge>
                          ) : (
                            <Badge
                              className={cn(
                                "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border-none shadow-none inline-flex items-center",
                                STATUS_BADGE_STYLE.inactive || "bg-slate-500/10 text-slate-600"
                              )}
                            >
                              Not Assigned
                            </Badge>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3 text-right">
                          {user.is_assigned ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnassignSingle(user.id)}
                              disabled={isUnassigningThis}
                              className="h-7 px-3 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-all"
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
                              className="h-7 px-3.5 text-[11px] font-semibold text-app-primary2 hover:bg-app-primary2 hover:text-white border-slate-300/60 rounded-md transition-all shadow-xs bg-white"
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
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 border-t border-slate-300/60 gap-4 bg-white">
            {/* Left Side: Showing results count */}
            <div className="text-xs font-medium text-slate-400 text-left w-full sm:w-auto">
              Showing {rowCount > 0 ? startRow : 0}-{endRow} of {rowCount} users
            </div>

            {/* Right Side: Rows + Page Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
              {/* Rows Select */}
              <div className="flex items-center gap-2">
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
                  <SelectTrigger className="h-8 w-[65px] border-slate-300/60 rounded-md bg-white text-xs font-semibold focus:ring-0">
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

          {/* Modal Footer with Assign All, Assign Selected, and Close */}
          <div className="px-6 py-3 border-t border-slate-300/60 bg-slate-50/50 flex items-center justify-between gap-3">
            {/* Left: Assign All Users Option */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmAssignAll(true)}
              disabled={isAssigningAll}
              className="h-8 text-xs font-semibold text-app-primary2 hover:bg-app-primary2/10 border-slate-300/60 rounded-md flex items-center gap-1.5 transition-all"
            >
              <UsersRound className="w-3.5 h-3.5" />
              Assign to All Users
            </Button>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs font-semibold rounded-md border-slate-300/60 px-5"
              >
                Close
              </Button>

              {selectedUserIds.length > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  disabled={isBulkAssigning}
                  onClick={handleBulkAssign}
                  className="h-8 text-xs font-semibold bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-4 shadow-sm transition-all flex items-center gap-1.5"
                >
                  {isBulkAssigning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      Assign Selected ({selectedUserIds.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Assign to All Users */}
      <ConfirmModal
        isOpen={confirmAssignAll}
        onClose={() => !isAssigningAll && setConfirmAssignAll(false)}
        onConfirm={handleConfirmAssignAll}
        title="Assign Fitzone to All Users"
        message={`Are you sure you want to assign "${fitzone?.title || "this Fitzone"}" to all users in the background? Existing user assignments will be skipped.`}
        confirmText="Assign All Users"
        type="brand"
        loading={isAssigningAll}
      />
    </>
  );
};

export default AssignSelectiveUsersDialog;
