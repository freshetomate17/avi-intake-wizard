
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";

interface LandingBookingProps {
  onComplete: () => void;
}

const LandingBooking = ({ onComplete }: LandingBookingProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  
  // Time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
  ];
  
  // Reasons for visit
  const reasons = [
    "Annual checkup", 
    "Illness", 
    "Follow-up", 
    "Vaccination", 
    "Prescription refill",
    "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero banner */}
      <h1 className="text-4xl font-serif font-bold text-black mb-6">
        avi – Digitalisierung des Patient-Intake
      </h1>
      
      <div className="bg-[#E6FFF4] p-6 rounded-lg w-full mb-8">
        <p className="text-lg">
          Streamline your doctor's visit with our digital check-in process. Book your appointment and complete your intake forms online.
        </p>
      </div>
      
      {/* Booking form */}
      <form className="w-full shadow-md p-6 rounded-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-serif mb-6">Book an appointment</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Select date</label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="border rounded-md p-3 pointer-events-auto"
          />
        </div>
        
        {date && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Select time</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`p-2 border rounded-md ${
                    timeSlot === slot 
                      ? "bg-primary text-white" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {timeSlot && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Reason for visit</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="" disabled>Select reason</option>
              {reasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        )}
        
        <Button 
          type="submit"
          className="w-full bg-primary text-white rounded-xl py-3"
          disabled={!date || !timeSlot || !reason}
        >
          Book appointment
        </Button>
      </form>
    </div>
  );
};

export default LandingBooking;
