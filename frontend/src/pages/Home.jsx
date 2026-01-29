
import { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../features/catalog/components/ProductCard';
import { fetchAssets } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Home = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchAssets();
                const formattedData = data.map(item => ({
                    ...item,
                    price: `${new Intl.NumberFormat('vi-VN').format(item.price)} ${item.currency || '₫'}`,
                    verified: true
                }));
                // If no real data, seed some dummy data for UI Polish
                if (formattedData.length === 0) {
                    setAssets([
                        { id: '1', title: 'Vietnam Financial Market Report Q4', price: '5,000,000 ₫', seller: 'FiinGroup', verified: true, type: 'XLSX' },
                        { id: '2', title: 'Healthcare Statistics 2025', price: '2,500,000 ₫', seller: 'MOH', verified: true, type: 'JSON' },
                        { id: '3', title: 'Real Estate Transaction Data (Hanoi)', price: '12,000,000 ₫', seller: 'Batdongsan', verified: true, type: 'CSV' },
                    ]);
                } else {
                    setAssets(formattedData);
                }
            } catch (err) {
                console.error(err);
                // Fallback dummy data
                setAssets([
                    { id: '1', title: 'Vietnam Financial Market Report Q4', price: '5,000,000 ₫', seller: 'FiinGroup', verified: true, type: 'XLSX' },
                    { id: '2', title: 'Healthcare Statistics 2025', price: '2,500,000 ₫', seller: 'MOH', verified: true, type: 'JSON' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-primary/20">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="container mx-auto text-center relative z-10 max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-card border border-border-subtle text-xs font-semibold text-primary mb-6 animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Live Enterprise Network
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-text-main to-text-muted bg-clip-text text-transparent">
                            The Standard for <br />
                            <span className="bg-gradient-to-r from-primary to-accent-blue bg-clip-text text-transparent">Trusted Data Exchange</span>
                        </h1>

                        <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                            Buy and sell high-value datasets with verified origin, watermark protection, and blockchain audit trails.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                variant="primary"
                                className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-bg-main font-bold shadow-glow"
                            >
                                Explore Marketplace
                            </Button>
                            <Link to="/access">
                                <Button
                                    variant="outline"
                                    className="h-12 px-8 text-base border-border-subtle hover:bg-bg-card text-text-main group"
                                >
                                    Unlock Data Features
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        {/* Stats / Trust Badges */}
                        <div className="mt-16 pt-8 border-t border-border-subtle/30 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center">
                                <ShieldCheck className="w-8 h-8 text-primary mb-2" />
                                <h3 className="font-bold text-white">Verified Identity</h3>
                                <p className="text-sm text-text-muted">VNeID Integration</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Zap className="w-8 h-8 text-accent-gold mb-2" />
                                <h3 className="font-bold text-white">Instant Settlement</h3>
                                <p className="text-sm text-text-muted">Smart Contract Escrow</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Globe className="w-8 h-8 text-accent-blue mb-2" />
                                <h3 className="font-bold text-white">Global Standard</h3>
                                <p className="text-sm text-text-muted">UGDES Compliant</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Grid */}
                <section className="py-20 bg-bg-main/50 border-t border-border-subtle">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Featured Data Assets</h2>
                                <p className="text-text-muted">Curated high-value datasets from top providers.</p>
                            </div>
                            <Link to="/access" className="text-primary hover:text-primary-hover font-semibold flex items-center gap-1">
                                View all <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-text-muted">Syncing with Ledger...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {assets.map((item, idx) => (
                                    <ProductCard key={item.id || idx} {...item} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};
