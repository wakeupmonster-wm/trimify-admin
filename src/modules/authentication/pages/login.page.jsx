import loginImg from "@/assets/web/LoginImg.webp";
import { LoginForm } from "../components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans">
      {/* Outer Card: Covers desktop canvas proportions (1250px total width, 780px height, 31.25px radius) */}
      <div className="w-full max-w-[1250px] min-h-[640px] lg:h-[780px] bg-white rounded-[24px] sm:rounded-[31.25px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100/80 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Banner Section (Figma: width 625px, height 780px, padding: 6.94px) */}
        <div className="hidden lg:flex w-full lg:w-1/2 h-full p-[6.94px] bg-white shrink-0">
          <div className="relative w-full h-full overflow-hidden rounded-[26px]">
            {/* Background Image Layer */}
            <div
              className="absolute inset-0 bg-cover bg-bottom bg-no-repeat transition-transform duration-700 hover:scale-[1.02]"
              style={{
                backgroundImage: `url(${loginImg})`,
              }}
            />

            {/* Gradient Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />

            {/* Banner Text Overlay */}
            <div className="absolute bottom-12 left-10 right-10 z-20 space-y-3">
              <h1 className="text-white text-4xl xl:text-[42px] font-medium leading-[1.18] tracking-tight">
                Welcome to <br />
                Trimify{" "}
                <span className="inline-block animate-wave origin-bottom text-3xl xl:text-4xl">
                  👋
                </span>
              </h1>
              <p className="text-white/85 text-[13.89px] leading-[20.83px] font-normal max-w-sm">
                Your space to manage, monitor, and grow the platform. Everything
                you need. All in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Wrapper (Figma: width 625px, height 780px, bg: white) */}
        <div className="w-full lg:w-1/2 flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-white">
          <div className="w-full max-w-[373.26px]">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
