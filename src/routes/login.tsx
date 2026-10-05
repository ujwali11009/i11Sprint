import { useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Logo } from '../components/common/Logo';
import { RoleSwitcher, type UserRole } from '../components/auth/RoleSwitcher';
import { LoginForm } from '../components/auth/LoginForm';
import { AuthHeroCard } from '../components/auth/AuthHeroCard';
import { AuthFooter } from '../components/auth/AuthFooter';

export const LoginPage = () => {
  const [role, setRole] = useState<UserRole>('employee');

  return (
    <div className="min-h-screen w-full bg-[#F4F5F9] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Outer Card Container */}
      <div className="w-full max-w-[1240px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/80 border border-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
        
        {/* Left Side: Form Section (5 columns on desktop) */}
        <div className="lg:col-span-6 p-8 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between">
          <div>
            {/* Top Brand Header */}
            <div className="mb-8">
              <Logo size="md" />
              <p className="text-xs font-semibold text-slate-400 mt-1.5">
                Accelerate your team's potential.
              </p>
            </div>

            {/* Role Switcher */}
            <div className="mb-6">
              <RoleSwitcher currentRole={role} onRoleChange={setRole} />
            </div>

            {/* Login Form */}
            <LoginForm role={role} />
          </div>

          {/* Footer Links */}
          <div className="mt-8">
            <AuthFooter />
          </div>
        </div>

        {/* Right Side: Visual Hero Panel (6 columns on desktop) */}
        <div className="lg:col-span-6 p-3 sm:p-4 bg-white flex flex-col justify-center">
          <AuthHeroCard />
        </div>

      </div>
    </div>
  );
};

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});
