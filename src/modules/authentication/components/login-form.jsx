/* eslint-disable no-unused-vars */
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import trimifyLogo from "@/assets/web/trimifyLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth.schemas";
// import { loginThunk } from "../store/auth.slice";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { ROLES } from "@/constants/roles";
import { useState } from "react";
import { toast } from "sonner";
import { loginThunk } from "../store/auth.slice";

export function LoginForm({ className, ...props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    // 👇 The zodResolver logic goes here
    resolver: zodResolver(loginSchema),
    defaultValues: {
      status: "active",
      role: "user",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { user } = await dispatch(loginThunk(data)).unwrap();

      // Navigate to dashboard upon successful login without strict role check
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="inline-flex items-center justify-center mx-auto w-44 h-12 mb-1">
            <img
              src={trimifyLogo}
              alt={trimifyLogo}
              loading="lazy"
              className="h-full w-full"
            />
          </div>
          <h1 className="text-4xl font-medium text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2 text-xs sm:text-sm text-pretty sm:text-balance">
            Login to manage the Trimify Admin ecosystem
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Field>
            <FieldLabel htmlFor="email" className={"text-sm"}>
              Email
            </FieldLabel>
            <div className="relative">
              <Mail className="absolute left-2 top-1/2 -translate-y-[45%] w-4 h-4 text-app-primary2" />
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="info@trimify.com.au"
                className={`w-full h-10 pl-8 pr-3 py-2 bg-gray-50 outline-none transition-all ${
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-100"
                    : "focus:border-app-primary2 focus-visible:ring-app-primary2"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 -mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel
                htmlFor="password"
                title="Password"
                className="text-sm"
              >
                Password
              </FieldLabel>
            </div>

            <div className="relative">
              <Lock className="absolute left-2 top-1/2 -translate-y-[45%] w-4 h-4 text-app-primary2" />
              <Input
                id="password"
                // Dynamic type based on state
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className={`w-full h-10 pl-8 pr-10 py-2 bg-gray-50 border !outline-none transition-all ${
                  errors.password
                    ? "border-red-500 focus-visible:ring-red-100"
                    : "focus:border-app-primary2 focus-visible:ring-app-primary2"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex="-1" // Prevents tabbing to the eye icon before the next field
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-app-primary2" />
                ) : (
                  <Eye className="h-4 w-4 text-app-primary2" />
                )}
              </button>
            </div>

            <div className="flex justify-between items-start -mt-1">
              <div className="flex-1">
                {errors.password && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <Link
              to="/auth/forgot-password"
              className="text-right text-xs hover:text-blue-700 underline-offset-4 hover:underline shrink-0"
            >
              Forgot your password?
            </Link>
          </Field>

          {/* Error Message from Thunk */}
          {/* {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )} */}
        </div>

        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={
              "py-5 mb-5 rounded-md bg-slate-50 hover:bg-app-primary5 hover:shadow-md border border-slate-300/60 text-muted-foreground hover:text-white font-medium hover:font-semibold transition-all duration-300"
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </Field>
        {/* <FieldSeparator>Or continue with</FieldSeparator> */}
        <Field>
          {/* <Button variant="outline" type="button">
            <img src={googleIcon} alt="Google" className="h-6 w-6" />
            Login with Google
          </Button> */}
          {/* <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link to="#" className="no-underline underline-offset-auto">
              <span className="hover:text-blue-700 underline">Sign up</span>
            </Link>
          </FieldDescription> */}
        </Field>
      </FieldGroup>
    </form>
  );
}
