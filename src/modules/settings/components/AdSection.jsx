import React from "react";
import { RenderField } from "./render.field";

export const AdSection = ({ title, platform, icon, control, placeholders }) => {
  const statusOptions = [
    { label: "On", value: "On" },
    { label: "Off", value: "Off" },
  ];

  const prefix = platform.toLowerCase();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        <div className="md:col-span-2">
          <RenderField
            control={control}
            name={`${prefix}.native`}
            label={`${platform} · Native Ads`}
            placeholder={placeholders?.native || "Native ID not set"}
          />
        </div>
        <RenderField
          control={control}
          name={`${prefix}.nativeEveryN`}
          label="Ad Every N Items"
          placeholder={placeholders?.nativeEveryN || "Interval not set"}
        />
        <RenderField
          control={control}
          name={`${prefix}.nativeStatus`}
          label="Status"
          type="select"
          options={statusOptions}
        />
      </div>
    </div>
  );
};
