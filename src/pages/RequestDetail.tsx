import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Package, ShoppingBag, Clock, User, Phone, ArrowLeft, CheckCircle, DollarSign, Store, AlertCircle, Loader } from 'lucide-react';
import { requestService, DeliveryRequest } from '../services/requestService';
import StatusBadge from '../components/StatusBadge';

export default function RequestDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [request, setRequest] = useState<DeliveryRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchRequest();
        }
    }, [id]);

    const fetchRequest = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await requestService.getRequest(parseInt(id!));
            setRequest(data);
        } catch (err: any) {
            console.error('Error fetching request:', err);
            setError(err.response?.data?.message || 'Failed to load request details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="p-4 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <AlertCircle size={24} className="text-red-600 mx-auto mb-2" />
                    <p className="text-red-600">{error || 'Request not found'}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-3 text-blue-600 hover:underline"
                    >
                        Go back home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 pb-20">
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-1 text-gray-600 mb-4 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            {/* Main Card */}
            <div className="card p-4 mb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        {request.type === 'buy' ? (
                            <>
                                <ShoppingBag size={24} className="text-purple-600" />
                                <span className="font-semibold text-lg">Buy & Deliver</span>
                            </>
                        ) : (
                            <>
                                <Package size={24} className="text-blue-600" />
                                <span className="font-semibold text-lg">Send Item</span>
                            </>
                        )}
                    </div>
                    <StatusBadge status={request.status} size="lg" />
                </div>

                {/* Item Description */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Item Description</h3>
                    <p className="text-gray-800">{request.item_description}</p>
                </div>

                {/* Customer Info */}
                {request.user && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Customer Information</h3>
                        <div className="flex items-center gap-2 mb-1">
                            <User size={14} className="text-gray-500" />
                            <span className="text-sm font-medium">{request.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-500" />
                            <span className="text-sm text-gray-600">{request.user.phone || 'No phone provided'}</span>
                        </div>
                    </div>
                )}

                {/* Locations */}
                <div className="space-y-3 mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Pickup Location</h3>
                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700">{request.pickup_address}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Delivery Location</h3>
                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700">{request.delivery_address}</p>
                        </div>
                    </div>
                </div>

                {/* Store Info (for buy type) */}
                {request.type === 'buy' && request.store_name && (
                    <div className="bg-purple-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Store size={16} className="text-purple-600" />
                            <h3 className="text-sm font-semibold text-purple-800">Store Information</h3>
                        </div>
                        <p className="text-sm text-purple-700">Store: {request.store_name}</p>
                        {request.item_cost && (
                            <p className="text-sm text-purple-700 mt-1">Estimated cost: R{request.item_cost}</p>
                        )}
                    </div>
                )}

                {/* Special Instructions */}
                {request.special_instructions && (
                    <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                        <h3 className="text-sm font-semibold text-yellow-800 mb-1">Special Instructions</h3>
                        <p className="text-sm text-yellow-700">{request.special_instructions}</p>
                    </div>
                )}

                {/* Cost Breakdown */}
                <div className="pt-3 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Cost Breakdown</h3>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold">R{request.delivery_fee}</span>
                    </div>
                    {request.type === 'buy' && request.item_cost && (
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Goods Cost</span>
                            <span className="font-semibold">R{request.item_cost}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                        <span>Total</span>
                        <span className="text-green-600">
                            R{request.delivery_fee + (request.item_cost || 0)}
                        </span>
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-4 pt-3 border-t text-xs text-gray-400">
                    <div className="flex items-center gap-1 mb-1">
                        <Clock size={12} />
                        <span>Created: {formatDate(request.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Last updated: {formatDate(request.updated_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}