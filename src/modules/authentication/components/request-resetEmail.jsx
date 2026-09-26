import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { schema } from "../schemas/auth.schemas";
import { requestOtpThunk } from "../store/auth.slice";
import { toast } from "sonner";

export default function RequestResetEmailForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(
        requestOtpThunk({ email: data.email }),
      ).unwrap();

      // Pass the email to the next route (verify OTP step)
      navigate("/auth/forgot-password/verify-email", {
        state: { email: data.email },
      });

      toast.success(response.message || "OTP Sent!", {
        description: "Please check your inbox for the 6-digit code.",
      });
    } catch (err) {
      toast.error(typeof err === "string" ? err : (err?.message || "Failed to send OTP"), {
        description: "Please check your email address and try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password?</h1>
        <p className="text-slate-700">
          Enter your email to receive an OTP code.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel className="text-sm">Email Address</FieldLabel>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-primary2" />
            <Input
              {...register("email")}
              placeholder="info@trimify.com.au"
              className="pl-10 py-5 placeholder:font-normal"
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-xs -mt-1">
              {errors.email.message}
            </p>
          )}
        </Field>

        <Button
          type="submit"
          className="py-5 mb-5 rounded-md bg-slate-50 hover:bg-app-primary3 hover:shadow-md border border-slate-300/60 text-muted-foreground hover:text-white font-medium hover:font-semibold transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>

        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-2 text-sm text-slate-700 hover:text-app-primary2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </FieldGroup>
    </form>
  );
}
