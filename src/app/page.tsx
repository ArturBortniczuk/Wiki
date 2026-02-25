'use client';

import React, { useState } from 'react';
import Arena from '@/components/Arena';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [gameMode, setGameMode] = useState<'menu' | 'solo' | 'multi_config'>('menu');

  // Multi config state
  const [nickname, setNickname] = useState('');
  const [rounds, setRounds] = useState('3');
  const [timer, setTimer] = useState('30');
  const [shopEnabled, setShopEnabled] = useState(true);

  const startMultiplayer = async () => {
    if (!nickname.trim()) {
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
          hostNick: nickname,
          settings: { rounds, timer, shopEnabled }
        })
      });

      // Redirect to lobby view with host flag and settings embedded
      router.push(`/lobby/${lobbyId}?host=1&nick=${encodeURIComponent(nickname)}&r=${rounds}&t=${timer}&s=${shopEnabled ? 1 : 0}`);
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
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={15}
              className="premium-input"
              placeholder="Wpisz nick..."
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label className="text-muted font-bold text-sm">Ilość Przegranych do Końca Gry (Best of...)</label>
            <select value={rounds} onChange={e => setRounds(e.target.value)} className="premium-input">
              <option value="1">Pierwsza Krew (Do 1)</option>
              <option value="2">Klasyk (Do 2)</option>
              <option value="3">Turniej (Do 3) - Opcja Domyślna</option>
              <option value="5">Maraton (Do 5)</option>
            </select>
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
              Ukrywaj statystyki pod kłódką (Odkrywanie za Punkty)
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
