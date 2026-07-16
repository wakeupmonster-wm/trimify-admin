import React, { useState } from "react";
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
// import { logout } from "@/modules/authentication/store/auth.slice";
import { toast } from "sonner";
import dummyImg from "@/assets/web/dummyImg.webp";
import ConfirmModal from "@/components/common/ConfirmModal";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    // dispatch(logout());
    navigate("/auth/login");
    toast.success("Logout successful.");
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <SidebarMenu className={"px-0"}>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ring-brand-blue hover:bg-slate-50"
              >
                <Avatar className="h-9 w-9 rounded-full">
                  <AvatarImage src={user.avatar} alt={"admin.webp"} />
                  <AvatarFallback className="rounded-lg">
                    {dummyImg}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left text-[13px] ml-1 leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="text-foreground/40 font-medium text-[10px]">
                    {/* {user.email} */}Admin
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={"admin.webp"} />
                    <AvatarFallback className="rounded-lg">
                      {dummyImg}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-[13px] leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-[11px]">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <Link to="accounts">
                  <DropdownMenuItem>
                    <IconUserCircle />
                    Account
                  </DropdownMenuItem>
                </Link>

                {/* <Link to="/admin/billing">
                  <DropdownMenuItem>
                    <IconCreditCard />
                    Billing
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem>
                  <IconNotification /> Notifications
                </DropdownMenuItem> */}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsLogoutModalOpen(true)}>
                <IconLogout />
                Log-out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your admin session?"
        confirmText="Log Out"
        type="warning"
      />
    </>
  );
}
