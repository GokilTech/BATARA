// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

type AuthContextType = {
    session: Session | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const value = {
        session,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};