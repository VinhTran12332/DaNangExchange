import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { PaymentGateway } from './pages/PaymentGateway';
import { BlockchainExplorer } from './pages/BlockchainExplorer';
import { DashboardLayout } from './layouts/DashboardLayout';
import { BuyerDashboard } from './pages/BuyerDashboard';
// import { AccessPortal } from './pages/AccessPortal'; // Deprecated
import { SellerDashboard } from './pages/SellerDashboard';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/assets/:id" element={<ProductDetail />} />
                <Route path="/dev/payment-simulation" element={<PaymentGateway />} />
                <Route path="/blockchain" element={<BlockchainExplorer />} />

                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route path="buyer" element={<BuyerDashboard />} />
                    <Route path="seller" element={<SellerDashboard />} />
                </Route>

                {/* Legacy Redirects or Aliases */}
                <Route path="/access" element={<Navigate to="/dashboard/buyer" replace />} />
                <Route path="/seller" element={<Navigate to="/dashboard/seller" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
