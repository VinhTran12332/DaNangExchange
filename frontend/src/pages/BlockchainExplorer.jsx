import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

export const BlockchainExplorer = () => {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBlocks();
        // Auto-refresh every 5 seconds
        const interval = setInterval(fetchBlocks, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchBlocks = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/hyperledger/blocks/latest`);
            if (res.ok) {
                const data = await res.json();
                setBlocks(data);
            }
        } catch (error) {
            console.error("Failed to load blockchain data", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-3">
                        ⛓️ Hyperledger Mock Explorer
                    </h1>
                    <div className="text-sm text-slate-400">
                        Network: <span className="text-emerald-400 font-mono">Viettel-Private-PoC</span>
                    </div>
                </header>

                <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-xl overflow-hidden">
                    <div className="p-4 bg-slate-700/50 border-b border-slate-700 font-bold flex justify-between">
                        <span>Latest Transactions (Mock Ledger)</span>
                        <button onClick={fetchBlocks} className="text-xs bg-slate-600 px-2 py-1 rounded hover:bg-slate-500">Refresh</button>
                    </div>

                    <div className="divide-y divide-slate-700">
                        {blocks.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No transactions found in ledger.</div>
                        ) : (
                            blocks.map((block) => (
                                <div key={block.id} className="p-4 hover:bg-slate-700/30 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded font-mono">
                                                BLK #{block.block_number}
                                            </span>
                                            <span className={`font-bold text-sm ${block.action_type === 'LOCK_ASSET' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                                {block.action_type}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">{new Date(block.timestamp).toLocaleString()}</span>
                                    </div>

                                    <div className="grid grid-cols-12 gap-4 text-xs font-mono text-slate-400">
                                        <div className="col-span-12 md:col-span-8 truncate">
                                            <span className="text-slate-500">TxID:</span> <span className="text-white selection:bg-blue-500">{block.id}</span>
                                        </div>
                                        <div className="col-span-12 md:col-span-4 truncate">
                                            <span className="text-slate-500">Order:</span> {block.order_id}
                                        </div>
                                    </div>

                                    {/* Collapsible Payload (Preview on hover) */}
                                    <div className="mt-2 text-[10px] text-slate-500 bg-slate-900/50 p-2 rounded hidden group-hover:block transition-all">
                                        {block.payload}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
