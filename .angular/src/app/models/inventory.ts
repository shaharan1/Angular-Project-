export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Analgesic' | 'Antipyretic' | 'Supplements' | 'Others';
  stock: number;
  unit: string;
  price: number;
  expiryDate: string;
  manufacturer: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
}
