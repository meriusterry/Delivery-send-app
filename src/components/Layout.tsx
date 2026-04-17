import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Shield, User, Menu, X, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
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
        { path: '/new', icon: PlusCircle, label: 'Send', role: 'all' },
        { path: '/admin', icon: Shield, label: 'Admin', role: 'admin' },
       
    ];

    // Filter nav items based on user role
    const filteredNavItems = navItems.filter(item => 
        item.role === 'all' || (item.role === 'admin' && user?.role === 'admin')
    );

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
                        {filteredNavItems.map((item) => (
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

                    {/* Desktop User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        
                        {user && (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-gray-100">
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
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <User size={16} />
                                            <span>My Profile</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                navigate('/profile#settings');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMobileMenuOpen && (
                    <nav className="md:hidden bg-white border-t shadow-lg animate-slide-up">
                        {filteredNavItems.map((item) => (
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
                        
                        {/* Mobile User Info & Logout */}
                        {user && (
                            <>
                                <div className="border-t border-gray-100 my-2"></div>
                                <div className="px-4 py-3 bg-gray-50">
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
                                        navigate('/profile#settings');
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
                        {filteredNavItems.map((item) => (
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