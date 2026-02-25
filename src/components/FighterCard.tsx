import React, { useState, useEffect } from 'react';
import { Fighter } from '@/services/wikipediaService';

interface FighterCardProps {
    fighter: Fighter;
    currentHp: number;
    isWinner?: boolean;
    onRevealStat?: (cost: number) => boolean;
}

const STATS_REVEAL_COST = 5;

export default function FighterCard({ fighter, currentHp, isWinner = false, onRevealStat }: FighterCardProps) {
    const hpPercent = Math.max(0, Math.min(100, (currentHp / fighter.maxHp) * 100));
    const [revealedStats, setRevealedStats] = useState<Set<string>>(new Set());

    useEffect(() => {
        setRevealedStats(new Set());
    }, [fighter.id]);

    const handleReveal = (statKey: string) => {
        if (revealedStats.has(statKey)) return;
        if (onRevealStat && onRevealStat(STATS_REVEAL_COST)) {
            setRevealedStats(prev => new Set(prev).add(statKey));
        } else if (!onRevealStat) {
            // Fallback just to reveal it if no point system is attached (e.g. game over)
            setRevealedStats(prev => new Set(prev).add(statKey));
        } else {
            // Could add an animation for "not enough points" here
        }
    };

    const renderStatRow = (label: string, value: string | number, key: keyof typeof fighter.tooltips, colorClass?: string) => {
        const isRevealed = revealedStats.has(key) || isWinner; // Always reveal for winner or at the end
        const content = isRevealed ? (
            <span className={`stat-val ${colorClass || ''}`}>{value}</span>
        ) : (
            <button
                onClick={() => handleReveal(key)}
                className="stat-reveal-btn"
                title="Odkryj statystykę (Koszt: 5 punktów)"
            >
                ??? 🔒
            </button>
        );

        return (
            <div className="stat-row" title={fighter.tooltips?.[key]}>
                <span className="stat-label">{label}</span>
                {content}
            </div>
        );
    };

    return (
        <div className={`glass-panel fighter-wrapper ${isWinner ? 'winner' : ''}`}>

            {/* Dynamic Background Gradient */}
            <div className="fighter-bg-gradient" />

            <div className="fighter-content">
                {/* Image Container */}
                <div className="fighter-img-box">
                    {fighter.img ? (
                        <img src={fighter.img} alt={fighter.title} className="fighter-img" />
                    ) : (
                        <span className="fighter-no-img">BRAK WIZUALIZACJI</span>
                    )}
                </div>

                <h3 className="fighter-title" title={fighter.title}>{fighter.title}</h3>

                {/* Tags */}
                <div className="fighter-tags">
                    {fighter.traits.map((t, idx) => (
                        <div key={idx} className="trait-tag">
                            {t.n}
                            <div className="trait-tooltip">
                                {t.d}
                            </div>
                        </div>
                    ))}
                    {fighter.traits.length === 0 && (
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Brak specyficznych cech</span>
                    )}
                </div>

                {/* HP Bar */}
                <div className="fighter-hp-container" title={fighter.tooltips?.hp}>
                    <div className="fighter-hp-text">
                        {Math.floor(currentHp)} / {fighter.maxHp} HP
                    </div>
                    <div className="hp-bar-bg">
                        <div
                            className="hp-bar-fill"
                            style={{ width: `${hpPercent}%` }}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="fighter-stats">
                    {renderStatRow("ATK", fighter.atk, "atk")}
                    {renderStatRow("ARM", `${fighter.arm}%`, "arm")}
                    {renderStatRow("SPD", fighter.spd.toFixed(1), "spd")}
                    {renderStatRow("CRIT", `${fighter.crit}%`, "crit", "text-red")}
                    {renderStatRow("UNIK", `${fighter.eva}%`, "eva", "text-cyan")}
                    <div className="stat-row">
                        <span className="stat-label">ROZMIAR</span> <span className="stat-val">{fighter.raw}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
