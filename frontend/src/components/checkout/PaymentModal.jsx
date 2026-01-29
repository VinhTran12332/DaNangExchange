import { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const PaymentModal = ({ isOpen, onClose, asset, quantity, total, onConfirm }) => {
    const [step, setStep] = useState('review'); // review, method, processing, success
    const [paymentMethod, setPaymentMethod] = useState('qr');

    if (!isOpen) return null;

    const handlePay = async () => {
        setStep('processing');
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            await onConfirm();
            setStep('success');
        } catch (error) {
            alert('Payment failed: ' + error.message);
            setStep('review');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-bg-card border border-border-subtle rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-bg-main/50">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" /> Secure Checkout
                    </h3>
                    {step !== 'processing' && (
                        <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'review' && (
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 bg-bg-main rounded-lg border border-border-subtle flex items-center justify-center">
                                    <span className="font-bold text-2xl text-primary">DS</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white line-clamp-1">{asset.title}</h4>
                                    <p className="text-sm text-text-muted">License: Enterprise Standard</p>
                                </div>
                            </div>

                            <div className="bg-bg-main rounded-lg p-4 space-y-2 border border-border-subtle/50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Unit Price</span>
                                    <span className="text-text-main font-mono">{new Intl.NumberFormat('vi-VN').format(asset.price)} {asset.currency || '₫'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Quantity</span>
                                    <span className="text-text-main font-mono">x{quantity}</span>
                                </div>
                                <div className="border-t border-border-subtle my-2"></div>
                                <div className="flex justify-between text-base font-bold">
                                    <span className="text-white">Total</span>
                                    <span className="text-primary font-mono">{new Intl.NumberFormat('vi-VN').format(total)} {asset.currency || '₫'}</span>
                                </div>
                            </div>

                            <Button onClick={() => setStep('method')} className="w-full h-12 text-base font-bold">
                                Proceed to Payment
                            </Button>
                        </div>
                    )}

                    {step === 'method' && (
                        <div className="space-y-6">
                            <h4 className="font-semibold text-white">Select Payment Method</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentMethod('qr')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'qr' ? 'bg-primary/10 border-primary text-primary' : 'bg-bg-main border-border-subtle text-text-muted hover:border-text-subtle'}`}
                                >
                                    <Smartphone className="w-8 h-8" />
                                    <span className="text-sm font-bold">VNPay QR</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'card' ? 'bg-primary/10 border-primary text-primary' : 'bg-bg-main border-border-subtle text-text-muted hover:border-text-subtle'}`}
                                >
                                    <CreditCard className="w-8 h-8" />
                                    <span className="text-sm font-bold">Credit Card</span>
                                </button>
                            </div>

                            {paymentMethod === 'qr' && (
                                <div className="flex flex-col items-center p-6 bg-white rounded-xl">
                                    <div className="w-48 h-48 bg-gray-900 mb-2 flex items-center justify-center text-white text-xs">
                                        [Mock QR Code]
                                    </div>
                                    <p className="text-gray-500 text-xs">Scan to pay with banking app</p>
                                </div>
                            )}

                            <Button onClick={handlePay} className="w-full h-12 text-base font-bold">
                                Confirm Payment
                            </Button>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="py-10 flex flex-col items-center text-center space-y-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <div>
                                <h4 className="text-lg font-bold text-white">Processing Transaction...</h4>
                                <p className="text-sm text-text-muted">Verifying via Smart Contract...</p>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-6 flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-white">Payment Successful!</h4>
                                <p className="text-text-muted mt-2">Your asset has been secured on the blockchain.</p>
                            </div>
                            <Button onClick={onClose} variant="outline" className="w-full">
                                Close
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer Security Badge */}
                <div className="bg-bg-main/50 p-3 text-center border-t border-border-subtle">
                    <p className="text-[10px] text-text-subtle flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Encrypted & Secured by Hyperledger Fabric
                    </p>
                </div>
            </div>
        </div>
    );
};
