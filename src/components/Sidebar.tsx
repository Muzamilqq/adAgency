import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Settings,
  Sparkles,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { User } from "@/types";
import { SettingsSheet } from "@/pages/Settings";

interface SidebarProps {
  isDarkMode: boolean;
  user?: User | null;
}

export function Sidebar({ isDarkMode, user }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/clients", icon: Users, label: "Clients" },
    { path: "/campaigns", icon: Megaphone, label: "Campaigns" },
    { path: "/ai-brief", icon: Sparkles, label: "AI Brief" },
    ...(user?.role === "admin" ? [{ path: "/admin", icon: Shield, label: "Admin" }] : []),
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 z-40 transition-transform duration-300
          ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}
          border-r
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-inherit">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <span
              className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              AdAgency Pro
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }: { isActive: boolean }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? isDarkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600"
                      : isDarkMode
                        ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
          
          {/* Settings - Opens as sheet from right */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full
              ${isDarkMode
                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
            `}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        {/* Footer */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDarkMode ? "border-slate-800" : "border-gray-200"}`}
        >
          <div
            className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}
          >
            <p>v1.0.0</p>
            <p>© 2026 AdAgency Pro</p>
          </div>
        </div>
      </aside>

      {/* Settings Sheet - Opens from right side */}
      <SettingsSheet isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
