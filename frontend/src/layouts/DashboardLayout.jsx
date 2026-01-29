import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { Header } from '../components/layout/Header'; // Re-use Header or keep distinct? 
// For Dashboard, we usually want a different header or simplified one.
// Let's use a simplified header or just the sidebar.
// Actually, let's keep it simple: Sidebar + Content Area. 
// Maybe a mobile header if needed.

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-bg-main text-text-main flex font-sans selection:bg-primary/20">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header placeholder could go here */}
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
