import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  BedDouble, 
  TrendingUp,
  Activity,
  UserPlus,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn, getStatusColor } from '@/src/lib/utils';
import { motion } from 'motion/react';

const revenueData = [
  { name: 'Mon', revenue: 4000, visits: 240 },
  { name: 'Tue', revenue: 3000, visits: 198 },
  { name: 'Wed', revenue: 5000, visits: 280 },
  { name: 'Thu', revenue: 2780, visits: 190 },
  { name: 'Fri', revenue: 6890, visits: 320 },
  { name: 'Sat', revenue: 2390, visits: 150 },
  { name: 'Sun', revenue: 3490, visits: 210 },
];

const recentAppointments = [
  { id: 1, patient: 'John Doe', doctor: 'Dr. Sarah Wilson', time: '09:00 AM', status: 'Confirmed', type: 'Consultation' },
  { id: 2, patient: 'Alice Smith', doctor: 'Dr. James Bond', time: '10:30 AM', status: 'Scheduled', type: 'Follow-up' },
  { id: 3, patient: 'Robert Brown', doctor: 'Dr. Sarah Wilson', time: '11:15 AM', status: 'In-progress', type: 'Emergency' },
  { id: 4, patient: 'Maria Garcia', doctor: 'Dr. Emily Chen', time: '01:45 PM', status: 'Confirmed', type: 'Consultation' },
  { id: 5, patient: 'David Miller', doctor: 'Dr. Michael Scott', time: '02:30 PM', status: 'Scheduled', type: 'Checkup' },
];

const KPICard = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all"
  >
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-slate-800">{value}</span>
      <span className={cn(
        "text-xs font-semibold mb-1",
        change > 0 ? "text-green-600" : "text-rose-600"
      )}>
        {change > 0 ? "+" : ""}{change}%
      </span>
    </div>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Admissions" value="1,284" change={+12} />
        <KPICard title="Available Beds" value="42" change={-5} /> {/* value of 350 in text maybe? */}
        <KPICard title="Pending Appointments" value="86" change={+18} />
        <KPICard title="Today Revenue" value="$24,500" change={+8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Bed Occupancy Simulation */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase">Real-Time Bed Occupancy</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div><span className="text-[10px] text-slate-500 uppercase font-bold">Occupied</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-slate-200 rounded-full"></div><span className="text-[10px] text-slate-500 uppercase font-bold">Vacant</span></div>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2 h-40">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "rounded-sm transition-all duration-500",
                  i < 32 ? "bg-blue-600 opacity-90 hover:opacity-100" : "bg-slate-200"
                )} 
              />
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-slate-100 pt-4">
            {[
              { label: 'General Ward', val: '88%' },
              { label: 'ICU / CCU', val: '94%' },
              { label: 'VIP Wing', val: '12%' },
              { label: 'Paediatrics', val: '65%' }
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold text-slate-800">{stat.val}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Alerts */}
        <div className="bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Security & Alerts</h3>
          <div className="space-y-4 flex-1">
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500"></div>
              <div>
                <p className="text-xs font-semibold">Code Blue - ICU Bed 04</p>
                <p className="text-[10px] text-slate-400">Response team dispatched 2m ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500"></div>
              <div>
                <p className="text-xs font-semibold">Lab Result: Critical Alert</p>
                <p className="text-[10px] text-slate-400">Patient ID: #H82910 - Glucose levels</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-xs font-semibold">New Staff Check-in</p>
                <p className="text-[10px] text-slate-400">Shift B - 14 Nurses available</p>
              </div>
            </div>
          </div>
          <button className="mt-4 w-full py-2 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors">View Incident Log</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Admissions Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between">
             <h3 className="text-sm font-bold text-slate-800 uppercase">Recent Admissions</h3>
             <button className="text-xs text-blue-600 font-semibold hover:underline">View Registry</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase font-bold bg-slate-50">
                  <th className="px-4 py-3">Patient Name</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Dept.</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {[
                  { name: 'Elena Rodriguez', id: '#821-A', dept: 'Cardiology', doctor: 'Dr. Jameson', status: 'STABLE', color: 'bg-green-100 text-green-700' },
                  { name: 'Marcus Thorne', id: '#442-B', dept: 'Orthopedic', doctor: 'Dr. Wilson', status: 'OBSERVATION', color: 'bg-blue-100 text-blue-700' },
                  { name: 'Amara Singh', id: '#109-C', dept: 'Pediatrics', doctor: 'Dr. Kim', status: 'PENDING LAB', color: 'bg-amber-100 text-amber-700' },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.name}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono">{row.id}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{row.dept}</td>
                    <td className="px-4 py-3 text-slate-600">{row.doctor}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-md uppercase", row.color)}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Load */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase mb-4">Department Load</h3>
          <div className="space-y-4">
            {[
              { name: 'Emergency', cap: 92, color: 'bg-red-500' },
              { name: 'Surgery', cap: 45, color: 'bg-blue-500' },
              { name: 'Outpatient', cap: 68, color: 'bg-blue-400' },
            ].map(dept => (
              <div key={dept.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">{dept.name}</span>
                  <span className="text-slate-400">{dept.cap}% capacity</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.cap}%` }}
                    className={cn("h-full transition-all duration-1000", dept.color)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors">
              <TrendingUp className="w-4 h-4" />
              Full Staff Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
