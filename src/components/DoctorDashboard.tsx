
import React, { useState } from "react";
import { Calendar, Clock, User, FileText, Award } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

  // Sample appointment data
  const upcomingAppointments = [
    {
      id: 1,
      patient: "Max Mustermann",
      date: "May 12, 2025",
      time: "10:30",
      type: "Routine check-up",
      status: "confirmed",
      bonusProgram: "avi Primary Care Plus",
    },
    {
      id: 2,
      patient: "Anna Schmidt",
      date: "May 12, 2025",
      time: "11:45",
      type: "Initial consultation",
      status: "confirmed",
      bonusProgram: "avi Impact",
    },
    {
      id: 3,
      patient: "Thomas Weber",
      date: "May 12, 2025",
      time: "13:15",
      type: "Follow-up",
      status: "pending",
      bonusProgram: null,
    },
  ];

  const historyAppointments = [
    {
      id: 101,
      patient: "Max Mustermann",
      date: "April 15, 2025",
      time: "09:15",
      type: "Blood test",
      status: "completed",
      bonusProgram: "avi Primary Care Plus",
    },
    {
      id: 102,
      patient: "Erika Meyer",
      date: "April 28, 2025",
      time: "14:30",
      type: "Vaccination",
      status: "completed",
      bonusProgram: null,
    },
  ];

  // Get the active bonus program name, or "None used" if none is active
  const getActiveBonusProgram = () => {
    const allAppointments = [...upcomingAppointments, ...historyAppointments];
    const activeBonusPrograms = allAppointments
      .filter(appointment => appointment.bonusProgram !== null)
      .map(appointment => appointment.bonusProgram);
    
    if (activeBonusPrograms.length > 0) {
      // Return the first active program if there are multiple (for simplicity)
      return activeBonusPrograms[0];
    } else {
      return "None used";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getBonusProgramBadge = (program: string | null) => {
    if (!program) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">
          No Program
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100 flex items-center gap-1">
        <Award className="h-3 w-3" />
        {program}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold">Doctor Dashboard</h2>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-700" />
          <span className="font-medium">Dr. Julia Schmidt</span>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Appointments today</p>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Next appointment</p>
            <p className="text-lg font-bold">10:30 AM</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Bonus program</p>
            <p className="text-lg font-bold">{getActiveBonusProgram()}</p>
          </div>
        </div>
      </div>

      {/* Appointments Tab Navigation */}
      <div className="border-b mb-4">
        <div className="flex space-x-8">
          <button
            className={`pb-2 px-1 ${
              activeTab === "upcoming"
                ? "border-b-2 border-primary text-primary font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Appointments
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "history"
                ? "border-b-2 border-primary text-primary font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Appointment History
          </button>
        </div>
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-lg overflow-hidden flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bonus Program</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(activeTab === "upcoming" ? upcomingAppointments : historyAppointments).map(
              (appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {appointment.patient}
                  </TableCell>
                  <TableCell>
                    <div>{appointment.date}</div>
                    <div className="text-gray-500">{appointment.time}</div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {appointment.type}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(appointment.status)}
                  </TableCell>
                  <TableCell>
                    {getBonusProgramBadge(appointment.bonusProgram)}
                  </TableCell>
                  <TableCell>
                    <button className="text-primary hover:text-primary-dark">
                      Details
                    </button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
