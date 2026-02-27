'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, loading, checkSession, logout } = useAuth();
    const router = useRouter();

    // Auth local state
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setAuthLoading(true);

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Wystąpił błąd');
            }

            if (!isLogin) {
                // Automatically login after successful registration
                const loginRes = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                if (!loginRes.ok) throw new Error('Zarejestrowano, ale błąd logowania. Spróbuj się zalogować.');
            }

            await checkSession();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (loading) {
        return (
            <main className="landing-layout flex items-center justify-center min-h-screen">
                <div className="bg-decoration-1" />
                <div className="bg-decoration-2" />
                <div className="spinner scale-150" />
            </main>
        );
    }

    // --- UNAUTHENTICATED VIEW (Login & Register) ---
    if (!user) {
        return (
            <main className="landing-layout flex items-center justify-center min-h-screen relative overflow-hidden">
                {/* Background decorations */}
                <div className="bg-decoration-1 opacity-50" />
                <div className="bg-decoration-2 opacity-50" />

                <div className="absolute top-6 left-6 z-50">
                    <button
                        onClick={() => router.push('/')}
                        className="text-gray-400 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-sm transition-colors"
                    >
                        ← Wróć do Areny
                    </button>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="glass-panel p-10 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl border border-white/5">
                        {/* Subtle glow behind the form */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b ${isLogin ? 'from-blue-500/20' : 'from-emerald-500/20'} to-transparent opacity-50 pointer-events-none transition-colors duration-700`} />

                        <div className="text-center mb-8 relative z-10">
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 mb-2 tracking-tight">
                                {isLogin ? 'Brama Areny' : 'Nowy Gladiator'}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {isLogin ? 'Zaloguj się, aby uzyskać dostęp do swoich zasobów.' : 'Zarejestruj się, aby budować swoją legendę.'}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-4 rounded-xl mb-6 text-center animate-pulse">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Pseudonim</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/40 border border-gray-700/50 text-white rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all placeholder-gray-700"
                                    placeholder="np. Maximus99"
                                    required
                                    minLength={3}
                                    maxLength={20}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Hasło</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-gray-700/50 text-white rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all placeholder-gray-700"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={authLoading}
                                className={`w-full font-black text-white py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2 ${isLogin
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-[0_0_30px_rgba(5,150,105,0.4)]'
                                    }`}
                            >
                                {authLoading ? 'AUTORYZACJA...' : (isLogin ? 'WEJDŹ NA ARENĘ' : 'STWÓRZ KONTO')}
                            </button>
                        </form>

                        <div className="mt-8 text-center relative z-10">
                            <button
                                type="button"
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="text-gray-500 text-sm font-medium hover:text-white transition-colors"
                            >
                                {isLogin ? 'Nie masz konta? Zarejestruj się →' : 'Masz już konto? Zaloguj się →'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // --- AUTHENTICATED VIEW (Dashboard / RPG Profile) ---
    const winRate = user.total_games > 0 ? Math.round((user.wins / user.total_games) * 100) : 0;

    return (
        <main className="min-h-screen bg-[#0a0f18] text-white p-6 md:p-12 relative overflow-x-hidden">
            {/* Background decorations */}
            <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

            {/* Header */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 relative z-10 gap-6 border-b border-gray-800 pb-6">
                <div>
                    <button
                        onClick={() => router.push('/')}
                        className="text-gray-400 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs mb-4 transition-colors"
                    >
                        ← WRÓĆ DO LOBBY
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-tighter">
                        Profil Gladiatora
                    </h1>
                </div>

                <div className="flex items-center gap-4 bg-gray-900/80 p-2 pr-6 rounded-full border border-gray-800 shadow-xl backdrop-blur-md">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-xl border-2 border-gray-600 text-gray-300">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-lg leading-tight">{user.username}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Połączono
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="ml-4 text-xs font-bold text-red-400 hover:text-white px-3 py-1.5 rounded-lg border border-red-900/30 hover:bg-red-900/30 transition-all"
                    >
                        Wyloguj
                    </button>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

                {/* Left Column - Core Stats */}
                <div className="space-y-6">
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-colors shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full blur-[30px] group-hover:bg-gold/20 transition-colors" />
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            📊 Osiągnięcia na Arenie
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-gray-800 pb-4">
                                <span className="text-gray-400 font-medium">Zwycięstwa</span>
                                <span className="text-3xl font-black text-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">{user.wins}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-gray-800 pb-4">
                                <span className="text-gray-400 font-medium">Porażki</span>
                                <span className="text-xl font-bold text-red-500">{user.losses}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-gray-800 pb-4">
                                <span className="text-gray-400 font-medium">Rozegrane Walki</span>
                                <span className="text-xl font-bold text-white">{user.total_games}</span>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between text-xs mb-1 font-bold text-gray-500">
                                    <span>Win Rate</span>
                                    <span>{winRate}%</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500"
                                        style={{ width: `${winRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center & Right Column - Future RPG Elements */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/10 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                            <div>
                                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="text-base">🛡️</span> Ranga Gladiatora
                                </h2>
                                <h3 className="text-3xl font-black text-white mt-1">Złoty Rekrut</h3>
                                <p className="text-indigo-200/50 text-sm mt-3 leading-relaxed">
                                    System Rankingowy jest obecnie w fazie kalibracji. Zdobywaj wygrane solo i multi, aby odblokować wyższe ligi w nadchodzącym sezonie!
                                </p>
                            </div>
                            <div className="mt-6 flex items-center gap-3">
                                <div className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg">WKRÓTCE</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/10 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                            <div>
                                <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="text-base">⚡</span> Drzewko Umiejętności
                                </h2>
                                <h3 className="text-2xl font-black text-white mt-1">Klasy Postaci</h3>
                                <p className="text-emerald-200/50 text-sm mt-3 leading-relaxed">
                                    Odblokuj unikalne pasywki! Np. zniżka w sklepie pomiędzy rundami albo możliwość spojrzenia w statystyki wroga.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center gap-3">
                                <div className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/30">ZABLOKOWANE</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 pb-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            🌍 Globalny Ranking Tygodnia (Preview)
                        </h2>

                        <div className="opacity-50 pointer-events-none grayscale sepia-[.2]">
                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl mb-3 border border-gray-700/50">
                                <div className="flex items-center gap-4">
                                    <span className="text-gold font-black text-xl w-6 text-center">1</span>
                                    <span className="font-bold text-white">Dominator2000</span>
                                </div>
                                <span className="text-gold font-bold">142 🏆</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl mb-3 border border-gray-700/50">
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-400 font-black text-xl w-6 text-center">2</span>
                                    <span className="font-bold text-white">WikiCzytacz</span>
                                </div>
                                <span className="text-gray-300 font-bold">89 🏆</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                                <div className="flex items-center gap-4">
                                    <span className="text-orange-400 font-black text-xl w-6 text-center">3</span>
                                    <span className="font-bold text-white">Arek_Test</span>
                                </div>
                                <span className="text-gray-300 font-bold">76 🏆</span>
                            </div>
                        </div>

                        {/* Overlay blurring the leaderboard */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0f18] flex items-end justify-center pb-8 p-4 z-10">
                            <div className="px-6 py-3 bg-gray-900/90 border border-gray-700 rounded-full font-bold text-gray-400 text-sm tracking-wide shadow-2xl backdrop-blur-md">
                                SEZON RANKINGOWY ROZPOCZNIE SIĘ W NASTĘPNYM PATCHU
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
