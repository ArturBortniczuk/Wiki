import React, { useEffect, useRef } from 'react';
import { BattleLogEntry } from '@/services/battleEngine';
import { Fighter } from '@/services/wikipediaService';

interface BattleLogProps {
    logs: BattleLogEntry[];
    fighters: Fighter[];
}

export default function BattleLog({ logs, fighters }: BattleLogProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="w-full flex justify-center mb-8">
            <div className="w-full max-w-2xl flex flex-col">
                <div className="bg-[#1a1a2e] px-4 py-2 text-xs text-[var(--text-muted)] border-2 border-[#1a1a2e] border-b-0 rounded-t-xl font-mono uppercase tracking-widest flex items-center justify-between">
                    <span>BATTLE_LOG_V3.0</span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
                        LIVE
                    </span>
                </div>

                <div
                    ref={scrollRef}
                    className="bg-black/90 w-full h-[320px] rounded-b-xl border-2 border-[#1a1a2e] overflow-y-auto p-4 font-mono text-sm shadow-[inset_0_0_20px_rgba(0,0,0,1)] scroll-smooth space-y-2 relative"
                >
                    {logs.length === 0 ? (
                        <div className="text-[var(--accent)]/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 uppercase tracking-[0.2em] font-bold opacity-50 select-none text-center">
                            OCZEKIWANIE NA<br />DECYZJĘ...
                        </div>
                    ) : (
                        logs.map((log) => {
                            if (!log.attackerIdx && log.attackerIdx !== 0) {
                                // System message
                                return <div key={log.id} className="text-white opacity-60">=== {log.damage ? 'INICJACJA WALKI' : 'SYSTEM MSG'} ===</div>;
                            }

                            const isLeft = log.attackerIdx === 0;
                            const color = isLeft ? 'text-[var(--accent)]' : 'text-[var(--red)]';
                            const sideLab = isLeft ? '[L]' : '[P]';

                            if (log.evaded) {
                                return (
                                    <div key={log.id} className="text-[var(--text-muted)] pl-4 border-l-2 border-[var(--text-muted)]/30 animate-fade-in">
                                        {sideLab} <span className="text-[var(--cyan)] font-bold">UNIK!</span>
                                    </div>
                                );
                            }

                            return (
                                <div key={log.id} className={`${color} pl-4 border-l-2 ${isLeft ? 'border-[var(--accent)]' : 'border-[var(--red)]'} animate-fade-in`}>
                                    {sideLab} {log.isCrit ? <span className="font-bold text-[var(--gold)]">★CRIT★ </span> : ''}
                                    Atak za <span className="font-bold">{Math.floor(log.damage)}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
