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
        <div className="battlelog-container">
            <div className="battlelog-header">
                <span>BATTLE_LOG_V3.0</span>
                <span className="live-indicator">
                    <span className="pulse-dot"></span>
                    LIVE
                </span>
            </div>

            <div className="battlelog-box" ref={scrollRef}>
                {logs.length === 0 ? (
                    <div className="waiting-msg">
                        OCZEKIWANIE NA<br />DECYZJĘ...
                    </div>
                ) : (
                    logs.map((log) => {
                        if (!log.attackerIdx && log.attackerIdx !== 0) {
                            return <div key={log.id} className="log-entry log-sys">=== {log.damage ? 'INICJACJA WALKI' : 'SYSTEM MSG'} ===</div>;
                        }

                        const isLeft = log.attackerIdx === 0;
                        const sideLab = isLeft ? '[L]' : '[P]';
                        const cls = isLeft ? 'log-left' : 'log-right';

                        if (log.evaded) {
                            return (
                                <div key={log.id} className="log-entry log-evade">
                                    {sideLab} <span className="text-cyan" style={{ fontWeight: 'bold' }}>UNIK!</span>
                                </div>
                            );
                        }

                        return (
                            <div key={log.id} className={`log-entry ${cls}`}>
                                {sideLab} {log.isCrit ? <span className="text-gold" style={{ fontWeight: 'bold' }}>★CRIT★ </span> : ''}
                                Atak za <span style={{ fontWeight: 'bold' }}>{Math.floor(log.damage)}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
