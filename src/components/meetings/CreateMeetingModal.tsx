import React, { useState } from 'react';
import { X, Video } from 'lucide-react';

export interface NewMeetingPayload {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  timezoneName: string;
  meetingLink: string;
  meetingNotes: string;
}

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMeeting: (newMeeting: NewMeetingPayload) => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onCreateMeeting,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayIso());
  const [startTime, setStartTime] = useState('10:00AM');
  const [endTime, setEndTime] = useState('11:00AM');
  const [timezone, setTimezone] = useState('UTC+0');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !meetingLink.trim()) return;

    onCreateMeeting({
      title,
      description,
      date: new Date(`${date}T00:00:00`).toISOString(),
      startTime,
      endTime,
      timezone,
      timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
      meetingLink,
      meetingNotes,
    });

    setTitle('');
    setDescription('');
    setMeetingLink('');
    setMeetingNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Create Appointment</h3>
              <p className="text-xs text-slate-500 font-medium">Schedule a new team meeting or webinar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
              Meeting Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. UI/UX Web3 Webinar 2025"
              className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-medium"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
              Short Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this meeting about?"
              className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="e.g. UTC+7"
                className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
              Meeting Link
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              required
              className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
              Meeting Notes
            </label>
            <textarea
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              placeholder="Key session topics and notes..."
              rows={3}
              className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all resize-none font-medium"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Video className="w-4 h-4" />
              <span>Schedule Meeting</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
