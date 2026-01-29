import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-bg-main border-t border-border-subtle pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center">
                                <span className="font-bold text-bg-main">U</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">
                                UGDES<span className="text-primary">.Enterprise</span>
                            </span>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">
                            The national standard for secure, verifiable, and compliant data exchange. Powered by Hyperledger Fabric.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Marketplace</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><Link to="/access" className="hover:text-primary transition-colors">Browse Data</Link></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Trending Assets</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Enterprise</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><a href="https://startup2026v1.lovable.app/seller" target="_blank" className="hover:text-accent-gold transition-colors">Seller Portal</a></li>
                            <li><a href="https://startup2026v1.lovable.app/buyer" target="_blank" className="hover:text-primary transition-colors">Buyer Portal</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded bg-bg-card border border-border-subtle flex items-center justify-center text-text-muted hover:text-white hover:border-primary transition-colors"><Twitter className="w-4 h-4" /></a>
                            <a href="#" className="w-8 h-8 rounded bg-bg-card border border-border-subtle flex items-center justify-center text-text-muted hover:text-white hover:border-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
                            <a href="#" className="w-8 h-8 rounded bg-bg-card border border-border-subtle flex items-center justify-center text-text-muted hover:text-white hover:border-primary transition-colors"><Github className="w-4 h-4" /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-subtle">
                    <p>&copy; 2026 UGDES Enterprise. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-text-main">Privacy Policy</a>
                        <a href="#" className="hover:text-text-main">Terms of Service</a>
                        <a href="#" className="hover:text-text-main">Compliance</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
