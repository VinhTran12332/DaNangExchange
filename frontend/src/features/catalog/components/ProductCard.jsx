import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Sparkline } from '../../../components/ui/Sparkline';

export const ProductCard = ({ id, title, price, change, verified, preview_url }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/assets/${id}`)}
            className="bg-bg-card rounded-2xl border border-border-subtle hover:border-primary/50 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden shadow-sm hover:shadow-xl"
        >
            {/* Cover Image */}
            <div className="h-48 w-full bg-slate-800 overflow-hidden relative">
                {preview_url ? (
                    <img
                        src={preview_url}
                        alt={title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                        <span className="text-slate-600 font-bold text-lg">No Preview</span>
                    </div>
                )}

                {/* Verified Badge Overlay */}
                {verified && (
                    <div className="absolute top-3 right-3 bg-bg-card/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 shadow-lg border border-border-subtle">
                        <CheckCircle2 className="w-3 h-3 text-accent-blue" />
                        <span className="text-[10px] uppercase font-bold text-accent-blue tracking-wider">Verified</span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="mb-4 flex-1">
                    <h3 className="font-semibold text-lg text-text-main group-hover:text-primary transition-colors line-clamp-2 mb-2">{title}</h3>
                </div>

                <div className="mt-auto pt-4 border-t border-border-subtle/50 flex items-end justify-between">
                    <span className="font-mono text-xl font-bold text-white">{price}</span>
                    <button className="text-primary opacity-0 group-hover:opacity-100 transition-all text-sm font-bold flex items-center gap-1 -translate-x-2 group-hover:translate-x-0">
                        View Details <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
