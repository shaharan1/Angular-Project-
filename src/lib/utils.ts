import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPatientId(num: number): string {
  return `PAT-${String(num).padStart(6, '0')}`;
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'completed':
    case 'inpatient':
    case 'ready':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'scheduled':
    case 'outpatient':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'in-progress':
    case 'emergency':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'cancelled':
    case 'discharged':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
