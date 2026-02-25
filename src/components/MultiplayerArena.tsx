'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchFighter, Fighter } from '@/services/wikipediaService';
import { BattleState, executeTurn } from '@/services/battleEngine';
import FighterCard from './FighterCard';
import BattleLog from './BattleLog';

export default function MultiplayerArena({ lobbyId, nickname, isHost }: { lobbyId: string, nickname: string, isHost: boolean }) {
    const [lobbyState, setLobbyState] = useState<any>(null);
    const [fighters, setFighters] = useState<Fighter[] | null>(null);
    const [battleState, setBattleState] = useState<BattleState | null>(null);

    // UI state
    const [userChoice, setUserChoice] = useState<number | null>(null);
    const [loadingMsg, setLoadingMsg] = useState("OCZEKIWANIE NA GLADIATORÓW...");
    const [score, setScore] = useState(0); // local tracking of points for shop

    const battleIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Poll lobby state
    useEffect(() => {
        const fetchState = async () => {
            try {
                const res = await fetch(`/api/lobby/${lobbyId}`);
                if (res.ok) {
                    const data = await res.json();
                    setLobbyState(data);

                    // Sync fighters when they arrive
                    if (data.fighters && (!fighters || data.fighters[0].title !== fighters[0].title)) {
                        setFighters(data.fighters);
                        setUserChoice(null);
                        setBattleState({
                            fighters: data.fighters,
                            hps: [data.fighters[0].hp, data.fighters[1].hp],
                            logs: [],
                            winnerIdx: null,
                            isFinished: false
                        });
                    }
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        };

        fetchState();
        const interval = setInterval(fetchState, 1500);
        return () => clearInterval(interval);
    }, [lobbyId, fighters]);

    // Host generates fighters if starting
    useEffect(() => {
        if (!lobbyState || !isHost) return;

        if (lobbyState.status === 'starting' && !fighters) {
            const generateAndPush = async () => {
                setLoadingMsg("GENEROWANIE ARENY...");
                const f1 = await fetchFighter();
                const f2 = await fetchFighter();
                await fetch(`/api/lobby/${lobbyId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'set_fighters', fighters: [f1, f2] })
                });
            };
            generateAndPush();
        }
    }, [lobbyState?.status, isHost, lobbyId]);

    // Trigger combat execution when backend says round is finished (everyone bet)
    useEffect(() => {
        if (lobbyState?.status === 'round_finished' && battleState && !battleState.isFinished && !battleIntervalRef.current) {
            // Run simulation locally
            let currentState = { ...battleState };
            const spdAcc = [0, 0];

            battleIntervalRef.current = setInterval(() => {
                if (currentState.isFinished) {
                    if (battleIntervalRef.current) {
                        clearInterval(battleIntervalRef.current);
                        battleIntervalRef.current = null;
                    }

                    // Host submits score to backend and advances round
                    if (isHost) {
                        const winner = currentState.winnerIdx;
                        const newScores: Record<string, number> = {};

                        lobbyState.players.forEach((p: any) => {
                            const pScore = p.score || 0;
                            if (p.bet === winner) {
                                newScores[p.nick] = pScore + 1;
                            }
                        });

                        setTimeout(() => {
                            fetch(`/api/lobby/${lobbyId}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'update_scores', scores: newScores })
                            });
                        }, 2000); // 2 second pause before advancing UI
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
            }, 100);
        }
    }, [lobbyState?.status, battleState, isHost]);

    const placeBet = async (choiceIdx: number) => {
        setUserChoice(choiceIdx);
        try {
            await fetch(`/api/lobby/${lobbyId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'bet', playerNick: nickname, betIndex: choiceIdx })
            });
        } catch (e) {
            console.error("Błąd podczas wysyłania zakładu", e);
        }
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
                    <span className="text-muted">PUNKTY SKLEPU:</span> <span className="text-cyan">{score}</span>
                </div>
                <h1 className="arena-header-title">
                    WIKI-GLADIATORS ONLINE
                </h1>
                <div className="arena-streak">
                    <span className="text-muted">WYGRANE:</span> <span className="text-gold">{lobbyState?.players?.find((p: any) => p.nick === nickname)?.score || 0} 🏆</span>
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
                        shopEnabled={lobbyState?.settings?.shop}
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
                                        onClick={() => placeBet(0)}
                                        className="bet-btn bet-left"
                                        disabled={userChoice !== null}
                                    >
                                        <span className="bet-icon">🛡️</span> OBSTAWIAM LEWEGO
                                    </button>
                                    <button
                                        onClick={() => placeBet(1)}
                                        className="bet-btn bet-right"
                                        disabled={userChoice !== null}
                                    >
                                        OBSTAWIAM PRAWEGO <span className="bet-icon">⚔️</span>
                                    </button>
                                </div>
                                {userChoice !== null && (
                                    <div className="mt-4 text-cyan">Oczekiwanie na resztę graczy...</div>
                                )}
                            </>
                        )}

                        {isDone && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', animation: 'fadeIn 0.5s' }}>
                                <div className={`result-banner ${battleState.winnerIdx === userChoice ? 'result-win' : 'result-lose'}`}>
                                    {battleState.winnerIdx === userChoice ? (
                                        <span>WYGRANA RUNDA! +1 🏆</span>
                                    ) : (
                                        <span>PRZEGRANA... STRATA SERII</span>
                                    )}
                                </div>
                                {isHost ? (
                                    <button
                                        onClick={() => fetch(`/api/lobby/${lobbyId}`, { method: 'PATCH', body: JSON.stringify({ action: 'next_round' }) })}
                                        className="premium-btn"
                                        disabled={lobbyState?.status === 'starting'}
                                        style={{ width: '100%', maxWidth: '300px' }}
                                    >
                                        {lobbyState?.status === 'starting' ? 'GENEROWANIE ARENY...' : 'NASTĘPNE STARCIE ⚔️'}
                                    </button>
                                ) : (
                                    <button
                                        className="premium-btn text-gold"
                                        disabled
                                        style={{ width: '100%', maxWidth: '300px' }}
                                    >
                                        Oczekiwanie na Hosta...
                                    </button>
                                )}
                            </div>
                        )}

                        {lobbyState?.status === 'starting' && (
                            <div className="sys-info">
                                &gt;&gt;&gt; BUFOROWANIE DANYCH SIECIOWYCH &lt;&lt;&lt;
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
                        shopEnabled={lobbyState?.settings?.shop}
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
