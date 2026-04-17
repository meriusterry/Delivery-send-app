import { useState, useEffect } from 'react';
import { Package, CheckCircle, Loader } from 'lucide-react';
import { requestService, DeliveryRequest, RequestStats } from '../services/requestService';
import RequestCard from '../components/RequestCard';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [requests, setRequests] = useState<DeliveryRequest[]>([]);
    const [stats, setStats] = useState<RequestStats>({
        active: 0,
        completed: 0,
        totalDeliveries: 0,
        totalSpent: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch user's requests
            const userRequests = await requestService.getUserRequests();
            setRequests(userRequests);
            
            // Fetch stats
            const userStats = await requestService.getStats();
            setStats(userStats);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const activeRequests = requests.filter(r => r.status !== 'delivered');
    const completedRequests = requests.filter(r => r.status === 'delivered');
    const currentRequests = activeTab === 'active' ? activeRequests : completedRequests;

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
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={fetchData}
                        className="mt-2 text-blue-600 hover:underline"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="card p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Active Deliveries</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
                        </div>
                        <Package className="text-blue-200" size={32} />
                    </div>
                </div>
                <div className="card p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Completed</p>
                            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                        </div>
                        <CheckCircle className="text-green-200" size={32} />
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between text-sm">
                    <div>
                        <p className="text-gray-500">Total Deliveries</p>
                        <p className="font-bold text-lg">{stats.totalDeliveries}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Total Spent</p>
                        <p className="font-bold text-lg text-green-600">R{stats.totalSpent}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
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

            {/* Requests List */}
            <div className="space-y-3">
                {currentRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                ))}

                {currentRequests.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-3">📭</div>
                        <p className="text-gray-500">No {activeTab} requests</p>
                        <button 
                            onClick={() => window.location.href = '/new'}
                            className="mt-3 text-blue-600 hover:underline"
                        >
                            Create your first request →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}