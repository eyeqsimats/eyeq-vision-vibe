import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../lib/firebase';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User as FirebaseUser,
    updateProfile
} from 'firebase/auth';
import api from '../api/axios';

interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
    register: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
                try {
                    await api.post('/users/sync', {
                        email: currentUser.email,
                        name: currentUser.displayName || 'Member',
                        uid: currentUser.uid
                    });
                } catch (e: any) {
                    console.error("Sync failed:", e.response?.data?.message || e.message || e);
                    // Continue even if sync fails - user is still authenticated in Firebase
                }
            }
        });
        return unsubscribe;
    }, []);

    const register = async (name: string, email: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            try {
                await api.post('/users/sync', {
                    email: userCredential.user.email,
                    name: name,
                    uid: userCredential.user.uid
                });
            } catch (syncError: any) {
                console.error('Sync failed after registration:', syncError.response?.data?.message || syncError.message);
                // User is registered in Firebase even if backend sync fails
            }
        } catch (error: any) {
            console.error('Registration failed:', error.message || error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle the sync automatically
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
