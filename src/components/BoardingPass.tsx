
import { Button } from "@/components/ui/button";
import { QrCode, Calendar, Clock, MapPin } from "lucide-react";

interface BoardingPassProps {
  onComplete: () => void;
}

const BoardingPass = ({ onComplete }: BoardingPassProps) => {
  // Placeholder data for the boarding pass
  const appointment = {
    patient: "Jane Doe",
    doctor: "Dr. Maria Schmidt",
    date: "May 15, 2025",
    time: "10:30 AM",
    location: "avi Medical Center",
    address: "Leopoldstraße 23, 80802 München",
    appointmentId: "AVP-2305150023"
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-serif mb-4">Your Digital Boarding Pass</h2>
      
      <p className="mb-6 text-gray-600">
        Your check-in is complete! Here is your digital boarding pass.
        Please scan the QR code upon arrival.
      </p>
      
      {/* Boarding Pass Card */}
      <div className="w-full max-w-md bg-white border rounded-xl overflow-hidden shadow-lg mb-8">
        {/* Header */}
        <div className="bg-primary text-white p-4">
          <div className="text-sm">Digital Boarding Pass</div>
          <div className="text-xl font-semibold">{appointment.patient}</div>
        </div>
        
        {/* QR Code Section */}
        <div className="flex justify-center p-6 bg-[#E6FFF4]">
          {/* Placeholder QR code - in a real app this would be generated */}
          <div className="w-40 h-40 bg-white p-2 rounded-lg flex items-center justify-center">
            <QrCode size={120} className="text-primary" />
          </div>
        </div>
        
        {/* Appointment Details */}
        <div className="p-4">
          <div className="mb-4">
            <div className="text-sm text-gray-500 uppercase">Appointment with</div>
            <div className="text-lg font-medium">{appointment.doctor}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start">
              <Calendar className="w-4 h-4 text-primary mt-1 mr-2" />
              <div>
                <div className="text-xs text-gray-500">Date</div>
                <div>{appointment.date}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="w-4 h-4 text-primary mt-1 mr-2" />
              <div>
                <div className="text-xs text-gray-500">Time</div>
                <div>{appointment.time}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-start">
            <MapPin className="w-4 h-4 text-primary mt-1 mr-2" />
            <div>
              <div className="text-xs text-gray-500">Location</div>
              <div>{appointment.location}</div>
              <div className="text-sm text-gray-600">{appointment.address}</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t text-center text-xs text-gray-500">
            Appointment ID: {appointment.appointmentId}
          </div>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 mb-2">
          We've also sent this boarding pass to your email.
        </p>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Calendar size={16} />
          Add to calendar
        </Button>
      </div>
      
      <Button 
        onClick={onComplete}
        className="bg-primary text-white rounded-xl w-full max-w-sm"
      >
        Scan at arrival
      </Button>
    </div>
  );
};

export default BoardingPass;
