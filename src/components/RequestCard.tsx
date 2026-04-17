import { Link } from 'react-router-dom';
import { MapPin, Package, ShoppingBag } from 'lucide-react';
import { DeliveryRequest } from '../types';
import StatusBadge from './StatusBadge';

interface RequestCardProps {
  request: DeliveryRequest;
}

export default function RequestCard({ request }: RequestCardProps) {
  return (
    <Link to={`/request/${request.id}`}>
      <div className="card p-4 hover:shadow-md transition cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {request.type === 'buy' ? (
              <ShoppingBag size={16} className="text-purple-600" />
            ) : (
              <Package size={16} className="text-blue-600" />
            )}
            <span className="text-sm font-semibold">
              {request.type === 'buy' ? 'Buy & Deliver' : 'Send Item'}
            </span>
          </div>
          <StatusBadge status={request.status} />
        </div>
        <p className="text-gray-700 text-sm mb-2 line-clamp-2">
          {request.itemDescription}
        </p>
        <div className="space-y-1 mb-3">
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <MapPin size={12} className="mt-0.5 text-green-600" />
            <span className="flex-1 truncate">From: {request.pickup.address}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <MapPin size={12} className="mt-0.5 text-red-600" />
            <span className="flex-1 truncate">To: {request.delivery.address}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-gray-400">
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
          <span className="text-sm font-bold text-green-600">
            R{request.deliveryFee}
          </span>
        </div>
      </div>
    </Link>
  );
}