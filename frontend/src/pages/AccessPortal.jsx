import React, { useState } from 'react';
import { API_BASE_URL } from '../services/api';

export const AccessPortal = () => {
    const [orderId, setOrderId] = useState('');
    const [accessInfo, setAccessInfo] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [downloadMsg, setDownloadMsg] = useState('');

    const fetchAccess = async () => {
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

            // Handle Excel/Binary File
            if (contentType.includes('spreadsheet') || contentType.includes('excel') || contentType.includes('octet-stream')) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `watermarked_data_${orderId}.xlsx`; // Default name
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                setDownloadMsg('✅ Excel File Downloaded!');
            }
            // Handle JSON Data
            else {
                const result = await res.json();

                // Trigger JSON Download
                const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `watermarked_data_${orderId}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                setDownloadMsg(`✅ JSON Data Retrieved! Usage Remaining: ${result.quota_status?.remaining ?? '-'}`);
                console.log("Downloaded Content:", result.data);

                // Refresh quota display if available
                if (result.quota_status) {
                    setAccessInfo(prev => ({ ...prev, remaining_quota: result.quota_status.remaining }));
                }
            }

        } catch (err) {
            setDownloadMsg('❌ Error: ' + err.message);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
            <div className="max-w-xl w-full">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">🔐 Data Access Portal</h1>

                <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-700">
                    <label className="block text-slate-400 mb-2 font-mono text-sm">Enter Order ID to retrieve API Key:</label>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            className="flex-1 bg-slate-900 border border-slate-600 rounded p-2 text-white font-mono"
                            placeholder="e.g. ffc88d2c..."
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                        <button
                            onClick={fetchAccess}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold disabled:opacity-50"
                        >
                            {loading ? 'Thinking...' : 'Unlock'}
                        </button>
                    </div>

                    {error && <div className="p-3 bg-red-900/50 border border-red-700 text-red-200 rounded mb-4 text-sm">{error}</div>}

                    {accessInfo && (
                        <div className="animate-fade-in">
                            <div className="bg-slate-900/50 p-4 rounded border border-emerald-900/50 mb-4">
                                <div className="text-xs text-slate-500 mb-1">YOUR API KEY</div>
                                <code className="text-emerald-400 font-mono text-lg break-all block mb-4">
                                    {accessInfo.api_key}
                                </code>

                                <div className="text-xs text-slate-500 mb-1">REMAINING QUOTA</div>
                                <div className="text-2xl font-bold text-white mb-2">
                                    {accessInfo.remaining_quota} <span className="text-sm font-normal text-slate-400">downloads</span>
                                </div>
                            </div>

                            <button
                                onClick={downloadData}
                                className="w-full bg-emerald-700 hover:bg-emerald-600 p-3 rounded font-bold flex justify-center items-center gap-2"
                            >
                                ⬇️ Download Data via API
                            </button>

                            {downloadMsg && (
                                <div className="mt-3 text-center text-sm font-mono text-yellow-300">
                                    {downloadMsg}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 text-slate-500 text-sm text-center">
                    <p>Tip: Use the API Key in the `x-api-key` header when calling `/api/access/data/:id` programmatically.</p>
                </div>
            </div>
        </div>
    );
}
