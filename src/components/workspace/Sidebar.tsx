import React from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import {
  UserCheck,
  Video,
  Clock,
  Users,
  LayoutGrid,
  Settings,
  HelpCircle,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: "/dashboard" | "/meetings" | "/attendance" | "/team";
}

const navItems: NavItem[] = [
  { label: "My work", icon: UserCheck, path: "/dashboard" },
  { label: "Meetings", icon: Video, path: "/meetings" },
  { label: "Attendance", icon: Clock, path: "/attendance" },
  { label: "The Team", icon: Users, path: "/team" },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: NavItem["path"]) => location.pathname.includes(path);

  return (
    <aside className="w-18 min-w-18 bg-white border-r border-slate-200/80 flex flex-col items-center justify-between py-4 h-full min-h-screen select-none">
      <div className="flex flex-col items-center gap-6">
        {/* Brand Mark */}
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors"
          title="i11Sprint"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        {/* Icon Navigation */}
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                title={item.label}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center gap-2">
        <button
          className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Help Center"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
