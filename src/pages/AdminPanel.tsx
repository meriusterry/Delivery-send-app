import { useState } from 'react';
import { MapPin, Phone, CheckCircle, Package, ShoppingBag, Clock, User, Navigation } from 'lucide-react';
import { mockRequests } from '../mockData';
import { DeliveryRequest, RequestStatus } from '../types';
import StatusBadge from '../components/StatusBadge';

type FilterType = 'all' | RequestStatus;

export default function AdminPanel() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [requests, setRequests] = useState<DeliveryRequest[]>(mockRequests);

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const updateStatus = (requestId: string, newStatus: RequestStatus) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: newStatus, updatedAt: new Date().toISOString() } : req
    ));
    alert(`Request ${requestId} updated to ${newStatus}`);
  };

  const openCustomerLocation = (location: { lat: number; lng: number }) => {
    window.open(`https://www.google.com/maps?q=${location.lat},${location.lng}`, '_blank');
  };

  const getNextAction = (status: RequestStatus): { label: string; color: string; next: RequestStatus } | null => {
    switch(status) {
      case 'pending': return { label: 'Approve', color: 'bg-green-600', next: 'approved' };
      case 'approved': return { label: 'Mark Collected', color: 'bg-orange-600', next: 'collected' };
      case 'collected': return { label: 'Mark Delivered', color: 'bg-purple-600', next: 'delivered' };
      default: return null;
    }
  };

  const getStatusCount = (status: RequestStatus) => {
    return requests.filter(r => r.status === status).length;
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <div className="text-sm text-gray-500">{requests.length} total</div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {(['pending', 'approved', 'collected', 'delivered', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`p-2 rounded-lg text-center transition ${
              filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <div className="text-xs font-semibold capitalize">{status}</div>
            <div className="text-lg font-bold">
              {status === 'all' ? requests.length : getStatusCount(status)}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const nextAction = getNextAction(request.status);
          
          return (
            <div key={request.id} className="card overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-500" />
                  <span className="text-sm font-medium">{request.customerName}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <Phone size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{request.customerPhone}</span>
                </div>
                <button
                  onClick={() => openCustomerLocation(request.customerLocation)}
                  className="text-blue-600 text-xs flex items-center gap-1 hover:underline"
                >
                  <Navigation size={12} />
                  Live Location
                </button>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {request.type === 'buy' ? (
                      <ShoppingBag size={16} className="text-purple-600" />
                    ) : (
                      <Package size={16} className="text-blue-600" />
                    )}
                    <span className="text-sm font-semibold capitalize">
                      {request.type === 'buy' ? 'Buy & Deliver' : 'Send Item'}
                    </span>
                  </div>
                  <StatusBadge status={request.status} />
                </div>

                <p className="text-sm text-gray-700 mb-3 font-medium">
                  {request.itemDescription}
                </p>

                <div className="space-y-2 mb-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500">Pickup:</span>
                      <p className="text-gray-700">{request.pickup.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500">Delivery:</span>
                      <p className="text-gray-700">{request.delivery.address}</p>
                    </div>
                  </div>
                </div>

                {request.specialInstructions && (
                  <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800 mb-3">
                    📝 {request.specialInstructions}
                  </div>
                )}

                {request.type === 'buy' && request.storeName && (
                  <div className="bg-purple-50 p-2 rounded text-xs text-purple-800 mb-3">
                    🏪 Store: {request.storeName}
                    {request.itemCost && <span className="ml-2">💰 R{request.itemCost}</span>}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-sm">
                    <span className="font-bold text-green-600">Fee: R{request.deliveryFee}</span>
                    {request.type === 'buy' && request.itemCost && (
                      <span className="text-gray-500 text-xs ml-2">
                        + R{request.itemCost} goods
                      </span>
                    )}
                  </div>
                  
                  {nextAction && (
                    <button
                      onClick={() => updateStatus(request.id, nextAction.next)}
                      className={`${nextAction.color} text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 hover:opacity-90 transition`}
                    >
                      <CheckCircle size={14} />
                      {nextAction.label}
                    </button>
                  )}

                  {request.status === 'delivered' && (
                    <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                      <CheckCircle size={14} />
                      Completed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Clock size={10} />
                  <span>Created: {new Date(request.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-3">📭</div>
            <p className="text-gray-500">No {filter} requests</p>
          </div>
        )}
      </div>
    </div>
  );
}