"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Calendar,
  Plus,
} from "lucide-react";
import DashNavbar from "@/components/DashNavbar";
import { useRouter } from "next/navigation";

//sample data to be used to show some stats data for the dashboard
const stats = {
  totalFlashcards: 165,
  cardsMastered: 117,
  studySessions: 45,
  overallProgress: 71,
};

const todayGoal = {
  reviewed: 15,
  target: 20,
};

export default function Page() {
  const router = useRouter();

  return (
    <>
      <DashNavbar />
      <main className="p-8 bg-[#F5F5F7] min-h-screen">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold">Welcome back!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Here's an overview of your learning progress
          </p>
        </header>

        {/* Stats section */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-50">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Flashcards</p>
              <p className="text-2xl font-semibold">{stats.totalFlashcards}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-50">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cards Mastered</p>
              <p className="text-2xl font-semibold">{stats.cardsMastered}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-50">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Study Sessions</p>
              <p className="text-2xl font-semibold">{stats.studySessions}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-violet-50">
              <TrendingUp className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall Progress</p>
              <p className="text-2xl font-semibold">{stats.overallProgress}%</p>
            </div>
          </div>
        </section>

        {/* Banner and Today's Goal section*/}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-15">
          <div className="lg:col-span-2 bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-2xl p-8 flex flex-col justify-between shadow-md">
            <div>
              <p className="text-sm opacity-80">🔥 Continue your streak!</p>
              <h3 className="text-2xl font-bold mt-2">Ready to study?</h3>
              <p className="mt-2 text-sm text-white/90 max-w-xl">
                You've been making great progress. Keep up the momentum!
              </p>
            </div>
            <div className="mt-4">
              {/* Redirects to the Revise page to pick materials */}
              <button
                onClick={() => router.push("/revise")}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-50 transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <SparkleIcon />
                  Start Studying
                </span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Goal</p>
                <p className="text-3xl font-semibold">
                  {todayGoal.reviewed}/{todayGoal.target}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-indigo-600"
                  style={{ width: `${(todayGoal.reviewed / todayGoal.target) * 100}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-gray-500">5 more cards to reach your goal</p>
            </div>
          </div>
        </section>


      </main>
    </>
  );
}

function SparkleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 2l1.5 3 3 1.5-3 1.5L12 12l-1.5-3L7 7.5 10 6 11.5 3z" strokeWidth="1.2" />
    </svg>
  );
}
