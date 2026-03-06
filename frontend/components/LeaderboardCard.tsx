"use client";

import React, { useEffect, useState } from "react";

//mapping to my dto class in java for the fetch request to map each item correctly
type LeaderboardEntry = {
  subjectName: string;
  cardsStudied: number;
  totalSuccesses: number;
  totalFailures: number;
  points: number;
  accuracyPercentage: number;
  lastStudied: string;
};

//function for my accuracy bar component
function AccuracyBar({ percentage }: { percentage: number }) {
  const color =
    percentage >= 75
      ? "bg-green-400"
      : percentage >= 50
      ? "bg-yellow-400"
      : "bg-red-400";

  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-700`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default function LeaderboardCard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //when the page first loads I will fetch the leaderboard data from the endpoint
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/leaderboard/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();
        setEntries(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading)
    return <div className="text-center py-10 text-gray-400">Loading leaderboard...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (entries.length === 0)
    return (
      <div className="text-center py-10 text-gray-400">
        No data yet — start studying to see your progress here!
      </div>
    );
  //to stand out the top 3 can have these medals
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Your Subject Leaderboard</h2>
      <p className="text-sm text-gray-400 -mt-2 mb-4">Ranked by accuracy, best subject first</p>

      {entries.map((entry, index) => (
        <div
          key={entry.subjectName}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
        >
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* added the medals here and # if its lower than 3 */}
              <span className="text-2xl">{medals[index] ??  `#${index + 1}`}</span>
              <div>
                <p className="text-lg font-semibold text-gray-800">{entry.subjectName}</p>
                <p className="text-xs text-gray-400">Last studied: {entry.lastStudied}</p>
              </div>
            </div>
            {/* Points badge */}
            <span className="bg-indigo-50 text-indigo-600 font-bold text-sm px-3 py-1 rounded-full">
              {entry.points} pts
            </span>
          </div>

          {/* Accuracy bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Accuracy</span>
              <span className="font-semibold text-gray-700">{entry.accuracyPercentage}%</span>
            </div>
            <AccuracyBar percentage={entry.accuracyPercentage} />
          </div>

          {/* Stats row */}
          {/* i added emojis for a more interactive look and to fill spaces */}
          <div className="flex gap-4 text-sm text-gray-500 mt-1">
            <span>📚 <strong className="text-gray-700">{entry.cardsStudied}</strong> cards studied</span>
            <span>✅ <strong className="text-green-600">{entry.totalSuccesses}</strong> correct</span>
            <span>❌ <strong className="text-red-500">{entry.totalFailures}</strong> incorrect</span>
          </div>
        </div>
      ))}
    </div>
  );
}
