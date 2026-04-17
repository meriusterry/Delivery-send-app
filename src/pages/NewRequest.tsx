import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Store, Package, CreditCard, AlertCircle } from 'lucide-react';
import { RequestType } from '../types';

interface FormData {
  pickupAddress: string;
  deliveryAddress: string;
  itemDescription: string;
  storeName: string;
  itemCost: string;
  specialInstructions: string;
}

export default function NewRequest() {
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState<RequestType>('send');
  const [formData, setFormData] = useState<FormData>({
    pickupAddress: '',
    deliveryAddress: '',
    itemDescription: '',
    storeName: '',
    itemCost: '',
    specialInstructions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Request sent successfully! (Demo)');
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold mb-2">New Request</h2>
      <p className="text-gray-500 text-sm mb-4">What would you like to send?</p>

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
          <Store className={`mx-auto mb-2 ${requestType === 'buy' ? 'text-purple-600' : 'text-gray-400'}`} size={28} />
          <p className={`font-semibold ${requestType === 'buy' ? 'text-purple-600' : 'text-gray-600'}`}>
            Buy & Deliver
          </p>
          <p className="text-xs text-gray-400 mt-1">You buy, you deliver</p>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Pickup Location *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="pickupAddress"
              required
              placeholder="Where to pick up from?"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.pickupAddress}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Delivery Location *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="deliveryAddress"
              required
              placeholder="Where to deliver to?"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.deliveryAddress}
              onChange={handleChange}
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
                  name="storeName"
                  required
                  placeholder="Which store?"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.storeName}
                  onChange={handleChange}
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
                  name="itemCost"
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.itemCost}
                  onChange={handleChange}
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
            name="itemDescription"
            required
            rows={3}
            placeholder={requestType === 'buy' 
              ? "What items? (quantity, brand, size, color)" 
              : "Describe your item and where to find it"}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.itemDescription}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Special Instructions
          </label>
          <textarea
            name="specialInstructions"
            rows={2}
            placeholder="Gate code, buzzer number, landmark, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.specialInstructions}
            onChange={handleChange}
          />
        </div>

        <div className="bg-blue-50 rounded-lg p-3 flex gap-2">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-semibold mb-1">How it works:</p>
            <p>1. You send request → 2. I approve → 3. I collect → 4. I deliver</p>
            <p className="mt-1 font-bold">Delivery fee: R15 flat rate</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition"
        >
          Send Request - R15
        </button>
      </form>
    </div>
  );
}