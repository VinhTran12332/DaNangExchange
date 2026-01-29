import { Search, Bell, User, Menu, X, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Marketplace', path: '/access' },
        { name: 'Blockchain', path: '/blockchain' },
    ];

    const externalLinks = [
        { name: 'Seller Portal', url: 'https://startup2026v1.lovable.app/seller', color: 'text-accent-gold' },
        { name: 'Buyer Portal', url: 'https://startup2026v1.lovable.app/buyer', color: 'text-primary' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'h-16 bg-bg-main/80 backdrop-blur-md border-b border-border-subtle shadow-glass' : 'h-20 bg-transparent border-transparent'}`}>
            <div className="container mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                        <span className="font-bold text-bg-main text-lg">U</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                        UGDES<span className="text-primary">.Enterprise</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} className="text-sm font-medium text-text-muted hover:text-white transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Search - Compact */}
                <div className={`hidden md:flex relative transition-all duration-300 ${isScrolled ? 'w-64' : 'w-48 opacity-50 hover:opacity-100'}`}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full bg-bg-card/50 border border-border-subtle rounded-full px-10 py-1.5 focus:outline-none focus:border-primary text-sm transition-colors text-white placeholder-text-subtle"
                    />
                </div>

                {/* Actions & Dashboards */}
                <div className="hidden md:flex items-center gap-3">
                    {externalLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-border-subtle hover:border-primary/50 bg-bg-card/50 hover:bg-bg-card transition-all ${link.color}`}
                        >
                            {link.name}
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    ))}
                    <div className="h-6 w-px bg-border-subtle mx-1"></div>
                    <button className="text-text-muted hover:text-primary transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                    <Button variant="primary" className="h-9 px-4 text-sm bg-primary hover:bg-primary-hover text-bg-main font-bold">
                        Connect Wallet
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-bg-main border-b border-border-subtle p-4 flex flex-col gap-4 shadow-xl">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} className="text-base font-medium text-text-muted hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                            {link.name}
                        </Link>
                    ))}
                    <hr className="border-border-subtle" />
                    <div className="flex flex-col gap-2">
                        {externalLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-between px-3 py-2 text-sm font-semibold rounded bg-bg-card ${link.color}`}
                            >
                                {link.name}
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};
