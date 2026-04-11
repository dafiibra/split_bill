export { default as Navbar } from "./Navbar";
export { default as Footer } from "./Footer";

export interface Person {
  id: string;
  name: string;
  amount: number;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // person IDs
}

export type SplitMethod = 'equal' | 'custom';

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}