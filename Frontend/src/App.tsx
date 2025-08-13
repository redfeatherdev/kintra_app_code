

import { useEffect, Suspense, lazy } from 'react';
import {
  Route,
  Routes,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import SignIn from './pages/Authentication/SignIn';
import Dashboard from './pages/Dashboard';
import TicketBookingPage from './pages/Events/TicketBookingPage';
import EventsPage from './pages/Events/EventsPage';
import CreateEventPage from './pages/Events/CreateEventPage';
import EventAttendeesPage from './pages/Events/EventAttendeesPage';
import { AdminSupportSidebar } from './pages/Events/AdminSupportSidebar';
import { useAuthStore } from './store/auth.store';
import Loader from './components/common/Loader';
import BookingsPage from './pages/Events/BookingsPage';
import PaymentsPage from './pages/Events/PaymentsPage';
import PaymentSuccess from './pages/Events/Success';
import PaymentCancel from './pages/Events/Cancel';
import MediaManagement from './pages/Media/MediaManagement';
import AccountOverview from './pages/AccountOverview';
import Profile from './pages/Profile';
import AdminMangement from './pages/AdminManagement';
import Notifications from './pages/Notifications';
import Demographics from './pages/Demographics';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Remove the type casting that's causing the error
  const { isAuthenticated, token, logIn, logOut } = useAuthStore();

  const isAdmin = () => {
    return true;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isAuthenticated) {
      // If your logIn function requires a user object, you'll need to handle that
      // For now, I'm assuming you can pass null or handle it in the store
      logIn(storedToken, null); // or however your auth store expects it
    }
  }, [isAuthenticated, logIn]);

  return (
    <div className="">
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/auth/signin"
            element={
              !isAuthenticated ? (
                <SignIn />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />



          <Route
            path="/"
            element={
              isAuthenticated ? (
                <DefaultLayout>
                  <Outlet />
                </DefaultLayout>
              ) : (
                <Navigate to="/auth/signin" replace />
              )
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<AccountOverview />} />
            <Route path="/users/profile/:id" element={<Profile />} />
            <Route path="demographics" element={<Demographics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="admins" element={<AdminMangement />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/create" element={<CreateEventPage />} />
            <Route path="events/:eventId/attendees" element={<EventAttendeesPage />} />
            <Route path="events/book" element={<TicketBookingPage />} />
            <Route path="/events/bookings" element={<BookingsPage />} />
            <Route path="/events/payments" element={<PaymentsPage />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />
            <Route path="/media" element={<MediaManagement />} />
            <Route
              path="/admin-support"
              element={
                isAuthenticated && isAdmin() ? (
                  <AdminSupportSidebar />
                ) : (
                  <Navigate to="/auth/signin" replace />
                )
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

