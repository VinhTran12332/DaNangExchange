import { LayoutGrid, BarChart3, Database, ShieldCheck, Settings, ShoppingBag } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active }) => (
    <div className={`
        flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all
        ${active ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-text-muted hover:text-text-main hover:bg-bg-hover'}
    `}>
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{label}</span>
    </div>
);

export const Sidebar = () => {
    return (
        <aside className="w-64 border-r border-border-subtle h-[calc(100vh-64px)] p-4 hidden md:flex flex-col gap-6 sticky top-16">
            <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase mb-3 px-3">Marketplace</h3>
                <div className="space-y-1">
                    <NavItem icon={LayoutGrid} label="Discover" active={true} />
                    <NavItem icon={BarChart3} label="Market Trends" />
                    <NavItem icon={ShoppingBag} label="My Orders" />
                </div>
            </div>

            <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase mb-3 px-3">Categories</h3>
                <div className="space-y-1">
                    <NavItem icon={Database} label="Finance & Crypto" />
                    <NavItem icon={Database} label="Transportation" />
                    <NavItem icon={Database} label="Healthcare" />
                </div>
            </div>

            <div className="mt-auto">
                <NavItem icon={ShieldCheck} label="Verification Center" />
                <NavItem icon={Settings} label="Settings" />
            </div>
        </aside>
    );
};
