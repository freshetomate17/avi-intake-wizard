
import React, { useState } from "react";
import { Calendar, Clock, User, FileText, Award } from "lucide-react";

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

  // Sample appointment data
  const upcomingAppointments = [
    {
      id: 1,
      patient: "Max Mustermann",
      date: "12. Mai 2025",
      time: "10:30",
      type: "Routineuntersuchung",
      status: "confirmed",
      bonusProgram: "avi Hausarzt Plus",
    },
    {
      id: 2,
      patient: "Anna Schmidt",
      date: "12. Mai 2025",
      time: "11:45",
      type: "Erstberatung",
      status: "confirmed",
      bonusProgram: "avi Impact",
    },
    {
      id: 3,
      patient: "Thomas Weber",
      date: "12. Mai 2025",
      time: "13:15",
      type: "Nachsorge",
      status: "pending",
      bonusProgram: null,
    },
  ];

  const historyAppointments = [
    {
      id: 101,
      patient: "Max Mustermann",
      date: "15. April 2025",
      time: "09:15",
      type: "Blutuntersuchung",
      status: "completed",
      bonusProgram: "avi Hausarzt Plus",
    },
    {
      id: 102,
      patient: "Erika Meyer",
      date: "28. April 2025",
      time: "14:30",
      type: "Impfung",
      status: "completed",
      bonusProgram: null,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Bestätigt
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Ausstehend
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Abgeschlossen
          </span>
        );
      default:
        return null;
    }
  };

  const getBonusProgramBadge = (program: string | null) => {
    if (!program) return null;
    
    return (
      <span className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full gap-1">
        <Award className="h-3 w-3" />
        {program}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold">Arzt Dashboard</h2>
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
            <p className="text-sm text-gray-500">Termine heute</p>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Nächster Termin</p>
            <p className="text-lg font-bold">10:30 Uhr</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Bonusprogramm-Teilnehmer</p>
            <p className="text-2xl font-bold">4</p>
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
            Anstehende Termine
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "history"
                ? "border-b-2 border-primary text-primary font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Terminhistorie
          </button>
        </div>
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-lg overflow-hidden flex-grow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum & Zeit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Typ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bonusprogramm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(activeTab === "upcoming" ? upcomingAppointments : historyAppointments).map(
              (appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {appointment.patient}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{appointment.date}</div>
                    <div className="text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {appointment.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getBonusProgramBadge(appointment.bonusProgram)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-primary hover:text-primary-dark">
                      Details
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
