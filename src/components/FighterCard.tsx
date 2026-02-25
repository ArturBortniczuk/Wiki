import React from 'react';
import { Fighter } from '@/services/wikipediaService';

interface FighterCardProps {
    fighter: Fighter;
    currentHp: number;
    isWinner?: boolean;
}

export default function FighterCard({ fighter, currentHp, isWinner = false }: FighterCardProps) {
    const hpPercent = Math.max(0, Math.min(100, (currentHp / fighter.maxHp) * 100));

    return (
        <div className={`glass-panel p-6 relative flex flex-col gap-4 overflow-hidden transition-all duration-500 min-h-[500px] ${isWinner ? 'border-[var(--gold)] shadow-[0_0_40px_var(--gold)] scale-[1.02]' : ''}`}>

            {/* Dynamic Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-dark)]/50 to-transparent pointer-events-none" />

            {/* Image Container */}
            <div className="w-full h-56 rounded-xl overflow-hidden bg-black border border-[var(--bg-dark)] shadow-[var(--bg-dark)] relative z-10 flex items-center justify-center">
                {fighter.img ? (
                    <img src={fighter.img} alt={fighter.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                ) : (
                    <span className="text-[var(--text-muted)] text-sm font-medium tracking-widest text-center px-4">BRAK WIZUALIZACJI</span>
                )}
            </div>

            <h3 className="text-xl font-bold text-wrap line-clamp-2 h-[56px] z-10">{fighter.title}</h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 min-h-[80px] z-10">
                {fighter.traits.map((t, idx) => (
                    <div key={idx} className="group relative bg-[var(--primary)]/20 px-3 py-1.5 rounded-md border border-[var(--primary)] text-xs font-bold cursor-help overflow-visible">
                        {t.n}
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-[var(--gold)] text-center px-3 py-2 rounded border border-[var(--gold)] w-48 text-xs shadow-xl pointer-events-none z-50">
                            {t.d}
                        </div>
                    </div>
                ))}
                {fighter.traits.length === 0 && (
                    <span className="text-xs text-[var(--text-muted)]">Brak specyficznych cech</span>
                )}
            </div>

            {/* HP Bar */}
            <div className="my-2 z-10">
                <div className="text-center font-mono font-bold text-[var(--gold)] text-lg mb-1">
                    {Math.floor(currentHp)} / {fighter.maxHp} HP
                </div>
                <div className="bg-black/80 h-4 rounded-full overflow-hidden border border-black shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--red)] to-[var(--accent)] transition-all duration-300 ease-out"
                        style={{ width: `${hpPercent}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm bg-black/40 p-4 rounded-lg border border-[var(--bg-darker)] z-10">
                <div className="flex justify-between border-b border-[var(--bg-dark)] pb-1" title={`Baza: 40 + ${fighter.imgCount} obrazków`}>
                    <span className="text-[var(--text-muted)] font-mono">ATK</span> <span className="font-bold">{fighter.atk}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--bg-dark)] pb-1" title={`Baza: 15% + edycje`}>
                    <span className="text-[var(--text-muted)] font-mono">ARM</span> <span className="font-bold">{fighter.arm}%</span>
                </div>
                <div className="flex justify-between border-b border-[var(--bg-dark)] pb-1">
                    <span className="text-[var(--text-muted)] font-mono">SPD</span> <span className="font-bold">{fighter.spd.toFixed(1)}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--bg-dark)] pb-1">
                    <span className="text-[var(--text-muted)] font-mono">CRIT</span> <span className="font-bold text-[var(--red)]">{fighter.crit}%</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[var(--text-muted)] font-mono">UNIK</span> <span className="font-bold text-[var(--cyan)]">{fighter.eva}%</span>
                </div>
                <div className="flex justify-between" title={`Łączna wielkość: ${fighter.raw}b`}>
                    <span className="text-[var(--text-muted)] font-mono">ROZMIAR</span> <span className="font-bold">{fighter.raw}</span>
                </div>
            </div>

        </div>
    );
}
