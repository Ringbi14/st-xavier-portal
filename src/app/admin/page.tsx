"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { 
  onAuthStateChanged, 
  signOut, 
  updateProfile,
  User 
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import {
  ShieldCheck,
  UserCheck,
  Users,
  UserCog,
  Bell,
  Calendar,
  Building2,
  FileDown,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Save,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Loader2
} from "lucide-react";

interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: "student" | "admin";
  status: "pending" | "approved" | "rejected";
  regNumber?: string;
  batch?: string;
  phone?: string;
  designation?: string;
  createdAt?: any;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "approvals" | "roster" | "profile" | "notices" | "events" | "organizations" | "downloads"
  >("approvals");

  // State: User Data
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [rosterSearch, setRosterSearch] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // State: Admin Profile Form
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileDesignation, setProfileDesignation] = useState("Faculty Coordinator");
  const [profileSaving, setProfileSaving] = useState(false);

  // State: Portal Content
  const [notices, setNotices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);

  // Form states for content management
  const [newNotice, setNewNotice] = useState({ title: "", category: "General", content: "", isUrgent: false });
  const [newEvent, setNewEvent] = useState({ title: "", date: "", venue: "", description: "" });
  const [newOrg, setNewOrg] = useState({ name: "", sector: "", location: "", contactPerson: "", contactPhone: "" });
  const [newDownload, setNewDownload] = useState({ title: "", category: "Fieldwork", fileUrl: "" });

  // 1. Check Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setCurrentUser(user);
        setProfileName(user.displayName || "");
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Fetch All Registered Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const q = query(collection(db, "users"));
      const snapshot = await getDocs(q);
      const userList: UserProfile[] = [];
      snapshot.forEach((d) => {
        userList.push({ id: d.id, ...d.data() } as UserProfile);
      });
      setAllUsers(userList);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  // 3. Live Sync Content Lists
  useEffect(() => {
    if (!currentUser) return;

    const unsubNotices = onSnapshot(collection(db, "notices"), (snap) => {
      setNotices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubEvents = onSnapshot(collection(db, "events"), (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubOrgs = onSnapshot(collection(db, "organizations"), (snap) => {
      setOrganizations(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubDownloads = onSnapshot(collection(db, "downloads"), (snap) => {
      setDownloads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubNotices();
      unsubEvents();
      unsubOrgs();
      unsubDownloads();
    };
  }, [currentUser]);

  // Actions: User Management
  const handleUpdateStatus = async (userId: string, newStatus: "approved" | "rejected") => {
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
      setActionMessage(`Student status successfully updated to ${newStatus}.`);
      fetchUsers();
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: "student" | "admin") => {
    const nextRole = currentRole === "admin" ? "student" : "admin";
    try {
      await updateDoc(doc(db, "users", userId), { role: nextRole });
      setActionMessage(`User access privilege updated to ${nextRole.toUpperCase()}.`);
      fetchUsers();
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  // Actions: Admin Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setProfileSaving(true);
    try {
      await updateProfile(currentUser, { displayName: profileName });
      
      // Update profile in Firestore users collection as well
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: profileName,
        phone: profilePhone,
        designation: profileDesignation,
      }).catch(async () => {
        // Fallback if doc doesn't exist under UID
        const q = query(collection(db, "users"), where("email", "==", currentUser.email));
        const res = await getDocs(q);
        if (!res.empty) {
          await updateDoc(doc(db, "users", res.docs[0].id), {
            name: profileName,
            phone: profilePhone,
            designation: profileDesignation,
          });
        }
      });

      setActionMessage("Administrative profile updated successfully.");
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setProfileSaving(false);
    }
  };

  // Actions: Content Creators & Removers
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title) return;
    await addDoc(collection(db, "notices"), {
      ...newNotice,
      createdAt: serverTimestamp(),
    });
    setNewNotice({ title: "", category: "General", content: "", isUrgent: false });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    await addDoc(collection(db, "events"), {
      ...newEvent,
      createdAt: serverTimestamp(),
    });
    setNewEvent({ title: "", date: "", venue: "", description: "" });
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg.name) return;
    await addDoc(collection(db, "organizations"), {
      ...newOrg,
      createdAt: serverTimestamp(),
    });
    setNewOrg({ name: "", sector: "", location: "", contactPerson: "", contactPhone: "" });
  };

  const handleCreateDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDownload.title || !newDownload.fileUrl) return;
    await addDoc(collection(db, "downloads"), {
      ...newDownload,
      createdAt: serverTimestamp(),
    });
    setNewDownload({ title: "", category: "Fieldwork", fileUrl: "" });
  };

  const handleDeleteItem = async (col: string, id: string) => {
    if (confirm("Are you sure you want to permanently remove this entry?")) {
      await deleteDoc(doc(db, col, id));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Checking authorization status...</p>
        </div>
      </div>
    );
  }

  // Filtered lists
  const pendingStudents = allUsers.filter((u) => u.status === "pending" || (!u.status && u.role === "student"));
  const approvedStudents = allUsers.filter((u) => u.status === "approved" || u.role === "student");
  const filteredRoster = approvedStudents.filter(
    (u) =>
      u.name?.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      u.regNumber?.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Dashboard Top Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-black uppercase tracking-wider">
                Institutional Administration
              </span>
              <span className="text-xs text-slate-400">Department of Social Work</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Portal Governance & Control Console
            </h1>
            <p className="text-xs text-slate-500">
              Authenticated Session: <span className="font-semibold text-teal-800">{currentUser?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                signOut(auth);
                router.push("/login");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 text-xs font-bold text-slate-700 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>

        {/* Toast / Notification Alert */}
        {actionMessage && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab("approvals")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "approvals"
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Student Approvals</span>
            {pendingStudents.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black">
                {pendingStudents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("roster")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "roster"
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Roster & Roles</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "profile"
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <UserCog className="w-4 h-4" />
            <span>Admin Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("notices")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "notices"
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notices</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "events"
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events</span>
          </button>

          <button
            onClick={() => setActiveTab("organizations")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "organizations"
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Agencies</span>
          </button>

          <button
            onClick={() => setActiveTab("downloads")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "downloads"
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <FileDown className="w-4 h-4" />
            <span>Downloads</span>
          </button>
        </div>

        {/* TAB 1: STUDENT APPROVALS QUEUE */}
        {activeTab === "approvals" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Pending Student Registrations ({pendingStudents.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Review new student registrations before giving access to practicum downloads and fieldwork updates.
                </p>
              </div>
              <button
                onClick={fetchUsers}
                className="text-xs font-bold text-teal-800 hover:underline inline-flex items-center gap-1"
              >
                Refresh Queue
              </button>
            </div>

            {pendingStudents.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No pending student approvals</p>
                <p className="text-xs text-slate-400">All registered student accounts have been processed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 px-3">Student Name</th>
                      <th className="pb-3 px-3">Email Address</th>
                      <th className="pb-3 px-3">Roll / Reg Number</th>
                      <th className="pb-3 px-3">Academic Batch</th>
                      <th className="pb-3 px-3 text-right">Verification Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {pendingStudents.map((stu) => (
                      <tr key={stu.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-3 font-bold text-slate-900">{stu.name || "Unnamed Student"}</td>
                        <td className="py-4 px-3 text-slate-600">{stu.email}</td>
                        <td className="py-4 px-3 font-mono text-slate-600">{stu.regNumber || "Not Provided"}</td>
                        <td className="py-4 px-3 text-slate-600">{stu.batch || "BSW"}</td>
                        <td className="py-4 px-3 text-right space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(stu.id, "approved")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-700 hover:text-white text-teal-800 border border-teal-200 font-bold transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(stu.id, "rejected")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-700 hover:text-white text-rose-700 border border-rose-200 font-bold transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STUDENT ROSTER & ROLE CONTROLS */}
        {activeTab === "roster" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Student Directory & Privilege Roster ({filteredRoster.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Manage active student cohorts and assign elevated administrative capabilities.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or roll..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-3">Student Name</th>
                    <th className="pb-3 px-3">Email</th>
                    <th className="pb-3 px-3">Registration ID</th>
                    <th className="pb-3 px-3">Access Level</th>
                    <th className="pb-3 px-3 text-right">Role Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRoster.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 px-3 font-bold text-slate-900">{user.name || "Student"}</td>
                      <td className="py-4 px-3 text-slate-600">{user.email}</td>
                      <td className="py-4 px-3 font-mono text-slate-500">{user.regNumber || "—"}</td>
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-800 border border-purple-200"
                              : "bg-teal-50 text-teal-800 border border-teal-200"
                          }`}
                        >
                          {user.role || "student"}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={() => handleToggleRole(user.id, user.role)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition"
                        >
                          {user.role === "admin" ? "Demote to Student" : "Promote to Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN PROFILE SETTINGS */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900">
                Administrator Profile & Coordinates
              </h2>
              <p className="text-xs text-slate-500">
                Update your administrative coordinator information and institutional contact credentials.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Account Email</label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs text-slate-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Full Display Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Dr. H. L. Vashum"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Designation / Role</label>
                  <input
                    type="text"
                    value={profileDesignation}
                    onChange={(e) => setProfileDesignation(e.target.value)}
                    placeholder="Fieldwork Coordinator"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Contact Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition"
                >
                  {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: NOTICES MANAGEMENT */}
        {activeTab === "notices" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Post Circular or Bulletin
              </h2>
              <form onSubmit={handleCreateNotice} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Notice Title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <select
                  value={newNotice.category}
                  onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option>General</option>
                  <option>Fieldwork</option>
                  <option>Examinations</option>
                  <option>Rural Camp</option>
                </select>
                <textarea
                  rows={4}
                  placeholder="Notice Details..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNotice.isUrgent}
                    onChange={(e) => setNewNotice({ ...newNotice, isUrgent: e.target.checked })}
                    className="rounded text-teal-700"
                  />
                  <span>Mark as Urgent Notice</span>
                </label>
                <button type="submit" className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold">
                  Publish Notice
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Published Notices ({notices.length})
              </h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {notices.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{n.title}</span>
                        {n.isUrgent && <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-black">Urgent</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{n.content}</p>
                    </div>
                    <button onClick={() => handleDeleteItem("notices", n.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EVENTS MANAGEMENT */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Schedule Department Event
              </h2>
              <form onSubmit={handleCreateEvent} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <input
                  type="date"
                  required
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Venue (e.g., Seminar Hall / Maram)"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <textarea
                  rows={3}
                  placeholder="Brief summary..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <button type="submit" className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold">
                  Schedule Event
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Upcoming Academic Calendar ({events.length})
              </h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {events.map((ev) => (
                  <div key={ev.id} className="p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                      <p className="text-[11px] text-slate-500">{ev.date} — {ev.venue}</p>
                    </div>
                    <button onClick={() => handleDeleteItem("events", ev.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ORGANIZATIONS DIRECTORY */}
        {activeTab === "organizations" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Add Fieldwork Partner Agency
              </h2>
              <form onSubmit={handleCreateOrg} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Organization / NGO Name"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Sector (e.g. Child Rights, Health)"
                  value={newOrg.sector}
                  onChange={(e) => setNewOrg({ ...newOrg, sector: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Location / District"
                  value={newOrg.location}
                  onChange={(e) => setNewOrg({ ...newOrg, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={newOrg.contactPerson}
                  onChange={(e) => setNewOrg({ ...newOrg, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <button type="submit" className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold">
                  Register Agency
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Partner Agencies Directory ({organizations.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                {organizations.map((org) => (
                  <div key={org.id} className="p-3.5 rounded-2xl border border-slate-100 flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{org.name}</h4>
                      <p className="text-[11px] text-teal-800 font-semibold">{org.sector}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{org.location}</p>
                    </div>
                    <button onClick={() => handleDeleteItem("organizations", org.id)} className="p-1 text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PRACTICUM DOWNLOADS */}
        {activeTab === "downloads" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Add Resource Download
              </h2>
              <form onSubmit={handleCreateDownload} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Document Name / Title"
                  value={newDownload.title}
                  onChange={(e) => setNewDownload({ ...newDownload, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <select
                  value={newDownload.category}
                  onChange={(e) => setNewDownload({ ...newDownload, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option>Fieldwork</option>
                  <option>Syllabus</option>
                  <option>Guidelines</option>
                  <option>Reports</option>
                </select>
                <input
                  type="url"
                  required
                  placeholder="File Link (Google Drive / Firebase URL)"
                  value={newDownload.fileUrl}
                  onChange={(e) => setNewDownload({ ...newDownload, fileUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
                <button type="submit" className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold">
                  Publish Download
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Published Resources ({downloads.length})
              </h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {downloads.map((d) => (
                  <div key={d.id} className="p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{d.title}</h4>
                      <p className="text-[11px] text-teal-800 font-semibold">{d.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-teal-700 hover:underline text-xs flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button onClick={() => handleDeleteItem("downloads", d.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}