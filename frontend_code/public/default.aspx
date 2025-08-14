<!-- import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSupportSidebar } from '../pages/Events/AdminSupportSidebar';
import { useAuthStore } from '../store/auth.store';

export default function DefaultLayout() {
  const { isAuthenticated } = useAuthStore();

  const isAdmin = () => true;

  return (
    <div className="flex min-h-screen relative">
      {/* Admin Sidebar for admins */}
      {isAuthenticated && isAdmin() && (
        <AdminSupportSidebar isOpen={true} onClose={() => {}} />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
} -->
