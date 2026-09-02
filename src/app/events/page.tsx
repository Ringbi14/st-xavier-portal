"use client";

import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Users, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { DepartmentEvent } from "@/lib/types";

export default function EventsPage() {
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DepartmentEvent[];
        setEvents(fetched);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Department Calendar
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Events & Activities
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Workshops, rural camps, seminars, and community exposure programs.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            Scheduled Activities
          </h2>

          {loading ? (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-center gap-3 text-slate-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              Loading scheduled activities...
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-sm">
              No upcoming events scheduled at this moment. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      {event.isUpcoming ? "Upcoming" : "Completed"}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{event.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{event.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span>{event.venue}</span>
                    </div>
                    {event.resourcePerson && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-500" />
                        <span>Resource Person: {event.resourcePerson}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}