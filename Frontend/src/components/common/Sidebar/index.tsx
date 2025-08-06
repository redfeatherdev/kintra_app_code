import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { MdDashboard, MdManageAccounts } from 'react-icons/md';
import { IoIosNotifications } from 'react-icons/io';
import { FaUsersCog } from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';
import Logo from '../../../images/logo/logo-icon.svg';
import { FaCalendarAlt } from 'react-icons/fa';
import { FiImage } from 'react-icons/fi';
import { useAuthStore } from '../../../store/auth.store';
import { Link } from 'react-router-dom';
import { FaCreditCard } from 'react-icons/fa';


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useAuthStore();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-99 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" className="flex items-center gap-4">
          <img className="w-8" src={Logo} alt="Logo" />
          <span className="text-3xl font-bold tracking-wider text-white">
            Kintr
          </span>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="py-4 px-4 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/' && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <MdDashboard className="w-6 h-6" />
                  Total User Statistics
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/users"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('users') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <MdManageAccounts className="w-6 h-6" />
                  Account Overview
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/demographics"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('demographics') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaUsersCog className="w-6 h-6" />
                  Demographics
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/notifications"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('notifications') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <IoIosNotifications className="w-6 h-6" />
                  Notifications
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/events"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('events') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaCalendarAlt className="w-6 h-6" />
                  Event Planner
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admins"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('admins') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <RiAdminFill className="w-6 h-5" />
                  Admin Management
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/events/payments"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('admins') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaCreditCard className="w-6 h-5" /> {/* Updated icon */}
                  Payment Management
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/media"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('media') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FiImage className="w-6 h-6" />
                  Media Manager
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-support"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('admin-support') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <RiAdminFill className="w-6 h-5" />
                  Admin Support
                </NavLink>
                )
              </li>

            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
