import { DeliveryRequest, User, Stats } from './types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '071 234 5678',
  address: '45 Long Street, Cape Town',
  joinDate: 'January 2024',
  isAdmin: false
};

export const mockStats: Stats = {
  active: 2,
  completed: 3,
  totalSpent: 180,
  totalDeliveries: 12
};

export const mockRequests: DeliveryRequest[] = [
  {
    id: '1',
    type: 'send',
    status: 'pending',
    customerId: '1',
    customerName: 'John Doe',
    customerPhone: '071 234 5678',
    customerEmail: 'john@example.com',
    customerLocation: { lat: -33.9249, lng: 18.4241, address: 'Current location' },
    pickup: { lat: -33.9250, lng: 18.4242, address: '123 Main St, Cape Town' },
    delivery: { lat: -33.9190, lng: 18.4220, address: '45 Long St, CBD' },
    itemDescription: 'iPhone charger and cable - original Apple',
    specialInstructions: 'Ring buzzer 123, gate code is 4567',
    deliveryFee: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { status: 'Request Sent', time: new Date().toISOString(), icon: '📤' },
      { status: 'pending', time: null, icon: '⏳' },
      { status: 'approved', time: null, icon: '✅' },
      { status: 'collected', time: null, icon: '📦' },
      { status: 'delivered', time: null, icon: '🏁' }
    ]
  },
  {
    id: '2',
    type: 'buy',
    status: 'approved',
    customerId: '2',
    customerName: 'Sarah Smith',
    customerPhone: '082 345 6789',
    customerEmail: 'sarah@example.com',
    customerLocation: { lat: -33.9149, lng: 18.4141, address: 'Current location' },
    pickup: { lat: -33.9090, lng: 18.4190, address: 'Woolworths, V&A Waterfront' },
    delivery: { lat: -33.9170, lng: 18.4110, address: '12 Beach Rd, Sea Point' },
    itemDescription: '2kg chicken, whole wheat bread, 2L milk',
    storeName: 'Woolworths',
    itemCost: 125,
    specialInstructions: 'Please check expiry dates',
    deliveryFee: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { status: 'Request Sent', time: new Date().toISOString(), icon: '📤' },
      { status: 'pending', time: new Date(Date.now() - 3600000).toISOString(), icon: '⏳' },
      { status: 'approved', time: new Date().toISOString(), icon: '✅' },
      { status: 'collected', time: null, icon: '📦' },
      { status: 'delivered', time: null, icon: '🏁' }
    ]
  },
  {
    id: '3',
    type: 'send',
    status: 'delivered',
    customerId: '3',
    customerName: 'Mike Johnson',
    customerPhone: '071 987 6543',
    customerEmail: 'mike@example.com',
    customerLocation: { lat: -33.9300, lng: 18.4300, address: 'Current location' },
    pickup: { lat: -33.9280, lng: 18.4280, address: '25 Loop St, Cape Town' },
    delivery: { lat: -33.9200, lng: 18.4250, address: '8 Bree St, CBD' },
    itemDescription: 'Legal documents in envelope',
    specialInstructions: 'Signatures required',
    deliveryFee: 15,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    timeline: [
      { status: 'Request Sent', time: new Date(Date.now() - 86400000).toISOString(), icon: '📤' },
      { status: 'pending', time: new Date(Date.now() - 86400000 + 300000).toISOString(), icon: '⏳' },
      { status: 'approved', time: new Date(Date.now() - 86400000 + 600000).toISOString(), icon: '✅' },
      { status: 'collected', time: new Date(Date.now() - 86400000 + 3600000).toISOString(), icon: '📦' },
      { status: 'delivered', time: new Date(Date.now() - 86400000 + 7200000).toISOString(), icon: '🏁' }
    ]
  }
];