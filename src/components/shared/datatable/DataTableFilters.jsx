import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export function DataTableFilters({ filterConfig = [] }) {
  if (!filterConfig || filterConfig.length === 0) return null;

  return (
    <>
      {filterConfig.map((filter, idx) => {
        if (filter.type === "select") {
          const isActive =
            filter.value !== undefined &&
            filter.value !== null &&
            filter.value !== "";
          return (
            <div key={filter.id || idx} className="flex-1 md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all w-full md:w-auto justify-between",
                      isActive && "border-app-primary2 text-app-primary2 hover:text-app-primary5",
                    )}
                  >
                    <span className="text-xs">
                      {isActive && filter.getDisplayValue
                        ? filter.getDisplayValue(filter.value)
                        : isActive
                          ? (() => {
                              const matched = filter.options?.find(
                                (o) =>
                                  (typeof o === "object" ? o.value : o) ===
                                  filter.value,
                              );
                              const lbl = matched
                                ? typeof matched === "object"
                                  ? matched.label
                                  : matched
                                : filter.value;
                              return lbl
                                .toString()
                                .replace("_", " ")
                                .replace("-", " ");
                            })()
                          : filter.placeholder || `Select ${filter.label}`}
                    </span>
                    <IconChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-auto min-w-36 p-1.5 rounded-xl"
                >
                  <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5">
                    {filter.label}
                  </DropdownMenuLabel>
                  {filter.options.map((opt) => {
                    // Support options that are either strings or { label, value } objects
                    const val = typeof opt === "object" ? opt.value : opt;
                    const lbl = typeof opt === "object" ? opt.label : opt;

                    return (
                      <DropdownMenuCheckboxItem
                        key={val}
                        className="rounded-lg capitalize text-xs"
                        checked={filter.value === val}
                        onCheckedChange={() =>
                          filter.onChange(filter.value === val ? "" : val)
                        }
                      >
                        {lbl.toString().replace("_", " ").replace("-", " ")}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }

        if (filter.type === "date") {
          const isActive = !!filter.value;
          return (
            <div
              key={filter.id || idx}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => filter.onChange(null)}
                  className="h-8 px-2 text-slate-500 hover:text-red-600 uppercase text-[10px] font-bold"
                >
                  Clear Date
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all w-full md:w-auto justify-between",
                      isActive && "border-app-primary2 text-app-primary2 hover:text-app-primary5",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-app-primary2" />
                      <span className="text-sm">
                        {isActive
                          ? format(filter.value, "PPP")
                          : filter.placeholder || "Pick a date"}
                      </span>
                    </div>
                    <IconChevronDown className="h-4 w-4 opacity-50 ml-auto md:ml-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={filter.value}
                    onSelect={filter.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          );
        }

        // Support for complex multi-checkbox grouping as used in UserDataTables
        if (filter.type === "checkbox-group") {
          const isActive = filter.options.some(
            (opt) =>
              opt.value !== undefined &&
              opt.value !== null &&
              opt.value !== false &&
              opt.value !== "",
          );
          return (
            <div key={filter.id || idx} className="flex-1 md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all w-full md:w-auto justify-between",
                      isActive && "border-app-primary2 text-app-primary2 hover:text-app-primary5",
                    )}
                  >
                    <span className="text-xs">
                      {filter.getDisplayValue
                        ? filter.getDisplayValue(filter.options)
                        : filter.placeholder || `Select ${filter.label}`}
                    </span>
                    <IconChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-full min-w-44 p-1.5 rounded-xl"
                >
                  {filter.groups.map((group, gIdx) => (
                    <React.Fragment key={gIdx}>
                      {gIdx > 0 && <DropdownMenuSeparator />}
                      {group.label && (
                        <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5">
                          {group.label}
                        </DropdownMenuLabel>
                      )}
                      {group.options.map((opt) => {
                        // Similar to select but each option manages its own value and onChange
                        const val = opt.value;
                        const isChecked =
                          val === true ||
                          (typeof val === "string" && val !== "");

                        return (
                          <DropdownMenuCheckboxItem
                            key={opt.id}
                            className="rounded-lg capitalize text-xs"
                            checked={isChecked}
                            onCheckedChange={opt.onChange}
                          >
                            {opt.label}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }

        return null;
      })}
    </>
  );
}
