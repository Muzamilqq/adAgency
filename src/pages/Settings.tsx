import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Bell,
  Lock,
  User,
  Palette,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useAuth } from "@/hooks/useAuth";

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsSheet({ isOpen, onClose }: SettingsSheetProps) {
  const { isDarkMode } = useDarkMode();
  const { user, updateProfile, updatePassword } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleProfileSave = async () => {
    try {
      await updateProfile({ name, email });
      alert("Profile updated successfully!");
    } catch (err) {
      alert(
        "Failed to update profile: " +
          (err instanceof Error ? err.message : err),
      );
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    try {
      await updatePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password updated successfully!");
    } catch (err) {
      alert(
        "Failed to update password: " +
          (err instanceof Error ? err.message : err),
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className={`w-full sm:w-[540px] overflow-y-auto ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white"}`}
      >
        <SheetHeader className="mb-6">
          <SheetTitle
            className={`text-2xl ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Settings
          </SheetTitle>
          <CardDescription
            className={isDarkMode ? "text-slate-400" : "text-gray-500"}
          >
            Manage your account and preferences
          </CardDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className={isDarkMode ? "bg-slate-800 border-slate-700" : ""}>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}
              >
                <User className="w-5 h-5 text-blue-500" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="sheet-name"
                  className={isDarkMode ? "text-slate-300" : ""}
                >
                  Full Name
                </Label>
                <Input
                  id="sheet-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={
                    isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="sheet-email"
                  className={isDarkMode ? "text-slate-300" : ""}
                >
                  Email
                </Label>
                <Input
                  id="sheet-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={
                    isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
                  }
                />
              </div>
              <Button onClick={handleProfileSave}>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className={isDarkMode ? "bg-slate-800 border-slate-700" : ""}>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}
              >
                <Palette className="w-5 h-5 text-purple-500" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize your interface preferences
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Notifications */}
          <Card className={isDarkMode ? "bg-slate-800 border-slate-700" : ""}>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}
              >
                <Bell className="w-5 h-5 text-yellow-500" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDarkMode ? "text-white" : ""}>
                    Campaign Alerts
                  </Label>
                  <p
                    className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                  >
                    Get notified when campaigns need attention
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDarkMode ? "text-white" : ""}>
                    Weekly Reports
                  </Label>
                  <p
                    className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                  >
                    Receive weekly performance summaries
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDarkMode ? "text-white" : ""}>
                    New Features
                  </Label>
                  <p
                    className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                  >
                    Be the first to know about new features
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className={isDarkMode ? "bg-slate-800 border-slate-700" : ""}>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}
              >
                <Lock className="w-5 h-5 text-green-500" />
                Security
              </CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="sheet-current-password"
                  className={isDarkMode ? "text-slate-300" : ""}
                >
                  Current Password
                </Label>
                <Input
                  id="sheet-current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={
                    isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="sheet-new-password"
                  className={isDarkMode ? "text-slate-300" : ""}
                >
                  New Password
                </Label>
                <Input
                  id="sheet-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={
                    isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="sheet-confirm-password"
                  className={isDarkMode ? "text-slate-300" : ""}
                >
                  Confirm New Password
                </Label>
                <Input
                  id="sheet-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={
                    isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
                  }
                />
              </div>
              <Button onClick={handlePasswordUpdate}>Update Password</Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Keep the page component for direct access via URL
export function Settings() {
  return null; // Now handled as sheet from Sidebar
}
