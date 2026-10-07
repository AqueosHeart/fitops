"use client";

import { useEffect, useState } from "react";
import { api, friendlyError } from "@/lib/client/api";

type Program = { id: string; slug: string; name: string; description: string; intensity: string; durationMinutes: number };
export function PublicPrograms({ compact = false }: { compact?: boolean }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void api<{ programs: Program[] }>("/api/v1/programs").then((data) => setPrograms(data.programs)).catch((cause) => setError(friendlyError(cause))).finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="program-grid" aria-label="Loading programs" aria-busy="true">{[1, 2, 3].map((index) => <div className="skeleton" key={index} />)}</div>;
  if (error) return <div className="schedule-state state-error" role="alert">{error}</div>;
  if (!programs.length) return <div className="schedule-state">Program details will appear here when the demo catalog is available.</div>;
  return <div className="program-grid">{programs.map((program, index) => <article className="program-card" key={program.id}><span className="feature-index">0{index + 1} / {program.intensity.toLowerCase()}</span><h3>{program.name}</h3><p>{compact ? `${program.durationMinutes} minute sessions` : `${program.durationMinutes} minutes${program.description.length > 8 && program.description.toLowerCase() !== "test" ? ` · ${program.description}` : ""}`}</p></article>)}</div>;
}
