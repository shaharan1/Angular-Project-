export enum InvoiceStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  OVERDUE = 'Overdue'
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  date: string | Date;
  dueDate: string | Date;
  items: InvoiceItem[];
  totalAmount: number;
  status: InvoiceStatus;
}
