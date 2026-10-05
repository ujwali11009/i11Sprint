import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  MoreHorizontal, 
  Users, 
  Video, 
  Info, 
  RotateCcw, 
  XCircle,
  ExternalLink
} from 'lucide-react';
import type { Meeting, MeetingStatus } from '../../types/meeting';

interface MeetingCardProps {
  meeting: Meeting;
  onStatusChange: (id: string, newStatus: MeetingStatus) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onStatusChange,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(meeting.isExpanded ?? false);

  const statusAccent: Record<MeetingStatus, string> = {
    Ongoing: 'border-l-emerald-400',
    Pending: 'border-l-amber-400',
    Rescheduled: 'border-l-blue-400',
    Cancelled: 'border-l-red-300',
  };

  const getStatusBadge = (status: MeetingStatus) => {
    switch (status) {
      case 'Ongoing':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-normal text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ongoing</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200/80 font-normal text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Pending</span>
          </span>
        );
      case 'Rescheduled':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200/80 font-normal text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
            <RotateCcw className="w-3 h-3 text-blue-600" />
            <span>Rescheduled</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="bg-red-50 text-red-700 border border-red-200/80 font-normal text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl transition-all duration-300 overflow-hidden ${
        isExpanded
          ? 'border-2 border-indigo-500/80 shadow-lg ring-4 ring-indigo-50/50 p-6 md:p-7'
          : `border border-l-4 ${statusAccent[meeting.status]} border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md p-5`
      }`}
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title & Description */}
        <div className="space-y-1 max-w-2xl">
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight">
            {meeting.title}
          </h3>
          <p className="text-xs md:text-sm text-slate-500 font-normal leading-relaxed">
            {meeting.description}
          </p>
        </div>

        {/* Right Badges & Actions */}
        <div className="flex items-center flex-wrap gap-3 self-start lg:self-center">
          {/* Status badge */}
          {getStatusBadge(meeting.status)}

          {/* Participants badge */}
          <div className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-normal text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>{meeting.participantsCount} Participant</span>
          </div>

          {/* Toggle Details Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-xs font-normal px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              isExpanded
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs'
            }`}
          >
            <span>View Details</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Options button */}
          <button className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content Details */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-6 animate-fadeIn">
          {/* Top timestamp row */}
          <div className="flex justify-end text-xs font-normal text-slate-400">
            <span>Created at: {meeting.createdAt}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Col 1: Start & End Time + Timezone */}
            <div className="md:col-span-4 space-y-4 pr-4 border-r-0 md:border-r border-slate-100">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">Start</span>
                  <span className="text-sm font-normal text-slate-900">{meeting.startTime}</span>
                </div>
                <div className="text-slate-300 font-normal">—</div>
                <div>
                  <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">End</span>
                  <span className="text-sm font-normal text-slate-900">{meeting.endTime}</span>
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-normal text-slate-800">
                  <span>{meeting.timezoneName}</span>
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-xs font-normal text-slate-500 block">{meeting.timezone}</span>
              </div>
            </div>

            {/* Col 2: Meeting Link & Email */}
            <div className="md:col-span-4 space-y-4 pr-4 border-r-0 md:border-r border-slate-100">
              <div>
                <div className="flex items-center gap-1 mb-1.5 text-[10px] font-normal uppercase tracking-wider text-slate-400">
                  <span>Meeting Link</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <a
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/80 font-normal text-xs px-3.5 py-1.5 rounded-lg transition-colors group"
                >
                  <Video className="w-4 h-4 text-emerald-600" />
                  <span>Connect Gmeet</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              <div>
                <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block mb-1">Email</span>
                <span className="text-xs font-normal text-slate-700">{meeting.email}</span>
              </div>
            </div>

            {/* Col 3: Meeting Notes */}
            <div className="md:col-span-4 space-y-2">
              <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">Meeting Notes</span>
              <p className="text-xs font-normal text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {meeting.meetingNotes}
              </p>
            </div>
          </div>

          {/* Action Footer Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onStatusChange(meeting.id, 'Rescheduled')}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-normal text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reschedule</span>
            </button>

            <button
              onClick={() => onStatusChange(meeting.id, 'Cancelled')}
              className="bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 font-normal text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
