import React, { useState } from 'react';
import { X, Tag, Plus } from 'lucide-react';
import type { CustomStatusItem } from '../../types/workspace';

interface AddCustomStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomStatus: (status: CustomStatusItem) => void;
}

export const AddCustomStatusModal: React.FC<AddCustomStatusModalProps> = ({
  isOpen,
  onClose,
  onAddCustomStatus,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-purple-600');

  if (!isOpen) return null;

  const colorOptions = [
    { name: 'Purple', bgClass: 'bg-purple-600' },
    { name: 'Indigo', bgClass: 'bg-indigo-600' },
    { name: 'Amber', bgClass: 'bg-amber-500' },
    { name: 'Emerald', bgClass: 'bg-emerald-600' },
    { name: 'Cyan', bgClass: 'bg-cyan-600' },
    { name: 'Rose', bgClass: 'bg-rose-600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCustomStatus({
      id: `status-${Date.now()}`,
      name: name.trim(),
      color: selectedColor,
    });

    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn font-sans text-slate-900 select-none">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-normal">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Add Custom Status</h3>
              <p className="text-xs text-slate-500 font-normal">Create a new status for your task workflow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-normal">
          {/* Status Name */}
          <div>
            <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-normal mb-1.5">
              Status Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. In Review, Testing, Blocked, Backlog"
              className="w-full bg-slate-50 border border-slate-200/80 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-normal"
              autoFocus
              required
            />
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-normal mb-1.5">
              Status Badge Color
            </label>
            <div className="flex items-center gap-2 pt-1">
              {colorOptions.map((opt) => (
                <button
                  key={opt.bgClass}
                  type="button"
                  onClick={() => setSelectedColor(opt.bgClass)}
                  className={`w-7 h-7 rounded-full ${opt.bgClass} transition-transform flex items-center justify-center ${
                    selectedColor === opt.bgClass ? 'scale-110 ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-105'
                  }`}
                  title={opt.name}
                />
              ))}
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="pt-1">
            <span className="block text-slate-400 text-[11px] mb-1.5">Quick status suggestions:</span>
            <div className="flex flex-wrap gap-1.5">
              {['In Review', 'Testing', 'Blocked', 'Backlog', 'Ready for QA'].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setName(sug)}
                  className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-normal transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-normal py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-normal py-3 rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Status</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
