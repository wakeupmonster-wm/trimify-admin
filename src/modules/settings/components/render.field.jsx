import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// --- REUSABLE FIELD RENDERER ---
export const RenderField = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  options,
  description,
  icon: Icon,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && (
            <FormLabel className="text-gray-800 font-semibold font-jakarta tracking-wide text-xs mb-2 block">
              {label}
            </FormLabel>
          )}

          <div className="relative group">
            {Icon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors">
                <Icon size={18} />
              </div>
            )}

            {type === "select" ? (
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "border border-slate-300/60 text-gray-800 h-11 focus:ring-brand-blue rounded-md transition-all bg-white",
                      Icon && "pl-11",
                    )}
                  >
                    <SelectValue
                      placeholder={placeholder || "Select an option"}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border-slate-300/60 text-slate-800">
                  {options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === "textarea" ? (
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  className={cn(
                    "border border-slate-300/60 text-gray-800 min-h-[120px] focus-visible:ring-brand-blue rounded-md transition-all bg-white",
                    Icon && "pl-11",
                  )}
                />
              </FormControl>
            ) : (
              <FormControl>
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  className={cn(
                    "border border-slate-300/60 text-slate-800 h-10 focus-visible:ring-brand-blue rounded-md transition-all bg-[#f9fafb] shadow-none",
                    Icon && "pl-11",
                  )}
                />
              </FormControl>
            )}
          </div>

          {description && (
            <FormDescription className="text-gray-500 text-xs mt-1">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-red-600 text-xs" />
        </FormItem>
      )}
    />
  );
};
