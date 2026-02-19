import React from "react";
import {
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Calendar,
  Plus,
} from "lucide-react";
import DashNavbar from "@/components/DashNavbar";


//sample data to mimic my real db data that will be made for each
// user after I implement the ai and google drive features
type Subject = {
  id: number;
  name: string;
  icon?: React.ReactNode;
  flashcards: number;
  mastered: number;
  sessions: number;
  colorClass?: string;
};

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

const subjects: Subject[] = [
  {
    id: 1,
    name: "Mathematics",
    icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
    flashcards: 45,
    mastered: 32,
    sessions: 12,
    colorClass: "from-indigo-100 to-indigo-50",
  },
  {
    id: 2,
    name: "Computer Science",
    icon: <BookOpen className="w-6 h-6 text-slate-700" />,
    flashcards: 30,
    mastered: 22,
    sessions: 10,
    colorClass: "from-slate-100 to-slate-50",
  },
  {
    id: 3,
    name: "Physics",
    icon: <BookOpen className="w-6 h-6 text-pink-600" />,
    flashcards: 38,
    mastered: 15,
    sessions: 8,
    colorClass: "from-pink-50 to-pink-25",
  },
  {
    id: 4,
    name: "Biology",
    icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
    flashcards: 52,
    mastered: 48,
    sessions: 15,
    colorClass: "from-emerald-50 to-emerald-25",
  },
];

export default function Page() {
  return (
    <>
    <DashNavbar></DashNavbar>
    <main className="p-8 bg-[#F5F5F7] min-h-screen">

      <header className="mb-6">
        <h2 className="text-2xl font-semibold">Welcome back, Aadam! 👋</h2>
        <p className="text-sm text-gray-500 mt-1">
          Here's an overview of your learning progress
        </p>
      </header>

      {/* stats section */}

        {/* allowing for 1 col all inline for big screens and for small ones 4 cols */ }

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

      {/* Banner + Today's Goal */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-2xl p-8 flex flex-col justify-between shadow-md">
          <div>
            <p className="text-sm opacity-80">🔥 Continue your streak!</p>
            <h3 className="text-2xl font-bold mt-2">Ready to study?</h3>
            <p className="mt-2 text-sm text-white/90 max-w-xl">
              You've been making great progress. Keep up the momentum!
            </p>
          </div>
          <div className="mt-4">
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium shadow">
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

      {/* Subjects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">Your Subjects</h4>
          <div className="flex items-center gap-3">
            <button className="text-sm px-3 py-1 rounded border border-gray-200 bg-white inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Material
            </button>
          </div>
        </div>

        {/*creatig a grid with each item being a subject from my sample data */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((s) => {
            const progress = Math.round((s.mastered / s.flashcards) * 100);
            return (
              <div key={s.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-indigo-50">{s.icon}</div>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-gray-400">{s.flashcards} flashcards</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 px-3 py-1 rounded-lg bg-gray-50">
                    {progress}%
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-black"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{s.mastered} / {s.flashcards} mastered</span>
                    <span className="inline-flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" /> {s.sessions} sessions
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <button className="text-indigo-600 text-sm font-medium">Study →</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
    </>
  );
}

//making sure the sparkle icon is inline in helper func to be used in start studying scection
function SparkleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 2l1.5 3 3 1.5-3 1.5L12 12l-1.5-3L7 7.5 10 6 11.5 3z" strokeWidth="1.2" />
    </svg>
);
}
