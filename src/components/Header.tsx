import { Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "./DarkModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User as UserType } from "@/types";

interface HeaderProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  user?: UserType | null;
  onLogout?: () => void;
}

export function Header({
  isDarkMode,
  onDarkModeToggle,
  user,
  onLogout,
}: HeaderProps) {
  const userName = user?.name || "User";
  const userRole = user?.role || "";

  return (
    <header
      className={`
        h-16 flex items-center justify-between px-6 border-b
        ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200"
        }
      `}
    >
      {/* Left side - can be used for breadcrumbs or page title */}
      <div />

      {/* Right side - actions */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={onDarkModeToggle} />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className={
            isDarkMode
              ? "hover:bg-slate-800 text-slate-400"
              : "hover:bg-gray-100 text-gray-600"
          }
        >
          <Bell className="w-5 h-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`
                flex items-center gap-2 px-2
                ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"}
              `}
            >
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isDarkMode ? "bg-blue-600" : "bg-blue-500"}
              `}
              >
                <User className="w-4 h-4 text-white" />
              </div>
              <span
                className={`hidden sm:inline text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}
              >
                {userName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={isDarkMode ? "bg-slate-800 border-slate-700" : ""}
          >
            <DropdownMenuLabel className={isDarkMode ? "text-white" : ""}>
              <div>{userName}</div>
              <div className="text-xs font-normal text-muted-foreground capitalize">
                {userRole}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
