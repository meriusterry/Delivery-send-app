export type RequestType = 'send' | 'buy';
export type RequestStatus = 'pending' | 'approved' | 'collected' | 'delivered';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface TimelineEvent {
  status: RequestStatus | 'Request Sent';
  time: string | null;
  icon: string;
}

export interface DeliveryRequest {
  id: string;
  type: RequestType;
  status: RequestStatus;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerLocation: Location;
  pickup: Location;
  delivery: Location;
  itemDescription: string;
  specialInstructions?: string;
  storeName?: string;
  itemCost?: number;
  deliveryFee: number;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  isAdmin: boolean;
}

export interface Stats {
  active: number;
  completed: number;
  totalSpent: number;
  totalDeliveries: number;
}