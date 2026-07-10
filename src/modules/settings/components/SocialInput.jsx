import React from "react";

export const SocialInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
}) => (
  <div className="space-y-2">
    <label className="text-[13px] font-bold text-slate-800 font-jakarta tracking-tight">
      {label}
    </label>
    <div className="flex items-stretch w-full rounded-lg border border-slate-300 overflow-hidden group focus-within:border-brand-aqua/50 focus-within:ring-4 focus-within:ring-brand-aqua/5 transition-all duration-300">
      <div className="bg-slate-100 px-4 flex items-center justify-center border-r border-slate-300 min-w-[60px] group-focus-within:bg-white transition-colors">
        <div className="text-foreground/80">{icon}</div>
      </div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-white/30 px-4 py-3.5 text-[14px] font-medium text-slate-700 outline-none placeholder:text-slate-300"
      />
    </div>
  </div>
);
