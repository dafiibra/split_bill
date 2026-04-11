export interface Person {
  id: string;
  name: string;
  amount: number;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[];
}

export type SplitMethod = "equal" | "custom";