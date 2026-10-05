import React, { useState } from 'react';
import {
  X,
  Calendar,
  MessageSquare,
  CheckSquare,
  Plus,
  Send
} from 'lucide-react';
import type { Task, TaskStatus, CustomStatusItem } from '../../types/workspace';

interface TaskDetailsModalProps {
  task: Task | null;
  customStatuses?: CustomStatusItem[];
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string, isCompleted: boolean) => void;
  onAddComment: (taskId: string, content: string) => void;
  onOpenAddStatusModal?: () => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  customStatuses = [],
  isOpen,
  onClose,
  onStatusChange,
  onAddSubtask,
  onToggleSubtask,
  onAddComment,
  onOpenAddStatusModal,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  if (!isOpen || !task) return null;

  const subtasks = task.subtasksList ?? [];
  const comments = task.commentsList ?? [];
  const completedSubtasksCount = subtasks.filter((s) => s.isCompleted).length;
  const progressPercent = subtasks.length > 0 ? Math.round((completedSubtasksCount / subtasks.length) * 100) : 0;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(task.id, newCommentText.trim());
    setNewCommentText('');
  };

  const getTypeDotColor = (type: string) => {
    switch (type) {
      case 'Design':
        return 'bg-purple-600';
      case 'Deployment':
        return 'bg-cyan-600';
      case 'Development':
        return 'bg-emerald-600';
      default:
        return 'bg-indigo-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn font-sans text-slate-900 select-none">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">

        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              {/* Type Pill */}
              <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-normal flex items-center gap-1.5 border border-slate-200/80">
                <span className={`w-2 h-2 rounded-full ${getTypeDotColor(task.type)}`} />
                <span>{task.type}</span>
              </span>

              {/* ASAP Flag */}
              {task.isAsap && (
                <span className="bg-red-600 text-white font-normal text-[10px] uppercase px-2 py-0.5 rounded tracking-wide shadow-xs">
                  ASAP Priority
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight leading-snug">
              {task.title}
            </h2>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Properties & Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status Dropdown */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
              Status
            </span>
            <select
              value={task.status}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '__ADD_NEW_CUSTOM_STATUS__') {
                  onOpenAddStatusModal?.();
                } else {
                  onStatusChange(task.id, val as TaskStatus);
                }
              }}
              className="bg-white border border-slate-200/80 text-xs font-normal text-slate-900 rounded-xl px-2.5 py-1 w-full focus:outline-none cursor-pointer"
            >
              <option value="IN PROGRESS">🚀 IN PROGRESS</option>
              <option value="SCHEDULED">📅 SCHEDULED</option>
              <option value="COMPLETED">✅ COMPLETED</option>
              {customStatuses.map((st) => (
                <option key={st.id} value={st.name}>
                  🏷️ {st.name}
                </option>
              ))}
              <option value="__ADD_NEW_CUSTOM_STATUS__">+ Add Custom Status...</option>
            </select>
          </div>

          {/* Assignee */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
              Assignee
            </span>
            <div className="flex items-center gap-2">
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                className="w-5 h-5 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xs font-normal text-slate-900">{task.assignee.name}</span>
            </div>
          </div>

          {/* Due Date */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
              Due Date
            </span>
            <div className="flex items-center gap-1.5 text-xs font-normal text-slate-900">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{task.dueDay && task.dueMonth ? `${task.dueDay} ${task.dueMonth}` : 'No deadline'}</span>
            </div>
          </div>
        </div>

        {/* Task Description */}
        {task.description && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-normal uppercase tracking-wider text-slate-400 block">
              Description
            </span>
            <p className="text-xs font-normal text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              {task.description}
            </p>
          </div>
        )}

        {/* Subtasks Progress & Checklist */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-normal text-slate-900">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>Subtasks Checklist ({completedSubtasksCount}/{subtasks.length})</span>
            </div>
            <span className="text-xs font-normal text-indigo-600">{progressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            />
          </div>

          {/* Subtask Items */}
          <div className="space-y-2 pt-1">
            {subtasks.length === 0 && (
              <p className="text-xs font-normal text-slate-400 py-2">No subtasks yet — add one below.</p>
            )}
            {subtasks.map((sub) => (
              <label
                key={sub.id}
                onClick={() => onToggleSubtask(task.id, sub.id, !sub.isCompleted)}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={sub.isCompleted}
                  onChange={() => {}}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-0 cursor-pointer"
                />
                <span className={`text-xs font-normal ${sub.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {sub.title}
                </span>
              </label>
            ))}
          </div>

          {/* Add Subtask Input */}
          <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add a new subtask..."
              className="flex-1 bg-slate-100 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-normal focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-normal flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Comment Thread & Discussion */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-normal text-slate-900">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Activity & Discussion ({comments.length})</span>
          </div>

          {/* List of comments */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {comments.length === 0 && (
              <p className="text-xs font-normal text-slate-400 py-2">No comments yet — start the discussion.</p>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-normal text-slate-900">{comment.authorName}</span>
                    <span className="font-normal text-slate-400">{comment.createdAt}</span>
                  </div>
                  <p className="text-xs font-normal text-slate-600 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Post Comment Input */}
          <form onSubmit={handlePostComment} className="flex gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-slate-100 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-normal focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-normal flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Comment</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
