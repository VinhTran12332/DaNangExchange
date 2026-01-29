import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';
import { Search, Download, Key, Package, FileJson, FileSpreadsheet, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const BuyerDashboard = () => {
    const [orderId, setOrderId] = useState('');
    const [accessInfo, setAccessInfo] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [downloadMsg, setDownloadMsg] = useState('');
    const [myLibrary, setMyLibrary] = useState([]);

    useEffect(() => {
        // Load mock library from localStorage or mock data
        const savedLibrary = JSON.parse(localStorage.getItem('my_assets') || '[]');
        if (savedLibrary.length === 0) {
            // Initial Mock Data for demo
            setMyLibrary([
                { id: 'ast_123', title: 'Q3 Financial Report 2024', type: 'excel', size: '2.4MB', purchased_at: '2024-10-15', status: 'Ready' },
                { id: 'ast_456', title: 'Global Market Access API', type: 'api', size: '-', purchased_at: '2024-11-02', status: 'Active' },
            ]);
        } else {
            setMyLibrary(savedLibrary);
        }
    }, []);

    const fetchAccess = async () => {
        if (!orderId.trim()) return;
        setLoading(true);
        setError('');
        setAccessInfo(null);
        try {
            const res = await fetch(`${API_BASE_URL}/orders/${orderId.trim()}/access`);
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to fetch access info');
            }
            const data = await res.json();
            setAccessInfo(data);

            // Add to library if not exists (Mock logic)
            // In real app, this happens on order confirmation
            // const newItem = { id: data.asset_id, title: `Asset #${data.asset_id.slice(0,5)}`, type: 'json', size: 'Dynamic', purchased_at: new Date().toISOString().split('T')[0], status: 'Ready' };
            // setMyLibrary(prev => [...prev, newItem]);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadData = async () => {
        if (!accessInfo) return;
        setDownloadMsg('Downloading...');
        try {
            const res = await fetch(`${(API_BASE_URL).replace('/api', '')}${accessInfo.asset_link}`, {
                headers: {
                    'x-api-key': accessInfo.api_key
                }
            });

            if (res.status === 403) {
                setDownloadMsg('❌ Quota Exceeded!');
                return;
            }

            if (!res.ok) throw new Error('Download failed');
            const contentType = res.headers.get('content-type');

            if (contentType.includes('spreadsheet') || contentType.includes('excel') || contentType.includes('octet-stream')) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `watermarked_data_${orderId}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                setDownloadMsg('✅ Excel File Downloaded!');
            } else {
                const result = await res.json();
                const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `watermarked_data_${orderId}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                setDownloadMsg(`✅ JSON Data Retrieved! Quota: ${result.quota_status?.remaining ?? '-'}`);
                if (result.quota_status) {
                    setAccessInfo(prev => ({ ...prev, remaining_quota: result.quota_status.remaining }));
                }
            }

        } catch (err) {
            setDownloadMsg('❌ Error: ' + err.message);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Buyer Portal</h1>
                <p className="text-text-muted">Manage your purchased assets and access keys.</p>
            </header>

            {/* Unlock Section */}
            <section className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" /> Unlock Asset Access
                </h2>
                <div className="max-w-xl">
                    <label className="block text-sm font-medium text-text-muted mb-2">Enter Order ID</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="e.g. ord_123..."
                            className="flex-1 bg-bg-main border border-border-subtle rounded-lg p-3 text-white focus:border-primary outline-none font-mono text-sm"
                        />
                        <button
                            onClick={fetchAccess}
                            disabled={loading || !orderId}
                            className="bg-primary hover:bg-primary-hover text-bg-main px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Unlock'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                )}

                {accessInfo && (
                    <div className="mt-6 p-6 rounded-xl bg-bg-main border border-border-subtle animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Key className="w-32 h-32 text-primary" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div>
                                <div className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-1">Secure API Key</div>
                                <code className="block bg-bg-card p-3 rounded border border-border-subtle text-primary font-mono break-all hover:bg-bg-card/80 transition-colors cursor-pointer" title="Click to copy">
                                    {accessInfo.api_key}
                                </code>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-1">Downloads Remaining</div>
                                <div className="text-2xl font-bold text-white">{accessInfo.remaining_quota}</div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
                            <button
                                onClick={downloadData}
                                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all"
                            >
                                <Download className="w-5 h-5" /> Download Secure Package
                            </button>
                            {downloadMsg && (
                                <span className={`text-sm font-bold ${downloadMsg.includes('❌') ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {downloadMsg}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* My Library Section */}
            <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent-blue" /> My Library
                </h2>

                <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-subtle bg-bg-main/50">
                                    <th className="p-4 font-bold text-text-muted text-sm">Asset Name</th>
                                    <th className="p-4 font-bold text-text-muted text-sm">Type</th>
                                    <th className="p-4 font-bold text-text-muted text-sm">Size</th>
                                    <th className="p-4 font-bold text-text-muted text-sm">Purchased</th>
                                    <th className="p-4 font-bold text-text-muted text-sm">Status</th>
                                    <th className="p-4 font-bold text-text-muted text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myLibrary.map((item) => (
                                    <tr key={item.id} className="border-b border-border-subtle hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{item.title}</td>
                                        <td className="p-4">
                                            {item.type === 'excel' ? (
                                                <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded w-fit">
                                                    <FileSpreadsheet className="w-3 h-3" /> EXCEL
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-1 rounded w-fit">
                                                    <FileJson className="w-3 h-3" /> JSON
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-text-muted text-sm">{item.size}</td>
                                        <td className="p-4 text-text-muted text-sm flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> {item.purchased_at}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded flex items-center gap-1 w-fit">
                                                <CheckCircle2 className="w-3 h-3" /> {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-text-muted hover:text-white p-2 rounded hover:bg-white/10 transition-colors" title="View Details">
                                                <Search className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};
