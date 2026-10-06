import React, { useState } from "react";
import {
  Target,
  Activity,
  ClipboardList,
  Dumbbell,
  Pencil,
  Plus,
  Eye,
  Trash2,
  Ellipsis,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Pill, EmptyState } from "./UserProfileShared";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditFitzoneDialogForm from "./profile/EditFitzoneDialogForm";
import AddFitzoneDialogForm from "./profile/AddFitzoneDialogForm";
import AddProgramDialogForm from "./profile/AddProgramDialogForm";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useDispatch } from "react-redux";
import { fetchSingleUserProfile } from "../store/user.slice";
import DashboardHead from "@/components/shared/dashboard.head";
import { DataTablePagination } from "@/components/shared/datatable/DataTablePagination";
import { deleteProgramAssignmentAPI } from "../services/user.services";
import { toast } from "sonner";

const getStatusTone = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "success";
    case "expired":
      return "expired";
    case "deactivated":
    case "inactive":
      return "danger";
    case "completed":
      return "neutral";
    default:
      return "neutral";
  }
};

export function TabPrograms({ data }) {
  const { user, programs, fitzoneStatus, fmtDate } = data;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editFitzoneOpen, setEditFitzoneOpen] = useState(false);
  const [addFitzoneOpen, setAddFitzoneOpen] = useState(false);
  const [selectedFitzone, setSelectedFitzone] = useState(null);

  // Program assignment states
  const [addProgramOpen, setAddProgramOpen] = useState(false);
  const [confirmDeleteProgramOpen, setConfirmDeleteProgramOpen] = useState(false);
  const [selectedProgramToDelete, setSelectedProgramToDelete] = useState(null);
  const [deletingProgram, setDeletingProgram] = useState(false);

  // Pagination states
  const [fitzonePage, setFitzonePage] = useState(1);
  const [fitzonePageSize, setFitzonePageSize] = useState(10);
  const [programPage, setProgramPage] = useState(1);
  const [programPageSize, setProgramPageSize] = useState(10);

  const currentFitzones = fitzoneStatus.slice(
    (fitzonePage - 1) * fitzonePageSize,
    fitzonePage * fitzonePageSize,
  );
  const totalFitzonePages = Math.ceil(fitzoneStatus.length / fitzonePageSize);

  const currentPrograms = programs.slice(
    (programPage - 1) * programPageSize,
    programPage * programPageSize,
  );
  const totalProgramPages = Math.ceil(programs.length / programPageSize);

  const fitzoneTable = {
    getPageCount: () => totalFitzonePages,
    getState: () => ({
      pagination: {
        pageIndex: fitzonePage - 1,
        pageSize: fitzonePageSize,
      },
    }),
    setPageSize: (size) => {
      setFitzonePageSize(size);
      setFitzonePage(1);
    },
    previousPage: () => setFitzonePage((p) => p - 1),
    nextPage: () => setFitzonePage((p) => p + 1),
    getCanPreviousPage: () => fitzonePage > 1,
    getCanNextPage: () => fitzonePage < totalFitzonePages,
    setPageIndex: (index) => setFitzonePage(index + 1),
  };

  const programTable = {
    getPageCount: () => totalProgramPages,
    getState: () => ({
      pagination: {
        pageIndex: programPage - 1,
        pageSize: programPageSize,
      },
    }),
    setPageSize: (size) => {
      setProgramPageSize(size);
      setProgramPage(1);
    },
    previousPage: () => setProgramPage((p) => p - 1),
    nextPage: () => setProgramPage((p) => p + 1),
    getCanPreviousPage: () => programPage > 1,
    getCanNextPage: () => programPage < totalProgramPages,
    setPageIndex: (index) => setProgramPage(index + 1),
  };

  const handleSuccess = () => {
    if (user?.id) {
      dispatch(fetchSingleUserProfile(user.id));
    }
  };

  const handleDeleteProgram = async () => {
    if (!selectedProgramToDelete || !user?.id) return;
    const programId = selectedProgramToDelete.program_id ?? selectedProgramToDelete.id;
    if (!programId) {
      toast.error("Invalid program identifier");
      return;
    }
    try {
      setDeletingProgram(true);
      const res = await deleteProgramAssignmentAPI(user.id, programId);
      if (res?.status === "success") {
        toast.success("Program assignment removed successfully");
        setConfirmDeleteProgramOpen(false);
        setSelectedProgramToDelete(null);
        handleSuccess();
      } else {
        toast.error(res?.message || "Failed to remove program assignment");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to remove program assignment",
      );
    } finally {
      setDeletingProgram(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Fitzone Assignments Card */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-200 bg-slate-50/50">
            <DashboardHead
              title="Fitzone Assignments"
              subtitle="Active Fitzone sessions and assignments"
              Icon={Dumbbell}
              iconColor="text-slate-600"
              iconBg="bg-slate-100/50"
            />
            <div className="flex items-center ml-auto sm:ml-0 gap-2">
              <span className="inline-flex items-center w-max border border-slate-200 bg-slate-100/50 rounded-xl text-muted-foreground px-3 py-1 font-bold text-[10px] shadow-sm">
                {fitzoneStatus.length} Fitzones
              </span>
              <button
                onClick={() => setAddFitzoneOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-app-primary2/30 bg-app-primary2/10 px-2 py-1 text-[11px] font-semibold text-app-primary2 hover:bg-app-primary2 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Assign
              </button>
            </div>
          </div>
          <div className="p-0 bg-white">
            {fitzoneStatus.length > 0 ? (
              <div className="flex flex-col w-full">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-16">
                          SR.No
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Category
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Status
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Assigned
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentFitzones.map((f, idx) => (
                        <tr
                          key={`${f.category_id}-${idx}`}
                          className="transition-colors hover:bg-slate-50/50 even:bg-slate-50/30"
                        >
                          <td className="whitespace-nowrap px-5 py-3 text-[12px] font-medium text-slate-500">
                            {(fitzonePage - 1) * fitzonePageSize +
                              Number(idx) +
                              1}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3">
                            <div className="text-[11px] font-semibold text-slate-900">
                              {f.category_title}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-5 py-3">
                            <Pill tone={getStatusTone(f.status)}>
                              {f.status || "Unknown"}
                            </Pill>
                          </td>
                          <td className="whitespace-nowrap px-5 py-3">
                            <div className="text-[11px] font-medium text-slate-600">
                              {f.assigned_at ? fmtDate(f.assigned_at) : "—"}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedFitzone(f);
                                setEditFitzoneOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                            >
                              <Pencil className="w-3 h-3 text-slate-500" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {fitzoneStatus.length > 0 && (
                  <DataTablePagination
                    table={fitzoneTable}
                    rowCount={fitzoneStatus.length}
                    itemName="Fitzones"
                  />
                )}
              </div>
            ) : (
              <div className="p-8 pb-12">
                <EmptyState
                  icon={Activity}
                  title="No Fitzone Assignments"
                  subtitle="This user has no Fitzone assignments."
                />
              </div>
            )}
          </div>
        </div>

        {/* Enrolled Programs Card */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-200 bg-slate-50/50">
            <DashboardHead
              title="Enrolled Programs"
              subtitle="Active and past program enrollments"
              Icon={ClipboardList}
              iconColor="text-slate-600"
              iconBg="bg-slate-100/50"
            />
            <div className="flex items-center ml-auto sm:ml-0 gap-2">
              <span className="inline-flex items-center w-max border border-slate-200 bg-slate-100/50 rounded-xl text-muted-foreground px-3 py-1 font-bold text-[10px] shadow-sm">
                {programs.length} Programs
              </span>
              <button
                onClick={() => setAddProgramOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-app-primary2/30 bg-app-primary2/10 px-2 py-1 text-[11px] font-semibold text-app-primary2 hover:bg-app-primary2 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Assign
              </button>
            </div>
          </div>
          <div className="p-0 bg-white">
            {programs.length > 0 ? (
              <div className="flex flex-col w-full">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-16">
                          SR.No
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Program
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Duration
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Status
                        </th>
                        <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentPrograms.map((p, idx) => (
                        <tr
                          key={`${p.program_id}-${idx}`}
                          className="transition-colors hover:bg-slate-50/50 even:bg-slate-50/30"
                        >
                          <td className="whitespace-nowrap px-5 py-3 text-[12px] font-medium text-slate-500">
                            {(programPage - 1) * programPageSize +
                              Number(idx) +
                              1}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3">
                            <div className="text-[11px] font-semibold text-slate-900">
                              {p.title}
                            </div>
                            <div className="mt-0.5 text-[10px] text-slate-500">
                              Assigned {fmtDate(p.assigned_at)}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 text-[11px] font-medium text-slate-600">
                            {p.start_date ? (
                              `${fmtDate(p.start_date)} – ${fmtDate(p.end_date)}`
                            ) : (
                              <span className="text-slate-500">
                                Not scheduled
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3">
                            <Pill tone={getStatusTone(p.status)}>
                              {p.status}
                            </Pill>
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 text-center">
                            <div className="flex justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-slate-100/50 rounded-full"
                                  >
                                    <Ellipsis className="h-4 w-4 text-foreground/90" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-36 p-2 rounded-xl border-slate-300/60 shadow-sm"
                                >
                                  <DropdownMenuLabel className="text-[11px] 3xl:text-xs text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
                                    Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem
                                    className="gap-2 cursor-pointer py-1.5 rounded-lg focus:bg-slate-100 focus:text-slate-900 font-semibold text-xs"
                                    onClick={() =>
                                      navigate(
                                        `/admin/manage-program?search=${encodeURIComponent(p.title)}`,
                                      )
                                    }
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    View Program
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="gap-2 cursor-pointer py-1.5 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 font-semibold text-xs"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setSelectedProgramToDelete(p);
                                      setConfirmDeleteProgramOpen(true);
                                    }}
                                    onClick={() => {
                                      setSelectedProgramToDelete(p);
                                      setConfirmDeleteProgramOpen(true);
                                    }}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {programs.length > 0 && (
                  <DataTablePagination
                    table={programTable}
                    rowCount={programs.length}
                    itemName="Programs"
                  />
                )}
              </div>
            ) : (
              <div className="p-8 pb-12">
                <EmptyState
                  icon={Target}
                  title="No Enrolled Programs"
                  subtitle="This user is not enrolled in any programs."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fitzone Dialogs */}
      <Dialog open={editFitzoneOpen} onOpenChange={setEditFitzoneOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 border-none bg-transparent shadow-none">
          <EditFitzoneDialogForm
            data={selectedFitzone}
            userId={user?.id}
            onClose={() => setEditFitzoneOpen(false)}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={addFitzoneOpen} onOpenChange={setAddFitzoneOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 border-none bg-transparent shadow-none">
          <AddFitzoneDialogForm
            userId={user?.id}
            onClose={() => setAddFitzoneOpen(false)}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Program Assignment Dialog */}
      <Dialog open={addProgramOpen} onOpenChange={setAddProgramOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 border-none bg-transparent shadow-none">
          <AddProgramDialogForm
            userId={user?.id}
            onClose={() => setAddProgramOpen(false)}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Program Assignment Modal */}
      <ConfirmModal
        isOpen={confirmDeleteProgramOpen}
        open={confirmDeleteProgramOpen}
        onClose={() => {
          setConfirmDeleteProgramOpen(false);
          setSelectedProgramToDelete(null);
        }}
        onConfirm={handleDeleteProgram}
        title="Delete Program Assignment"
        message={`Are you sure you want to remove the enrollment for "${selectedProgramToDelete?.title || "this program"}" from this user?`}
        type="danger"
        confirmText="Delete"
        loading={deletingProgram}
      />
    </>
  );
}
