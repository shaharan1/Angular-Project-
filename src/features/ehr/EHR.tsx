import React from 'react';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  FileText, 
  History,
  Activity,
  ChevronRight,
  Download
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const mockRecords = [
  { id: 1, type: 'Diagnosis', date: 'May 12, 2026', doctor: 'Dr. Sarah Wilson', info: 'Acute Hypertension with regular arrhythmias.', icon: Activity, color: 'text-rose-500 bg-rose-50' },
  { id: 2, type: 'Prescription', date: 'May 10, 2026', doctor: 'Dr. James Bond', info: 'Lisinopril 10mg daily for 30 days.', icon: FileText, color: 'text-blue-500 bg-blue-50' },
  { id: 3, type: 'Lab Report', date: 'May 08, 2026', doctor: 'Dr. Emily Chen', info: 'Complete Blood Count (CBC) - Results Pending.', icon: ClipboardList, color: 'text-amber-500 bg-amber-50' },
];

export const EHR: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Records (EHR)</h1>
          <p className="text-sm text-slate-500 font-medium">Search and manage electronic health records across departments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-slate-800">
            <Download className="w-4 h-4" />
            Bulk Export
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Patient Snapshot */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden mb-6 border border-slate-200 shadow-sm">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" alt="Patient" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">James Wilson</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-6">Patient ID: PAT-000452</p>
            
            <div className="grid grid-cols-2 gap-3 w-full">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Age</p>
                    <p className="text-xs font-bold text-slate-800">45y 4m</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Blood</p>
                    <p className="text-xs font-bold text-slate-800">O Positive</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Weight</p>
                    <p className="text-xs font-bold text-slate-800">82.5 kg</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Allergies</p>
                    <p className="text-xs font-bold text-rose-500">Penicillin</p>
                </div>
            </div>

            <button className="w-full mt-8 py-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                Full Clinical Folder
            </button>
        </div>

        {/* Timeline View */}
        <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-500" />
                    Clinical Timeline
                </h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Search timeline..." className="bg-white border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs font-medium focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>

            <div className="space-y-3">
                {mockRecords.map((record) => (
                    <motion.div 
                        key={record.id}
                        whileHover={{ x: 4 }}
                        className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 group hover:border-blue-200 transition-all"
                    >
                        <div className={cn("p-3 rounded-lg flex-shrink-0 transition-all", record.color)}>
                            <record.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">{record.type}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{record.date} • Issued by {record.doctor}</p>
                                </div>
                                <button className="p-1 text-slate-300 hover:text-blue-500 transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                {record.info}
                            </p>
                        </div>
                    </motion.div>
                ))}

                <button className="w-full py-4 text-[10px] font-bold text-slate-400 hover:text-blue-500 uppercase tracking-widest transition-colors">
                    Load Archive Records
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
