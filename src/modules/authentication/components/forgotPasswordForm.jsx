import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { resetSchema } from "../schemas/auth.schemas";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  // Grab the email passed from the previous page
  const email = location.state?.email;
  const otp = location.state?.otp;

  // If the user somehow lands here without an email (e.g., refresh), send them back
  useEffect(() => {
    if (!email && !otp) {
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const onSubmit = async (data) => {
    try {
      // const response = await dispatch(
      //   forgotPasswordThunk({ email, otp, newPassword: data.password }),
      // ).unwrap();
      const response = {
        screen: "/auth/login",
        message: "Password is forgot successful!",
      };
      // Pass the email to the next route
      navigate(response.screen || "/auth/login", { replace: true });
      toast.success(response.message || "Password is forgot successful!", {
        description: "Please enter email and password.",
      });
    } catch (err) {
      toast.error(err || "Failed to send OTP", {
        description: "Please enter correct otp.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-grey-900">Set New Password</h1>
        <p className="text-grey-800 text-sm font-medium mt-2">
          Choose a strong password for your account.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-5">
        {/* New Password Field */}
        <div className="space-y-1">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-primary2" />
            <Input
              {...register("password")}
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className={`pl-10 py-6 focus:ring-app-primary2 ${
                errors.password ? "border-alerts-error" : "border-grey-200"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex="-1" // Prevents tabbing to the eye icon before the next field
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4 text-app-primary2" />
              ) : (
                <Eye className="h-4 w-4 text-app-primary2" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-alerts-error text-xs ml-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-primary2" />
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`pl-10 py-6 pr-10 focus:ring-app-primary2 ${
                errors.confirmPassword
                  ? "border-alerts-error"
                  : "border-grey-200"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex="-1" // Prevents tabbing to the eye icon before the next field
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-app-primary2" />
              ) : (
                <Eye className="h-4 w-4 text-app-primary2" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-alerts-error text-xs ml-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="py-5 mb-5 rounded-md bg-slate-50 hover:bg-app-primary3 hover:shadow-md border border-slate-300/60 text-muted-foreground hover:text-white font-medium hover:font-semibold transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </div>
    </form>
  );
}
