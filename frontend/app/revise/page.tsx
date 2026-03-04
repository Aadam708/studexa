"use client";

import React, { useState, useEffect } from "react";
import DashNavbar from "@/components/DashNavbar";
import { Subject } from "@/types";
import MaterialsGrid, { Document } from "@/components/revise/MaterialsGrid";
import SubjectsGrid from "@/components/revise/SubjectsGrid";
import UploadSection from "@/components/revise/UploadSection";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"revise" | "materials" | "subjects">("revise");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [materials, setMaterials] = useState<Document[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchMaterials();
  }, []);

  const fetchSubjects = async () => {
    setIsLoadingSubjects(true);
    try {
      const res = await fetch("http://localhost:8080/api/subjects", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  //replacing my sample data with this real json fetched from documents endpoint for curr user
  const fetchMaterials = async () => {
    setIsLoadingMaterials(true);
    try {
      const res = await fetch("http://localhost:8080/api/documents", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  return (
    <main className="bg-[#F5F5F7] min-h-screen">
      <DashNavbar />

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Revise</h1>
          <p className="text-gray-600 mt-1">
            Upload materials, manage subjects, and study with AI-generated flashcards
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <TabButton
            label="Upload Material"
            isActive={activeTab === "revise"}
            onClick={() => setActiveTab("revise")}
          />
          <TabButton
            label="My Materials"
            isActive={activeTab === "materials"}
            onClick={() => setActiveTab("materials")}
          />
          <TabButton
            label="My Subjects"
            isActive={activeTab === "subjects"}
            onClick={() => setActiveTab("subjects")}
          />
        </div>

        {/* Tab Content */}
        {activeTab === "revise" && <UploadSection subjects={subjects} refreshSubjects={fetchSubjects} />}
        {activeTab === "materials" && (
          isLoadingMaterials ? (
            <div className="text-center py-10 text-gray-500">Loading your materials...</div>
          ) : (
            //this passes  the materials grid with the materials from the json from the document endpoint
            <MaterialsGrid materials={materials} />
          )
        )}
        {activeTab === "subjects" && (
          <SubjectsGrid
            subjects={subjects}
            refreshSubjects={fetchSubjects}
            isLoading={isLoadingSubjects}
          />
        )}
      </div>
    </main>
  );
}

function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 px-2 font-medium transition-colors relative ${
        isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
      {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
    </button>
  );
}
