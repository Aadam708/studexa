"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type FlashcardDto = {
  id: number;
  documentId: number;
  frontText: string;
  backText: string;
};

export default function FlashcardViewer({ documentId }: { documentId: string }) {
  const router = useRouter();
  //setting the flashcards default states on load
  const [flashcards, setFlashcards] = useState<FlashcardDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/flashcards/${documentId}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch flashcards");
        const data = await res.json();
        setFlashcards(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [documentId]);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false); // resetting flip state back to false for the next card
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleAnswer = (correct: boolean) => {
    // Next feature here will be to track the progress when they click the right/wrong buttons
    //need to make the endpoint in my backend for userflashcard progress first
    console.log(`Card ${flashcards[currentIndex].id} marked as ${correct ? "Right" : "Wrong"}`);
    handleNext();
  };

  //showing the loading screen and if the enpoint shows any errors
  //like unauthorised showing an error mssg here for the user to see it

  if (loading) return <div className="text-center py-20 text-gray-500">Loading flashcards...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (flashcards.length === 0) return <div className="text-center py-20 text-gray-500">No flashcards found for this document.</div>;

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      {/* Progress & Return Back Button */}
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={() => router.back()} className="text-indigo-600 font-medium hover:underline">
          &larr; Back to Materials
        </button>
        <span className="text-gray-500 font-medium">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
      </div>

      {/* Main Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 bg-white rounded-3xl shadow-lg border border-gray-100 flex items-center justify-center p-8 cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
      >
        <p className="text-2xl text-center font-medium text-gray-800">
          {isFlipped ? currentCard.backText : currentCard.frontText}
        </p>
      </div>

      <p className="text-sm text-gray-400 mt-4 mb-8">Click the card to flip</p>

      {/* Navigation & Controls */}
      <div className="w-full flex items-center justify-between gap-4">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 bg-white rounded-full shadow-sm text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Right/wrong Buttons */}
        {isFlipped && (
          <div className="flex gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); handleAnswer(false); }}
              className="px-6 py-3 rounded-xl font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              Got it wrong
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleAnswer(true); }}
              className="px-6 py-3 rounded-xl font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
            >
              Got it right
            </button>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="p-3 bg-white rounded-full shadow-sm text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
