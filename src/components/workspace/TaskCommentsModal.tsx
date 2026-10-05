import React, { useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import type { Task } from '../../types/workspace';

interface TaskCommentsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (taskId: string, content: string) => void;
}

export const TaskCommentsModal: React.FC<TaskCommentsModalProps> = ({
  task,
  isOpen,
  onClose,
  onAddComment,
}) => {
  const [commentContent, setCommentContent] = useState('');

  if (!isOpen || !task) return null;

  const commentsList = task.commentsList ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    onAddComment(task.id, commentContent.trim());
    setCommentContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn font-sans text-slate-900 select-none">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 relative max-h-[85vh] flex flex-col justify-between">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-normal">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-1">{task.title}</h3>
              <p className="text-xs text-slate-500 font-normal">Task Comments ({commentsList.length})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment Thread List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
          {commentsList.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200/60 text-slate-400 text-xs font-normal">
              No comments posted yet. Be the first to comment!
            </div>
          ) : (
            commentsList.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <img
                  src={c.authorAvatar}
                  alt={c.authorName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-normal text-slate-900">{c.authorName}</span>
                    <span className="font-normal text-slate-400">{c.createdAt}</span>
                  </div>
                  <p className="text-xs font-normal text-slate-700 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Input Form */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-normal focus:outline-none transition-all"
            autoFocus
            required
          />
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-normal flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
