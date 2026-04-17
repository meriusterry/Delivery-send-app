import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Package, ShoppingBag, Clock, User, Phone, ArrowLeft, CheckCircle, DollarSign, Store, AlertCircle, Loader, CreditCard, TrendingUp } from 'lucide-react';
import { requestService, DeliveryRequest } from '../services/requestService';
import StatusBadge from '../components/StatusBadge';

export default function RequestDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [request, setRequest] = useState<DeliveryRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const DELIVERY_FEE = 15;

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

    const formatCurrency = (amount: number): string => {
        return `R${amount.toFixed(2)}`;
    };

    const getItemCost = (): number => {
        if (request?.type === 'buy' && request?.item_cost) {
            return typeof request.item_cost === 'number' ? request.item_cost : parseFloat(String(request.item_cost));
        }
        return 0;
    };

    const getTotal = (): number => {
        return DELIVERY_FEE + getItemCost();
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'collected': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
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
        <div className="p-4 pb-20 max-w-2xl mx-auto">
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-1 text-gray-600 mb-4 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            {/* Status Banner */}
            <div className={`${getStatusColor(request.status)} rounded-lg p-3 mb-4 border`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-current"></div>
                        <span className="text-sm font-semibold">Request Status</span>
                    </div>
                    <StatusBadge status={request.status} size="lg" />
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 pb-3 border-b">
                    <div className="flex items-center gap-3">
                        {request.type === 'buy' ? (
                            <>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <ShoppingBag size={24} className="text-purple-600" />
                                </div>
                                <div>
                                    <span className="font-semibold text-lg">Buy & Deliver</span>
                                    <p className="text-xs text-gray-500">Shopping service</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Package size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <span className="font-semibold text-lg">Send Item</span>
                                    <p className="text-xs text-gray-500">Parcel delivery</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Request ID */}
                <div className="bg-gray-50 rounded-lg p-2 mb-4 text-center">
                    <p className="text-xs text-gray-500">Request ID</p>
                    <p className="text-sm font-mono font-semibold">#{request.id}</p>
                </div>

                {/* Item Description */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                        <Package size={14} />
                        Item Description
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-800">{request.item_description}</p>
                    </div>
                </div>

                {/* Customer Info */}
                {request.user && (
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <User size={14} />
                            Customer Information
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-gray-500" />
                                <span className="text-sm font-medium">{request.user.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-500" />
                                <span className="text-sm text-gray-600">{request.user.phone || 'No phone provided'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Locations */}
                <div className="space-y-4 mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                            <MapPin size={14} className="text-green-600" />
                            Pickup Location
                        </h3>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                            <p className="text-gray-700 text-sm">{request.pickup_address}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                            <MapPin size={14} className="text-red-600" />
                            Delivery Location
                        </h3>
                        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                            <p className="text-gray-700 text-sm">{request.delivery_address}</p>
                        </div>
                    </div>
                </div>

                {/* Store Info (for buy type) */}
                {request.type === 'buy' && request.store_name && (
                    <div className="bg-purple-50 rounded-lg p-3 mb-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Store size={16} className="text-purple-600" />
                            <h3 className="text-sm font-semibold text-purple-800">Store Information</h3>
                        </div>
                        <p className="text-sm text-purple-700">Store: {request.store_name}</p>
                        {request.item_cost && (
                            <p className="text-sm text-purple-700 mt-1">Estimated cost: {formatCurrency(getItemCost())}</p>
                        )}
                    </div>
                )}

                {/* Special Instructions */}
                {request.special_instructions && (
                    <div className="bg-yellow-50 rounded-lg p-3 mb-4 border border-yellow-200">
                        <h3 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                            <AlertCircle size={14} />
                            Special Instructions
                        </h3>
                        <p className="text-sm text-yellow-700">{request.special_instructions}</p>
                    </div>
                )}

                {/* Cost Breakdown - Enhanced */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mt-2">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <DollarSign size={16} />
                        Payment Summary
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Delivery Fee:</span>
                            <span className="font-semibold text-green-600">{formatCurrency(DELIVERY_FEE)}</span>
                        </div>
                        {request.type === 'buy' && getItemCost() > 0 && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Item Cost:</span>
                                <span className="font-semibold">{formatCurrency(getItemCost())}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                            <span className="font-semibold text-gray-800">Total Amount:</span>
                            <span className="font-bold text-green-600 text-lg">{formatCurrency(getTotal())}</span>
                        </div>
                        {request.type === 'buy' && getItemCost() > 0 && (
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-xs text-gray-500">(Item cost + Delivery fee)</span>
                                <span className="text-xs text-green-600">Includes R15 delivery</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-4 pt-3 border-t text-xs text-gray-400">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>Created:</span>
                        </div>
                        <span>{formatDate(request.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>Last updated:</span>
                        </div>
                        <span>{formatDate(request.updated_at)}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons (if needed) */}
            {request.status !== 'delivered' && (
                <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                    <p className="text-sm text-blue-800">
                        Your request is {request.status}. You'll be notified when it's updated.
                    </p>
                </div>
            )}

            {request.status === 'delivered' && (
                <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                    <div className="flex items-center justify-center gap-2">
                        <CheckCircle size={18} className="text-green-600" />
                        <p className="text-sm text-green-800 font-semibold">Delivery Completed!</p>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Thank you for using QuickSend</p>
                </div>
            )}
        </div>
    );
}