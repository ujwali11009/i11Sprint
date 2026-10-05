import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import type { TaskStatus, TaskType, CustomStatusItem } from "../../types/workspace";
import type { User } from "../../types/user";

export interface NewTaskPayload {
  title: string;
  status: TaskStatus;
  type: TaskType;
  isAsap: boolean;
  assigneeId: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  customStatuses?: CustomStatusItem[];
  teamMembers: User[];
  onClose: () => void;
  onAddTask: (task: NewTaskPayload) => void;
  onOpenAddStatusModal?: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  customStatuses = [],
  teamMembers,
  onClose,
  onAddTask,
  onOpenAddStatusModal,
}) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("IN PROGRESS");
  const [type, setType] = useState<TaskType>("Operational");
  const [assigneeId, setAssigneeId] = useState("");
  const [isAsap, setIsAsap] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assigneeId) return;

    onAddTask({ title, status, type, isAsap, assigneeId });

    setTitle("");
    setIsAsap(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">
            Create New Task
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-xs font-semibold"
        >
          <div>
            <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
              Task Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement user authentication flow"
              className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '__ADD_NEW_CUSTOM_STATUS__') {
                    onOpenAddStatusModal?.();
                  } else {
                    setStatus(val as TaskStatus);
                  }
                }}
                className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
              >
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="COMPLETED">COMPLETED</option>
                {customStatuses.map((st) => (
                  <option key={st.id} value={st.name}>
                    {st.name}
                  </option>
                ))}
                <option value="__ADD_NEW_CUSTOM_STATUS__">+ Add Custom Status...</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Category Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
              >
                <option value="Operational">Operational</option>
                <option value="Design">Design</option>
                <option value="Deployment">Deployment</option>
                <option value="Development">Development</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              required
              className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
            >
              <option value="" disabled>
                Select a team member
              </option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAsap"
              checked={isAsap}
              onChange={(e) => setIsAsap(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
            />
            <label
              htmlFor="isAsap"
              className="text-slate-700 cursor-pointer select-none"
            >
              Mark as <span className="text-red-600 font-extrabold">ASAP</span>{" "}
              priority
            </label>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
