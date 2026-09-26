import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { verifyOtpThunk, requestOtpThunk } from "../store/auth.slice";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import maskedEmail from "@/constants/masked.email";

export default function VerifyEmailOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  // Grab the email passed from the previous page
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  // If the user somehow lands here without an email (e.g., refresh), send them back
  useEffect(() => {
    if (!email) {
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    try {
      // Step 2 Thunk: Needs email + otp
      const response = await dispatch(verifyOtpThunk({ email, otp })).unwrap();

      navigate("../new-password", { state: { email, otp } });

      toast.success(response.message || "OTP verified!", {
        description: "Please enter your new password.",
      });
    } catch (err) {
      setOtp(""); // Clear OTP on error
      toast.error(typeof err === "string" ? err : (err?.message || "Invalid OTP"), {
        description: "Please check your OTP and try again.",
      });
    }
  };

  // 1. Ensure the interval only runs when timer > 0
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]); // Depend on timer to restart logic safely

  // 2. Protect the resend function
  const handleResend = async () => {
    if (timer > 0) return; // Guard clause

    try {
      const res = await dispatch(requestOtpThunk({ email })).unwrap();
      setTimer(30); // Reset the clock
      setOtp(""); // Clear old OTP input for fresh start
      toast.success(res?.message || "OTP Resent!", {
        description: "A new 6-digit code has been sent to your email.",
      });
    } catch (err) {
      toast.error(typeof err === "string" ? err : (err?.message || "Failed to resend OTP"), {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Enter verification code</h1>
        <p className="text-muted-foreground mt-2">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">
            {maskedEmail(email)}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-5">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)} // shadcn InputOTP returns value directly, not event
          >
            <InputOTPGroup className="gap-[10px] sm:gap-[14px]">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-11 h-12 sm:w-14 sm:h-14 text-lg"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          onClick={handleVerify}
          className="py-5 mb-5 rounded-md bg-slate-50 hover:bg-app-primary3 hover:shadow-md border border-slate-300/60 text-muted-foreground hover:text-white font-medium hover:font-semibold transition-all duration-300"
          disabled={otp.length !== 6 || loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
        </Button>

        <div className="text-sm text-muted-foreground">
          Didn't get the code?{" "}
          <button
            type="button"
            disabled={timer > 0 || loading}
            onClick={handleResend}
            className="text-app-primary2 font-semibold hover:underline disabled:opacity-90 disabled:cursor-not-allowed"
          >
            Resend {timer > 0 && `(${timer}s)`}
          </button>
        </div>
      </div>
    </div>
  );
}
