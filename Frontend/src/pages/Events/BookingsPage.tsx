import { useEffect, useState } from 'react';

type Booking = {
  id: string; 
  eventId: string;
  name: string;
  age: number;
  gender: string;
  seatType: string;
  amount: number;
  status: string;
};

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    id: '1',
    eventId: 'EVT001',
    name: 'John Doe',
    age: 28,
    gender: 'male',
    seatType: 'VIP',
    amount: 150,
    status: 'confirmed'
  },
  {
    id: '2',
    eventId: 'EVT002',
    name: 'Jane Smith',
    age: 32,
    gender: 'female',
    seatType: 'Premium',
    amount: 100,
    status: 'pending'
  },
  {
    id: '3',
    eventId: 'EVT001',
    name: 'Mike Johnson',
    age: 25,
    gender: 'male',
    seatType: 'Standard',
    amount: 75,
    status: 'successful'
  },
  {
    id: '4',
    eventId: 'EVT003',
    name: 'Sarah Wilson',
    age: 29,
    gender: 'female',
    seatType: 'VIP',
    amount: 150,
    status: 'cancelled'
  },
  {
    id: '5',
    eventId: 'EVT002',
    name: 'Chris Brown',
    age: 35,
    gender: 'male',
    seatType: 'Premium',
    amount: 100,
    status: 'confirmed'
  }
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [eventIdFilter, setEventIdFilter] = useState<string>('');
  const [uniqueEventIds, setUniqueEventIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
        
        // Get unique event IDs for filter dropdown
        const eventIds = [...new Set(mockBookings.map(booking => booking.eventId))];
        setUniqueEventIds(eventIds);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filter bookings based on event ID
  useEffect(() => {
    if (eventIdFilter === '') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => 
        booking.eventId.toLowerCase().includes(eventIdFilter.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  }, [eventIdFilter, bookings]);

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(bookingId));
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/bookings/${bookingId}`);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert('Failed to delete booking. Please try again.');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const clearFilter = () => {
    setEventIdFilter('');
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status.toLowerCase()) {
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'successful':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getSeatTypeColor = (seatType: string) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-lg";
    switch (seatType.toLowerCase()) {
      case 'vip':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'premium':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'standard':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-lg font-medium text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => window.location.href = '/events'}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Events
                  </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Bookings Dashboard</h1>
                <p className="text-gray-600">Manage and track all event bookings</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold text-indigo-600">{filteredBookings.length}</p>
                  {eventIdFilter && (
                    <p className="text-xs text-gray-400">of {bookings.length} total</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  <label className="text-sm font-medium text-gray-700">Filter by Event ID:</label>
                </div>
                
                <div className="flex items-center space-x-2 flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Enter event ID or search..."
                    value={eventIdFilter}
                    onChange={(e) => setEventIdFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  
                  <select
                    value={eventIdFilter}
                    onChange={(e) => setEventIdFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="">All Events</option>
                    {uniqueEventIds.map(eventId => (
                      <option key={eventId} value={eventId}>
                        {eventId}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {eventIdFilter && (
                <button
                  onClick={clearFilter}
                  className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filter
                </button>
              )}
            </div>
            
            {eventIdFilter && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Filtered by:</span> "{eventIdFilter}" 
                  <span className="ml-2 text-blue-600">({filteredBookings.length} result{filteredBookings.length !== 1 ? 's' : ''})</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Seat Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {booking.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                          <div className="text-sm text-gray-500">Event ID: {booking.eventId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{booking.age}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium capitalize">{booking.gender}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getSeatTypeColor(booking.seatType)}>
                        {booking.seatType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">${booking.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(booking.id)}
                        disabled={deletingIds.has(booking.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          deletingIds.has(booking.id)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                        }`}
                      >
                        {deletingIds.has(booking.id) ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {eventIdFilter ? 'No bookings found for this filter' : 'No bookings found'}
              </h3>
              <p className="text-gray-500">
                {eventIdFilter 
                  ? 'Try adjusting your filter criteria or clear the filter to see all bookings.'
                  : 'There are no bookings to display at the moment.'
                }
              </p>
              {eventIdFilter && (
                <button
                  onClick={clearFilter}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                >
                  Clear Filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






// import { useEffect, useState } from 'react';
// import axios from 'axios';

// type Booking = {
//   id: string; 
//   eventId: string;
//   name: string;
//   age: number;
//   gender: string;
//   seatType: string;
//   amount: number;
//   status: string;
// };

// export default function BookingsPage() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/bookings`);
//         const snapshot = res.data;

//         const parsedBookings: Booking[] = Object.entries(snapshot).map(
//           ([id, data]: [string, any]) => ({
//             id,
//             ...data
//           })
//         );

//         setBookings(parsedBookings);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookings();
//   }, []);

//   const handleDelete = async (bookingId: string) => {
//     if (!confirm('Are you sure you want to delete this booking?')) {
//       return;
//     }

//     setDeletingIds(prev => new Set(prev).add(bookingId));
    
//     try {
//       await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/bookings/${bookingId}`);
//       setBookings(prev => prev.filter(b => b.id !== bookingId));
//     } catch (error) {
//       console.error("Error deleting booking:", error);
//       alert('Failed to delete booking. Please try again.');
//     } finally {
//       setDeletingIds(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(bookingId);
//         return newSet;
//       });
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
//     switch (status.toLowerCase()) {
//       case 'confirmed':
//         return `${baseClasses} bg-green-100 text-green-800`;
//       case 'pending':
//         return `${baseClasses} bg-yellow-100 text-yellow-800`;
//       case 'cancelled':
//         return `${baseClasses} bg-red-100 text-red-800`;
//       case 'successful':
//         return `${baseClasses} bg-green-100 text-green-800`;
//       default:
//         return `${baseClasses} bg-gray-100 text-gray-800`;
//     }
//   };

//   const getSeatTypeColor = (seatType: string) => {
//     const baseClasses = "px-3 py-1 text-xs font-medium rounded-lg";
//     switch (seatType.toLowerCase()) {
//       case 'vip':
//         return `${baseClasses} bg-purple-100 text-purple-800`;
//       case 'premium':
//         return `${baseClasses} bg-blue-100 text-blue-800`;
//       case 'standard':
//         return `${baseClasses} bg-gray-100 text-gray-800`;
//       default:
//         return `${baseClasses} bg-gray-100 text-gray-800`;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
//         <div className="flex items-center justify-center h-64">
//           <div className="flex flex-col items-center space-y-4">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//             <p className="text-lg font-medium text-gray-600">Loading bookings...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="flex items-center space-x-4 mb-4">
//                   <button
//                     onClick={() => window.location.href = '/events'}
//                     className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
//                   >
//                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                     </svg>
//                     Back to Events
//                   </button>
//                 </div>
//                 <h1 className="text-3xl font-bold text-gray-800 mb-2">Bookings Dashboard</h1>
//                 <p className="text-gray-600">Manage and track all event bookings</p>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="text-right">
//                   <p className="text-sm text-gray-500">Total Bookings</p>
//                   <p className="text-2xl font-bold text-indigo-600">{bookings.length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Customer
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Age
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Gender
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Seat Type
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {bookings.map((booking) => (
//                   <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-200">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
//                             <span className="text-white font-medium text-sm">
//                               {booking.name.charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{booking.name}</div>
//                           <div className="text-sm text-gray-500">Event ID: {booking.eventId}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900 font-medium">{booking.age}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900 font-medium capitalize">{booking.gender}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={getSeatTypeColor(booking.seatType)}>
//                         {booking.seatType}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-bold text-green-600">${booking.amount}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={getStatusBadge(booking.status)}>
//                         {booking.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right">
//                       <button
//                         onClick={() => handleDelete(booking.id)}
//                         disabled={deletingIds.has(booking.id)}
//                         className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
//                           deletingIds.has(booking.id)
//                             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                             : 'text-red-600 hover:text-red-800 hover:bg-red-50'
//                         }`}
//                       >
//                         {deletingIds.has(booking.id) ? (
//                           <>
//                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Deleting...
//                           </>
//                         ) : (
//                           <>
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Delete
//                           </>
//                         )}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Empty State */}
//           {bookings.length === 0 && (
//             <div className="text-center py-12">
//               <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                 <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
//               <p className="text-gray-500">There are no bookings to display at the moment.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }