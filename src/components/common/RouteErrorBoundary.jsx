import React, { useState } from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertOctagon,
  RefreshCw,
  ArrowLeft,
  Home,
  ChevronDown,
  ChevronUp,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  // Determine if it's a chunk loading / dynamic import failure
  const errorString =
    error?.message || (typeof error === "string" ? error : "");
  const isChunkError =
    /failed to fetch dynamically imported module/i.test(errorString) ||
    /loading chunk/i.test(errorString) ||
    /failed to load/i.test(errorString);

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#F8FDFF] flex flex-col items-center justify-center px-6 py-12 text-center relative overflow-hidden">
      {/* Decorative Brand Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-aqua-gradient blur-[120px] opacity-25 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full bg-[#E6FFFD] blur-[120px] opacity-45 pointer-events-none" />

      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="max-w-xl w-full space-y-8 z-10"
      >
        {/* Animated Visual Card */}
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 12 }}
            className="bg-white p-7 rounded-full shadow-[0_20px_50px_rgba(70,199,205,0.08)] border border-[#E6FFFD] relative"
          >
            <div className="bg-rose-50 p-4 rounded-full">
              <AlertOctagon className="w-16 h-16 text-rose-500 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1">
              <span className="flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 border-2 border-white"></span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#212121] tracking-tight">
            {isChunkError
              ? "App Update Available"
              : "Unexpected Application Error"}
          </h1>
          <p className="text-[#606060] text-lg font-medium leading-relaxed max-w-md mx-auto">
            {isChunkError
              ? "We've deployed an update to the application! Please reload to fetch the latest version and keep things running smoothly."
              : "Something unexpected went wrong while rendering this page. Our team has been notified."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          {isChunkError ? (
            <Button
              className="bg-[#46C7CD] hover:bg-[#3bb1b6] text-white h-12 px-8 rounded-full font-bold shadow-lg shadow-[#46C7CD]/20 transition-all transform hover:scale-105 flex items-center gap-2"
              onClick={handleReload}
            >
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
              Reload Application
            </Button>
          ) : (
            <Button
              className="bg-[#46C7CD] hover:bg-[#3bb1b6] text-white h-12 px-8 rounded-full font-bold shadow-lg shadow-[#46C7CD]/20 transition-all transform hover:scale-105 flex items-center gap-2"
              onClick={handleReload}
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}

          <Button
            variant="outline"
            className="border-slate-300/60 text-slate-600 hover:bg-slate-50 hover:text-slate-800 h-12 px-6 rounded-full font-bold transition-all flex items-center gap-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>

          <Button
            variant="outline"
            className="border-[#46C7CD] text-brand-blue hover:bg-[#46C7CD] hover:text-white h-12 px-6 rounded-full font-bold transition-all flex items-center gap-2"
            onClick={handleGoHome}
          >
            <Home className="h-4 w-4" /> Back to Home
          </Button>
        </div>

        {/* Collapsible Error Diagnostics */}
        <div className="border border-slate-100 rounded-2xl bg-white/50 backdrop-blur-sm overflow-hidden transition-all shadow-sm">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between px-6 py-4 text-left text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors"
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              Technical Error Diagnostics
            </span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {showDetails && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 text-left border-t border-slate-50 pt-4">
                  <div className="bg-slate-900 text-slate-200 font-mono text-xs rounded-xl p-4 overflow-x-auto max-h-60 shadow-inner">
                    <p className="font-bold text-rose-400 mb-2">
                      Error: {errorString || "Unknown runtime exception"}
                    </p>
                    {error?.stack ? (
                      <pre className="whitespace-pre overflow-x-auto opacity-80 leading-relaxed">
                        {error.stack}
                      </pre>
                    ) : (
                      <p className="opacity-60 italic">
                        No stack trace available.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
