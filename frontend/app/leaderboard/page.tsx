import React from "react";
import DashNavbar from "@/components/DashNavbar";
import LeaderboardCard from "@/components/LeaderboardCard";

export default function LeaderboardPage() {
  return (
    <main className="bg-[#F5F5F7] min-h-screen flex flex-col">
      <DashNavbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-8 py-12">

        <LeaderboardCard />
      </div>
    </main>
  );
}
