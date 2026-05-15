export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string; // e.g. 'May 2026'
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
}
