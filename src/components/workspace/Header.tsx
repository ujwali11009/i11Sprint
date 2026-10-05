import React, { useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Bell,
  Table as TableIcon,
  LayoutGrid,
  ChevronDown,
  X,
} from "lucide-react";
import type { User } from "../../types/user";

export type ViewMode = "table" | "kanban";

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddNewClick: () => void;
  showAddNew?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: User;
  teamPreview: User[];
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onAddNewClick,
  showAddNew = true,
  searchQuery,
  onSearchChange,
  currentUser,
  teamPreview,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const visiblePreview = teamPreview.slice(0, 3);
  const extraCount = teamPreview.length - visiblePreview.length;

  return (
    <header className="w-full bg-white border-b border-slate-200/80 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      {/* Left controls: Add New button + View Tabs */}
      <div className="flex items-center gap-4">
        {/* Primary "+ Add new" button */}
        {showAddNew && (
          <button
            onClick={onAddNewClick}
            className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-md shadow-slate-900/15 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-3" />
            <span>Add new</span>
          </button>
        )}

        {/* View Switcher Segmented Pill */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1 text-xs font-medium">
          <button
            onClick={() => onViewModeChange("table")}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-2 ${
              viewMode === "table"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table view</span>
          </button>

          <button
            onClick={() => onViewModeChange("kanban")}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-2 ${
              viewMode === "kanban"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban board</span>
          </button>
        </div>
      </div>

      {/* Middle & Right controls */}
      <div className="flex items-center gap-2.5">
        {/* Search Toggle */}
        {isSearchOpen ? (
          <div className="relative flex items-center bg-slate-100 border border-slate-300 rounded-full px-3.5 py-1.5 w-60 sm:w-72 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
              autoFocus
            />
            <button
              onClick={() => {
                setIsSearchOpen(false);
                onSearchChange("");
              }}
              className="text-slate-400 hover:text-slate-600 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 border border-slate-200/80 rounded-full hover:bg-slate-50 text-slate-600 transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Group */}
        <button className="flex items-center gap-1.5 border border-slate-200/80 hover:bg-slate-50 px-3.5 py-2.5 rounded-full text-xs font-medium text-slate-700 transition-colors">
          <LayoutGrid className="w-4 h-4 text-slate-500" />
          <span>Group</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Filter */}
        <button className="flex items-center gap-1.5 border border-slate-200/80 hover:bg-slate-50 px-3.5 py-2.5 rounded-full text-xs font-medium text-slate-700 transition-colors">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span>Filter</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Notification bell */}
        <button
          className="p-2.5 hover:bg-slate-100 rounded-full transition-colors text-slate-600 relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User avatars group */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden">
            {visiblePreview.map((member) => (
              <img
                key={member.id}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-slate-100"
                src={member.avatarUrl ?? undefined}
                alt={member.fullName}
                title={member.fullName}
              />
            ))}
            {extraCount > 0 && (
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white bg-indigo-50 text-indigo-700 font-bold text-xs">
                +{extraCount}
              </div>
            )}
          </div>

          <img
            className="inline-block h-9 w-9 rounded-full border-2 border-indigo-600 object-cover shadow-xs bg-slate-100"
            src={currentUser.avatarUrl ?? undefined}
            alt={currentUser.fullName}
            title={`${currentUser.fullName} (You)`}
          />
        </div>
      </div>
    </header>
  );
};
