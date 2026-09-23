/* eslint-disable no-unused-vars */
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import trimifyLogo from "@/assets/web/trimifyLogo.png";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth.schemas";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { loginThunk } from "../store/auth.slice";

export function LoginForm({ className, ...props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("trimify_remember_me") === "true";
  });

  const savedEmail = localStorage.getItem("trimify_saved_email") || "";

  const {
    register,
    handleSubmit,
    resetField,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: savedEmail,
      password: "",
      status: "active",
      role: "user",
    },
  });

  useEffect(() => {
    if (savedEmail) {
      setValue("email", savedEmail);
    }
  }, [savedEmail, setValue]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (rememberMe) {
        localStorage.setItem("trimify_remember_me", "true");
        localStorage.setItem("trimify_saved_email", data.email);
      } else {
        localStorage.removeItem("trimify_remember_me");
        localStorage.removeItem("trimify_saved_email");
      }

      const { user } = await dispatch(loginThunk(data)).unwrap();
      navigate(user?.screen || "/admin/dashboard", { replace: true });
      toast.success(user?.message || "Login successful", {
        description: `Welcome back, ${user?.nickname || "Admin"}!`,
      });
    } catch (err) {
      resetField("password");
      toast.error(err || "Server error while login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("w-full flex flex-col items-center", className)} {...props}>
      {/* Header Section: Logo + Heading + Subtitle */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-8 mb-4 flex items-center justify-center">
          <img
            src={trimifyLogo}
            alt="Trimify"
            loading="eager"
            className="h-full w-auto object-contain"
          />
        </div>
        <h1 className="font-sans font-medium text-[34px] sm:text-[38px] lg:text-[41.67px] leading-[41.67px] tracking-[-0.035em] text-[#121212]">
          Welcome Back
        </h1>
        <p className="font-dmsans font-normal text-[13.89px] leading-[20.83px] text-[#3D3D3D] mt-2">
          Enter your email and password to access your account
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block font-sans text-[13.89px] leading-[20.83px] font-normal text-[#121212] mb-1.5 text-left"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-[13.89px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#8E8E93] pointer-events-none" />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={cn(
                "w-full h-[42.3px] pl-[38px] pr-[13.89px] py-[12.15px] bg-[#F5F7FA] font-sans text-[13.89px] text-[#121212] placeholder:text-[#9CA3AF] rounded-[10.42px] border transition-all outline-none",
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:bg-white"
                  : "border-transparent focus:border-slate-300 focus:bg-white"
              )}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 ml-0.5">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block font-sans text-[13.89px] leading-[20.83px] font-normal text-[#121212] mb-1.5 text-left"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-[13.89px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#8E8E93] pointer-events-none" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className={cn(
                "w-full h-[42.3px] pl-[38px] pr-[44px] py-[12.15px] bg-[#F5F7FA] font-sans text-[13.89px] text-[#121212] placeholder:text-[#9CA3AF] rounded-[10.42px] border transition-all outline-none",
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:bg-white"
                  : "border-transparent focus:border-slate-300 focus:bg-white"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#121212] transition-colors p-1"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-[17.36px] h-[17.36px] stroke-[1.75]" />
              ) : (
                <Eye className="w-[17.36px] h-[17.36px] stroke-[1.75]" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 ml-0.5">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-[13px] font-dmsans pt-0.5">
          <label
            htmlFor="remember-me"
            className="flex items-center gap-2 cursor-pointer select-none text-[#3D3D3D] hover:text-[#121212] transition-colors"
          >
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              className="h-4 w-4 rounded-[4px] border-[#D1D5DB] data-[state=checked]:bg-[#121212] data-[state=checked]:border-[#121212]"
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-[#3D3D3D] hover:text-[#121212] hover:underline transition-colors"
          >
            Forgot Password
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[41.83px] mt-2 bg-[#121212] hover:bg-[#262626] active:scale-[0.99] text-white font-sans font-medium text-[13.89px] rounded-[10.42px] transition-all duration-200 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
