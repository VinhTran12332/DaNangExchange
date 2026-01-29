import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, PlusCircle, Settings, LogOut, Home } from 'lucide-react';

export const DashboardSidebar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: ShoppingBag, label: 'Buyer Portal', path: '/dashboard/buyer' },
        { icon: PlusCircle, label: 'Seller Portal', path: '/dashboard/seller' },
        // { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <aside className="w-64 bg-bg-card border-r border-border-subtle h-screen sticky top-0 flex flex-col hidden lg:flex">
            <div className="p-6 border-b border-border-subtle flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-bg-main" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white">Dashboard</span>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${isActive(item.path)
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow'
                                : 'text-text-muted hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-primary' : 'text-text-subtle group-hover:text-white'}`} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-border-subtle">
                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-all">
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Back to Home</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all mt-2">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};
