import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Calendar, Package, Award, Loader, AlertCircle, Settings, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requestService, RequestStats } from '../services/requestService';
import api from '../services/api';

export default function Profile() {
    const { user, login } = useAuth();
    const [stats, setStats] = useState<RequestStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchStats();
        if (user) {
            setEditForm({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const userStats = await requestService.getStats();
            setStats(userStats);
        } catch (err: any) {
            console.error('Error fetching stats:', err);
            setError(err.response?.data?.message || 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditForm({
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || ''
        });
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const response = await api.put('/auth/profile', editForm);
            if (response.data.success) {
                alert('Profile updated successfully!');
                setIsEditing(false);
                // Refresh the page to show updated data
                window.location.reload();
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-4 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <AlertCircle size={24} className="text-red-600 mx-auto mb-2" />
                    <p className="text-red-600">{error || 'User not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 pb-20">
            {/* Profile Header */}
            <div className="card p-6 text-center mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-4xl text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                    <Calendar size={12} />
                    Member since {new Date().toLocaleDateString()}
                </p>
                
                {/* Stats */}
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats?.totalDeliveries || 0}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Package size={10} />
                            Deliveries
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">R{stats?.totalSpent || 0}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Award size={10} />
                            Total Spent
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="card p-4 mb-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User size={18} />
                    Contact Information
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail size={16} className="text-gray-400" />
                        <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Phone size={16} className="text-gray-400" />
                        <span>{user.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{user.address || 'Not provided'}</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-4 mb-4">
                <h3 className="font-semibold mb-3">Delivery Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats?.active || 0}</p>
                        <p className="text-xs text-gray-600">Active Deliveries</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
                        <p className="text-xs text-gray-600">Completed</p>
                    </div>
                </div>
            </div>

            {/* Payment Methods (Placeholder) */}
            <div className="card p-4 mb-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCard size={18} />
                    Payment Methods
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <CreditCard size={16} className="text-gray-600" />
                            <div>
                                <p className="text-sm font-medium">Cash on Delivery</p>
                                <p className="text-xs text-gray-500">Pay when you receive</p>
                            </div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Default</span>
                    </div>
                    <button className="text-blue-600 text-sm w-full text-center py-2 hover:underline">
                        + Add Payment Method
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-4">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                    <button 
                        onClick={() => window.location.href = '/new'}
                        className="w-full text-left py-2 px-3 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2"
                    >
                        📦 Create New Delivery
                    </button>
                    <button 
                        onClick={handleEdit}
                        className="w-full text-left py-2 px-3 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        <Settings size={16} />
                        Edit Profile Settings
                    </button>
                    <button className="w-full text-left py-2 px-3 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        📞 Contact Support
                    </button>
                    <button className="w-full text-left py-2 px-3 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        📝 View Terms & Conditions
                    </button>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Edit Profile</h3>
                            <button 
                                onClick={() => setIsEditing(false)} 
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Address
                                </label>
                                <textarea
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your address"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}