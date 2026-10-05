import React from 'react';
import {
  ArrowUpDown,
  SlidersHorizontal,
  CheckCircle2,
  Users,
  Search,
  Settings,
  Plus,
  ChevronDown,
} from 'lucide-react';

interface KanbanToolbarProps {
  onNewBoardClick: () => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  onSearchClick?: () => void;
}

export const KanbanToolbar: React.FC<KanbanToolbarProps> = ({
  onNewBoardClick,
  onFilterClick,
  onSortClick,
  onSearchClick,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto select-none font-sans text-slate-900">
      {/* Left / Middle Control Pills */}
      <div className="flex items-center gap-2 min-w-max">
        {/* Sort Button */}
        <button
          onClick={onSortClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-normal text-slate-700 transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span>Sort</span>
        </button>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-normal text-slate-700 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Filter</span>
        </button>

        {/* Closed Toggle Button */}
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-normal text-slate-400 transition-colors">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Closed</span>
        </button>

        {/* Assignee Filter Pill */}
        <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-normal text-slate-700 transition-colors">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>Assignee</span>
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-200 my-auto mx-1" />

        {/* Search Icon Trigger */}
        <button
          onClick={onSearchClick}
          className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          title="Search Kanban"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Customize Button */}
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-normal text-slate-700 transition-colors">
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>Customize</span>
        </button>
      </div>

      {/* Right Primary Action Button: + New Board v */}
      <div className="flex items-center min-w-max">
        <button
          onClick={onNewBoardClick}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-xs font-normal shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Board</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
