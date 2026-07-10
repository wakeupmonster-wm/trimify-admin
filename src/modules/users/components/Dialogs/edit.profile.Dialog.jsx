import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconEdit, IconLoader2, IconCheck } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { fetchUserData, updateUserProfile } from "../../store/user.slice";
import { GENDER_OPTIONS } from "@/constants/gender.options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const EditProfileDialog = ({ userData }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Initialize state with existing data
  const [formData, setFormData] = useState({
    nickname: userData?.profile?.nickname || "",
    gender: userData?.profile?.gender || "",
    // age: userData?.profile?.age || "",
    jobTitle: userData?.profile?.jobTitle || "",
    company: userData?.profile?.company || "",
    about: userData?.profile?.about || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setSuccess(false);
    const cleanedData = { ...formData };

    try {
      // 1. Dispatch the update
      const user = await dispatch(
        updateUserProfile({
          userId: userData._id,
          profile: cleanedData,
        }),
      ).unwrap();

      // 2. 🔥 RE-FETCH to sync calculated fields (completion %, etc.)
      await dispatch(fetchUserData(userData._id));

      toast.success(`${user?.profile.nickname}, profile updated successfully!`);

      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      const message = Array.isArray(err) ? err[0] : err;
      toast.error(message || "Failed to update");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <IconEdit size={16} className="mr-2" /> Edit details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Input
            name="nickname"
            placeholder="Nickname"
            value={formData.nickname}
            onChange={handleChange}
          />
          <Select
            name="gender"
            value={formData.gender}
            onValueChange={(value) => {
              // Shadcn Select seedha 'value' deta hai, 'event' nahi
              setFormData({ ...formData, gender: value });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <Input
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          /> */}
          <Input
            name="jobTitle"
            placeholder="Job Title"
            value={formData.jobTitle}
            onChange={handleChange}
          />
          <Input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
          />
          <div className="col-span-2">
            <Textarea
              name="about"
              placeholder="About/Bio"
              value={formData.about}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting || success}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting || success}
            className={cn(
              "font-semibold text-[13px] px-6 rounded-md shadow-sm gap-2 transition-all duration-300 flex items-center justify-center min-w-[140px]",
              success
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-brand-aqua hover:bg-brand-hoverAqua text-white"
            )}
          >
            {isSubmitting ? (
              <>
                <IconLoader2 className="animate-spin w-4 h-4" />
                <span>Saving...</span>
              </>
            ) : success ? (
              <>
                <IconCheck className="w-4 h-4 animate-in zoom-in duration-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
