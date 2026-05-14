import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Droplet, 
  Calendar,
  Shield,
  Heart,
  Save,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const patientSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  gender: z.enum(['Male', 'Female', 'Other']),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  phone: z.string().min(10, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is too short"),
  emergencyContactName: z.string().min(2, "Name is required"),
  emergencyContactPhone: z.string().min(10, "Phone is required"),
  status: z.enum(['Inpatient', 'Outpatient', 'Emergency']),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface AddPatientFormProps {
  onClose: () => void;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: 'Male',
      status: 'Outpatient'
    }
  });

  const onSubmit = async (data: PatientFormValues) => {
    console.log('Form data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Patient registered successfully!');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
    >
      <div className="flex justify-between items-center p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Patient Registration</h2>
            <p className="text-sm font-medium text-slate-500">Register a new patient for admission or consultation.</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors border border-transparent hover:border-slate-200">
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8 overflow-y-auto max-h-[70vh] scrollbar-thin">
        {/* Section: Basic Information */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
            <User className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">First Name</label>
              <input {...register('firstName')} className={cn("form-input w-full", errors.firstName && "border-rose-500 focus:ring-rose-500/20")} placeholder="John" />
              {errors.firstName && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Last Name</label>
              <input {...register('lastName')} className={cn("form-input w-full", errors.lastName && "border-rose-500 focus:ring-rose-500/20")} placeholder="Doe" />
              {errors.lastName && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.lastName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Gender</label>
              <select {...register('gender')} className="form-input w-full">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input type="date" {...register('dateOfBirth')} className="form-input w-full pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Blood Group</label>
              <div className="relative">
                <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500 pointer-events-none" />
                <select {...register('bloodGroup')} className="form-input w-full pl-10">
                  <option value="">Select Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Initial Status</label>
              <select {...register('status')} className="form-input w-full">
                <option value="Outpatient">Outpatient</option>
                <option value="Inpatient">Inpatient</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section: Contact & Location */}
        <section className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400">
            <Phone className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Contact Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
              <input {...register('phone')} className="form-input w-full" placeholder="+1 234 567 890" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
              <input {...register('email')} className="form-input w-full" placeholder="john.doe@example.com" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Full Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <textarea {...register('address')} className="form-input w-full pl-10 min-h-[100px]" placeholder="123 Hospital Lane, Medical District..." />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Emergency Contact */}
        <section className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
            <Shield className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Emergency Contact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Contact Name</label>
              <input {...register('emergencyContactName')} className="form-input w-full" placeholder="Relation's Name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Contact Phone</label>
              <input {...register('emergencyContactPhone')} className="form-input w-full" placeholder="+1 987 654 321" />
            </div>
          </div>
        </section>

        <div className="pt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-10 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-blue-200 dark:shadow-none transition-all"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Register Patient
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Add standard styles for form inputs in index.css
