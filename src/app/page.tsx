'use client';

import React, { useState } from 'react';
import Arena from '@/components/Arena';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProfileBadge from '@/components/ProfileBadge';

export default function Home() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [gameMode, setGameMode] = useState<'menu' | 'solo' | 'multi_config' | 'multi_join'>('menu');

  // Multi config state
  const [nickname, setNickname] = useState('');
  const [joinLobbyId, setJoinLobbyId] = useState('');
  const [rounds, setRounds] = useState('3');
  const [timer, setTimer] = useState('30');
  const [shopEnabled, setShopEnabled] = useState(true);

  const startMultiplayer = async () => {
    const finalNickname = user?.username || nickname.trim();
    if (!finalNickname) {
      alert("Podaj swój pseudonim!");
      return;
    }
    // Generate simple ID
    const lobbyId = Math.random().toString(36).substring(2, 6).toUpperCase();

    try {
      await fetch('/api/lobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lobbyId,
          hostNick: finalNickname,
          settings: { rounds, timer, shopEnabled }
        })
      });

      // Redirect to lobby view with host flag and settings embedded
      router.push(`/lobby/${lobbyId}?host=1&nick=${encodeURIComponent(finalNickname)}&r=${rounds}&t=${timer}&s=${shopEnabled ? 1 : 0}`);
    } catch (err) {
      console.error("Failed to create lobby", err);
      alert("Błąd połączenia z serwerem Redis!");
    }
  };

  const handleJoinMultiplayer = () => {
    const finalNickname = user?.username || nickname.trim();
    if (!finalNickname) {
      alert("Podaj swój pseudonim!");
      return;
    }
    if (!joinLobbyId.trim() || joinLobbyId.length < 4) {
      alert("Wpisz poprawny, 4-znakowy kod Lobby!");
      return;
    }

    router.push(`/lobby/${joinLobbyId.toUpperCase()}`);
  };

  if (gameMode === 'solo') {
    return (
      <main className="main-layout">
        <Arena />
      </main>
    );
  }

  return (
    <main className="landing-layout">

      {/* Background decorations */}
      <div className="bg-decoration-1" />
      <div className="bg-decoration-2" />

      {/* Top Navigation / User Profile Banner */}
      <ProfileBadge />

      <div style={{ marginTop: '80px' }} />

      <p className="landing-subtitle">
        Najpotężniejsza arena w polskim internecie. Zmierz się z absolutnym chaosem generowanym z zasobów Wikipedii. Gdzie algorytmy określają Twoje przetrwanie.
      </p>

      {gameMode === 'menu' && (
        <div className="landing-buttons">
          <button
            onClick={() => setGameMode('solo')}
            className="premium-btn"
          >
            Rozpocznij Solo
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setGameMode('multi_join')}
              className="premium-btn text-cyan"
              style={{ padding: '16px 20px', fontWeight: 900 }}
            >
              Dołącz 🔗
            </button>
            <button
              onClick={() => setGameMode('multi_config')}
              className="premium-btn text-gold"
              style={{ padding: '16px 20px', fontWeight: 900 }}
            >
              Stwórz ⚔️
            </button>
          </div>
        </div>
      )}

      {gameMode === 'multi_join' && (
        <div className="glass-panel" style={{ padding: '30px', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10 }}>
          <h2 className="choice-title" style={{ textAlign: 'center', color: 'var(--cyan)' }}>Dołącz do Pokoju</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label className="text-muted font-bold text-sm">Twój Pseudonim</label>
            <input
              type="text"
              value={nickname || user?.username || ''}
              onChange={e => setNickname(e.target.value)}
              maxLength={15}
              className="premium-input"
              placeholder={user ? user.username : "Wpisz nick..."}
              disabled={!!user}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label className="text-muted font-bold text-sm">Kod Lobby (4 znaki)</label>
            <input
              type="text"
              maxLength={4}
              value={joinLobbyId}
              onChange={e => setJoinLobbyId(e.target.value.toUpperCase())}
              className="premium-input"
              style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '10px', textTransform: 'uppercase' }}
              placeholder="----"
            />
          </div>

          <div className="action-buttons" style={{ marginTop: '20px' }}>
            <button onClick={() => setGameMode('menu')} className="bet-btn bet-left" style={{ width: 'auto', flex: 1 }}>
              Wróć
            </button>
            <button onClick={handleJoinMultiplayer} className="bet-btn bet-right text-cyan" style={{ width: 'auto', flex: 1 }}>
              Wejdź! 🔗
            </button>
          </div>
        </div>
      )}

      {gameMode === 'multi_config' && (
        <div className="glass-panel" style={{ padding: '30px', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10 }}>
          <h2 className="choice-title" style={{ textAlign: 'center', color: 'var(--gold)' }}>Nowy Pokój</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label className="text-muted font-bold text-sm">Twój Pseudonim (Host)</label>
            <input
              type="text"
              value={nickname || user?.username || ''}
              onChange={e => setNickname(e.target.value)}
              maxLength={15}
              className="premium-input"
              placeholder={user ? user.username : "Wpisz nick..."}
              disabled={!!user}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label className="text-muted font-bold text-sm">Zwycięstw do Końca Gry</label>
            <input
              type="number"
              min="1"
              max="100"
              value={rounds}
              onChange={e => setRounds(e.target.value)}
              className="premium-input"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label className="text-muted font-bold text-sm">Czas na decyzję w rundzie</label>
            <select value={timer} onChange={e => setTimer(e.target.value)} className="premium-input">
              <option value="15">Szybka gra (15s)</option>
              <option value="30">Standard (30s)</option>
              <option value="60">Zastanowienie (60s)</option>
              <option value="0">Brak limitu</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
            <input
              type="checkbox"
              id="opt-shop"
              checked={shopEnabled}
              onChange={e => setShopEnabled(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="opt-shop" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
              Sklep z informacjami (Kupowanie podglądu statystyk za punkty; odznaczenie zakrywa je na stałe aż do startu walki)
            </label>
          </div>

          <div className="action-buttons" style={{ marginTop: '20px' }}>
            <button onClick={() => setGameMode('menu')} className="bet-btn bet-left" style={{ width: 'auto', flex: 1 }}>
              Wróć
            </button>
            <button onClick={startMultiplayer} className="bet-btn bet-right text-gold" style={{ width: 'auto', flex: 1 }}>
              Stwórz Pokój 🚀
            </button>
          </div>
        </div>
      )}

      <div className="version-text">
        VERSION 3.0 • VERCEL EDITION
      </div>
    </main>
  );
}
