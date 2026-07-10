import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { TabsContent } from "@/components/ui/tabs";
import {
  IconTrash,
  IconEye,
  IconPhotoOff,
  IconCheck,
  IconPhoto,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "sonner";
import { deleteUserPhoto, fetchUserData } from "../../store/user.slice";
import { cn } from "@/lib/utils";
import dummyImg from "@/assets/web/dummyImg.webp";
import DashboardHead from "@/components/shared/dashboard.head";

export const GallleryTab = ({ photos = [], userId }) => {
  const dispatch = useDispatch();
  const safePhotos = Array.isArray(photos) ? photos : [];
  const [selectedPhotos, setSelectedPhotos] = useState([]); // For bulk actions
  const [isPhotoDeleteOpen, setIsPhotoDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState(null);

  const toggleSelect = (publicId) => {
    setSelectedPhotos((prev) =>
      prev.includes(publicId)
        ? prev.filter((id) => id !== publicId)
        : [...prev, publicId],
    );
  };

  const onConfirmDelete = async () => {
    const idsToDelete = singleDeleteId ? [singleDeleteId] : selectedPhotos;
    if (idsToDelete.length === 0) return; // Guard: nothing selected
    
    setIsDeleting(true);
    setDeleteSuccess(false);
    try {
      for (const publicId of idsToDelete) {
        await dispatch(deleteUserPhoto({ userId, publicId })).unwrap();
      }

      toast.success(
        `${idsToDelete.length} photo${idsToDelete.length > 1 ? "s" : ""} removed`,
      );
      setDeleteSuccess(true);
      setIsDeleting(false);
      
      setTimeout(() => {
        setIsPhotoDeleteOpen(false);
        setDeleteSuccess(false);
        if (singleDeleteId) {
          setSingleDeleteId(null);
        } else {
          setSelectedPhotos([]);
        }
      }, 1500);
    } catch (err) {
      setIsDeleting(false);
      setDeleteSuccess(false);
      toast.error(err || "Failed to delete");
    } finally {
      await dispatch(fetchUserData(userId));
    }
  };

  const deleteCount = singleDeleteId ? 1 : selectedPhotos.length;

  return (
    <>
      <TabsContent
        value="gallery"
        className="mt-6 space-y-4 bg-white rounded-xl py-4 border border-slate-200 shadow-sm focus-visible:ring-offset-0 focus-visible:ring-0"
      >
        {/* GALLERY HEADER & BULK ACTIONS */}
        <div className="px-5 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <DashboardHead
              title="User Gallery"
              subtitle="User uploaded media and photos"
              Icon={IconPhoto}
              iconColor="text-slate-600"
              iconBg="bg-slate-100/50"
            />

            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                {selectedPhotos.length > 0 ? (
                  <motion.div
                    key="selection-actions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-[11px] font-bold text-indigo-500 mr-1 uppercase tracking-tight">
                      {selectedPhotos.length} selected
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wider"
                      onClick={() => setIsPhotoDeleteOpen(true)}
                    >
                      <IconTrash size={14} className="mr-1" /> Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wider text-slate-400"
                      onClick={() => setSelectedPhotos([])}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="total-badge"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Badge
                      variant="outline"
                      className="bg-slate-100/50 rounded-xl text-muted-foreground border-slate-200 px-3 py-1 font-bold text-[10px]"
                    >
                      {safePhotos.length} Total Uploads
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* PHOTO GRID */}
        {safePhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            <IconPhotoOff size={48} stroke={1} />
            <p className="mt-2 font-medium">No media uploaded yet</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 p-4 items-start gap-4"
          >
            <AnimatePresence mode="popLayout">
              {safePhotos.map((photo, index) => {
                // const isSelected = selectedPhotos.includes(photo.publicId);

                const photoId = photo.publicId || photo._id || `idx-${index}`;
                const isSelected = selectedPhotos.includes(photoId);
                return (
                  <motion.div
                    key={photoId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={cn(
                      "group relative break-inside-avoid rounded-2xl overflow-hidden border-2 transition-all duration-300",
                      isSelected
                        ? "border-brand-aqua ring-4 ring-brand-aqua/5"
                        : "border-transparent hover:border-slate-300 shadow-sm",
                    )}
                  >
                    {/* SELECTION CHECKMARK */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the image's onClick
                        toggleSelect(photoId);
                      }}
                      className={cn(
                        "absolute top-3 right-3 z-30 h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all",
                        isSelected
                          ? "bg-brand-aqua border-brand-aqua text-white"
                          : "bg-white/20 backdrop-blur-md border-white/50 text-transparent group-hover:text-white/50",
                      )}
                    >
                      <IconCheck size={14} stroke={3} />
                    </button>

                    {/* IMAGE CONTENT */}
                    <div className="relative overflow-hidden bg-slate-100">
                      {index === 0 && (
                        <Badge className="absolute top-3 left-3 z-20 bg-amber-400 text-amber-950 hover:bg-amber-400 border-none text-[10px] font-black uppercase">
                          Cover
                        </Badge>
                      )}

                      <img
                        src={photo?.url || dummyImg}
                        alt="User Upload"
                        className={cn(
                          "w-full h-96 transition-transform duration-500 group-hover:scale-105",
                          isSelected && "opacity-80",
                        )}
                        onError={(e) => {
                          e.currentTarget.src = dummyImg;
                        }}
                        onClick={() => {
                          if (selectedPhotos.length > 0) {
                            toggleSelect(photoId);
                          } else {
                            setPreviewUrl(photo.url || dummyImg);
                            setIsPreviewOpen(true);
                          }
                        }}
                      />

                      {/* HOVER OVERLAY - Only shows if not in selection mode */}
                      {selectedPhotos.length === 0 && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white"
                              onClick={() => {
                                setPreviewUrl(photo.url);
                                setIsPreviewOpen(true);
                              }}
                            >
                              <IconEye size={18} />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-9 w-9 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSingleDeleteId(photoId);
                                setIsPhotoDeleteOpen(true);
                              }}
                            >
                              <IconTrash size={18} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </TabsContent>

      {/* --- PHOTO PREVIEW MODAL --- */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-max p-0 border-none bg-black/95 overflow-hidden flex items-center justify-center">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <img
            src={previewUrl || dummyImg}
            className="max-w-full max-h-[90vh] object-cover"
            alt="High Res Preview"
          />
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isPhotoDeleteOpen}
        onClose={() => {
          if (isDeleting || deleteSuccess) return; // Prevent closing while deleting
          setIsPhotoDeleteOpen(false);
          setSingleDeleteId(null);
        }}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
        success={deleteSuccess}
        title={
          deleteCount > 1 ? "Bulk Delete Photos?" : "Delete Photo?"
        }
        message={`Are you sure you want to remove ${deleteCount} photo${deleteCount > 1 ? "s" : ""}? This cannot be undone.`}
      />
    </>
  );
};
