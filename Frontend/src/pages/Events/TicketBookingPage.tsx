import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';



type Event = {
  event_id: string;
  name: string;
  event_date: string;
  location: string;
  max_tickets: number;
  vip_limit: number;
};

type BookingForm = {
  name: string;
  age: string;
  gender: string;
  seat_type: 'normal' | 'vip';
};

type EventStats = {
  total: number;
  vip_limit: number;
  remaining_normal: number;
  remaining_vip: number;
  normal_booked: number;
  vip_booked: number;
};

export default function TicketBookingPage() {
  const { eventId } = useParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState(eventId || '');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<BookingForm>({ 
    name: '', 
    age: '', 
    gender: '', 
    seat_type: 'normal' 
  });
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/events/upcoming`);
        setEvents(response.data);
        
        // If eventId is provided in URL, set it as selected
        if (eventId) {
          const event = response.data.find((e: Event) => e.event_id === eventId);
          if (event) {
            setSelectedEvent(event);
            setSelectedEventId(eventId);
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, [eventId]);

  useEffect(() => {
    if (selectedEventId) {
      const fetchStats = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/events/${selectedEventId}/stats`);
          setStats(response.data);
        } catch (error) {
          console.error('Error fetching event stats:', error);
          setStats(null);
        }
      };

      fetchStats();
      
      // Find and set the selected event
      const event = events.find(e => e.event_id === selectedEventId);
      setSelectedEvent(event || null);
    }
  }, [selectedEventId, events]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEventId(e.target.value);
  };

  const createCheckoutSession = async (amount: number, bookingId: string) => {
    try {
      const sessionResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/create-checkout-session`, {
        amount,
        booking_id: bookingId,  
        name: form.name,
        seat_type: form.seat_type,
        event_id: selectedEvent?.name,
        
      });

      const checkoutUrl = sessionResponse.data.checkoutUrl;
      window.location.href = checkoutUrl;  // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to initiate payment session. Please try again.");
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedEventId) {
    alert("Please select an event");
    return;
  }

  if (!form.name.trim() || !form.age || !form.gender) {
    alert("Please fill in all required fields");
    return;
  }

  if (parseInt(form.age) < 1 || parseInt(form.age) > 120) {
    alert("Please enter a valid age");
    return;
  }

  if (stats) {
    if (form.seat_type === "vip" && stats.remaining_vip <= 0) {
      alert("No VIP tickets available");
      return;
    }
    if (form.seat_type === "normal" && stats.remaining_normal <= 0) {
      alert("No normal tickets available");
      return;
    }
  }

  setLoading(true);
  try {
    const usdAmount = form.seat_type === "vip" ? 600 : 300;

    // Create booking first
    const bookingResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/bookings/initiate`, {
      name: form.name,
      age: form.age,
      gender: form.gender,
      seat_type: form.seat_type,  
      event_id: selectedEvent?.name,
      amount: usdAmount,
    });

    const booking_id = bookingResponse.data.booking_id;

    // Call createCheckoutSession function once
    await createCheckoutSession(usdAmount, booking_id);

  } catch (error: any) {
    const errorMessage = error?.response?.data?.detail || "Payment failed. Please try again.";
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvailabilityColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage <= 20) return 'text-red-600';
    if (percentage <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Ticket</h1>
          <p className="text-gray-600">Select an event and fill in your details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Selection & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Event</h2>
              <select 
                value={selectedEventId} 
                onChange={handleEventChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">-- Choose an event --</option>
                {events.map(event => (
                  <option key={event.event_id} value={event.event_id}>
                    {event.name} - {new Date(event.event_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Event Details */}
            {selectedEvent && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Event Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Event Name</p>
                    <p className="font-semibold text-gray-900">{selectedEvent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedEvent.event_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900">{selectedEvent.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ticket Availability */}
         
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      required
                      min="1"
                      max="120"
                      placeholder="Enter your age"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Seat Type */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Ticket Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`relative flex cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                        form.seat_type === 'normal' 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <input
                          type="radio"
                          name="seat_type"
                          value="normal"
                          checked={form.seat_type === 'normal'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">Normal Ticket</span>
                          <span className="text-sm text-gray-500">Standard seating</span>
                          <span className="text-lg font-bold text-blue-600 mt-2">$3</span>
                        </div>
                        {form.seat_type === 'normal' && (
                          <div className="absolute top-2 right-2">
                            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>

                      <label className={`relative flex cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                        form.seat_type === 'vip' 
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <input
                          type="radio"
                          name="seat_type"
                          value="vip"
                          checked={form.seat_type === 'vip'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 flex items-center">
                            VIP Ticket
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Premium</span>
                          </span>
                          <span className="text-sm text-gray-500">Priority seating & perks</span>
                          <span className="text-lg font-bold text-purple-600 mt-2">$6</span>
                        </div>
                        {form.seat_type === 'vip' && (
                          <div className="absolute top-2 right-2">
                            <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/events')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !selectedEventId}
                    className="flex-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Booking...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Make Payment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need assistance? Contact our support team for help with your booking.</p>
        </div>
      </div>
    </div>
  );
}