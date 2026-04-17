import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MapPin, Store, Package, ShoppingBag, CreditCard, AlertCircle, 
    Loader, CheckCircle, Phone, User, DollarSign, 
    Navigation, Mail, MessageCircle, X, TrendingUp
} from 'lucide-react';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

type RequestType = 'send' | 'buy';

interface FormErrors {
    pickup_address?: string;
    delivery_address?: string;
    item_description?: string;
    store_name?: string;
    item_cost?: string;
}

export default function NewRequest() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [requestType, setRequestType] = useState<RequestType>('send');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [createdRequest, setCreatedRequest] = useState<any>(null);
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    
    const [formData, setFormData] = useState({
        pickup_address: '',
        delivery_address: '',
        item_description: '',
        store_name: '',
        item_cost: '',
        special_instructions: ''
    });

    // Calculate totals with proper number handling
    const DELIVERY_FEE = 15;
    
    const getItemCost = (): number => {
        if (requestType === 'buy' && formData.item_cost) {
            const cost = parseFloat(formData.item_cost);
            return isNaN(cost) ? 0 : cost;
        }
        return 0;
    };
    
    const getSubtotal = (): number => {
        return DELIVERY_FEE + getItemCost();
    };
    
    const formatCurrency = (amount: number): string => {
        return `R${amount.toFixed(2)}`;
    };

    useEffect(() => {
        if (useCurrentLocation) {
            getCurrentLocation();
        }
    }, [useCurrentLocation]);

    const getCurrentLocation = () => {
        setGettingLocation(true);
        setError(null);
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
                        );
                        const data = await response.json();
                        if (data.display_name) {
                            setFormData(prev => ({
                                ...prev,
                                pickup_address: data.display_name
                            }));
                        } else {
                            setFormData(prev => ({
                                ...prev,
                                pickup_address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
                            }));
                        }
                    } catch (err) {
                        console.error('Error getting address:', err);
                        setFormData(prev => ({
                            ...prev,
                            pickup_address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
                        }));
                    } finally {
                        setGettingLocation(false);
                        setUseCurrentLocation(false);
                    }
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    let errorMessage = 'Unable to get your location. ';
                    switch(err.code) {
                        case err.PERMISSION_DENIED:
                            errorMessage += 'Please enable location access in your browser settings.';
                            break;
                        case err.POSITION_UNAVAILABLE:
                            errorMessage += 'Location information is unavailable.';
                            break;
                        case err.TIMEOUT:
                            errorMessage += 'Location request timed out.';
                            break;
                        default:
                            errorMessage += 'Please enter your address manually.';
                    }
                    setError(errorMessage);
                    setGettingLocation(false);
                    setUseCurrentLocation(false);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser');
            setGettingLocation(false);
            setUseCurrentLocation(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!formData.pickup_address.trim()) {
            newErrors.pickup_address = 'Pickup address is required';
        }
        
        if (!formData.delivery_address.trim()) {
            newErrors.delivery_address = 'Delivery address is required';
        }
        
        if (!formData.item_description.trim()) {
            newErrors.item_description = 'Item description is required';
        }
        
        if (requestType === 'buy') {
            if (!formData.store_name.trim()) {
                newErrors.store_name = 'Store name is required';
            }
            if (formData.item_cost && parseFloat(formData.item_cost) <= 0) {
                newErrors.item_cost = 'Item cost must be greater than 0';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name as keyof FormErrors]) {
            setErrors({
                ...errors,
                [e.target.name]: undefined
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            const requestData = {
                type: requestType,
                pickup_address: formData.pickup_address,
                delivery_address: formData.delivery_address,
                item_description: formData.item_description,
                store_name: formData.store_name || undefined,
                item_cost: getItemCost() > 0 ? getItemCost() : undefined,
                special_instructions: formData.special_instructions || undefined
            };

            const response = await requestService.createRequest(requestData);
            setCreatedRequest(response);
            setShowConfirmation(true);
            
            setTimeout(() => {
                setShowConfirmation(false);
                navigate('/');
            }, 3000);
        } catch (err: any) {
            console.error('Error creating request:', err);
            setError(err.response?.data?.message || 'Failed to create request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // If no user, show message
    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md text-center">
                    <AlertCircle size={48} className="text-yellow-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Login Required</h3>
                    <p className="text-yellow-700 mb-4">Please log in to create a delivery request</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">New Delivery Request</h1>
                    <p className="text-gray-500 mt-1">Fill in the details below to create a delivery request</p>
                </div>

                {/* User Info Card */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <User size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                                <Phone size={14} />
                                {user.phone || 'No phone'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Mail size={14} />
                                {user.email}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Request Type Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setRequestType('send')}
                        className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                            requestType === 'send'
                                ? 'border-blue-600 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                    >
                        <Package className={`mx-auto mb-3 ${requestType === 'send' ? 'text-blue-600' : 'text-gray-400'}`} size={32} />
                        <p className={`font-semibold text-center ${requestType === 'send' ? 'text-blue-600' : 'text-gray-600'}`}>
                            Send Item
                        </p>
                        <p className="text-xs text-gray-400 text-center mt-1">I pack, you deliver</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setRequestType('buy')}
                        className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                            requestType === 'buy'
                                ? 'border-purple-600 bg-purple-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                    >
                        <ShoppingBag className={`mx-auto mb-3 ${requestType === 'buy' ? 'text-purple-600' : 'text-gray-400'}`} size={32} />
                        <p className={`font-semibold text-center ${requestType === 'buy' ? 'text-purple-600' : 'text-gray-600'}`}>
                            Buy & Deliver
                        </p>
                        <p className="text-xs text-gray-400 text-center mt-1">You buy, you deliver</p>
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                        <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700 flex-1">{error}</p>
                        <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Success Confirmation Modal */}
                {showConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Request Created!</h3>
                            <p className="text-gray-600 mb-4">
                                Your request has been submitted successfully.
                            </p>
                            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 text-left">
                                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <TrendingUp size={14} />
                                    Payment Summary
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Request Type:</span>
                                        <span className="font-medium">{requestType === 'send' ? 'Send Item' : 'Buy & Deliver'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Fee:</span>
                                        <span className="font-medium text-green-600">{formatCurrency(DELIVERY_FEE)}</span>
                                    </div>
                                    {requestType === 'buy' && getItemCost() > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Item Cost:</span>
                                            <span className="font-medium">{formatCurrency(getItemCost())}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="font-semibold">Total Amount:</span>
                                        <span className="font-bold text-green-600 text-lg">{formatCurrency(getSubtotal())}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Redirecting to home...</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Pickup Address */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pickup Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="pickup_address"
                                required
                                value={formData.pickup_address}
                                onChange={handleChange}
                                placeholder="Where to pick up from?"
                                className={`w-full pl-10 pr-32 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base ${
                                    errors.pickup_address ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setUseCurrentLocation(true)}
                                disabled={gettingLocation}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 px-2 py-1 rounded"
                            >
                                {gettingLocation ? (
                                    <Loader size={16} className="animate-spin" />
                                ) : (
                                    <Navigation size={16} />
                                )}
                                <span className="text-xs hidden sm:inline">Use Current</span>
                            </button>
                        </div>
                        {errors.pickup_address && (
                            <p className="text-xs text-red-600 mt-1">{errors.pickup_address}</p>
                        )}
                    </div>

                    {/* Delivery Address */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Delivery Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="delivery_address"
                                required
                                value={formData.delivery_address}
                                onChange={handleChange}
                                placeholder="Where to deliver to?"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base ${
                                    errors.delivery_address ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                        </div>
                        {errors.delivery_address && (
                            <p className="text-xs text-red-600 mt-1">{errors.delivery_address}</p>
                        )}
                    </div>

                    {/* Store Info (Buy type only) */}
                    {requestType === 'buy' && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Store Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="store_name"
                                        value={formData.store_name}
                                        onChange={handleChange}
                                        placeholder="Which store?"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 text-base ${
                                            errors.store_name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.store_name && (
                                    <p className="text-xs text-red-600 mt-1">{errors.store_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Estimated Cost (R)
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        name="item_cost"
                                        step="0.01"
                                        min="0"
                                        value={formData.item_cost}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 text-base ${
                                            errors.item_cost ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.item_cost && (
                                    <p className="text-xs text-red-600 mt-1">{errors.item_cost}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">You'll pay this amount + R15 delivery fee</p>
                            </div>
                        </div>
                    )}

                    {/* Item Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {requestType === 'buy' ? 'Items to Buy' : 'Item Description'} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="item_description"
                            required
                            rows={4}
                            value={formData.item_description}
                            onChange={handleChange}
                            placeholder={requestType === 'buy' 
                                ? "What items? (quantity, brand, size, color)" 
                                : "Describe your item and where to find it"}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base ${
                                errors.item_description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.item_description && (
                            <p className="text-xs text-red-600 mt-1">{errors.item_description}</p>
                        )}
                    </div>

                    {/* Special Instructions */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Special Instructions
                        </label>
                        <div className="relative">
                            <MessageCircle className="absolute left-3 top-3 text-gray-400" size={18} />
                            <textarea
                                name="special_instructions"
                                rows={2}
                                value={formData.special_instructions}
                                onChange={handleChange}
                                placeholder="Gate code, buzzer number, landmark, etc."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                            />
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-5">
                        <h4 className="font-semibold text-base mb-4 flex items-center gap-2">
                            <DollarSign size={18} />
                            Payment Summary
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Delivery Fee:</span>
                                <span className="font-semibold text-green-600 text-lg">{formatCurrency(DELIVERY_FEE)}</span>
                            </div>
                            {requestType === 'buy' && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Item Cost:</span>
                                    <span className="font-semibold text-lg">{getItemCost() > 0 ? formatCurrency(getItemCost()) : 'R0.00'}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                                <span className="font-semibold text-gray-800 text-lg">Total Amount:</span>
                                <span className="font-bold text-green-600 text-2xl">{formatCurrency(getSubtotal())}</span>
                            </div>
                            {requestType === 'buy' && getItemCost() > 0 && (
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-xs text-gray-500">(Item cost + Delivery fee)</span>
                                    <span className="text-xs text-green-600">Includes R15 delivery</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* How it works */}
                    <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
                        <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">How it works:</p>
                            <p>1. You send request → 2. Admin approves → 3. Driver collects → 4. Driver delivers</p>
                            <p className="mt-2 font-bold">Delivery fee: {formatCurrency(DELIVERY_FEE)} flat rate</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader className="animate-spin" size={24} />
                                Creating Request...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Package size={24} />
                                Send Request - {formatCurrency(getSubtotal())}
                            </div>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}