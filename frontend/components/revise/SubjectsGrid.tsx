"use client";

import React, { useState } from "react";
import { Plus, X, BookOpen } from "lucide-react";
import { Subject } from "@/types";

export default function SubjectsGrid({ subjects, refreshSubjects, isLoading }: { subjects: Subject[], refreshSubjects: () => void, isLoading: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">My Subjects</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading subjects...</div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <button
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center min-h-40 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
            >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-indigo-100 mb-3 transition-colors">
                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
                </div>
                <span className="font-medium text-gray-500 group-hover:text-indigo-600">Create New Subject</span>
            </button>

            {subjects.map((subject) => (
                <div key={subject.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center justify-center min-h-40">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3 text-indigo-600">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">{subject.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">Study Material</p>
                </div>
            ))}
        </div>
      )}

      {isModalOpen && <CreateSubjectModal onClose={() => setIsModalOpen(false)} onSuccess={refreshSubjects} />}
    </div>
  );
}

function CreateSubjectModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("http://localhost:8080/api/subjects/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: name })
            });

            if(res.ok) {
                onSuccess();
                onClose();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to create subject");
            }
        } catch (error) {
            console.error(error);
            alert("Network error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Add New Subject</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            placeholder="e.g. Computer Science"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting || !name.trim()} className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                            {isSubmitting ? "Creating..." : "Create Subject"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
