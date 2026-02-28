'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardPage() {
    const { user, loading, checkSession, logout } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');

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

            const sessionValid = await checkSession();
            if (!sessionValid) {
                throw new Error("Pomyślnie uwierzytelniono, ale nie odczytano sesji. Odśwież stronę.");
            }

            // Correctly route to the previous page if required, else to the authenticated dashboard view.
            if (returnTo) {
                router.push(returnTo);
            }
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
            <main className="landing-layout">
                <div className="bg-decoration-1" />
                <div className="bg-decoration-2" />
                <div className="center-console">
                    <div className="spinner"></div>
                    <p className="loading-text">ŁADOWANIE PROFILU...</p>
                </div>
            </main>
        );
    }

    // --- UNAUTHENTICATED VIEW (Login & Register) ---
    if (!user) {
        return (
            <main className="landing-layout">
                {/* Background decorations */}
                <div className="bg-decoration-1" style={{ opacity: 0.5 }} />
                <div className="bg-decoration-2" style={{ opacity: 0.5 }} />

                <button
                    onClick={() => router.push('/')}
                    className="return-btn-absolute"
                >
                    ← Wróć do Areny
                </button>

                <div className="glass-panel auth-form-card">
                    <h1 className="auth-title">
                        {isLogin ? 'Brama Areny' : 'Nowy Gladiator'}
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin ? 'Zaloguj się, aby uzyskać dostęp do swoich zasobów.' : 'Zarejestruj się, aby budować swoją legendę.'}
                    </p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleAuth}>
                        <div className="auth-field">
                            <label className="auth-label">Pseudonim</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="premium-input"
                                placeholder="np. Maximus99"
                                required
                                minLength={3}
                                maxLength={20}
                            />
                        </div>

                        <div className="auth-field">
                            <label className="auth-label">Hasło</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="premium-input"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={authLoading}
                            className={`auth-primary-btn ${!isLogin ? 'register' : ''}`}
                        >
                            {authLoading ? 'AUTORYZACJA...' : (isLogin ? 'WEJDŹ NA ARENĘ' : 'STWÓRZ KONTO')}
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="auth-toggle"
                    >
                        {isLogin ? 'Nie masz konta? Zarejestruj się →' : 'Masz już konto? Zaloguj się →'}
                    </button>
                </div>
            </main>
        );
    }

    // --- AUTHENTICATED VIEW (Dashboard / RPG Profile) ---
    const winRate = user.total_games > 0 ? Math.round((user.wins / user.total_games) * 100) : 0;

    return (
        <main>
            {/* Background decorations specific to dashboard */}
            <div className="bg-decoration-1" style={{ position: 'fixed', top: '0', left: '0', opacity: 0.3, transform: 'translate(-30%, -30%)' }} />
            <div className="bg-decoration-2" style={{ position: 'fixed', bottom: '0', right: '0', opacity: 0.3, top: 'auto', left: 'auto', transform: 'translate(30%, 30%)' }} />

            <div className="dashboard-layout">
                {/* Header */}
                <header className="dashboard-header">
                    <div>
                        <button
                            onClick={() => router.push('/')}
                            className="return-btn-absolute"
                            style={{ position: 'relative', top: '0', left: '0', marginBottom: '20px', padding: 0 }}
                        >
                            ← WRÓĆ DO LOBBY
                        </button>
                        <h1 className="dashboard-header-title">
                            Profil Gladiatora
                        </h1>
                    </div>

                    <div className="user-profile-pill">
                        <div className="user-avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-info">
                            <div className="profile-name">{user.username}</div>
                            <div className="profile-status">
                                <span className="status-dot" />
                                Połączono
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            Wyloguj
                        </button>
                    </div>
                </header>

                {/* Main Grid */}
                <div className="dashboard-grid">

                    {/* Left Column - Core Stats */}
                    <div>
                        <div className="dashboard-card glow-gold">
                            <h2 className="dashboard-card-title">
                                📊 Osiągnięcia na Arenie
                            </h2>

                            <div>
                                <div className="stat-item">
                                    <span>Zwycięstwa</span>
                                    <span className="stat-value large">{user.wins}</span>
                                </div>
                                <div className="stat-item">
                                    <span>Porażki</span>
                                    <span className="stat-value text-red">{user.losses}</span>
                                </div>
                                <div className="stat-item">
                                    <span>Rozegrane Walki</span>
                                    <span className="stat-value">{user.total_games}</span>
                                </div>
                                <div style={{ paddingTop: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                        <span>Win Rate</span>
                                        <span>{winRate}%</span>
                                    </div>
                                    <div className="progress-bar-container">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${winRate}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center & Right Column - Future RPG Elements */}
                    <div>

                        <div className="dashboard-subgrid">
                            <div className="rpg-card">
                                <div>
                                    <h2 className="dashboard-card-title" style={{ color: '#a0a0ff' }}>
                                        🛡️ Ranga Gladiatora
                                    </h2>
                                    <h3>Złoty Rekrut</h3>
                                    <p className="rpg-desc">
                                        System Rankingowy jest obecnie w fazie kalibracji. Zdobywaj wygrane solo i multi, aby odblokować wyższe ligi w nadchodzącym sezonie!
                                    </p>
                                </div>
                                <div className="badge-wrapper">
                                    <span className="badge-soon">WKRÓTCE</span>
                                </div>
                            </div>

                            <div className="rpg-card emerald">
                                <div>
                                    <h2 className="dashboard-card-title" style={{ color: '#a0ffa0' }}>
                                        ⚡ Drzewko Umiejętności
                                    </h2>
                                    <h3>Klasy Postaci</h3>
                                    <p className="rpg-desc">
                                        Odblokuj unikalne pasywki! Np. zniżka w sklepie pomiędzy rundami albo możliwość spojrzenia w statystyki wroga.
                                    </p>
                                </div>
                                <div className="badge-wrapper">
                                    <span className="badge-locked">ZABLOKOWANE</span>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-card" style={{ paddingBottom: '40px' }}>
                            <h2 className="dashboard-card-title">
                                🌍 Globalny Ranking Tygodnia (Preview)
                            </h2>

                            <div className="leaderboard-list">
                                <div className="lb-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span className="lb-rank first">1</span>
                                        <span className="lb-user">Dominator2000</span>
                                    </div>
                                    <span className="lb-score lb-score-gold">142 🏆</span>
                                </div>
                                <div className="lb-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span className="lb-rank second">2</span>
                                        <span className="lb-user">WikiCzytacz</span>
                                    </div>
                                    <span className="lb-score">89 🏆</span>
                                </div>
                                <div className="lb-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span className="lb-rank third">3</span>
                                        <span className="lb-user">Arek_Test</span>
                                    </div>
                                    <span className="lb-score">76 🏆</span>
                                </div>
                            </div>

                            {/* Overlay blurring the leaderboard */}
                            <div className="lb-overlay">
                                <div className="lb-notice">
                                    SEZON RANKINGOWY ROZPOCZNIE SIĘ W NASTĘPNYM PATCHU
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
