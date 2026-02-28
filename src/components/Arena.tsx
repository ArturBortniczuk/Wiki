'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchFighter, Fighter } from '@/services/wikipediaService';
import { BattleState, executeTurn } from '@/services/battleEngine';
import FighterCard from './FighterCard';
import BattleLog from './BattleLog';

export default function Arena() {
    const [fighters, setFighters] = useState<Fighter[] | null>(null);
    const [nextFighters, setNextFighters] = useState<Fighter[] | null>(null);

    const [battleState, setBattleState] = useState<BattleState | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [loadingMsg, setLoadingMsg] = useState("INICJUJĘ SYSTEMY ARENY...");
    const [isPreFetching, setIsPreFetching] = useState(false);
    const [userChoice, setUserChoice] = useState<number | null>(null);

    const battleIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const loadFighters = async (isPrefetch = false) => {
        if (isPrefetch) {
            setIsPreFetching(true);
            const f1 = await fetchFighter();
            const f2 = await fetchFighter();
            setNextFighters([f1, f2]);
            setIsPreFetching(false);
        } else {
            setLoadingMsg("POBIERANIE WOJOWNIKÓW...");
            if (nextFighters) {
                setFighters(nextFighters);
                setNextFighters(null);
            } else {
                const f1 = await fetchFighter();
                const f2 = await fetchFighter();
                setFighters([f1, f2]);
            }
            setLoadingMsg("");
        }
    };

    useEffect(() => {
        loadFighters();
    }, []);

    useEffect(() => {
        if (fighters) {
            setBattleState({
                fighters,
                hps: [fighters[0].hp, fighters[1].hp],
                logs: [],
                winnerIdx: null,
                isFinished: false
            });
            setUserChoice(null);
        }
    }, [fighters]);

    const startBattle = (choiceIdx: number) => {
        setUserChoice(choiceIdx);
        if (!battleState) return;

        // Start prefetching next round in background
        loadFighters(true);

        let currentState = { ...battleState };
        const spdAcc = [0, 0];

        battleIntervalRef.current = setInterval(() => {
            if (currentState.isFinished) {
                if (battleIntervalRef.current) clearInterval(battleIntervalRef.current);

                // Calculate score
                const winner = currentState.winnerIdx;

                // Report my own stats to the global user leaderboard if logged in
                fetch('/api/users/stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ result: (winner === choiceIdx) ? 'win' : 'loss' })
                }).catch(console.error); // Silent catch if not logged in

                if (winner === choiceIdx) {
                    setStreak(s => {
                        const newStreak = s + 1;
                        setScore(sc => sc + (15 + newStreak * 5));
                        return newStreak;
                    });
                } else {
                    setStreak(0);
                    setScore(sc => Math.max(0, sc - 20));
                }

                return;
            }

            spdAcc[0] += currentState.fighters[0].spd;
            spdAcc[1] += currentState.fighters[1].spd;

            let nextState = currentState;

            if (spdAcc[0] >= 2) {
                nextState = executeTurn(nextState, 0, 1);
                spdAcc[0] -= 2;
            }

            if (!nextState.isFinished && spdAcc[1] >= 2) {
                nextState = executeTurn(nextState, 1, 0);
                spdAcc[1] -= 2;
            }

            currentState = nextState;
            setBattleState(currentState);

        }, 150); // Frame time for battle
    };

    if (!fighters || !battleState) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <h2 className="loading-text">{loadingMsg}</h2>
            </div>
        );
    }

    const isOngoing = userChoice !== null && !battleState.isFinished;
    const isDone = battleState.isFinished;

    return (
        <div style={{ width: '100%' }}>

            {/* Header / Scoreboard */}
            <div className="arena-header-container glass-panel">
                <div className="arena-score">
                    <span className="text-muted">SCORE:</span> <span className="text-cyan">{score}</span>
                </div>
                <h1 className="arena-header-title">
                    WIKI-GLADIATORS 3.0
                </h1>
                <div className="arena-streak">
                    <span><span className="text-muted">STREAK:</span> <span className="text-gold">{streak}</span></span>
                </div>
            </div>

            <div className="arena-grid">

                {/* Left Fighter */}
                <div style={{ justifySelf: 'center', width: '100%' }}>
                    <FighterCard
                        fighter={fighters[0]}
                        currentHp={battleState.hps[0]}
                        isBattleStarted={userChoice !== null}
                        isWinner={battleState.winnerIdx === 0}
                        onRevealStat={(cost) => {
                            if (score >= cost) {
                                setScore(s => s - cost);
                                return true;
                            }
                            return false;
                        }}
                    />
                </div>

                {/* Center Console */}
                <div className="center-console">
                    <BattleLog logs={battleState.logs} fighters={fighters} />

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {!isOngoing && !isDone && (
                            <>
                                <h3 className="choice-title mb-4">Wybierz Zwycięzcę</h3>
                                <div className="action-buttons">
                                    <button
                                        onClick={() => startBattle(0)}
                                        className="bet-btn bet-left"
                                    >
                                        <span className="bet-icon">🛡️</span> OBSTAWIAM LEWEGO
                                    </button>
                                    <button
                                        onClick={() => startBattle(1)}
                                        className="bet-btn bet-right"
                                    >
                                        OBSTAWIAM PRAWEGO <span className="bet-icon">⚔️</span>
                                    </button>
                                </div>
                            </>
                        )}

                        {isDone && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', animation: 'fadeIn 0.5s' }}>
                                <div className={`result-banner ${battleState.winnerIdx === userChoice ? 'result-win' : 'result-lose'}`}>
                                    {battleState.winnerIdx === userChoice ? (
                                        <span>WYGRANA ZAKŁADU! +{15 + streak * 5} PKT</span>
                                    ) : (
                                        <span>PRZEGRANA... STRATA SERII</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => loadFighters()}
                                    className="premium-btn"
                                    disabled={isPreFetching && !nextFighters}
                                    style={{ width: '100%', maxWidth: '300px' }}
                                >
                                    {isPreFetching && !nextFighters ? 'BUFOROWANIE ARENY...' : 'NASTĘPNE STARCIE ⚔️'}
                                </button>
                            </div>
                        )}

                        {(isPreFetching || nextFighters) && (
                            <div className="sys-info">
                                {nextFighters ? ">>> NASTĘPNI GLADIATORZY SĄ W GOTOWOŚCI <<<" : ">>> BUFOROWANIE DANYCH SIECIOWYCH <<<"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Fighter */}
                <div style={{ justifySelf: 'center', width: '100%' }}>
                    <FighterCard
                        fighter={fighters[1]}
                        currentHp={battleState.hps[1]}
                        isBattleStarted={userChoice !== null}
                        isWinner={battleState.winnerIdx === 1}
                        onRevealStat={(cost) => {
                            if (score >= cost) {
                                setScore(s => s - cost);
                                return true;
                            }
                            return false;
                        }}
                    />
                </div>

            </div>
        </div>
    );
}
