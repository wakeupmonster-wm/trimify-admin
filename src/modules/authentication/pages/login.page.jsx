import loginImg from "@/assets/web/LoginImg.webp";
import { LoginForm } from "../components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-2.5 sm:p-4 lg:p-4 xl:p-8 font-sans">
      {/* Outer Card: Adapts gracefully to screen height on smaller laptops/tablets while preserving desktop Figma canvas */}
      <div className="w-full max-w-[1250px] h-auto lg:h-[min(780px,calc(100vh-2rem))] max-h-[96vh] bg-white rounded-[20px] sm:rounded-[26px] lg:rounded-[31.25px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100/80 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Banner Section */}
        <div className="hidden lg:flex w-full lg:w-1/2 h-full p-[6.94px] bg-white shrink-0">
          <div className="relative w-full h-full overflow-hidden rounded-[20px] xl:rounded-[26px]">
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
            <div className="absolute bottom-6 xl:bottom-12 left-6 xl:left-10 right-6 xl:right-10 z-20 space-y-2 xl:space-y-3">
              <h1 className="text-white text-3xl xl:text-[42px] font-medium leading-[1.18] tracking-tight">
                Welcome to <br />
                Trimify{" "}
                <span className="inline-block animate-wave origin-bottom text-2xl xl:text-4xl">
                  👋
                </span>
              </h1>
              <p className="text-white/85 text-xs xl:text-[13.89px] leading-[18px] xl:leading-[20.83px] font-normal max-w-sm">
                Your space to manage, monitor, and grow the platform. Everything
                you need. All in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Wrapper */}
        <div className="w-full lg:w-1/2 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-6 xl:p-12 bg-white overflow-y-auto">
          <div className="w-full max-w-[373.26px] my-auto">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
