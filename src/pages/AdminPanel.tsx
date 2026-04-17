import { useState, useEffect } from 'react';
import { MapPin, Phone, CheckCircle, Package, ShoppingBag, Clock, User, Navigation, Loader, AlertCircle } from 'lucide-react';
import { requestService, DeliveryRequest, RequestStats } from '../services/requestService';
import StatusBadge from '../components/StatusBadge';

type FilterType = 'all' | 'pending' | 'approved' | 'collected' | 'delivered';

export default function AdminPanel() {
    const [requests, setRequests] = useState<DeliveryRequest[]>([]);
    const [stats, setStats] = useState<RequestStats | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [allRequests, userStats] = await Promise.all([
                requestService.getAllRequests(),
                requestService.getStats()
            ]);
            setRequests(allRequests);
            setStats(userStats);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (requestId: number, newStatus: string) => {
        try {
            setUpdating(requestId);
            await requestService.updateRequestStatus(requestId, newStatus);
            await fetchData(); // Refresh data
            alert(`Request ${requestId} updated to ${newStatus}`);
        } catch (err: any) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const openCustomerLocation = (lat?: number, lng?: number, address?: string) => {
        if (lat && lng) {
            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
        } else if (address) {
            window.open(`https://www.google.com/maps?q=${encodeURIComponent(address)}`, '_blank');
        } else {
            alert('No location available');
        }
    };

    const filteredRequests = filter === 'all' 
        ? requests 
        : requests.filter(r => r.status === filter);

    const getStatusCount = (status: string) => {
        return requests.filter(r => r.status === status).length;
    };

    const getNextAction = (status: string): { label: string; color: string; next: string } | null => {
        switch(status) {
            case 'pending': return { label: 'Approve', color: 'bg-green-600', next: 'approved' };
            case 'approved': return { label: 'Mark Collected', color: 'bg-orange-600', next: 'collected' };
            case 'collected': return { label: 'Mark Delivered', color: 'bg-purple-600', next: 'delivered' };
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <AlertCircle size={24} className="text-red-600 mx-auto mb-2" />
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={fetchData}
                        className="mt-3 text-blue-600 hover:underline"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 pb-20">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <div className="text-sm text-gray-500">{requests.length} total requests</div>
            </div>

            {/* Stats Filters */}
            <div className="grid grid-cols-5 gap-2 mb-4">
                {(['pending', 'approved', 'collected', 'delivered', 'all'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`p-2 rounded-lg text-center transition ${
                            filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <div className="text-xs font-semibold capitalize">{status}</div>
                        <div className="text-lg font-bold">
                            {status === 'all' ? requests.length : getStatusCount(status)}
                        </div>
                    </button>
                ))}
            </div>

            {/* Admin Stats Summary */}
            {stats?.admin && (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-5 gap-2 text-center text-xs">
                        <div>
                            <p className="text-gray-500">Pending</p>
                            <p className="font-bold text-yellow-600">{stats.admin.pending}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Approved</p>
                            <p className="font-bold text-blue-600">{stats.admin.approved}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Collected</p>
                            <p className="font-bold text-purple-600">{stats.admin.collected}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Delivered</p>
                            <p className="font-bold text-green-600">{stats.admin.delivered}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Total</p>
                            <p className="font-bold text-gray-600">{stats.admin.total}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Requests List */}
            <div className="space-y-4">
                {filteredRequests.map((request) => {
                    const nextAction = getNextAction(request.status);
                    const isUpdating = updating === request.id;
                    
                    return (
                        <div key={request.id} className="card overflow-hidden">
                            {/* Customer Info Bar */}
                            <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-gray-500" />
                                    <span className="text-sm font-medium">{request.user?.name || 'Unknown'}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <Phone size={12} className="text-gray-400" />
                                    <span className="text-xs text-gray-500">{request.user?.phone || 'No phone'}</span>
                                </div>
                                <button
                                    onClick={() => openCustomerLocation(request.latitude, request.longitude, request.pickup_address)}
                                    className="text-blue-600 text-xs flex items-center gap-1 hover:underline"
                                >
                                    <Navigation size={12} />
                                    View Location
                                </button>
                            </div>

                            <div className="p-4">
                                {/* Type & Status */}
                                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        {request.type === 'buy' ? (
                                            <>
                                                <ShoppingBag size={16} className="text-purple-600" />
                                                <span className="text-sm font-semibold">Buy & Deliver</span>
                                            </>
                                        ) : (
                                            <>
                                                <Package size={16} className="text-blue-600" />
                                                <span className="text-sm font-semibold">Send Item</span>
                                            </>
                                        )}
                                    </div>
                                    <StatusBadge status={request.status} size="sm" />
                                </div>

                                {/* Item Description */}
                                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                    {request.item_description}
                                </p>

                                {/* Locations */}
                                <div className="space-y-2 mb-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="text-xs text-gray-500">Pickup:</span>
                                            <p className="text-gray-700 text-sm">{request.pickup_address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="text-xs text-gray-500">Delivery:</span>
                                            <p className="text-gray-700 text-sm">{request.delivery_address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                {request.special_instructions && (
                                    <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800 mb-3">
                                        📝 {request.special_instructions}
                                    </div>
                                )}

                                {/* Store Info for Buy Type */}
                                {request.type === 'buy' && request.store_name && (
                                    <div className="bg-purple-50 p-2 rounded text-xs text-purple-800 mb-3">
                                        🏪 Store: {request.store_name}
                                        {request.item_cost && <span className="ml-2">💰 R{request.item_cost}</span>}
                                    </div>
                                )}

                                {/* Cost Info & Action Button */}
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <div className="text-sm">
                                        <span className="font-bold text-green-600">Fee: R{request.delivery_fee}</span>
                                        {request.type === 'buy' && request.item_cost && (
                                            <span className="text-gray-500 text-xs ml-2">
                                                + R{request.item_cost} goods
                                            </span>
                                        )}
                                    </div>
                                    
                                    {nextAction && (
                                        <button
                                            onClick={() => updateStatus(request.id, nextAction.next)}
                                            disabled={isUpdating}
                                            className={`${nextAction.color} text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 hover:opacity-90 transition disabled:opacity-50`}
                                        >
                                            {isUpdating ? (
                                                <Loader size={14} className="animate-spin" />
                                            ) : (
                                                <CheckCircle size={14} />
                                            )}
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

                                {/* Timestamp */}
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                    <Clock size={10} />
                                    <span>Created: {new Date(request.created_at).toLocaleString()}</span>
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