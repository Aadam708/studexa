"use client";

import React, { useState, useEffect } from "react";
import { Upload, FolderOpen, Sparkles } from "lucide-react";
import DashNavbar from "@/components/DashNavbar";

type Material = {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  cards: number;
  progress: number;
};

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
};

const sampleMaterials: Material[] = [
  {
    id: "1",
    title: "Pumping Lemma for Regular Languages",
    subject: "Computer Science",
    subjectColor: "text-blue-600",
    cards: 15,
    progress: 100,
  },
  {
    id: "2",
    title: "Quantum Mechanics Basics",
    subject: "Physics",
    subjectColor: "text-pink-600",
    cards: 4,
    progress: 40,
  },
  {
    id: "3",
    title: "Data Structures",
    subject: "Computer Science",
    subjectColor: "text-blue-600",
    cards: 4,
    progress: 11,
  },
  {
    id: "4",
    title: "Introduction to Calculus",
    subject: "Mathematics",
    subjectColor: "text-indigo-600",
    cards: 5,
    progress: 72,
  },
  {
    id: "5",
    title: "Cell Biology",
    subject: "Biology",
    subjectColor: "text-emerald-600",
    cards: 4,
    progress: 20,
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<"revise" | "materials">("revise");

  return (
    <main className="bg-[#F5F5F7] min-h-screen">
      <DashNavbar />

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Revise</h1>
          <p className="text-gray-600 mt-1">
            Upload materials and study with AI-generated flashcards
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("revise")}
            className={`pb-3 px-2 font-medium transition-colors relative ${
              activeTab === "revise"
                ? "text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upload Material
            {activeTab === "revise" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            className={`pb-3 px-2 font-medium transition-colors relative ${
              activeTab === "materials"
                ? "text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            My Materials
            {activeTab === "materials" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "revise" && <UploadSection />}
        {activeTab === "materials" && <MaterialsGrid materials={sampleMaterials} />}
      </div>
    </main>
  );
}

function UploadSection() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pickerLoaded, setPickerLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    checkAuthentication();

    // loading Google Picker API
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gapi.load("picker", {
        callback: () => {
          console.log("Picker loaded");
          setPickerLoaded(true);
        }
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const checkAuthentication = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/drive/authenticated", {
        credentials: "include",
      });
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  const handleConnectDrive = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/drive/auth-url", {
        credentials: "include",
      });
      const data = await res.json();
      window.location.href = data.authUrl;
    } catch (error) {
      console.error("Error connecting to Drive:", error);
      setLoading(false);
    }
  };

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

  const openGooglePicker = async () => {
    if (!pickerLoaded) {
      alert("Google Picker is still loading. Please wait.");
      return;
    }

    if (!isAuthenticated) {
      alert("Please connect to Google Drive first");
      return;
    }

    try {
      // Get access token from backend
      const tokenRes = await fetch("http://localhost:8080/api/drive/access-token", {
        credentials: "include",
      });

      if (!tokenRes.ok) {
        alert("Failed to get access token. Please reconnect to Google Drive.");
        return;
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.accessToken;

      // Create and show picker
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken(accessToken)
        .setDeveloperKey(API_KEY) // use env var here
        .setCallback(pickerCallback)
        .build();

      picker.setVisible(true);
    } catch (error) {
      console.error("Error opening picker:", error);
      alert("Failed to open Google Drive picker");
    }
  };

  const pickerCallback = (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const file = data.docs[0];
      setSelectedFile({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        url: file.url,
      });
      console.log("Selected file:", file);
    }
  };
  //this wont work yet as not implementd the google gemini api yet
  const handleGenerateFlashcards = async () => {
    if (!selectedFile || !selectedSubject) {
      alert("Please select both a file and a subject");
      return;
    }


    //this endpoint doesn exist in my spring boot app yet so this will fail
    setGenerating(true);
    try {
      const res = await fetch("http://localhost:8080/api/flashcards/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driveFileId: selectedFile.id,
          fileName: selectedFile.name,
          subject: selectedSubject,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate flashcards");
      const result = await res.json();
      alert(`Generated ${result.cardCount} flashcards!`);
      setSelectedFile(null);
      setSelectedSubject("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {/* Upload Box */}
      <div className="bg-linear-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-3 text-white mb-2">
          <Upload className="w-6 h-6 mt-1" />
          <div>
            <h3 className="text-xl font-semibold">Upload Study Material</h3>
            <p className="text-white/80 text-sm mt-1">
              Select a file from Google Drive and our AI will generate flashcards
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Google Picker */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h4 className="font-medium mb-2">Select File from Google Drive</h4>
          <p className="text-sm text-gray-500 mb-4">
            {!isAuthenticated
              ? "Connect your Google Drive to get started"
              : "Click to browse and select a file"}
          </p>

          {!isAuthenticated ? (
            <button
              onClick={handleConnectDrive}
              disabled={loading}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl py-12 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors group disabled:opacity-50"
            >
              <FolderOpen className="w-12 h-12 text-gray-400 group-hover:text-indigo-600 mb-3" />
              <p className="text-indigo-600 font-medium">
                {loading ? "Connecting..." : "Connect to Google Drive"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Click to authorize access</p>
            </button>
          ) : (
            <>
              <button
                onClick={openGooglePicker}
                disabled={!pickerLoaded}
                className="w-full border-2 border-dashed border-indigo-300 rounded-xl py-12 flex flex-col items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors group disabled:opacity-50"
              >
                <FolderOpen className="w-12 h-12 text-indigo-500 group-hover:text-indigo-600 mb-3" />
                <p className="text-indigo-600 font-medium">
                  {!pickerLoaded ? "Loading Picker..." : "Choose File from Drive"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {!pickerLoaded ? "Please wait..." : "Browse your Google Drive files"}
                </p>
              </button>

              {selectedFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm font-medium text-green-900 flex items-center gap-2">
                    <span className="text-green-600">✓</span> File Selected
                  </p>
                  <p className="text-sm text-green-700 mt-2 font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-green-600 mt-1">{selectedFile.mimeType}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Subject Selection */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h4 className="font-medium mb-2">Subject & Generate</h4>
          <p className="text-sm text-gray-500 mb-4">
            Choose a subject to organize your flashcards
          </p>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!isAuthenticated}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4 disabled:bg-gray-100"
          >
            <option value="">Select subject</option>
            <option value="mathematics">Mathematics</option>
            <option value="computer-science">Computer Science</option>
            <option value="physics">Physics</option>
            <option value="biology">Biology</option>
            <option value="chemistry">Chemistry</option>
            <option value="history">History</option>
            <option value="literature">Literature</option>
            <option value="other">Other</option>
          </select>

          <button
            onClick={handleGenerateFlashcards}
            disabled={!isAuthenticated || !selectedFile || !selectedSubject || generating}
            className="w-full bg-linear-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5" />
            {generating ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MaterialsGrid({ materials }: { materials: Material[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Your Study Materials</h3>
        <p className="text-sm text-gray-500">{materials.length} materials</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <div
            key={material.id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm leading-tight">{material.title}</h4>
                <p className={`text-xs mt-1 ${material.subjectColor}`}>
                  {material.subject}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span>{material.cards} cards</span>
              <span className="text-emerald-600 font-medium">
                {material.progress}% complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="h-2 rounded-full bg-linear-to-r from-indigo-600 to-violet-600"
                style={{ width: `${material.progress}%` }}
              />
            </div>

            {/* Action Button */}
            <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Start Studying
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}
