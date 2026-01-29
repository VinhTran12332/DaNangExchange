import React, { useState } from 'react';
import { API_BASE_URL } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, DollarSign, BarChart3, Plus, ExternalLink, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export const SellerDashboard = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        source_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [myAssets, setMyAssets] = useState([
        { id: 'ast_991', title: 'Consumer Behavior Dataset 2024', price: 1500000, views: 1240, sales: 45, status: 'Active' },
        { id: 'ast_992', title: 'Vietnam Real Estate Trends', price: 2500000, views: 890, sales: 22, status: 'Active' },
        { id: 'ast_993', title: 'Crypto Market Sentiment Analysis', price: 500000, views: 3400, sales: 120, status: 'Trending' },
    ]);

    const stats = [
        { label: 'Total Revenue', value: '45.2M ₫', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { label: 'Total Sales', value: '187', icon: UploadCloud, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Asset Views', value: '5.5K', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Mock API Call
            const res = await fetch(`${API_BASE_URL}/assets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer mock-token'
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseInt(formData.price),
                    metadata: { type: 'external_source' }
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(`✅ Asset Listed Successfully! ID: ${data.asset_id}`);

                // Add to local list for demo
                const newAsset = {
                    id: data.asset_id || 'new_id',
                    title: formData.title,
                    price: parseInt(formData.price),
                    views: 0,
                    sales: 0,
                    status: 'Pending Review'
                };
                setMyAssets([newAsset, ...myAssets]);

                setFormData({ title: '', price: '', description: '', source_url: '' });
                // setTimeout(() => navigate('/'), 2000); // Stay on dashboard
            } else {
                setMessage(`❌ Error: ${data.error}`);
            }

        } catch (error) {
            setMessage(`❌ Network Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Seller Portal</h1>
                <p className="text-text-muted">Monetize your high-value data assets.</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-bg-card border border-border-subtle p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-text-muted font-medium text-sm">{stat.label}</span>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Upload Form - 2/3 Width */}
                <div className="lg:col-span-2 bg-bg-card border border-border-subtle rounded-2xl p-8 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" /> Create New Asset Listing
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Asset Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-bg-main border border-border-subtle rounded-lg p-3 text-white focus:border-primary outline-none"
                                    placeholder="e.g. Q4 Financial Report 2025"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Price (VND)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-bg-main border border-border-subtle rounded-lg p-3 text-white focus:border-primary outline-none"
                                    placeholder="500000"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-accent-blue mb-2 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" /> Data Source Link
                            </label>
                            <input
                                type="url"
                                required
                                className="w-full bg-bg-main border border-accent-blue/30 rounded-lg p-3 text-white focus:border-accent-blue outline-none placeholder:text-text-subtle"
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                value={formData.source_url}
                                onChange={e => setFormData({ ...formData, source_url: e.target.value })}
                            />
                            <p className="text-xs text-text-subtle mt-2 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-primary" />
                                Secure Broker: We fetch data from this link. Buyers never see the direct URL.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Description</label>
                            <textarea
                                className="w-full bg-bg-main border border-border-subtle rounded-lg p-3 text-white focus:border-primary outline-none h-32 resize-none"
                                placeholder="Describe the quality and source of your data..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-bg-main p-4 rounded-lg font-bold text-lg transition-all shadow-glow flex justify-center items-center gap-2"
                        >
                            {loading ? 'Registering...' : '🚀 Publish Asset to Market'}
                        </button>

                        {message && (
                            <div className={`p-4 rounded-lg border text-center font-bold text-sm ${message.startsWith('✅') ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>

                {/* Recent Assets - 1/3 Width */}
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-lg h-fit">
                    <h2 className="text-lg font-bold text-white mb-4">Your Active Assets</h2>
                    <div className="space-y-4">
                        {myAssets.map((asset) => (
                            <div key={asset.id} className="bg-bg-main border border-border-subtle p-4 rounded-xl hover:border-primary/30 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">{asset.title}</div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${asset.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                        {asset.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end text-xs text-text-muted">
                                    <div className="flex gap-3">
                                        <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {asset.views}</span>
                                        <span className="flex items-center gap-1"><UploadCloud className="w-3 h-3" /> {asset.sales}</span>
                                    </div>
                                    <div className="font-bold text-white">{new Intl.NumberFormat('vi-VN').format(asset.price)} ₫</div>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 text-sm text-text-muted hover:text-white border border-dashed border-border-subtle rounded-lg hover:bg-white/5 transition-all">
                            View All Assets
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
