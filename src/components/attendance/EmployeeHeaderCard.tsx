import React from "react";
import { Mail, Phone, MoreVertical } from "lucide-react";
import type { User } from "../../types/user";

interface EmployeeHeaderCardProps {
  user: User;
}

export const EmployeeHeaderCard: React.FC<EmployeeHeaderCardProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-7 shadow-2xs space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatarUrl ?? undefined}
              alt={user.fullName}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white shadow-md bg-slate-100"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {user.fullName}
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs px-3 py-0.5 rounded-full font-normal">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              {user.employeeCode ? `${user.employeeCode} • ` : ''}{user.jobTitle}
            </p>
          </div>
        </div>

        <button className="self-start sm:self-center p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {/* Department */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
            Department
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs font-normal text-slate-800">{user.department}</span>
          </div>
        </div>

        {/* Employment Type */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
            Employment Type
          </span>
          <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block">
            {user.employmentType}
          </span>
        </div>

        {/* Email */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
            Email
          </span>
          <div className="flex items-center gap-2 text-xs font-normal text-slate-800 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
            Phone Number
          </span>
          <div className="flex items-center gap-2 text-xs font-normal text-slate-800 truncate">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{user.phoneNumber || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
