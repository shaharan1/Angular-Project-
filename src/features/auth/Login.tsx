import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, Activity } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate JWT Auth
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 z-10"
      >
        <div className="p-8 pt-10 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">
            MedCore <span className="text-blue-600">ERP</span>
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Enterprise Analytics Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identity</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  defaultValue="admin@medcore.com"
                  className="form-input w-full pl-10" 
                  placeholder="System Email"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Credential</label>
                <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider">Reset</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  defaultValue="********"
                  className="form-input w-full pl-10" 
                  placeholder="Secret Key"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-3 text-sm mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Access Terminal
              </>
            )}
          </button>
        </form>

        <div className="bg-slate-50 p-5 text-center border-t border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">
            Restricted System • Med-Level 4 Clearance Required
          </p>
        </div>
      </motion.div>
    </div>
  );
};
