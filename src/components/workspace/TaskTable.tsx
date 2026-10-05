import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Settings,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Calendar,
  Check,
  Plus,
  Rocket,
  Clock,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import type { Task, TaskStatus, CustomStatusItem } from '../../types/workspace';

interface TaskTableProps {
  tasks: Task[];
  customStatuses?: CustomStatusItem[];
  isAdmin?: boolean;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddNewTaskClick: () => void;
  onOpenAddStatusModal?: () => void;
  onTaskClick?: (task: Task) => void;
  onCommentClick?: (task: Task) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  customStatuses = [],
  isAdmin = true,
  onTaskStatusChange,
  onAddNewTaskClick,
  onOpenAddStatusModal,
  onTaskClick,
  onCommentClick,
}) => {
  const [isActiveOpen, setIsActiveOpen] = useState(true);
  const [isCompletedOpen, setIsCompletedOpen] = useState(true);

  const activeTasks = tasks.filter((t) => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Design':
        return 'bg-purple-500';
      case 'Deployment':
        return 'bg-cyan-500';
      case 'Development':
        return 'bg-emerald-500';
      default:
        return 'bg-indigo-500';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { icon: CheckCircle2, className: 'text-emerald-600' };
      case 'SCHEDULED':
        return { icon: Clock, className: 'text-slate-500' };
      case 'IN PROGRESS':
        return { icon: Rocket, className: 'text-amber-600' };
      default:
        return { icon: Tag, className: 'text-purple-600' };
    }
  };

  const renderStatusPill = (task: Task) => {
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === '__ADD_NEW_CUSTOM_STATUS__') {
        onOpenAddStatusModal?.();
      } else {
        onTaskStatusChange(task.id, val as TaskStatus);
      }
    };

    const { icon: StatusIcon, className } = getStatusStyle(task.status);

    return (
      <div
        className={`relative inline-flex items-center gap-2 text-xs font-medium ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <StatusIcon className="w-3.5 h-3.5 shrink-0" />
        <select
          value={task.status}
          onChange={handleSelectChange}
          className="bg-transparent focus:outline-none cursor-pointer appearance-none pr-1"
        >
          <option value="IN PROGRESS">In Progress</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          {customStatuses.map((st) => (
            <option key={st.id} value={st.name}>
              {st.name}
            </option>
          ))}
          <option value="__ADD_NEW_CUSTOM_STATUS__">+ Add Custom Status...</option>
        </select>
      </div>
    );
  };

  return (
    <div className="w-full space-y-8 select-none font-sans">
      {/* SECTION 1: Active Tasks */}
      <div className="space-y-3">
        {/* Section Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsActiveOpen(!isActiveOpen)}
            className="flex items-center gap-2.5 text-slate-900 hover:text-indigo-600 transition-colors group"
          >
            {isActiveOpen ? (
              <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            )}
            <h2 className="text-lg font-semibold tracking-tight">Active tasks</h2>
            <span className="bg-slate-100 text-slate-600 font-normal text-xs px-2.5 py-0.5 rounded-full">
              {activeTasks.length}
            </span>
          </button>

          <div className="flex items-center gap-3 text-slate-400 text-xs font-normal">
            <button className="flex items-center gap-1.5 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort</span>
            </button>
            <button className="hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Tasks Light Theme Table Card */}
        {isActiveOpen && (
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-normal text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6 font-normal w-[40%]">Task Name</th>
                    <th className="py-3.5 px-4 font-normal">
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        <button
                          type="button"
                          onClick={onOpenAddStatusModal}
                          className="p-1 hover:bg-slate-200/80 rounded-md text-slate-500 hover:text-slate-900 transition-colors"
                          title="Add Custom Status"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 font-normal">Type</th>
                    <th className="py-3.5 px-4 font-normal">Due Date</th>
                    <th className="py-3.5 px-6 font-normal">Assignee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {activeTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => onTaskClick?.(task)}
                      className={`transition-colors hover:bg-slate-50/80 cursor-pointer ${
                        task.isHighlighted ? 'bg-red-50/60 hover:bg-red-50/90' : ''
                      }`}
                    >
                      {/* Task Name */}
                      <td className="py-4 px-6 font-normal text-slate-900">
                        <div className="flex items-center gap-3">
                          <span
                            onClick={() => onTaskClick?.(task)}
                            className="leading-snug hover:text-indigo-600 hover:underline cursor-pointer"
                          >
                            {task.title}
                          </span>
                          
                          {task.isAsap && (
                            <span className="bg-red-600 text-white font-normal text-[9px] uppercase px-1.5 py-0.5 rounded tracking-wide shadow-xs shrink-0">
                              ASAP
                            </span>
                          )}

                          {/* Counters: comments, attachments, subtasks */}
                          <div className="flex items-center gap-2 text-slate-400 font-normal text-[11px] ml-1">
                            {task.commentsCount !== undefined && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCommentClick?.(task);
                                }}
                                className="flex items-center gap-1 hover:text-indigo-600 hover:bg-slate-100 px-1.5 py-0.5 rounded transition-colors"
                                title="View / Add Comments"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                                <span>{task.commentsCount}</span>
                              </button>
                            )}

                            {task.attachmentsCount !== undefined && (
                              <span className="flex items-center gap-1">
                                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                                {task.attachmentsCount}
                              </span>
                            )}

                            {task.subtasksTotal !== undefined && (
                              <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 font-normal text-[10px] px-1.5 py-0.5 rounded">
                                <CheckSquare className="w-3 h-3 text-indigo-600" />
                                {task.subtasksCompleted}/{task.subtasksTotal}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">{renderStatusPill(task)}</td>

                      {/* Type */}
                      <td className="py-4 px-4 font-normal text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-sm ${getTypeColor(task.type)}`} />
                          <span>{task.type}</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4">
                        {task.dueDay && task.dueMonth ? (
                          <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl font-normal leading-none ${
                            task.isHighlighted ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <span className="text-xs">{task.dueDay}</span>
                            <span className="text-[9px] uppercase tracking-wider">{task.dueMonth}</span>
                          </div>
                        ) : (
                          <Calendar className="w-4 h-4 text-slate-300" />
                        )}
                      </td>

                      {/* Assignee */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-normal text-slate-800">{task.assignee.name}</span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Inline Add Task Row (admin only — only admins assign tasks) */}
                  {isAdmin && (
                    <tr>
                      <td colSpan={5} className="py-3.5 px-6">
                        <button
                          onClick={onAddNewTaskClick}
                          className="text-indigo-600 hover:text-indigo-700 font-normal text-xs flex items-center gap-2 group transition-colors"
                        >
                          <div className="w-5 h-5 rounded-full border border-indigo-200 group-hover:border-indigo-500 flex items-center justify-center text-indigo-600">
                            <Plus className="w-3.5 h-3.5 stroke-[2]" />
                          </div>
                          <span>Add new task</span>
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Completed Tasks */}
      <div className="space-y-3 pt-2">
        {/* Section Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsCompletedOpen(!isCompletedOpen)}
            className="flex items-center gap-2.5 text-slate-900 hover:text-indigo-600 transition-colors group"
          >
            {isCompletedOpen ? (
              <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            )}
            <h2 className="text-lg font-semibold tracking-tight">Completed tasks</h2>
            <span className="bg-slate-100 text-slate-600 font-normal text-xs px-2.5 py-0.5 rounded-full">
              {completedTasks.length}
            </span>
          </button>
        </div>

        {/* Completed Tasks Light Table Card */}
        {isCompletedOpen && completedTasks.length > 0 && (
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-100 text-xs">
                  {completedTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => onTaskClick?.(task)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      {/* Task Name with Check icon */}
                      <td className="py-4 px-6 font-normal text-slate-400 w-[40%]">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[2]" />
                          </div>
                          <span
                            onClick={() => onTaskClick?.(task)}
                            className="line-through hover:text-indigo-600 hover:underline cursor-pointer"
                          >
                            {task.title}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">{renderStatusPill(task)}</td>

                      {/* Type */}
                      <td className="py-4 px-4 font-normal text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
                          <span>{task.type}</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4">
                        <Calendar className="w-4 h-4 text-slate-300" />
                      </td>

                      {/* Assignee */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5 opacity-60">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-normal text-slate-600">{task.assignee.name}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
