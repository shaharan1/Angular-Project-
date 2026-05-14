import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  UserRound, 
  Stethoscope, 
  Microscope, 
  Pill, 
  Bed, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTheme } from '@/src/hooks/useTheme';

interface SidebarProps {
  isMobile?: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['*'] },
  { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['*'] },
  { id: 'patients', label: 'Patients', icon: Users, roles: ['DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { id: 'ehr', label: 'Medical Records', icon: ClipboardList, roles: ['DOCTOR', 'NURSE'] },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope, roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'] },
  { id: 'staff', label: 'Staff Management', icon: UserRound, roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'HR_MANAGER'] },
  { id: 'lab', label: 'Lab & Diagnostics', icon: Microscope, roles: ['LAB_TECHNICIAN', 'DOCTOR'] },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill, roles: ['PHARMACIST', 'DOCTOR'] },
  { id: 'wards', label: 'Ward & Beds', icon: Bed, roles: ['NURSE', 'RECEPTIONIST'] },
  { id: 'billing', label: 'Billing & Finance', icon: FileText, roles: ['ACCOUNTANT', 'RECEPTIONIST'] },
  { id: 'security', label: 'Security', icon: ShieldCheck, roles: ['SUPER_ADMIN'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['*'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  activeSection, 
  setActiveSection 
}) => {
  const { theme } = useTheme();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? '256px' : '80px' }}
      className={cn(
        "h-screen sticky top-0 bg-slate-900 border-r border-slate-800 transition-colors duration-300 flex flex-col z-50",
        !isOpen && "items-center"
      )}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3 overflow-hidden border-b border-slate-800">
        <div className="min-w-[32px] h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-white font-bold text-lg tracking-tight whitespace-nowrap"
            >
              MedCore <span className="text-blue-400">ERP</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
              activeSection === item.id
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
            title={!isOpen ? item.label : undefined}
          >
            <item.icon className="min-w-[20px] w-5 h-5" />
            
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* Footer / User Profile Toggle */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className={cn(
          "flex items-center gap-3",
          !isOpen && "justify-center"
        )}>
           <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold shadow-sm">
             DA
           </div>
           {isOpen && (
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-medium text-white truncate">Dr. Sarah Adams</p>
               <p className="text-xs text-slate-500 truncate">Senior Administrator</p>
             </div>
           )}
        </div>
      </div>
    </motion.aside>
  );
};
