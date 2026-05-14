import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Dashboard } from '@/src/features/dashboard/Dashboard';
import { PatientList } from '@/src/features/patients/PatientList';
import { AppointmentCalendar } from '@/src/features/appointments/AppointmentCalendar';
import { EHR } from '@/src/features/ehr/EHR';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientList />;
      case 'appointments':
        return <AppointmentCalendar />;
      case 'ehr':
        return <EHR />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-slate-300">🚧</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Module Under Construction</h2>
            <p className="text-slate-500 max-w-xs">We're currently scaling our heart-rate monitors! This module will be live shortly.</p>
            <button onClick={() => setActiveSection('dashboard')} className="text-blue-600 font-bold hover:underline">Back to Dashboard</button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="py-4 px-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} MediConnect Pro HMS. Enterprise Health Infrastructure.
        </footer>
      </div>
    </div>
  );
};
