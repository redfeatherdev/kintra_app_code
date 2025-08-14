import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type FormFields = {
  name: string;
  event_date: string;
  location: string;
  max_tickets: string;
  vip_limit: string;
  created_by: string;
};

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<FormFields>({
    name: '',
    event_date: '',
    location: '',
    max_tickets: '',
    vip_limit: '',
    created_by: 'admin',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/events`, form);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldLabel = (key: keyof FormFields): string => {
    const labels = {
      name: 'Event Name',
      event_date: 'Event Date & Time',
      location: 'Location',
      max_tickets: 'Maximum Tickets',
      vip_limit: 'VIP Tickets Limit',
      created_by: 'Created By'
    };
    return labels[key];
  };

  const getFieldPlaceholder = (key: keyof FormFields): string => {
    const placeholders = {
      name: 'Enter event name',
      event_date: '',
      location: 'Enter venue location',
      max_tickets: 'Enter maximum number of tickets',
      vip_limit: 'Enter VIP tickets limit',
      created_by: 'Created by'
    };
    return placeholders[key];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-gray-600">Fill in the details to create your event</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {(Object.keys(form) as (keyof FormFields)[]).map((key) =>
              key !== 'created_by' ? (
                <div key={key} className="space-y-2">
                  <label 
                    htmlFor={key}
                    className="block text-sm font-semibold text-gray-700"
                  >
                    {getFieldLabel(key)}
                  </label>
                  <div className="relative">
                    <input
                      id={key}
                      name={key}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder={getFieldPlaceholder(key)}
                      type={key === 'event_date' ? 'datetime-local' : key.includes('tickets') || key.includes('limit') ? 'number' : 'text'}
                      value={form[key]}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      required
                      min={key.includes('tickets') || key.includes('limit') ? '1' : undefined}
                    />
                    {key === 'name' && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    )}
                    {key === 'location' && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                    {key === 'event_date' && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ) : null
            )}

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
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Event
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Check our <span className="text-blue-600 hover:text-blue-700 cursor-pointer">event creation guide</span></p>
        </div>
      </div>
    </div>
  );
}