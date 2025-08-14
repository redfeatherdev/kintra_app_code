import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import SupportChat from '../SupportChat/SupportChat'; 

type Event = {
  event_id: string;
  name: string;
  event_date: string;
  location: string;
  max_tickets: number;
  vip_limit: number;
  booked_normal?: number;
  booked_vip?: number;
  available_normal?: number;
  available_vip?: number;
  rsvps?: Record<string, boolean>;
};


export default function EventsPage() {
  // const [showChat, setShowChat] = useState(false);      
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [upcomingRes, pastRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/events/upcoming`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/events/past`)
        ]);
        setUpcoming(upcomingRes.data);
        setPast(pastRes.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

const getAttendancePercentage = (event: Event) => {
  const booked = (event.booked_normal ?? 0) + (event.booked_vip ?? 0);
  const total = Number(event.max_tickets ?? 0) + Number(event.vip_limit ?? 0);
  if (total === 0) return 0;
  return Math.round((booked / total) * 100);
};

const handleDelete = async (event_id: string) => {
  const confirmed = window.confirm(`Are you sure you want to delete event "${event_id}"?`);
  if (!confirmed) return;

  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/events/${event_id}`);
    alert("Event deleted successfully!");

    // Update local state to remove deleted event
    setUpcoming(prev => prev.filter(ev => ev.event_id !== event_id));
    setPast(prev => prev.filter(ev => ev.event_id !== event_id));
  } catch (err) {
    console.error("Error deleting event:", err);
    alert("Failed to delete event. Please try again.");
  }
};



  const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => {
    const rsvpCount = Object.keys(event.rsvps || {}).length;
    const attendancePercentage = getAttendancePercentage(event);

    return (
      <div className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
        isPast ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-gray-400' : 'bg-white border-l-4 border-blue-500'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${isPast ? 'text-gray-700' : 'text-gray-900'}`}>
                {event.name}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{formatDate(event.event_date)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{event.location}</span>
              </div>
            </div>
            {!isPast && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                attendancePercentage >= 80 ? 'bg-red-100 text-red-800' :
                attendancePercentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {attendancePercentage}% Full
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isPast ? 'text-gray-600' : 'text-blue-600'}`}>
                {event.available_normal ?? 0}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Normal Available</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isPast ? 'text-gray-600' : 'text-purple-600'}`}>
                {event.available_vip ?? 0}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">VIP Available</div>
            </div>
          </div>


          {!isPast && (
            <div className="mt-4 mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Attendance</span>
                <span>{rsvpCount}/{event.max_tickets}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    attendancePercentage >= 80 ? 'bg-red-500' :
                    attendancePercentage >= 50 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate(`/events/${event.event_id}/attendees`)}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Booked Users
            </button>
            {!isPast && (
            <button
              onClick={() => handleDelete(event.event_id)}
              className="w-full mt-2 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Delete Event
            </button>
          )}

            
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Dashboard</h1>
              <p className="text-gray-600">Manage and track your events</p>
            </div>
            <div className="flex flex-wrap gap-3">
         
              <Link
                to="/events/payments"
                className="hidden sm:inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl border border-emerald-400"
              >
                View Payments
              </Link>

             
              <Link
                to="/events/book"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Book Ticket
              </Link>

           
              <Link
                to="/events/create"
                className="hidden sm:inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-400"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Event
              </Link>
        </div>
            

            {/* <div className="flex flex-col sm:flex-row gap-3">
              <Link 
    to="/events/bookings"
    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl"
  >
    📒 View Bookings
              </Link>

              <Link 
                to="/events/payments"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-medium rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                💰 View Payments
              </Link>

              <Link 
                to="/events/book" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Book Ticket
              </Link>

              <Link 
                to="/events/create" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Event
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
                <p className="text-gray-600">Upcoming Events</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {upcoming.reduce((total, event) => total + Object.keys(event.rsvps || {}).length, 0)}
                </p>
                <p className="text-gray-600">Total RSVPs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 003.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{past.length}</p>
                <p className="text-gray-600">Past Events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming Events ({upcoming.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'past'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past Events ({past.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upcoming' ? (
              upcoming.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first event.</p>
                  <Link 
                    to="/events/create"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Event
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {upcoming.map(event => (
                    <EventCard key={event.event_id} event={event} />
                  ))}
                </div>
              )
            ) : (
              past.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 003.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
                  <p className="text-gray-500">Your completed events will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {past.map(event => (
                    <EventCard key={event.event_id} event={event} isPast={true} />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>


      
  {/* Floating Support Chat Button */}
{/* <div className="fixed bottom-6 right-6 z-50">
  {showChat ? (
    <div className="w-96 h-[28rem] bg-white shadow-xl rounded-lg border overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-blue-600 text-white">
        <h3 className="font-bold">Support Chat</h3>
        <button onClick={() => setShowChat(false)} className="text-white font-bold text-xl">
          &times;
        </button>
      </div>
      <div className="h-full overflow-hidden p-2">
        <SupportChat ticketId="demo-ticket" currentUser="AdminUser" />
      </div>
    </div>
  ) : (
    <button
      onClick={() => setShowChat(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
    >
      💬
    </button>
  )}
</div> */}

    </div>
  );



}