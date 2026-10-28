"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshClaims: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signInWithEmail: async () => {},
  logout: async () => {},
  refreshClaims: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const syncUserState = async (currentUser: User) => {
    try {
      // Authoritative check: Admin access is strictly granted via refreshed Firebase Auth custom claim
      const tokenResult = await currentUser.getIdTokenResult(true);
      const hasAdminAccess = tokenResult.claims.admin === true;

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      const profileData = docSnap.exists()
        ? (docSnap.data() as UserProfile)
        : null;

      setProfile(profileData);
      setIsAdmin(hasAdminAccess);

      return {
        hasAdminAccess,
        profileData,
      };
    } catch (e) {
      console.error("Error evaluating administrative user permissions:", e);
      setIsAdmin(false);
      setProfile(null);
      return {
        hasAdminAccess: false,
        profileData: null,
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await syncUserState(currentUser);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshClaims = async () => {
    if (auth.currentUser) {
      await syncUserState(auth.currentUser);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await syncUserState(cred.user);
    return cred;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signInWithEmail,
        logout,
        refreshClaims,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);