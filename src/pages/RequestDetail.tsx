import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Package, ShoppingBag, Clock, User, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import { mockRequests } from '../mockData';
import StatusBadge from '../components/StatusBadge';

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const request = mockRequests.find(r => r.id === id);

  if (!request) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Request not found</p>
        <button onClick={() => navigate('/')} className="text-blue-600 mt-2">
          Go back
        </button>
      </div>
    );
  }

  const completedSteps = request.timeline.filter(step => step.time !== null).length;

  return (
    <div className="p-4 pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 mb-4 hover:text-gray-900">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="card p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {request.type === 'buy' ? (
              <ShoppingBag size={20} className="text-purple-600" />
            ) : (
              <Package size={20} className="text-blue-600" />
            )}
            <span className="font-semibold">
              {request.type === 'buy' ? 'Buy & Deliver' : 'Send Item'}
            </span>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <p className="text-gray-700 mb-4">{request.itemDescription}</p>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={14} className="text-gray-500" />
            <span className="text-sm font-medium">{request.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-500" />
            <span className="text-sm text-gray-600">{request.customerPhone}</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-3 text-sm">Progress</h4>
          <div className="relative">
            {request.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-3 mb-4 last:mb-0">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    event.time ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className="text-lg">{event.icon}</span>
                  </div>
                  {idx < request.timeline.length - 1 && (
                    <div className={`absolute top-8 left-4 w-0.5 h-12 ${
                      idx < completedSteps - 1 ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${event.time ? 'text-gray-900' : 'text-gray-400'}`}>
                    {event.status}
                  </p>
                  {event.time && (
                    <p className="text-xs text-gray-500">
                      {new Date(event.time).toLocaleString()}
                    </p>
                  )}
                </div>
                {event.time && (
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Pickup Location</p>
              <p className="text-sm text-gray-700">{request.pickup.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Delivery Location</p>
              <p className="text-sm text-gray-700">{request.delivery.address}</p>
            </div>
          </div>
        </div>

        {request.specialInstructions && (
          <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-yellow-800 mb-1">Special Instructions</p>
            <p className="text-sm text-yellow-700">{request.specialInstructions}</p>
          </div>
        )}

        {request.type === 'buy' && request.storeName && (
          <div className="mt-4 bg-purple-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-purple-800 mb-1">Store Information</p>
            <p className="text-sm text-purple-700">Store: {request.storeName}</p>
            {request.itemCost && (
              <p className="text-sm text-purple-700 mt-1">Estimated cost: R{request.itemCost}</p>
            )}
          </div>
        )}

        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-semibold">R{request.deliveryFee}</span>
          </div>
          {request.type === 'buy' && request.itemCost && (
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Goods Cost</span>
              <span className="font-semibold">R{request.itemCost}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
            <span>Total</span>
            <span className="text-green-600">
              R{request.deliveryFee + (request.itemCost || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}