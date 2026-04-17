import { Outlet, NavLink } from 'react-router-dom';
import { Home, PlusCircle, Shield, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/new', icon: PlusCircle, label: 'Send' },
    { path: '/admin', icon: Shield, label: 'Admin' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="px-4 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛵</span>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                QuickSend
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">Fast & Reliable Delivery</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 text-base ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          
          <div className="text-sm text-gray-500 hidden md:block font-medium">R15 per delivery</div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-white border-t shadow-lg animate-slide-up">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-4 transition-colors text-base ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon size={22} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (only on mobile) */}
      {isMobile && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="flex justify-around py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                    isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
                  }`
                }
              >
                <item.icon size={24} />
                <span className="text-sm mt-1.5 font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}

      {/* Footer (desktop only) */}
      <footer className="hidden md:block bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 QuickSend. All rights reserved.</p>
            <p className="mt-1.5 text-sm">R15 flat rate delivery fee in South Africa</p>
          </div>
        </div>
      </footer>
    </div>
  );
}