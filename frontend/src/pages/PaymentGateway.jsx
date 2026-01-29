import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Server, Zap, Lock } from 'lucide-react';

export const PaymentGateway = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [status, setStatus] = useState('SUCCESS');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    const fetchPendingOrders = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/payment/pending`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to load pending orders", error);
        }
    };

    const handleSimulate = async (orderId) => {
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/payment/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: orderId,
                    amount: 100000,
                    status: 'SUCCESS',
                    signature: 'mock_secure_signature'
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ Paid Order ${orderId.slice(0, 8)}...`);
                fetchPendingOrders(); // Refresh list
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
        <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-primary/20 p-8 flex items-center justify-center">
            <div className="max-w-5xl w-full">
                <header className="flex justify-between items-center mb-10 border-b border-border-subtle pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">UGDES Secure Gateway</h1>
                            <p className="text-text-muted text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Hyperledger Fabric Node: Connected
                            </p>
                        </div>
                    </div>
                    <button onClick={fetchPendingOrders} className="text-sm bg-bg-card border border-border-subtle hover:border-primary text-text-muted hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <RefreshCw className="w-4 h-4" /> Refresh Ledger
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Pending Transactions */}
                    <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-border-subtle bg-bg-main/50 flex justify-between items-center">
                            <h2 className="font-bold text-white flex items-center gap-2">
                                <Server className="w-5 h-5 text-accent-blue" /> Pending Transactions
                            </h2>
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-mono font-bold">{orders.length}</span>
                        </div>

                        <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                            {orders.length === 0 ? (
                                <div className="text-center py-12 text-text-muted border border-dashed border-border-subtle rounded-xl">
                                    <ShieldCheck className="w-12 h-12 text-border-subtle mx-auto mb-3" />
                                    No pending transactions. Ledger is synced.
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="bg-bg-main border border-border-subtle p-4 rounded-xl flex justify-between items-center group hover:border-primary/50 transition-all">
                                        <div>
                                            <p className="font-mono text-primary text-xs mb-1">ID: {order.id}</p>
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="text-white font-bold">{new Intl.NumberFormat('vi-VN').format(order.amount || 100000)} ₫</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${order.status === 'LOCKED' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSimulate(order.id)}
                                            disabled={loading}
                                            className="bg-primary hover:bg-primary-hover text-bg-main px-4 py-2 rounded-lg text-xs font-bold shadow-glow opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
                                        >
                                            Approve <Zap className="w-3 h-3 inline ml-1" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Manual Override */}
                    <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 h-fit">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            Manual Settlement
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Transaction Hash / Order ID</label>
                                <input
                                    type="text"
                                    value={selectedOrderId}
                                    onChange={(e) => setSelectedOrderId(e.target.value)}
                                    placeholder="e.g. ord_123456789..."
                                    className="w-full bg-bg-main border border-border-subtle rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                                />
                            </div>
                            <button
                                onClick={() => handleSimulate(selectedOrderId)}
                                disabled={loading || !selectedOrderId}
                                className="w-full bg-bg-main hover:bg-bg-hover border border-border-subtle hover:border-primary text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Processing...' : 'Force Settle Transaction'}
                            </button>
                        </div>

                        {message && (
                            <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 text-sm ${message.startsWith('✅') ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                                {message.startsWith('✅') ? <ShieldCheck className="w-5 h-5 shrink-0" /> : <Lock className="w-5 h-5 shrink-0" />}
                                {message}
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-border-subtle text-xs text-text-subtle text-center">
                            Only use this dashboard for development and testing purposes. <br />
                            All actions are recorded in the immutable audit log.
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
