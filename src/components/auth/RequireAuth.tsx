import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCurrentUser } from '../../hooks/useAuth';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && isError) {
      navigate({ to: '/login', replace: true });
    }
  }, [isLoading, isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  return <>{children}</>;
};
