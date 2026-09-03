"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Search, 
  Tag, 
  Sparkles 
} from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: "Fieldwork" | "Academic" | "Seminar" | "Camp";
  description: string;
}

const FALLBACK_EVENTS: EventItem[] = [
  {
    id: "e-1",
    title: "BSW Fieldwork Practicum Orientation",
    date: "2026-09-10",
    time: "10:00 AM - 01:00 PM",
    venue: "Main Auditorium, Academic Block",
    category: "Fieldwork",
    description: "Compulsory orientation on agency code of ethics, supervisory recording standards, and agency allocation criteria.",
  },
  {
    id: "e-2",
    title: "Workshop on Community Social Assessment & PRA Tools",
    date: "2026-09-18",
    time: "11:00 AM - 03:30 PM",
    venue: "Social Work Seminar Hall",
    category: "Seminar",
    description: "Hands-on workshop demonstrating resource mapping, seasonal calendars, and Venn diagrams for community practice.",
  },
  {
    id: "e-3",
    title: "Pre-Camp Logistics & Planning Conference",
    date: "2026-10-02",
    time: "02:00 PM - 04:30 PM",
    venue: "Department Conference Room",
    category: "Camp",
    description: "Committee review for transport, village committee consultation, and thematic cultural street-play rehearsals.",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Fieldwork", "Academic", "Seminar", "Camp"];

  useEffect(() => {
    try {
      const q = query(collection(db, "events"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: EventItem[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<EventItem, "id">),
          }));
          list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setEvents(list);
        } else {
          setEvents(FALLBACK_EVENTS);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Using fallback events:", err);
      setEvents(FALLBACK_EVENTS);
    }
  }, []);

  const filteredEvents = events.filter((ev) => {
    const matchesCat = selectedCategory === "All" || ev.category === selectedCategory;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Date formatter helpers
  const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "SEP" : date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  };

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "01" : date.getDate().toString().padStart(2, "0");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Header Banner */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Department Calendar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Events & Schedules
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              Stay informed about upcoming practicum orientations, rural camps, guest lectures, and academic conferences.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Filter and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schedule or venue..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition duration-300 flex flex-col md:flex-row md:items-center gap-6"
            >
              {/* Date Block */}
              <div className="flex md:flex-col items-center justify-center w-full md:w-24 h-16 md:h-24 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 gap-2 md:gap-0">
                <span className="text-xs font-extrabold tracking-wider uppercase">
                  {formatMonth(ev.date)}
                </span>
                <span className="text-2xl md:text-3xl font-black text-white">
                  {formatDay(ev.date)}
                </span>
              </div>

              {/* Event Details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                    {ev.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{ev.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ev.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{ev.time}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{ev.venue}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-slate-900/30 border border-dashed border-slate-800 text-xs text-slate-400">
              No events match your current filters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}