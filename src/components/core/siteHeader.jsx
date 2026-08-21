import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { AdminProfileNav } from "./AdminProfileNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b bg-white backdrop-blur-md px-4 transition-all">
      <div className="flex w-full items-center justify-between md:justify-end">
        <div className="flex items-center gap-2 md:hidden">
          {/* Sidebar Trigger for Mobile & Desktop collapse */}
          <SidebarTrigger className="-ml-1 text-slate-500 hover:bg-white" />
          <Separator orientation="vertical" className="h-4 mx-2" />
        </div>

        <div className="flex items-center gap-3">
          <AdminProfileNav />
        </div>
      </div>
    </header>
  );
}
