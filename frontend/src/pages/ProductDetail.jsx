import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PaymentModal } from '../components/checkout/PaymentModal';
import { fetchAssetById, createOrder, simulatePayment } from '../services/api'; // Import simulatePayment
import { ArrowLeft, ShieldCheck, Download, Activity, FileJson, Layers, Clock, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const loadAsset = async () => {
            setLoading(true);
            try {
                const data = await fetchAssetById(id);
                if (!data) return; // Handle 404 in render
                data.formattedPrice = new Intl.NumberFormat('vi-VN').format(data.price);
                setAsset(data);
                setTotalPrice(data.price);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadAsset();
    }, [id]);

    useEffect(() => {
        if (asset) {
            setTotalPrice(asset.price * quantity);
        }
    }, [quantity, asset]);

    const handleCheckoutSuccess = async () => {
        // 1. Create Order
        const orderResult = await createOrder(asset.id, quantity);
        console.log("Order Created:", orderResult);

        // 2. Simulate Payment (Auto-pay for MVP)
        // In real app, this happens via Payment Gateway Webhook
        await simulatePayment(orderResult.order_id);
        console.log("Payment Confirmed");

        // 3. Navigate after delay
        setTimeout(() => {
            navigate('/dashboard/buyer');
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-main text-text-main flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Activity className="w-10 h-10 text-primary animate-pulse" />
                    <div className="text-xl font-bold animate-pulse text-primary">Accessing Secure Vault...</div>
                </div>
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="min-h-screen bg-bg-main text-text-main flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-red-500">Asset Not Found</h2>
                <Link to="/" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft className="w-5 h-5" /> Back to Market
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-primary/20 flex flex-col">
            <Header />

            <main className="flex-1 py-8 container mx-auto px-6 max-w-7xl">
                {/* Breadcrumb / Back */}
                <div className="mb-6 flex justify-between items-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
                    </Link>
                    <div className="text-xs text-text-muted font-mono">
                        Asset ID: <span className="text-text-main">{asset.id}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Visuals & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Info */}
                        <div>
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Source
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-bg-card border border-border-subtle text-text-muted px-3 py-1 rounded-full text-xs font-semibold">
                                    <Layers className="w-3.5 h-3.5" /> {asset.file_type || 'JSON/XLSX'}
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-bg-card border border-border-subtle text-text-muted px-3 py-1 rounded-full text-xs font-semibold">
                                    <Clock className="w-3.5 h-3.5" /> Real-time
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                {asset.title}
                            </h1>

                            <p className="text-lg text-text-muted leading-relaxed">
                                {asset.description || "High-frequency market data aggregated from top financial institutions. Suitable for algorithmic trading and market analysis."}
                            </p>
                        </div>

                        {/* Visual Preview */}
                        <div className="aspect-video bg-bg-card border border-border-subtle rounded-2xl overflow-hidden relative shadow-2xl group">
                            {asset.preview_url ? (
                                <div className="absolute inset-0">
                                    <img
                                        src={asset.preview_url}
                                        alt={asset.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent opacity-60"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-bg-card to-bg-main"></div>
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center group-hover:scale-105 transition-transform duration-500">
                                            <Activity className="w-20 h-20 text-primary mx-auto mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                            <p className="text-primary font-mono text-sm tracking-widest uppercase">Live Data Stream</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Tabs */}
                        <div>
                            <div className="flex border-b border-border-subtle mb-6">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`pb-4 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'description' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'}`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('technical')}
                                    className={`pb-4 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'technical' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'}`}
                                >
                                    Technical Specs
                                </button>
                                <button
                                    onClick={() => setActiveTab('license')}
                                    className={`pb-4 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'license' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'}`}
                                >
                                    License & Usage
                                </button>
                            </div>

                            <div className="min-h-[200px] text-text-muted leading-relaxed">
                                {activeTab === 'description' && (
                                    <div className="space-y-4">
                                        <p>This dataset provides comprehensive insights into market trends. Data is collected via secure API endpoints and validated through our rigorous verification process.</p>
                                        <ul className="list-disc list-inside space-y-2 marker:text-primary">
                                            <li>Updated every 15 minutes</li>
                                            <li>Includes historical data back to 2020</li>
                                            <li>Cleaned and normalized for immediate use</li>
                                        </ul>
                                    </div>
                                )}
                                {activeTab === 'technical' && (
                                    <div className="bg-bg-card p-6 rounded-xl border border-border-subtle font-mono text-sm">
                                        <h4 className="text-white font-bold mb-4 flex items-center gap-2"><FileJson className="w-4 h-4" /> Metadata Schema</h4>
                                        <pre className="text-xs text-text-subtle overflow-x-auto">
                                            {JSON.stringify(asset.metadata, null, 2)}
                                        </pre>
                                    </div>
                                )}
                                {activeTab === 'license' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                            <h4 className="text-primary font-bold mb-2">Enterprise License</h4>
                                            <p className="text-sm">Grants usage rights for internal analysis and commercial application. Redistribution of raw data is prohibited.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Action Card */}
                    <div>
                        <div className="sticky top-24 bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border-subtle">
                                <span className="text-text-muted">Price</span>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-white tracking-tight">
                                        {new Intl.NumberFormat('vi-VN').format(totalPrice)} <span className="text-lg text-text-muted">{asset.currency || '₫'}</span>
                                    </div>
                                    <div className="text-xs text-primary font-medium mt-1">
                                        Lowest price guaranteed
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-text-subtle text-xs font-bold uppercase tracking-wider mb-3">License Seats (Quantity)</label>
                                    <div className="flex items-center gap-4 bg-bg-main p-1.5 rounded-lg border border-border-subtle">
                                        <button
                                            className="w-10 h-10 rounded bg-bg-card hover:bg-bg-hover flex items-center justify-center font-bold text-lg transition-colors border-r border-border-subtle"
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        >
                                            -
                                        </button>
                                        <div className="flex-1 text-center font-mono font-bold text-lg text-white">
                                            {quantity}
                                        </div>
                                        <button
                                            className="w-10 h-10 rounded bg-bg-card hover:bg-bg-hover flex items-center justify-center font-bold text-lg transition-colors border-l border-border-subtle"
                                            onClick={() => setQuantity(q => q + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-bg-main shadow-glow transition-all active:scale-[0.98]"
                                >
                                    Buy Now
                                </Button>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-3 text-xs text-text-muted">
                                        <Globe className="w-4 h-4 text-accent-blue" />
                                        <span>Instant Global Access</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-text-muted">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        <span>Watermarked & Protected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                asset={asset}
                quantity={quantity}
                total={totalPrice}
                onConfirm={handleCheckoutSuccess}
            />
        </div>
    );
};
