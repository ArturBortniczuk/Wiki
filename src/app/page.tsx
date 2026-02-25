'use client';

import React, { useState } from 'react';
import Arena from '@/components/Arena';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  if (gameStarted) {
    return (
      <main className="min-h-screen p-8 flex flex-col items-center">
        <Arena />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[var(--cyan)]/10 rounded-full blur-[100px] pointer-events-none" />

      <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-[var(--primary)] to-[var(--red)] drop-shadow-2xl z-10">
        WIKI-GLADIATORS
      </h1>

      <p className="text-xl md:text-2xl text-[var(--text-muted)] mb-12 max-w-2xl z-10 font-light">
        Najpotężniejsza arena w Polskim internecie. Zmierz się z absolutnym chaosem generowanym z zasobów Wikipedii.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 z-10">
        <button
          onClick={() => setGameStarted(true)}
          className="premium-btn text-xl py-4 px-12 uppercase tracking-widest min-w-[250px]"
        >
          Rozpocznij Solo
        </button>
        <button
          disabled
          className="premium-btn text-xl py-4 px-12 uppercase tracking-widest min-w-[250px] relative overflow-hidden group"
        >
          <span className="opacity-40">Graj Multi</span>
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm text-[var(--gold)]">
            DOSTĘPNE WKRÓTCE
          </div>
        </button>
      </div>

      <div className="mt-24 text-sm text-[var(--text-muted)]/50 uppercase tracking-[0.3em] font-mono z-10">
        VERSION 3.0 • VERCEL EDITION
      </div>
    </main>
  );
}
