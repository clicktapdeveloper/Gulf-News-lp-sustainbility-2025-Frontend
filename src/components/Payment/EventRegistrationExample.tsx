import React, { useState } from 'react';
import EventTicketPayment from '@/components/Payment/EventTicketPayment';

// Example component showing how to use EventTicketPayment
const EventRegistrationExample: React.FC = () => {
  const [attendees, setAttendees] = useState([
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      industry: '',
      interests: [],
      dietaryRequirements: ''
    }
  ]);

  const ticketPrice = 150; // AED 150 per ticket

  const handleAddAttendee = () => {
    setAttendees([...attendees, {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      industry: '',
      interests: [],
      dietaryRequirements: ''
    }]);
  };

  const handleRemoveAttendee = (index: number) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter((_, i) => i !== index));
    }
  };

  const handleAttendeeChange = (index: number, field: string, value: string) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index] = { ...updatedAttendees[index], [field]: value };
    setAttendees(updatedAttendees);
  };

  const handlePaymentSuccess = () => {
    console.log('Payment successful!');
    // Handle success (e.g., show success message, redirect, etc.)
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // Handle error (e.g., show error message)
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Event Registration</h1>
      
      <div className="space-y-6">
        {attendees.map((attendee, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Attendee {index + 1}</h3>
              {attendees.length > 1 && (
                <button
                  onClick={() => handleRemoveAttendee(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  value={attendee.firstName}
                  onChange={(e) => handleAttendeeChange(index, 'firstName', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  value={attendee.lastName}
                  onChange={(e) => handleAttendeeChange(index, 'lastName', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={attendee.email}
                  onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  value={attendee.phone}
                  onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={attendee.company}
                  onChange={(e) => handleAttendeeChange(index, 'company', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="text"
                  value={attendee.position}
                  onChange={(e) => handleAttendeeChange(index, 'position', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={handleAddAttendee}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800"
        >
          + Add Another Attendee
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total: AED {ticketPrice * attendees.length}</span>
          <span className="text-sm text-gray-600">{attendees.length} ticket(s)</span>
        </div>
        
        <EventTicketPayment
          attendees={attendees}
          ticketPrice={ticketPrice}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    </div>
  );
};

export default EventRegistrationExample;
