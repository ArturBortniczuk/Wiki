'use client';

import React, { useState } from 'react';
import Arena from '@/components/Arena';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [gameMode, setGameMode] = useState<'menu' | 'solo' | 'multi_config'>('menu');

  // Multi config state
  const [nickname, setNickname] = useState('');
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
      <div className="absolute top-4 right-4 flex gap-4 items-center z-50">
        {!loading && (
          user ? (
            <div
              onClick={() => router.push('/dashboard')}
              className="user-profile-pill cursor-pointer"
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <div className="profile-info" style={{ alignItems: 'flex-end', paddingRight: '10px', borderRight: '1px solid var(--border-color)' }}>
                <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Rozegrane <span className="text-main">{user.total_games}</span>
                </span>
                <span className="text-accent" style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--accent)' }}>
                  W {user.wins} / P {user.losses}
                </span>
              </div>
              <div className="user-avatar" style={{ margin: '0 5px' }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info" style={{ gap: '2px' }}>
                <span className="profile-name" style={{ lineHeight: '1' }}>{user.username}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); logout(); }}
                  style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: '0.75rem', fontWeight: 'bold', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                >
                  Wyloguj się
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => router.push('/dashboard')}
              className="premium-btn text-gold"
              style={{ padding: '12px 30px', fontSize: '1rem', letterSpacing: '1px' }}
            >
              Zaloguj / Zarejestruj
            </button>
          )
        )}
      </div>

      <h1 className="landing-title">
        WIKI-GLADIATORS
      </h1>

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
          <button
            onClick={() => setGameMode('multi_config')}
            className="premium-btn text-gold"
            style={{ padding: '16px 40px', fontWeight: 900 }}
          >
            Graj Multi ⚔️
          </button>
        </div>
      )}

      {gameMode === 'multi_config' && (
        <div className="glass-panel" style={{ padding: '30px', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10 }}>
          <h2 className="choice-title" style={{ textAlign: 'center' }}>Konfiguracja Lobby</h2>

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
