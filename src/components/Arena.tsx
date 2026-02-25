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
            <div className="flex-1 flex items-center justify-center flex-col">
                <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-[var(--accent)] rounded-full animate-spin mb-4" />
                <h2 className="text-[var(--gold)] font-mono tracking-widest text-xl animate-pulse">{loadingMsg}</h2>
            </div>
        );
    }

    const isOngoing = userChoice !== null && !battleState.isFinished;
    const isDone = battleState.isFinished;

    return (
        <div className="w-full max-w-[1450px] mx-auto flex flex-col items-center">

            {/* Header / Scoreboard */}
            <div className="w-full flex justify-between items-center mb-10 px-6 py-4 glass-panel max-w-4xl">
                <div className="text-xl font-bold font-mono">
                    <span className="text-[var(--text-muted)]">SCORE:</span> <span className="text-[var(--cyan)]">{score}</span>
                </div>
                <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--gold)]">
                    WIKI-GLADIATORS 3.0
                </h1>
                <div className="text-xl font-bold font-mono">
                    <span className="text-[var(--text-muted)]">STREAK:</span> <span className="text-[var(--gold)]">{streak} 🔥</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(400px,_600px)_1fr] gap-8 w-full px-4 items-start">

                {/* Left Fighter */}
                <div className="w-full">
                    <FighterCard
                        fighter={fighters[0]}
                        currentHp={battleState.hps[0]}
                        isWinner={battleState.winnerIdx === 0}
                    />
                </div>

                {/* Center Console */}
                <div className="flex flex-col items-center justify-start gap-6 h-full w-full max-w-2xl mx-auto">
                    <BattleLog logs={battleState.logs} fighters={fighters} />

                    <div className="flex flex-col items-center gap-4 w-full">
                        {!isOngoing && !isDone && (
                            <>
                                <h3 className="text-lg font-bold text-[var(--gold)] mb-2 uppercase tracking-widest text-center">Wybierz Zwycięzcę</h3>
                                <div className="flex justify-center gap-12 w-full">
                                    <button
                                        onClick={() => startBattle(0)}
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--red)] border-4 border-transparent hover:border-[var(--gold)] hover:scale-110 hover:shadow-[0_0_20px_var(--red)] transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <span className="text-3xl transform transition-transform group-hover:-translate-x-2">←</span>
                                    </button>
                                    <button
                                        onClick={() => startBattle(1)}
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--red)] border-4 border-transparent hover:border-[var(--gold)] hover:scale-110 hover:shadow-[0_0_20px_var(--red)] transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <span className="text-3xl transform transition-transform group-hover:translate-x-2">→</span>
                                    </button>
                                </div>
                            </>
                        )}

                        {isDone && (
                            <div className="flex flex-col items-center gap-4 animate-fade-in w-full text-center">
                                <div className="text-2xl font-black mb-2 flex flex-col items-center w-full">
                                    {battleState.winnerIdx === userChoice ? (
                                        <span className="text-[var(--gold)] drop-shadow-[0_0_10px_var(--gold)] bg-black/50 px-6 py-2 rounded-lg border border-[var(--gold)]">
                                            WYGRANA ZAKŁADU! +{15 + streak * 5} PKT
                                        </span>
                                    ) : (
                                        <span className="text-[var(--red)] drop-shadow-[0_0_10px_var(--red)] bg-black/50 px-6 py-2 rounded-lg border border-[var(--red)]">
                                            PRZEGRANA... STRATA SERII
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => loadFighters()}
                                    className="premium-btn w-full max-w-md text-lg py-4"
                                    disabled={isPreFetching && !nextFighters}
                                >
                                    {isPreFetching && !nextFighters ? 'PRZYGOTOWANIE ARENY...' : 'NASTĘPNE STARCIE ⚔️'}
                                </button>
                            </div>
                        )}

                        {(isPreFetching || nextFighters) && (
                            <div className="text-xs text-[var(--text-muted)] font-mono animate-pulse mt-4">
                                {nextFighters ? ">>> NASTĘPNI GLADIATORZY SĄ W GOTOWOŚCI <<<" : ">>> BUFOROWANIE DANYCH SIECIOWYCH <<<"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Fighter */}
                <div className="w-full">
                    <FighterCard
                        fighter={fighters[1]}
                        currentHp={battleState.hps[1]}
                        isWinner={battleState.winnerIdx === 1}
                    />
                </div>

            </div>
        </div>
    );
}
