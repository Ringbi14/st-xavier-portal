"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
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
  uid?: string;
  email: string;
  name?: string;
  rollNumber?: string;
  semester?: string;
  academicYear?: string;
  role: "admin" | "student";
  status?: "pending" | "approved" | "rejected";
  createdAt?: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  registerStudent: (
    email: string, 
    pass: string, 
    name: string, 
    rollNumber: string,
    semester: string,
    academicYear: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  login: async () => {},
  registerStudent: async () => {},
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
            setProfile(userSnap.data() as UserProfile);
          } else {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", currentUser.email.toLowerCase().trim()));
            const querySnap = await getDocs(q);

            if (!querySnap.empty) {
              const matchedData = querySnap.docs[0].data() as UserProfile;
              await setDoc(userDocRef, {
                ...matchedData,
                email: currentUser.email.toLowerCase().trim(),
                status: "approved",
                updatedAt: serverTimestamp(),
              });
              setProfile({ ...matchedData, status: "approved" });
            } else {
              const defaultStudent: UserProfile = {
                uid: currentUser.uid,
                email: currentUser.email.toLowerCase().trim(),
                name: currentUser.displayName || "Student",
                role: "student",
                status: "pending",
                createdAt: serverTimestamp(),
              };
              await setDoc(userDocRef, defaultStudent);
              setProfile(defaultStudent);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), pass);
  };

  const registerStudent = async (
    email: string, 
    pass: string, 
    name: string, 
    rollNumber: string,
    semester: string,
    academicYear: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const newStudentProfile: UserProfile = {
      uid: cred.user.uid,
      email: email.toLowerCase().trim(),
      name,
      rollNumber,
      semester,
      academicYear,
      role: "student",
      status: "pending",
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", cred.user.uid), newStudentProfile);
    setProfile(newStudentProfile);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, registerStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);