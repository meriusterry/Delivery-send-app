import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Mail, Phone, MapPin, Lock, Bell, Moon, Globe, 
    Shield, CreditCard, Trash2, Save, X, AlertCircle, 
    CheckCircle, Eye, EyeOff, Loader, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Settings() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    
    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    
    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Preferences state
    const [preferences, setPreferences] = useState({
        email_notifications: true,
        sms_notifications: true,
        dark_mode: false,
        language: 'en'
    });

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await api.put('/auth/profile', {
                name: profileForm.name,
                phone: profileForm.phone,
                address: profileForm.address
            });
            
            if (response.data.success) {
                showMessage('success', 'Profile updated successfully!');
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (error: any) {
            showMessage('error', error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            showMessage('error', 'New passwords do not match');
            return;
        }
        
        if (passwordForm.new_password.length < 6) {
            showMessage('error', 'Password must be at least 6 characters');
            return;
        }
        
        setSaving(true);
        try {
            const response = await api.put('/auth/password', {
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password
            });
            
            if (response.data.success) {
                showMessage('success', 'Password updated successfully!');
                setPasswordForm({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                });
            }
        } catch (error: any) {
            showMessage('error', error.response?.data?.message || 'Failed to update password');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
            setLoading(true);
            try {
                await api.delete('/auth/account');
                showMessage('success', 'Account deleted successfully');
                setTimeout(() => {
                    logout();
                    navigate('/login');
                }, 1500);
            } catch (error: any) {
                showMessage('error', error.response?.data?.message || 'Failed to delete account');
            } finally {
                setLoading(false);
            }
        }
    };

    const sections = [
        { id: 'profile', label: 'Profile Information', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'preferences', label: 'Preferences', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
        { id: 'danger', label: 'Danger Zone', icon: AlertCircle }
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 pb-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
            </div>

            {/* Message Toast */}
            {message && (
                <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-slide-up ${
                    message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span className="text-sm">{message.text}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-20">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                    activeSection === section.id
                                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <section.icon size={18} />
                                <span className="flex-1 text-left">{section.label}</span>
                                <ChevronRight size={16} className={activeSection === section.id ? 'text-blue-600' : 'text-gray-400'} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold mb-2">Profile Information</h2>
                            <p className="text-sm text-gray-500 mb-6">Update your personal information</p>
                            
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={profileForm.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="+27 71 234 5678"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <textarea
                                            value={profileForm.address}
                                            onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                                            rows={3}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Your address"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Security Section */}
                    {activeSection === 'security' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold mb-2">Security</h2>
                            <p className="text-sm text-gray-500 mb-6">Change your password</p>
                            
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={passwordForm.current_password}
                                            onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={passwordForm.new_password}
                                            onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={passwordForm.confirm_password}
                                            onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                                        {saving ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Preferences Section */}
                    {activeSection === 'preferences' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold mb-2">Preferences</h2>
                            <p className="text-sm text-gray-500 mb-6">Customize your experience</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b">
                                    <div className="flex items-center gap-3">
                                        <Moon size={18} className="text-gray-600" />
                                        <div>
                                            <p className="font-medium">Dark Mode</p>
                                            <p className="text-xs text-gray-500">Switch to dark theme</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.dark_mode}
                                            onChange={(e) => setPreferences({...preferences, dark_mode: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                
                                <div className="flex items-center justify-between py-3 border-b">
                                    <div className="flex items-center gap-3">
                                        <Globe size={18} className="text-gray-600" />
                                        <div>
                                            <p className="font-medium">Language</p>
                                            <p className="text-xs text-gray-500">Choose your preferred language</p>
                                        </div>
                                    </div>
                                    <select
                                        value={preferences.language}
                                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="en">English</option>
                                        <option value="af">Afrikaans</option>
                                        <option value="zu">Zulu</option>
                                        <option value="xh">Xhosa</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Section */}
                    {activeSection === 'notifications' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold mb-2">Notifications</h2>
                            <p className="text-sm text-gray-500 mb-6">Manage how you receive updates</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b">
                                    <div className="flex items-center gap-3">
                                        <Bell size={18} className="text-gray-600" />
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-xs text-gray-500">Receive updates via email</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.email_notifications}
                                            onChange={(e) => setPreferences({...preferences, email_notifications: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                
                                <div className="flex items-center justify-between py-3 border-b">
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-gray-600" />
                                        <div>
                                            <p className="font-medium">SMS Notifications</p>
                                            <p className="text-xs text-gray-500">Receive updates via SMS</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.sms_notifications}
                                            onChange={(e) => setPreferences({...preferences, sms_notifications: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-6">
                                <button
                                    onClick={() => showMessage('success', 'Preferences saved!')}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    <Save size={18} />
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Billing Section */}
                    {activeSection === 'billing' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold mb-2">Billing & Payments</h2>
                            <p className="text-sm text-gray-500 mb-6">Manage your payment methods</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={20} className="text-gray-600" />
                                        <div>
                                            <p className="font-medium">Cash on Delivery</p>
                                            <p className="text-xs text-gray-500">Pay when you receive your items</p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Default</span>
                                </div>
                                
                                <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:border-blue-400 transition">
                                    + Add Payment Method
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Danger Zone Section */}
                    {activeSection === 'danger' && (
                        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                            <h2 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h2>
                            <p className="text-sm text-gray-500 mb-6">Irreversible account actions</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                                    <div>
                                        <p className="font-semibold text-red-800">Delete Account</p>
                                        <p className="text-xs text-red-600">Permanently delete your account and all data</p>
                                    </div>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        {loading ? <Loader size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}