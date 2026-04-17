import { useState } from 'react';
import { Package, CheckCircle } from 'lucide-react';
import { mockRequests, mockStats } from '../mockData';
import RequestCard from '../components/RequestCard';

// Define the type locally if it's not importing properly
export type RequestStatus = 'pending' | 'approved' | 'collected' | 'delivered';

export interface DeliveryRequest {
  id: string;
  type: 'send' | 'buy';
  status: RequestStatus;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickup: { lat: number; lng: number; address: string };
  delivery: { lat: number; lng: number; address: string };
  itemDescription: string;
  specialInstructions?: string;
  storeName?: string;
  itemCost?: number;
  deliveryFee: number;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
  const activeRequests = mockRequests.filter(r => r.status !== 'delivered');
  const completedRequests = mockRequests.filter(r => r.status === 'delivered');
  
  const requests = activeTab === 'active' ? activeRequests : completedRequests;

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Active</p>
              <p className="text-2xl font-bold text-blue-600">{mockStats.active}</p>
            </div>
            <Package className="text-blue-200" size={32} />
          </div>
        </div>
        <div className="card p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{mockStats.completed}</p>
            </div>
            <CheckCircle className="text-green-200" size={32} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'active'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
        >
          Active ({activeRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'completed'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
        >
          Completed ({completedRequests.length})
        </button>
      </div>

      <div className="space-y-3">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}

        {requests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-3">📭</div>
            <p className="text-gray-500">No {activeTab} requests</p>
          </div>
        )}
      </div>
    </div>
  );
}