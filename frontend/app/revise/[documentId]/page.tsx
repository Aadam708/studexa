"use client";

import React from "react";
import DashNavbar from "@/components/DashNavbar";
import FlashcardViewer from "@/components/revise/FlashcardViewer";
import { useParams } from "next/navigation";

export default function DocumentFlashcardsPage() {
  const params = useParams();
  // params.documentId matches the [documentId] folder name so only viewing
  //flshcars with this doc id attached to it
  const documentId = Array.isArray(params.documentId) ? params.documentId[0] : params.documentId;

  return (
    <main className="bg-[#F5F5F7] min-h-screen flex flex-col">
      <DashNavbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-8 py-12">
        <FlashcardViewer documentId={documentId!} />
      </div>
    </main>
  );
}
