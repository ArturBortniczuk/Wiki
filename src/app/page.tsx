'use client';

import React, { useState } from 'react';
import Arena from '@/components/Arena';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  if (gameStarted) {
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

      <div className="landing-buttons">
        <button
          onClick={() => setGameStarted(true)}
          className="premium-btn"
        >
          Rozpocznij Solo
        </button>
        <button
          disabled
          className="premium-btn"
        >
          Graj Multi
          <div className="btn-hover-layer">
            DOSTĘPNE WKRÓTCE
          </div>
        </button>
      </div>

      <div className="version-text">
        VERSION 3.0 • VERCEL EDITION
      </div>
    </main>
  );
}
