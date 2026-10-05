import React from 'react';
import { MoreVertical, Plus } from 'lucide-react';
import type { Task, TaskStatus } from '../../types/workspace';
import type { BoardColumnConfig } from './AddBoardModal';

interface KanbanBoardProps {
  tasks: Task[];
  columns?: BoardColumnConfig[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onAddNewTaskClick: (defaultStatus?: string) => void;
  onTaskClick?: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  columns,
  onAddNewTaskClick,
  onTaskClick,
}) => {
  // Default columns if none provided
  const defaultColumns: BoardColumnConfig[] = [
    { id: 'todo', title: 'To Do', color: 'bg-indigo-600' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-amber-500' },
    { id: 'scheduled', title: 'Scheduled', color: 'bg-blue-500' },
    { id: 'completed', title: 'Completed', color: 'bg-emerald-600' },
  ];

  const activeColumns = columns && columns.length > 0 ? columns : defaultColumns;

  const getTaskStatusMatch = (task: Task, colTitle: string) => {
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');
    const colNorm = normalize(colTitle);
    const taskStatusNorm = normalize(task.status);
    const taskTypeNorm = normalize(task.type);

    if (colNorm === 'todo' && (taskStatusNorm === 'todo' || taskStatusNorm === 'scheduled')) return true;
    if (colNorm === 'inprogress' && taskStatusNorm === 'inprogress') return true;
    if (colNorm === 'scheduled' && taskStatusNorm === 'scheduled') return true;
    if (colNorm === 'completed' && (taskStatusNorm === 'completed' || task.category === 'completed')) return true;
    
    return colNorm === taskStatusNorm || colNorm === taskTypeNorm;
  };

  // Helper for theme styling matching uploaded reference card image
  const getCardTheme = (task: Task, index: number) => {
    const themes = [
      {
        bgGradient: 'from-emerald-950/80 via-slate-900 to-slate-950',
        progressFill: 'bg-emerald-400',
        plusBadge: 'bg-emerald-500',
        percent: 90,
      },
      {
        bgGradient: 'from-amber-950/80 via-slate-900 to-slate-950',
        progressFill: 'bg-amber-400',
        plusBadge: 'bg-amber-500',
        percent: 30,
      },
      {
        bgGradient: 'from-rose-950/80 via-slate-900 to-slate-950',
        progressFill: 'bg-rose-400',
        plusBadge: 'bg-rose-500',
        percent: 50,
      },
      {
        bgGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
        progressFill: 'bg-blue-400',
        plusBadge: 'bg-blue-500',
        percent: 20,
      },
    ];

    if (task.subtasksTotal && task.subtasksTotal > 0) {
      const calcPercent = Math.round(((task.subtasksCompleted || 0) / task.subtasksTotal) * 100);
      const themeIdx = index % themes.length;
      return {
        ...themes[themeIdx],
        percent: calcPercent > 0 ? calcPercent : themes[themeIdx].percent,
      };
    }

    return themes[index % themes.length];
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 select-none">
      {activeColumns.map((col) => {
        const columnTasks = tasks.filter((t) => getTaskStatusMatch(t, col.title));

        return (
          <div
            key={col.id}
            className="w-84 min-w-[336px] bg-slate-100/70 p-4 rounded-3xl border border-slate-200/60 flex flex-col gap-4 min-h-[540px] shrink-0"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="font-semibold text-slate-900 text-sm tracking-tight">{col.title}</h3>
                <span className="bg-white text-slate-700 font-normal text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => onAddNewTaskClick(col.title)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors"
                title={`Add task under ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards Column */}
            <div className="flex-1 space-y-4">
              {columnTasks.map((task, idx) => {
                const theme = getCardTheme(task, idx);
                const displayDate = task.dueDay && task.dueMonth
                  ? `Due ${task.dueMonth} ${task.dueDay}`
                  : null;

                return (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick?.(task)}
                    className={`relative w-full rounded-[26px] overflow-hidden p-5 bg-gradient-to-b ${theme.bgGradient} border border-slate-800 shadow-xl transition-all duration-200 hover:shadow-2xl hover:border-slate-700 cursor-pointer space-y-5 text-white font-sans group`}
                  >
                    {/* Top Bar: Date & Options Menu */}
                    <div className="flex items-center justify-between text-xs font-normal text-slate-300">
                      <span>{displayDate ?? ' '}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick?.(task);
                        }}
                        className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/60 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Center Section: Task Title & Subtitle */}
                    <div className="text-center space-y-1 py-1">
                      <h4 className="font-semibold text-white text-lg tracking-tight leading-snug group-hover:text-indigo-200 transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-xs font-normal text-slate-400">
                        {task.type || 'Prototyping'}
                      </p>
                    </div>

                    {/* Progress Bar Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-normal text-white">
                        <span>Progress</span>
                        <span>{theme.percent}%</span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${theme.progressFill} transition-all duration-500 rounded-full`}
                          style={{ width: `${theme.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Card Footer: Assignee & Due Date */}
                    <div className="pt-2 flex items-center justify-between">
                      {/* Assignee */}
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-7 h-7 rounded-full object-cover border-2 border-slate-900 shadow-xs"
                        />
                        <span className="text-xs font-normal text-slate-300">{task.assignee.name}</span>
                      </div>

                      {/* Due Date Badge */}
                      {displayDate && (
                        <div className="bg-slate-800/90 text-slate-200 text-xs px-3.5 py-1.5 rounded-full font-normal border border-slate-700/60 shadow-xs">
                          {displayDate}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add Task Quick Trigger at bottom of column */}
              <button
                onClick={() => onAddNewTaskClick(col.title)}
                className="w-full py-3 px-3 rounded-2xl border border-dashed border-slate-300/80 hover:border-indigo-400 hover:bg-white text-slate-500 hover:text-indigo-600 text-xs font-normal flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
