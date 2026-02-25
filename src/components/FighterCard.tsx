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
                <div className="fighter-hp-container">
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
                    <div className="stat-row" title={`Baza: 40 + ${fighter.imgCount} obrazków`}>
                        <span className="stat-label">ATK</span> <span className="stat-val">{fighter.atk}</span>
                    </div>
                    <div className="stat-row" title={`Baza: 15% + edycje`}>
                        <span className="stat-label">ARM</span> <span className="stat-val">{fighter.arm}%</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">SPD</span> <span className="stat-val">{fighter.spd.toFixed(1)}</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">CRIT</span> <span className="stat-val text-red">{fighter.crit}%</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">UNIK</span> <span className="stat-val text-cyan">{fighter.eva}%</span>
                    </div>
                    <div className="stat-row" title={`Łączna wielkość: ${fighter.raw}b`}>
                        <span className="stat-label">ROZMIAR</span> <span className="stat-val">{fighter.raw}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
