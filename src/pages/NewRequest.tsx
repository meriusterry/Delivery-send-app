import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Store, Package, ShoppingBag, CreditCard, AlertCircle, Loader } from 'lucide-react';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

type RequestType = 'send' | 'buy';

export default function NewRequest() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [requestType, setRequestType] = useState<RequestType>('send');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        pickup_address: '',
        delivery_address: '',
        item_description: '',
        store_name: '',
        item_cost: '',
        special_instructions: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const requestData = {
                type: requestType,
                pickup_address: formData.pickup_address,
                delivery_address: formData.delivery_address,
                item_description: formData.item_description,
                store_name: formData.store_name || undefined,
                item_cost: formData.item_cost ? parseFloat(formData.item_cost) : undefined,
                special_instructions: formData.special_instructions || undefined
            };

            await requestService.createRequest(requestData);
            alert('Request created successfully!');
            navigate('/');
        } catch (err: any) {
            console.error('Error creating request:', err);
            setError(err.response?.data?.message || 'Failed to create request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 pb-20">
            <h2 className="text-2xl font-bold mb-2">New Request</h2>
            <p className="text-gray-500 text-sm mb-4">What would you like to send?</p>

            {/* Request Type Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => setRequestType('send')}
                    className={`p-4 rounded-xl border-2 transition ${
                        requestType === 'send'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <Package className={`mx-auto mb-2 ${requestType === 'send' ? 'text-blue-600' : 'text-gray-400'}`} size={28} />
                    <p className={`font-semibold ${requestType === 'send' ? 'text-blue-600' : 'text-gray-600'}`}>
                        Send Item
                    </p>
                    <p className="text-xs text-gray-400 mt-1">I pack, you deliver</p>
                </button>

                <button
                    type="button"
                    onClick={() => setRequestType('buy')}
                    className={`p-4 rounded-xl border-2 transition ${
                        requestType === 'buy'
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <ShoppingBag className={`mx-auto mb-2 ${requestType === 'buy' ? 'text-purple-600' : 'text-gray-400'}`} size={28} />
                    <p className={`font-semibold ${requestType === 'buy' ? 'text-purple-600' : 'text-gray-600'}`}>
                        Buy & Deliver
                    </p>
                    <p className="text-xs text-gray-400 mt-1">You buy, you deliver</p>
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Pickup Address *
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
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Delivery Address *
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
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>
                </div>

                {requestType === 'buy' && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Store Name *
                            </label>
                            <div className="relative">
                                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="store_name"
                                    value={formData.store_name}
                                    onChange={handleChange}
                                    placeholder="Which store?"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-base"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Estimated Cost (R)
                            </label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    name="item_cost"
                                    step="0.01"
                                    value={formData.item_cost}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-base"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">You'll pay this amount + R15 delivery fee</p>
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {requestType === 'buy' ? 'Items to Buy *' : 'Item Description *'}
                    </label>
                    <textarea
                        name="item_description"
                        required
                        rows={3}
                        value={formData.item_description}
                        onChange={handleChange}
                        placeholder={requestType === 'buy' 
                            ? "What items? (quantity, brand, size, color)" 
                            : "Describe your item and where to find it"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Special Instructions
                    </label>
                    <textarea
                        name="special_instructions"
                        rows={2}
                        value={formData.special_instructions}
                        onChange={handleChange}
                        placeholder="Gate code, buzzer number, landmark, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                    />
                </div>

                <div className="bg-blue-50 rounded-lg p-3 flex gap-2">
                    <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">How it works:</p>
                        <p>1. You send request → 2. Admin approves → 3. Driver collects → 4. Driver delivers</p>
                        <p className="mt-1 font-bold">Delivery fee: R15 flat rate</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader className="animate-spin" size={20} />
                            Creating Request...
                        </div>
                    ) : (
                        `Send Request - R15`
                    )}
                </button>
            </form>
        </div>
    );
}