import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  UserPlus,
  LayoutGrid,
  Folder,
  FolderOpen,
  Hash,
} from "lucide-react";
import type { Project } from "../../types/workspace";

interface WorkspaceSidebarProps {
  projects: Project[];
  currentProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onAddProjectClick: () => void;
  onInviteClick?: () => void;
  showInvite?: boolean;
  showAddProject?: boolean;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onAddProjectClick,
  onInviteClick,
  showInvite = true,
  showAddProject = true,
}) => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const topLevelProjects = projects.filter((p) => !p.parentProjectId);
  const childrenOf = (projectId: string) => projects.filter((p) => p.parentProjectId === projectId);

  return (
    <aside className="w-64 min-w-[256px] bg-[#151B34] text-white flex flex-col justify-between h-full min-h-screen select-none">
      <div className="flex-1 overflow-y-auto px-4 pt-5 space-y-6">
        {/* Workspace Brand Header */}
        <button className="w-full flex items-center gap-2.5 px-1 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-bold text-white text-sm tracking-tight block leading-tight">
              i11Sprint
            </span>
            <span className="text-[11px] text-white/40 leading-tight">Workspace</span>
          </div>
          <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
        </button>

        {/* Search */}
        <div className="relative flex items-center bg-white/10 hover:bg-white/15 focus-within:bg-white/15 rounded-xl px-3 py-2.5 transition-colors">
          <Search className="w-4 h-4 text-white/40 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-xs text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>

        {/* Projects Section */}
        <div className="space-y-1">
          <div className="w-full flex items-center justify-between px-1 py-1">
            <button
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
            >
              <span>Projects</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isProjectsOpen ? "" : "-rotate-90"}`} />
            </button>
            {showAddProject && (
              <button
                onClick={onAddProjectClick}
                className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                title="Add new project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isProjectsOpen && (
            <div className="space-y-0.5">
              {topLevelProjects.length === 0 && (
                <p className="px-3 py-2 text-[11px] text-white/40">
                  {showAddProject ? 'No projects yet — add one above.' : 'No projects yet.'}
                </p>
              )}
              {topLevelProjects.map((proj) => {
                const children = childrenOf(proj.id);
                const hasChildren = children.length > 0;
                const isActive = currentProjectId === proj.id;
                const isExpanded = expandedProjectId === proj.id;

                return (
                  <div key={proj.id}>
                    <button
                      onClick={() => {
                        onSelectProject(proj.id);
                        if (hasChildren) setExpandedProjectId(isExpanded ? null : proj.id);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-white/10 text-white border-l-2 border-indigo-400 pl-2.5"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {hasChildren ? (
                        isExpanded ? (
                          <FolderOpen className="w-3.5 h-3.5 shrink-0 text-indigo-300" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 shrink-0 text-indigo-300" />
                        )
                      ) : (
                        <Hash className="w-3.5 h-3.5 shrink-0 text-white/30" />
                      )}
                      <span className="truncate flex-1 text-left">{proj.name}</span>
                      {hasChildren && (
                        <ChevronRight className={`w-3.5 h-3.5 text-white/30 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      )}
                    </button>

                    {hasChildren && isExpanded && (
                      <div className="ml-6 pl-2 border-l border-white/10 space-y-0.5 mt-0.5">
                        {children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => onSelectProject(child.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors truncate ${
                              currentProjectId === child.id
                                ? "text-white bg-white/10"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Invite Button (admin only) */}
      {showInvite && (
        <div className="p-4 pt-2">
          <button
            onClick={onInviteClick}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md shadow-emerald-900/30 transition-all group"
          >
            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Add Employee</span>
          </button>
        </div>
      )}
    </aside>
  );
};
