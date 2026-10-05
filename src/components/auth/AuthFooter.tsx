import React from 'react';

export const AuthFooter: React.FC = () => {
  return (
    <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs font-semibold text-slate-400 border-t border-slate-100">
      <div className="flex items-center gap-6">
        <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-slate-700 transition-colors">
          Privacy Policy
        </a>
        <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-slate-700 transition-colors">
          Terms of Service
        </a>
        <a href="#status" onClick={(e) => e.preventDefault()} className="hover:text-slate-700 transition-colors flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          System Status
        </a>
      </div>
      <div>
        <span>© 2024 i11Sprint</span>
      </div>
    </footer>
  );
};
