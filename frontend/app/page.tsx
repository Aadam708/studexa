import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FlashcardComponent from "@/components/FlashcardComponent";
import { Sparkles} from "lucide-react";


export default function Home() {

  return (
    <main className="bg-[#F5F5F7] w-full min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 pt-20 pb-16">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          AI-Powered Study Platform
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold
         tracking-tight text-center mb-6 max-w-4xl bg-linear-to-r  from-indigo-400 via-teal-400 to-blue-400 bg-clip-text text-transparent ">
          The Future of
          <span className="block bg-linear-to-r from-indigo-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
            Education
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 text-center max-w-3xl mb-10 leading-relaxed">
          Transform your study materials into interactive flashcards with AI. Learn smarter, not harder and achieve your academic goals faster than ever.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/get-started">
            <button className="px-8 py-3.5 rounded-lg hover:cursor-pointer hover:-translate-y-0.5 bg-linear-to-r from-indigo-500  to-blue-500 text-white font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              Start Your Journey Today
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>

          <Link href="/learn-more">
            <button className="px-8 py-3.5 rounded-lg bg-white text-gray-900 font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:cursor-pointer transition-all duration-200">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      <FlashcardComponent/>

    </main>
  );
}
