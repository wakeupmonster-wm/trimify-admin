import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateAdminAccount } from "../store/account.slice";
import { toast } from "sonner";
import {
  Camera,
  Loader2,
  Save,
  UserCircle,
  User,
  Phone,
  Check,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { LuUserRound } from "react-icons/lu";

export default function AdminEditDialog({ children, currentData }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [formData, setFormData] = useState({
    nickname: currentData?.nickname || "",
    // about: currentData?.about || "",
    phone: currentData?.phone || "",
  });

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setLoading(false);
      setPhoneError("");
    }
  }, [open]);

  // Handle File Selection with Client-Side Validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return toast.error(
          "Invalid file type. Please upload JPEG, PNG, or WebP.",
        );
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const isValidAustralianPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return false;
    // Local formats: 04xx xxx xxx or 02/03/07/08 xxxx xxxx
    if (/^(04|02|03|07|08)\d{8}$/.test(digits)) return true;
    // International formats: +61 4xx xxx xxx or +61 2/3/7/8 xxxx xxxx
    if (/^61(4|2|3|7|8)\d{8}$/.test(digits)) return true;
    return false;
  };

  const handleUpdate = async () => {
    if (!formData.nickname.trim()) return toast.error("Nickname is required");
    if (!formData.phone.trim()) {
      setPhoneError("Phone is required");
      return;
    }

    if (!isValidAustralianPhone(formData.phone)) {
      setPhoneError(
        "Enter a valid Australian phone number (10 digits), e.g. 0412345678",
      );
      return;
    }

    setPhoneError("");
    setLoading(true);
    setSuccess(false);
    const data = new FormData();
    data.append("nickname", formData.nickname);
    // data.append("about", formData.about);
    data.append("phone", formData.phone);

    if (selectedFile) {
      data.append("avatar", selectedFile);
    }

    try {
      await dispatch(updateAdminAccount(data)).unwrap();
      toast.success("Profile updated successfully!");
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (err) {
      console.log("error: ", err);
      toast.error(err || "Failed to update profile");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto gap-0 p-0 border-none shadow-2xl rounded-2xl font-jakarta">
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-5 pb-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-300">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100/50 text-slate-400">
              <UserCircle size={28} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-base font-bold text-foreground">
                Edit Administrator Profile
              </DialogTitle>
              <p className="text-xs text-foreground/60 font-medium">
                Update your personal information and profile picture
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Main Body ── */}
        <div className="flex flex-col md:flex-row gap-8 bg-white pt-6 px-6">
          {/* Left: Avatar Section */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="h-40 w-40 transition-all shadow-md bg-slate-50 border-4 border-white">
                <AvatarImage
                  src={preview || currentData?.avatar?.url}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-brand-blue text-brand-blue">
                  <UserCircle className="w-16 h-16 opacity-30" />
                </AvatarFallback>
              </Avatar>

              {/* Camera overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-900/40 rounded-full transition-all duration-300">
                <Camera
                  className="text-white w-8 h-8 drop-shadow-lg"
                  strokeWidth={2.5}
                />
              </div>

              {/* Edit Badge floating */}
              <div className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                <div className="bg-brand-blue p-2 rounded-full text-brand-blue">
                  <Camera className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
              />
            </div>

            <div className="text-center mt-4 space-y-1">
              <p className="text-[10px] text-brand-blue uppercase font-black tracking-widest">
                Update Photo
              </p>
              <p className="text-[10px] text-foreground/60 font-medium leading-tight">
                JPG, PNG or WebP <br />
                Max size: 5MB
              </p>
            </div>
          </div>

          {/* Right: Form Section */}
          <div className="flex-1 space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Display Name
              </Label>
              <div className="relative">
                <LuUserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={formData.nickname}
                  onChange={(e) =>
                    setFormData({ ...formData, nickname: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  className="h-11 pl-10 text-sm font-medium rounded-lg border-slate-200 bg-white shadow-none focus-visible:border-slate-500 transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={formData.phone}
                  onChange={(e) => {
                    const onlyNums = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 11);
                    setFormData({ ...formData, phone: onlyNums });
                    if (phoneError) setPhoneError("");
                  }}
                  placeholder="e.g. 0412345678"
                  className={cn(
                    "h-11 pl-10 text-sm font-medium rounded-lg bg-white shadow-none transition-all",
                    phoneError
                      ? "border-rose-500 focus-visible:border-rose-500"
                      : "border-slate-200 focus-visible:border-slate-500",
                  )}
                />
              </div>
              {phoneError && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">
                  {phoneError}
                </p>
              )}
            </div>

            {/* Bio / About */}
            {/* <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Bio / About
                </Label>
                <div className="relative">
                  <Pencil className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Textarea
                    value={formData.about}
                    onChange={(e) =>
                      setFormData({ ...formData, about: e.target.value })
                    }
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="pl-10 py-3 text-sm font-medium rounded-lg border-slate-200 bg-white shadow-none focus-visible:ring-brand-blue focus-visible:border-brand-blue transition-all resize-none min-h-[100px]"
                  />
                </div>
              </div> */}
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="px-4 mb-6 bg-slate-50/80 border-t border-slate-100 flex items-center sm:justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading || success}
            className="h-10 px-6 border-slate-200 text-slate-600 font-semibold text-[13px] capitalize rounded-md hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading || success}
            className={cn(
              "h-10 px-6 font-semibold text-[13px] capitalize rounded-md shadow-sm gap-2 transition-all duration-300 flex items-center justify-center min-w-[140px]",
              success
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-brand-blue hover:bg-brand-hoverAqua text-white",
            )}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : success ? (
              <>
                <Check size={16} className="animate-in zoom-in duration-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2.5} />
                <span>Save Updates</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
