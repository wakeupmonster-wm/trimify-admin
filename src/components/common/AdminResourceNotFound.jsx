import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Search, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * AdminResourceNotFound - A unified "Not Found" component for administrative resources.
 * Matches the Bento Grid aesthetic of the KAM Admin UI.
 */
export const AdminResourceNotFound = ({
  title = "Resource Not Found",
  description = "The requested item could not be located in our system. It may have been removed or the ID might be incorrect.",
  icon: Icon = Search,
  backLabel = "Go Back",
  backPath,
  className,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center min-h-[500px] p-6 animate-in fade-in zoom-in duration-500",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-4"
      >
        {/* Visual Element */}
        <div className="relative flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-app-primary2 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative bg-white p-8 rounded-full shadow-md border border-slate-300/60 flex items-center justify-center">
              <Icon className="w-16 h-16 text-app-primary2" strokeWidth={1.5} />

              {/* Decorative Mini-Icon */}
              {/* <div className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-md border border-slate-50">
                <div className="bg-amber-100 p-1 rounded-full">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-center">
          <Button
            onClick={handleBack}
            className="bg-app-primary2 hover:bg-app-primary5 text-white h-10 px-8 rounded-md font-bold shadow-sm shadow-app-primary2/50 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
