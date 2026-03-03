"use client";

import React, { useState, useEffect } from "react";
import { Upload, FolderOpen, Sparkles } from "lucide-react";
import { Subject } from "@/types";

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export default function UploadSection({ subjects, refreshSubjects }: { subjects: Subject[]; refreshSubjects: () => void }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pickerLoaded, setPickerLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("drive_connected") === "true") {
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get("drive_error")) {
      alert("Failed to connect to Google Drive: " + urlParams.get("drive_error"));
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    checkAuthentication();

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gapi.load("picker", { callback: () => setPickerLoaded(true) });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const checkAuthentication = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/drive/authenticated", { credentials: "include" });
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if(data.authenticated) refreshSubjects();
    } catch (e) { console.error(e); }
  };

  const handleConnectDrive = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/drive/auth-url", { credentials: "include" });
      const data = await res.json();
      window.location.href = data.authUrl;
    } catch (error) { console.error(error); setLoading(false); }
  };

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

  const openGooglePicker = async () => {
      if (!pickerLoaded) return alert("Picker loading...");
      if (!isAuthenticated) return alert("Connect Drive first");
      try {
          const tokenRes = await fetch("http://localhost:8080/api/drive/access-token", { credentials: "include" });
          if (!tokenRes.ok) return alert("Failed token fetch");
          const { accessToken } = await tokenRes.json();
          const picker = new window.google.picker.PickerBuilder()
              .addView(window.google.picker.ViewId.DOCS)
              .setOAuthToken(accessToken)
              .setDeveloperKey(API_KEY)
              .setCallback((data: any) => {
                  if (data.action === window.google.picker.Action.PICKED) {
                    const file = data.docs[0];
                    setSelectedFile({ id: file.id, name: file.name, mimeType: file.mimeType });
                  }
              })
              .build();
          picker.setVisible(true);
      } catch (e) { console.error(e); }
  };

  const handleGenerateFlashcards = async () => {
    if (!selectedFile || !selectedSubjectId) {
      alert("Please select both a file and a subject");
      return;
    }
    setGenerating(true);
    try {
      //first need to create the doc in the db to save it so flashcards can be stoeed later
      const createDocRes = await fetch("http://localhost:8080/api/documents/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubjectId,
          title: selectedFile.name,
          filePath: selectedFile.id, // using Drive file ID as the file path
        }),
      });

      if (!createDocRes.ok) throw new Error("Failed to create Document record");

      const documentData = await createDocRes.json();
      console.log("Document Created with ID:", documentData.id);

      // Find the subject name to pass to Gemini for the prompt
      const subjectName = subjects.find(s => s.id.toString() === selectedSubjectId)?.name || "General";

      // 2. THEN: Generate Flashcards using the file
      const generateRes = await fetch("http://localhost:8080/api/flashcards/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: documentData.id,
          driveFileId: selectedFile.id,
          fileName: selectedFile.name,
          subject: subjectName,
        }),
      });

      // added an  alert to force any errors to be shown on my  console
      if (!generateRes.ok) {
        const errorText = await generateRes.text();
        const status = generateRes.status;
        alert(` HTTP STATUS: ${status}\n ERROR Details: \n${errorText}`);
        throw new Error(`Backend Error ${status}: ${errorText}`);
      }

      // making sure the json is corretly given
      let result;
      try {
        result = await generateRes.json();
      } catch (jsonErr) {
        throw new Error("Backend succeeded, but Gemini returned invalid JSON instead of flashcards!");
      }

      console.log("Gemini JSON Result:", result);
      alert(`Successfully created Document and Generated flashcards! Check console for JSON.`);

      setSelectedFile(null);
      setSelectedSubjectId("");
    } catch (error) {
      console.error(error);
      alert("Error: " + (error instanceof Error ? error.message : "Process failed"));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="bg-linear-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-3 text-white mb-2">
          <Upload className="w-6 h-6 mt-1" />
          <div>
            <h3 className="text-xl font-semibold">Upload Study Material</h3>
            <p className="text-white/80 text-sm mt-1">Select a file from Drive and choose a subject</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h4 className="font-medium mb-4">Select File from Google Drive</h4>
          {!isAuthenticated ? (
            <button
              onClick={handleConnectDrive}
              disabled={loading}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl py-12 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
            >
              <FolderOpen className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-indigo-600 font-medium">{loading ? "Connecting..." : "Connect Drive"}</p>
            </button>
          ) : (
             <div className="space-y-4">
               <button
                onClick={openGooglePicker}
                disabled={!pickerLoaded}
                className="w-full border-2 border-dashed border-indigo-300 rounded-xl py-8 flex flex-col items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                <FolderOpen className="w-8 h-8 text-indigo-500 mb-2" />
                <p className="text-indigo-600 font-medium">{pickerLoaded ? "Choose File" : "Loading..."}</p>
              </button>
              {selectedFile && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                   <span className="text-green-600">✓</span>
                   <span className="text-sm text-green-800 truncate">{selectedFile.name}</span>
                </div>
              )}
             </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
           <h4 className="font-medium mb-4">Subject & Generate</h4>
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
               {subjects.length === 0 ? (
                 <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                    No subjects found. Please go to "My Subjects" tab to create one.
                 </div>
               ) : (
                <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                >
                    <option value="">Choose a subject...</option>
                    {/* sub.id is the value for the DB subject, but sub.name for displaying better */}
                    {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>
               )}
             </div>

             <button
                onClick={handleGenerateFlashcards}
                disabled={!isAuthenticated || !selectedFile || !selectedSubjectId || generating}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
             >
                <Sparkles className="w-5 h-5" />
                {generating ? "Generating..." : "Generate Flashcards"}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
