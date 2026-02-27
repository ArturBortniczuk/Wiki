'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    username: string;
    wins: number;
    losses: number;
    total_games: number;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    checkSession: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    checkSession: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/auth/me', {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.authenticated && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (e) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
        } catch (e) {
            console.error('Błąd podczas wylogowywania', e);
        }
    };

    // Check login state on first mount
    useEffect(() => {
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, checkSession, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
