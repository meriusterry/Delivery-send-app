import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Shield, User, Menu, X, LogOut, Settings, ChevronDown, Package, ShoppingBag, Phone, Mail, HelpCircle, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: Home, label: 'Home', role: 'all' },
        { path: '/new', icon: PlusCircle, label: 'New Request', role: 'all' },
        { path: '/admin', icon: Shield, label: 'Admin Panel', role: 'admin' },
        { path: '/profile', icon: User, label: 'Profile', role: 'all' },
    ];

    const filteredNavItems = navItems.filter(item => 
        item.role === 'all' || (item.role === 'admin' && user?.role === 'admin')
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
                <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center max-w-7xl mx-auto">
                    {/* Logo */}
                    <div 
                        className="flex items-center gap-3 cursor-pointer group" 
                        onClick={() => navigate('/')}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                            <span className="text-2xl">🛵</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                QuickSend
                            </h1>
                            <p className="text-xs text-gray-500 hidden lg:block">Fast & Reliable Delivery</p>
                        </div>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {filteredNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 text-base ${
                                        isActive 
                                            ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 font-semibold shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Desktop User Menu */}
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="text-sm text-gray-600 font-medium bg-gradient-to-r from-blue-50 to-green-50 px-4 py-1.5 rounded-full shadow-sm">
                            🚚 R15 per delivery
                        </div>
                        
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-white text-sm font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-left hidden xl:block">
                                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50 rounded-t-xl">
                                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                            {user.phone && (
                                                <p className="text-xs text-gray-500 mt-1">{user.phone}</p>
                                            )}
                                        </div>
                                        
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                navigate('/profile');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <User size={16} />
                                            <span>My Profile</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                navigate('/settings');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Settings size={16} />
                                            <span>Settings</span>
                                        </button>
                                        
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:opacity-90 transition"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMobileMenuOpen && (
                    <nav className="lg:hidden bg-white border-t shadow-lg animate-slide-up">
                        {filteredNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-4 transition-colors text-base ${
                                        isActive 
                                            ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 border-l-4 border-blue-600 font-semibold' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`
                                }
                            >
                                <item.icon size={22} />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                        
                        {user && (
                            <>
                                <div className="border-t border-gray-100 my-2"></div>
                                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-green-50">
                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/profile');
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full"
                                >
                                    <User size={18} />
                                    <span>My Profile</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/settings');
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full"
                                >
                                    <Settings size={18} />
                                    <span>Settings</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full border-t border-gray-100"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}
                        
                        {!user && (
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    navigate('/login');
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 w-full"
                            >
                                <LogOut size={18} />
                                <span>Login</span>
                            </button>
                        )}
                    </nav>
                )}
            </header>

            {/* Main Content - Full width */}
            <main className="flex-1 w-full">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                                    <span className="text-lg">🛵</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">QuickSend</h3>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Fast, reliable delivery service in South Africa. R15 flat rate per delivery.
                            </p>
                        </div>
                        
                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
                            <ul className="space-y-2">
                                <li>
                                    <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-blue-600 transition">
                                        Home
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate('/new')} className="text-sm text-gray-500 hover:text-blue-600 transition">
                                        New Request
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate('/profile')} className="text-sm text-gray-500 hover:text-blue-600 transition">
                                        My Profile
                                    </button>
                                </li>
                                {user?.role === 'admin' && (
                                    <li>
                                        <button onClick={() => navigate('/admin')} className="text-sm text-gray-500 hover:text-blue-600 transition">
                                            Admin Panel
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                        
                        {/* Contact Info */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Contact Us</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-gray-500">
                                    <Mail size={14} />
                                    <span>support@quicksend.co.za</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-500">
                                    <Phone size={14} />
                                    <span>+27 71 234 5678</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-500">
                                    <HelpCircle size={14} />
                                    <span>Mon-Fri: 8am-6pm</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Delivery Info */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Delivery Info</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-gray-500">
                                    <Package size={14} />
                                    <span>R15 flat rate per delivery</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-500">
                                    <ShoppingBag size={14} />
                                    <span>Buy & deliver service available</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-500">
                                    <Info size={14} />
                                    <span>Track your delivery in real-time</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                        <p className="text-xs text-gray-400">
                            © 2024 QuickSend. All rights reserved. | R15 flat rate delivery fee in South Africa | 
                            <a href="#" className="hover:text-blue-600 ml-1">Terms & Conditions</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}