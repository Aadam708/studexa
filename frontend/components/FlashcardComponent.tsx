"use client"
import { Trophy, TrendingUp } from "lucide-react";
import { useState } from "react";

const FlashcardComponent = () => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <section className="flex flex-col justify-center items-center ">
      <div className="grid grid-cols-2 gap-5 bg-white p-10 rounded-2xl mt-20 mb-20">
        <div
          // perspective wrapper so the inner card flips in 3D (click to flip)
          className="w-full"
          style={{ perspective: 1000 }}
        >
          <div
            onClick={() => setShowAnswer((s) => !s)}
            role="button"
            aria-pressed={showAnswer}
            className="relative w-full h-full rounded-2xl"
            style={{
              transformStyle: "preserve-3d",
              transition:
                "transform 900ms cubic-bezier(.2,.8,.2,1), box-shadow 400ms ease",
              transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)",
              boxShadow: showAnswer
                ? "0 30px 60px rgba(20,184,166,0.12)"
                : "0 12px 30px rgba(2,6,23,0.06)",
              cursor: "pointer",
              willChange: "transform",
            }}
          >
            {/* front face */}
            <div
              className="absolute inset-0 flex flex-col justify-start gap-5
                shadow-none shadow-teal-200 hover:shadow-2xl hover:-translate-y-1
                bg-linear-to-br from-indigo-600 to-violet-600 rounded-2xl text-white pl-6 pr-13 py-15
                transition-all transition-duration-300"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-white/80">Sample flashcard</p>
              <h3 className="text-2xl font-bold">
                What is the pythagorean theorem?
              </h3>
              <p className="text-white/80">Click to reveal answer...</p>
            </div>

            {/* back face */}
            <div
              className="absolute inset-0 flex flex-col justify-start gap-5 shadow-none shadow-teal-200 hover:shadow-2xl hover:-translate-y-1 bg-linear-to-br from-indigo-600 to-violet-600 rounded-2xl text-white pl-6 pr-13 py-15 transition-all transition-duration-300"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            >
              <p className="text-white/80">Sample flashcard</p>
              <h3 className="text-2xl font-bold">
                The square of the hypotenuse equals the sum of the squares of
                the other two sides
              </h3>
              <p className="text-white/80">Click to reveal question...</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-7">
          <div className="flex flex-col rounded-2xl bg-[#F5F5F7] pl-7 pr-60 py-10">
            <div className="flex items-center gap-3 text-gray-700">
              <TrendingUp className="w-6 h-6" />
              <span>Today's progress</span>
            </div>
            <h3 className="font-bold text-3xl mt-2">88%</h3>
          </div>

          <div className="flex flex-col rounded-2xl bg-[#F5F5F7] pl-7 pr-60 py-10">
            <div className="flex items-center gap-3 text-gray-700">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>Cards mastered</span>
            </div>
            <h3 className="font-bold text-3xl mt-2">150</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashcardComponent;
