import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Video, 
  Users, 
  MoreVertical,
  Plus
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { motion } from 'motion/react';

const mockAppointments = [
  { id: 1, patient: 'John Doe', time: '09:00 AM', type: 'Consultation', doctor: 'Dr. Wilson', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 2, patient: 'Alice Smith', time: '10:30 AM', type: 'Telemedicine', doctor: 'Dr. Bond', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 3, patient: 'Robert Brown', time: '01:00 PM', type: 'Follow-up', doctor: 'Dr. Wilson', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

export const AppointmentCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointment Schedule</h1>
          <p className="text-sm text-slate-500 font-medium">Manage doctor availability and patient bookings.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all">
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Date Selector & Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-sm">{format(selectedDate, 'MMMM yyyy')}</h3>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft size={16} /></button>
                <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight size={16} /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <span key={day} className="text-[10px] font-bold text-slate-400 uppercase">{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }, (_, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedDate(new Date(2026, 4, i + 1))}
                  className={cn(
                    "h-8 w-full flex items-center justify-center rounded-lg text-[11px] font-bold transition-all",
                    i + 1 === selectedDate.getDate() 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl text-white shadow-sm border border-slate-800">
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
              <Video className="w-4 h-4 text-blue-400" /> Tele-Consultation
            </h4>
            <p className="text-[11px] text-slate-400 mb-4">4 patients are currently in the virtual waiting room.</p>
            <button className="w-full bg-slate-800 text-white border border-slate-700 py-2 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-700">Open Virtual Lobby</button>
          </div>
        </div>

        {/* Schedule View */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            {weekDays.map((date) => (
              <button
                key={date.toString()}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex-1 flex flex-col items-center py-2.5 rounded-lg transition-all",
                  isSameDay(date, selectedDate)
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider mb-0.5 opacity-80">
                  {format(date, 'EEE')}
                </span>
                <span className="text-base font-bold">{format(date, 'd')}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Timeline for {format(selectedDate, 'do MMMM')}
                </h3>
            </div>
            
            <div className="space-y-2">
              {mockAppointments.map((appt) => (
                <motion.div
                  key={appt.id}
                  whileHover={{ x: 4 }}
                  className={cn(
                    "p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all shadow-sm hover:border-blue-200"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {appt.time.split(':')[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{appt.patient}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{appt.doctor} • {appt.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all uppercase tracking-wider">
                      View EHR
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              <button className="w-full py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-[11px] font-bold uppercase tracking-widest hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2 group">
                <Plus className="w-4 h-4" />
                Schedule next appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
