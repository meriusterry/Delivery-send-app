import { Link } from 'react-router-dom';
import { MapPin, Package, ShoppingBag, Calendar, DollarSign } from 'lucide-react';
import { DeliveryRequest } from '../services/requestService';
import StatusBadge from './StatusBadge';

interface RequestCardProps {
    request: DeliveryRequest;
}

export default function RequestCard({ request }: RequestCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-ZA');
    };

    return (
        <Link to={`/request/${request.id}`}>
            <div className="card p-4 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98]">
                {/* Header */}
                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        {request.type === 'buy' ? (
                            <>
                                <ShoppingBag size={18} className="text-purple-600" />
                                <span className="text-sm font-semibold text-gray-900">Buy & Deliver</span>
                            </>
                        ) : (
                            <>
                                <Package size={18} className="text-blue-600" />
                                <span className="text-sm font-semibold text-gray-900">Send Item</span>
                            </>
                        )}
                    </div>
                    <StatusBadge status={request.status} size="sm" />
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                    {request.item_description}
                </p>

                {/* Locations */}
                <div className="space-y-2 mb-3">
                    <div className="flex items-start gap-2 text-xs">
                        <MapPin size={14} className="mt-0.5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-600 flex-1 truncate">From: {request.pickup_address}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                        <MapPin size={14} className="mt-0.5 text-red-600 flex-shrink-0" />
                        <span className="text-gray-600 flex-1 truncate">To: {request.delivery_address}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        <span>{formatDate(request.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                        <DollarSign size={14} />
                        <span>R{request.delivery_fee}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}