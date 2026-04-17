import { Outlet, NavLink } from 'react-router-dom';
import { Home, PlusCircle, Shield, User } from 'lucide-react';

export default function Layout() {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/new', icon: PlusCircle, label: 'Send' },
    { path: '/admin', icon: Shield, label: 'Admin' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛵</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              QuickSend
            </h1>
          </div>
          <div className="text-xs text-gray-500">R15 per delivery</div>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-4 rounded-lg transition ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
                }`
              }
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}