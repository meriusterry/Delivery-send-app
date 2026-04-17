import { User, Mail, Phone, MapPin, CreditCard, Calendar, Package, Award } from 'lucide-react';
import { mockUser, mockStats } from '../mockData';

export default function Profile() {
  return (
    <div className="p-4 pb-20">
      <div className="card p-6 text-center mb-4">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
          <User size={40} className="text-white" />
        </div>
        <h2 className="text-xl font-bold">{mockUser.name}</h2>
        <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
          <Calendar size={12} />
          Member since {mockUser.joinDate}
        </p>
        
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{mockStats.totalDeliveries}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Package size={10} />
              Deliveries
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">R{mockStats.totalSpent}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Award size={10} />
              Total Spent
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <User size={18} />
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-gray-400" />
            <span>{mockUser.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-gray-400" />
            <span>{mockUser.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={16} className="text-gray-400" />
            <span>{mockUser.address}</span>
          </div>
        </div>
      </div>

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
                <p className="text-sm font-medium">Visa •••• 4242</p>
                <p className="text-xs text-gray-500">Expires 12/26</p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Default</span>
          </div>
          <button className="text-blue-600 text-sm w-full text-center py-2 hover:underline">
            + Add Payment Method
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left py-2 px-3 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            📞 Contact Support
          </button>
          <button className="w-full text-left py-2 px-3 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            📝 View Terms & Conditions
          </button>
          <button className="w-full text-left py-2 px-3 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}