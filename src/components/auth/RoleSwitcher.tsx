import React from 'react';

export type UserRole = 'employee' | 'admin';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
}) => {
  return (
    <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 shadow-inner">
      <button
        type="button"
        onClick={() => onRoleChange('employee')}
        className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
          currentRole === 'employee'
            ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/40'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Employee
      </button>
      <button
        type="button"
        onClick={() => onRoleChange('admin')}
        className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
          currentRole === 'admin'
            ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/40'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Admin
      </button>
    </div>
  );
};
