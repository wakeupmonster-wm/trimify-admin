import { Container } from "@/components/common/container";
import CTAButton from "@/components/common/CTAButton";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Save,
  UploadCloud,
  Loader2,
  ArrowLeft,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addProgram, updateProgram } from "../store/program.slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IMAGE_BASE_URL } from "@/services/api-endpoints/base.url";

const PROGRAM_DURATION_OPTIONS = Array.from(
  { length: 12 },
  (_, index) => `${index + 1} Week Plan`,
);

const AddProgramPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const editData = location.state?.editData;
  const isEditMode = !!editData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const editData = location.state?.editData;
  const isEditMode = !!editData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    duration: editData?.duration
      ? `${parseInt(editData.duration, 10)} Week Plan`
      : "",
                Program Duration
              </Label>
              <Select
                value={formData.duration}
                onValueChange={handleDurationChange}
              >
                <SelectTrigger className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-normal border-slate-300/60">
                  <SelectValue
                    placeholder="Select..."
                    className="placeholder:font-normal"
                  />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAM_DURATION_OPTIONS.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.duration}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto rounded-md px-5 h-10 text-xs 3xl:text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto text-white rounded-md px-4 h-10 text-xs 3xl:text-sm font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {isEditMode ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? "Update" : "Save"}
                    <Save size={16} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
          {currentIcon && (
            <img
              src={currentIcon}
              alt="Banner preview"
              className="w-full max-h-[75vh] object-contain bg-slate-50"
            />
          )}
          <div className="p-4">
            <p className="text-sm font-semibold text-slate-800">
              {formData.title || "Banner Image"}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleSaveOrUpdate}
        title={isEditMode ? "Confirm Update" : "Confirm Creation"}
        message={
          isEditMode
            ? "Are you sure you want to update this program's details?"
            : "Are you sure you want to create this new program?"
        }
        confirmText={isEditMode ? "Update" : "Create"}
        type="brand"
        loading={isSubmitting}
      />
    </Container>
  );
};

export default AddProgramPage;
