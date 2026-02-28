import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileBadge() {
    const router = useRouter();
    const { user, logout, loading } = useAuth();

    if (loading) return null;

    return (
        <div className="absolute top-4 right-4 flex gap-4 items-center" style={{ zIndex: 9999 }}>
            {user ? (
                <div
                    onClick={() => router.push('/dashboard')}
                    className="user-profile-pill cursor-pointer"
                    style={{ cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '15px' }}
                >
                    <div className="profile-info" style={{ alignItems: 'flex-end', paddingRight: '10px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                        <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Rozegrane <span style={{ color: 'var(--text-main)' }}>{user.total_games}</span>
                        </span>
                        <span className="text-accent" style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--accent)' }}>
                            W {user.wins} / P {user.losses}
                        </span>
                    </div>
                    <div className="user-avatar" style={{ margin: '0 5px' }}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info" style={{ gap: '2px', display: 'flex', flexDirection: 'column' }}>
                        <span className="profile-name" style={{ lineHeight: '1', fontWeight: 'bold' }}>{user.username}</span>
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
            )}
        </div>
    );
}
