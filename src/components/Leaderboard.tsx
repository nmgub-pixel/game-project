"use client";

import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/scores")
      .then(res => res.json())
      .then(data => setScores(data))
      .catch(() => {});
  }, []);

  if (scores.length === 0) return <p className="text-[10px] text-slate-600">Пока нет рекордов...</p>;

  return (
    <div className="space-y-1">
      {scores.map((s, i) => (
        <div key={s.id} className="flex justify-between text-[10px]">
          <span className="text-slate-400">{i + 1}. {s.playerName} ({s.game})</span>
          <span className="font-bold">{s.score}</span>
        </div>
      ))}
    </div>
  );
}
