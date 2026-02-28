'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MultiplayerArena from '@/components/MultiplayerArena';
import ProfileBadge from '@/components/ProfileBadge';
import { fetchFighter } from '@/services/wikipediaService';

export default function LobbyPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const lobbyId = params.id as string;
    const { user, loading } = useAuth();

    // URL params indicating player state
    const isHostParam = searchParams.get('host') === '1';
    const initialNick = searchParams.get('nick') || '';
    const initialRounds = searchParams.get('r');
    const initialTimer = searchParams.get('t');
    const initialShop = searchParams.get('s');

    const [isHost, setIsHost] = useState(isHostParam);
    const [nickname, setNickname] = useState(initialNick);
    const [hasJoined, setHasJoined] = useState(isHostParam); // Host automatically joins

    // Game starting state 
    const [gameStarted, setGameStarted] = useState(false);
    const [lobbyState, setLobbyState] = useState<any>(null);

    // Pre-loading state
    const [isGenerating, setIsGenerating] = useState(false);
    const [genProgress, setGenProgress] = useState(0);

    // Retrieve user session if page refreshed
    useEffect(() => {
        if (!isHostParam && typeof window !== 'undefined') {
            if (user && user.username) {
                // Official player login overrides local session
                setNickname(user.username);
            } else {
                const savedNick = sessionStorage.getItem(`wiki_lobby_${lobbyId}`);
                if (savedNick) {
                    setNickname(savedNick);
                    setHasJoined(true);
                }
            }
        }
    }, [isHostParam, lobbyId, user]);

    // Poll the redis lobby state
    useEffect(() => {
        if (!hasJoined) return;

        const fetchState = async () => {
            try {
                const res = await fetch(`/api/lobby/${lobbyId}`);
                if (res.ok) {
                    const data = await res.json();
                    setLobbyState(data);

                    if (data.status === 'starting' || data.status === 'round_active') {
                        setGameStarted(true);
                    } else if (data.status === 'waiting' && gameStarted) {
                        setGameStarted(false);
                        setIsGenerating(false);
                        setGenProgress(0);
                    }
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        };

        fetchState();
        const interval = setInterval(fetchState, 2000);
        return () => clearInterval(interval);
    }, [lobbyId, hasJoined, gameStarted]);

    const handleJoinLobby = async () => {
        if (!nickname.trim()) {
            alert("Podaj swój pseudonim!");
            return;
        }

        try {
            const res = await fetch(`/api/lobby/${lobbyId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'join', playerNick: nickname })
            });

            if (res.ok) {
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem(`wiki_lobby_${lobbyId}`, nickname);
                }
                setHasJoined(true);
            } else {
                const err = await res.json();
                alert(err.error || 'Błąd łączenia z pokojem!');
            }
        } catch (e) {
            alert("Błąd połączenia z serwerem!");
        }
    };

    const handleStartGame = async () => {
        if (isGenerating) return;
        try {
            setIsGenerating(true);
            const totalRoundsToGenerate = Math.max(3, (lobbyState?.settings?.rounds || 3) * 2);
            const pool = [];

            for (let i = 0; i < totalRoundsToGenerate; i++) {
                setGenProgress(Math.round(((i) / totalRoundsToGenerate) * 100));
                // Fetch pairs in parallel
                const [f1, f2] = await Promise.all([fetchFighter(), fetchFighter()]);
                pool.push([f1, f2]);
            }
            setGenProgress(100);

            await fetch(`/api/lobby/${lobbyId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'start_game', pool })
            });
        } catch (e) {
            console.error("Wystąpił błąd podczas startu", e);
            setIsGenerating(false);
        }
    };

    if (gameStarted) {
        return (
            <main className="main-layout" style={{ maxWidth: '100%', padding: '0' }}>
                <MultiplayerArena lobbyId={lobbyId} nickname={nickname} isHost={isHost} />
            </main>
        );
    }

    if (loading) {
        return (
            <main className="landing-layout">
                <div className="bg-decoration-1" />
                <div className="bg-decoration-2" />
                <div className="center-console">
                    <div className="spinner"></div>
                    <p className="loading-text">AUTORYZACJA...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="landing-layout">
            <ProfileBadge />
            <div className="bg-decoration-1" />
            <div className="bg-decoration-2" />

            {!hasJoined ? (
                // PLAYER 2 JOIN SCREEN
                <div className="glass-panel" style={{ padding: '40px', maxWidth: '500px', width: '100%', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h2 className="choice-title" style={{ textAlign: 'center', color: 'var(--cyan)' }}>Dołącz do {lobbyId.toUpperCase()}</h2>
                    <p className="text-muted" style={{ textAlign: 'center' }}>Zostałeś zaproszony do walki na arenie.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label className="text-muted font-bold text-sm">Twój Pseudonim</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            maxLength={15}
                            className="premium-input"
                            placeholder="Wpisz nick..."
                            autoFocus
                            disabled={!!user}
                        />
                        {user && <span className="text-gold text-sm text-center">Zalogowano! Zapiszesz swój wynik na koncie.</span>}
                    </div>

                    <button onClick={handleJoinLobby} className="premium-btn" style={{ marginTop: '10px' }}>
                        Wejdź do Pokoju
                    </button>
                    {!user && (
                        <button onClick={() => router.push(`/dashboard?returnTo=/lobby/${lobbyId}`)} className="premium-btn" style={{ background: 'transparent', border: '1px dashed var(--gold)', color: 'var(--gold)', marginTop: '-10px', fontSize: '1rem', padding: '12px' }}>
                            Zaloguj się / Załóż konto 👑
                        </button>
                    )}
                    <button onClick={() => router.push('/')} className="premium-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px' }}>
                        Anuluj
                    </button>
                </div>
            ) : (
                // LOBBY WAITING ROOM (Both host and p2)
                <div className="glass-panel" style={{ padding: '40px', maxWidth: '600px', width: '100%', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 className="choice-title" style={{ color: 'var(--gold)' }}>Pokój Walki</h2>
                        <h1 style={{ fontSize: '3rem', margin: '10px 0', letterSpacing: '8px', color: 'var(--primary)' }}>{lobbyId.toUpperCase()}</h1>

                        {isHost && (
                            <p className="text-muted">
                                Wyślij ten link przeciwnikowi: <br />
                                <code style={{ background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '5px', color: 'var(--cyan)' }}>
                                    {typeof window !== 'undefined' ? `${window.location.origin}/lobby/${lobbyId}` : `.../lobby/${lobbyId}`}
                                </code>
                            </p>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                        <h3 className="text-gold font-bold text-center mb-2" style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>Gracze ({lobbyState?.players?.length || 1})</h3>
                        {lobbyState?.players ? lobbyState.players.map((p: any, i: number) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: p.isHost ? '3px solid var(--gold)' : '3px solid var(--cyan)' }}>
                                <span className={p.isHost ? "text-gold font-bold" : "text-cyan font-bold"}>{p.nick} {p.isHost && "(Host)"}</span>
                                <span className={p.isHost ? "text-gold" : "text-muted"} style={{ fontSize: '0.9rem' }}>{p.ready ? 'Gotowy' : 'Oczekujący'}</span>
                            </div>
                        )) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--gold)' }}>
                                <span className="text-gold font-bold">{nickname} (Host)</span>
                                <span className="text-muted" style={{ fontSize: '0.9rem' }}>Oczekujący...</span>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.9rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                            <span className="text-muted">Rundy:</span> <span className="text-gold pull-right font-bold">{lobbyState?.settings?.rounds || initialRounds || '?'}</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                            <span className="text-muted">Timer:</span> <span className="text-gold pull-right font-bold">{lobbyState?.settings?.timer ? lobbyState.settings.timer + 's' : (initialTimer !== '0' ? initialTimer + 's' : 'Brak')}</span>
                        </div>
                    </div>

                    {isHost ? (
                        <button disabled={lobbyState?.players?.length < 2 || isGenerating} onClick={handleStartGame} className={lobbyState?.players?.length >= 2 ? "premium-btn text-gold" : "premium-btn"} style={{ width: '100%' }}>
                            {lobbyState?.players?.length >= 2 ? (isGenerating ? `Pobieranie aren z Wikipedii... ${genProgress}%` : "Rozpocznij Starcie! ⚔️") : "Czekam na graczy..."}
                        </button>
                    ) : (
                        <button disabled className="premium-btn text-gold" style={{ width: '100%' }}>
                            {lobbyState?.status === 'starting' ? "Oczekiwanie na start Hosta..." : "Czekam na akcję Hosta..."}
                        </button>
                    )}
                </div>
            )}

            <div className="version-text">
                WIKI-GLADIATORS ONLINE LOBBY
            </div>
        </main>
    );
}
