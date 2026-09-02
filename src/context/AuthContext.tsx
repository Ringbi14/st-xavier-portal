"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
  email: string;
  name?: string;
  role: "admin" | "student";
  createdAt?: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser && currentUser.email) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            // Case 1: Profile already mapped to this UID
            setProfile(userSnap.data() as UserProfile);
          } else {
            // Case 2: Check if email was pre-registered as an admin by document field
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", currentUser.email.toLowerCase().trim()));
            const querySnap = await getDocs(q);

            if (!querySnap.empty) {
              const matchedData = querySnap.docs[0].data() as UserProfile;
              // Link their UID to the existing pre-assigned role
              await setDoc(userDocRef, {
                ...matchedData,
                email: currentUser.email.toLowerCase().trim(),
                updatedAt: serverTimestamp(),
              });
              setProfile(matchedData);
            } else {
              // Case 3: Public student signup default
              const defaultStudentProfile: UserProfile = {
                email: currentUser.email.toLowerCase().trim(),
                name: currentUser.displayName || "Student",
                role: "student",
                createdAt: serverTimestamp(),
              };
              await setDoc(userDocRef, defaultStudentProfile);
              setProfile(defaultStudentProfile);
            }
          }
        } catch (error) {
          console.error("Error synchronizing user profile:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);