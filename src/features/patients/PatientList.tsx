import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  ChevronRight,
  UserPlus,
  Activity
} from 'lucide-react';
import { cn, getStatusColor } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from '@/src/components/common/Modal';
import { AddPatientForm } from './AddPatientForm';

const mockPatients = [
  { id: '1', patientId: 'PAT-000452', name: 'James Wilson', gender: 'Male', age: 45, status: 'Inpatient', bloodGroup: 'O+', lastVisit: '2 hours ago', lastVitals: '120/80 mmHg' },
  { id: '2', patientId: 'PAT-000453', name: 'Elena Rodriguez', gender: 'Female', age: 32, status: 'Outpatient', bloodGroup: 'A-', lastVisit: 'Yesterday', lastVitals: '115/75 mmHg' },
  { id: '3', patientId: 'PAT-000454', name: 'Robert Chen', gender: 'Male', age: 28, status: 'Emergency', bloodGroup: 'B+', lastVisit: 'Just now', lastVitals: '140/95 mmHg' },
  { id: '4', patientId: 'PAT-000455', name: 'Sarah Thompson', gender: 'Female', age: 54, status: 'Discharged', bloodGroup: 'AB+', lastVisit: '3 days ago', lastVitals: '125/82 mmHg' },
  { id: '5', patientId: 'PAT-000456', name: 'Michael O-Connor', gender: 'Male', age: 62, status: 'Inpatient', bloodGroup: 'O-', lastVisit: '4 hours ago', lastVitals: '110/68 mmHg' },
];

export const PatientList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Registry</h1>
          <p className="text-slate-500 dark:text-slate-400">Total 1,250 registered patients in the system</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Add New Patient
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Admissions', count: '1,284', change: '+12%', color: 'text-green-600' },
          { label: 'Available Beds', count: '42', change: 'of 350', color: 'text-slate-400' },
          { label: 'Pending Appointments', count: '86', change: 'Action req.', color: 'text-amber-500' },
          { label: 'Today Revenue', count: '$24,500', change: '84% target', color: 'text-blue-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-slate-800">{stat.count}</span>
              <span className={cn("text-xs font-semibold mb-1", stat.color)}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Patient List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Active Patient Registry</h3>
           <div className="flex gap-2">
             <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Filter list..."
                 className="pl-9 pr-3 py-1.5 bg-slate-100 border-none rounded-lg text-xs focus:ring-2 focus:ring-blue-500 w-48"
               />
             </div>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase font-bold bg-slate-50">
                <th className="px-6 py-3">Patient Name</th>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Blood</th>
                <th className="px-6 py-3">Last Vitals</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {mockPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-blue-600 text-[10px]">
                        {patient.name.charAt(0)}{patient.name.split(' ')[1]?.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-800">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{patient.patientId}</td>
                  <td className="px-6 py-4 text-slate-600">{patient.status}</td>
                  <td className="px-6 py-4 font-bold text-slate-400">{patient.bloodGroup}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{patient.lastVitals}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-bold rounded-md uppercase",
                      getStatusColor(patient.status)
                    )}>
                      {patient.status === 'Inpatient' ? 'STABLE' : patient.status === 'Emergency' ? 'CRITICAL' : 'OBSERVATION'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-xs">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddPatientForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};
