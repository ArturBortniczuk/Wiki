import React, { useState, useEffect } from 'react';
import { Fighter } from '@/services/wikipediaService';

interface FighterCardProps {
    fighter: Fighter;
    currentHp: number;
    isBattleStarted: boolean;
    isWinner?: boolean;
    onRevealStat?: (cost: number) => boolean;
    shopEnabled?: boolean;
}

const STATS_REVEAL_COST = 5;

export default function FighterCard({ fighter, currentHp, isBattleStarted, isWinner = false, onRevealStat, shopEnabled = true }: FighterCardProps) {
    const hpPercent = Math.max(0, Math.min(100, (currentHp / fighter.maxHp) * 100));
    const [revealedStats, setRevealedStats] = useState<Set<string>>(new Set());

    useEffect(() => {
        setRevealedStats(new Set());
    }, [fighter.id]);

    const handleReveal = (statKey: string) => {
        if (!shopEnabled) return;
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

    const genericTooltips: Record<string, string> = {
        hp: "Zależne od całkowitej wielkości tekstu artykułu",
        atk: "Zależne od ilości wstawionych obrazów w artykule",
        arm: "Zależne od ilości ostatnich edycji oraz zabezpieczeń artykułu",
        spd: "Zależne od ilości dostępnych tłumaczeń tego artykułu na inne języki",
        crit: "Zależne od ilości linków wewnętrznych w artykule",
        eva: "Zależne odwrotnie proporcjonalnie od długości artykułu",
        raw: "Czysty rozmiar pobranego artykułu w bajtach"
    };

    const renderStatRow = (label: string, value: string | number, key: keyof typeof fighter.tooltips | "hp" | "raw", colorClass?: string) => {
        const isRevealed = revealedStats.has(key as string) || isWinner || isBattleStarted;
        const tooltipStr = isRevealed ? (fighter.tooltips as any)?.[key] : genericTooltips[key as string] || "Wykup, aby poznać szczegóły";
        const content = isRevealed ? (
            <span className={`stat-val ${colorClass || ''}`}>{value}</span>
        ) : (
            <button
                onClick={() => handleReveal(key as string)}
                className="stat-reveal-btn"
                title={shopEnabled ? "Odkryj statystykę (Koszt: 5 punktów)" : "Statystyki zablokowane do startu walki"}
                style={{ cursor: shopEnabled ? 'pointer' : 'not-allowed', opacity: shopEnabled ? 1 : 0.6 }}
            >
                ??? 🔒
            </button>
        );

        return (
            <div className="stat-row" title={tooltipStr}>
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
                <div className="fighter-hp-container" title={(isBattleStarted || isWinner || revealedStats.has("hp")) ? fighter.tooltips?.hp : "PUNKTY ZDROWIA (Odkryj)"}>
                    <div className="fighter-hp-text">
                        {isBattleStarted || isWinner || revealedStats.has("hp") ? (
                            `${Math.floor(currentHp)} / ${fighter.maxHp} HP`
                        ) : (
                            <button
                                onClick={() => handleReveal("hp")}
                                className="stat-reveal-btn text-lg"
                                title={shopEnabled ? "Odkryj HP (5 pkt)" : "Zablokowane"}
                                style={{ cursor: shopEnabled ? 'pointer' : 'not-allowed', opacity: shopEnabled ? 1 : 0.6 }}
                            >
                                ??? / ??? HP 🔒
                            </button>
                        )}
                    </div>
                    <div className="hp-bar-bg">
                        <div
                            className="hp-bar-fill"
                            style={{
                                width: (isBattleStarted || isWinner || revealedStats.has("hp")) ? `${hpPercent}%` : '100%',
                                filter: (isBattleStarted || isWinner || revealedStats.has("hp")) ? 'none' : 'grayscale(1) brightness(0.3)'
                            }}
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
                    {renderStatRow("ROZMIAR", fighter.raw, "raw")}
                </div>
            </div>

        </div>
    );
}
