"use client";

import React from "react";
import { useRouter } from "next/navigation";

export type Document = {
  id: number;
  subjectId: number;
  subjectName: string;
  title: string;
};

export default function MaterialsGrid({ materials }: { materials: Document[] }) {
  const router = useRouter();

  if (materials.length === 0) {
    return <div className="text-gray-500 text-center py-10">No materials generated yet.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Your Study Materials</h3>
        <p className="text-sm text-gray-500">{materials.length} documents</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <div
            key={material.id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm leading-tight">{material.title}</h4>
                <p className="text-xs mt-1 text-indigo-600">
                  Subject: {material.subjectName || material.subjectId}
                </p>
              </div>
            </div>

            {/* Action Button to dynamic route on click passing the doc id*/}
            <button
              onClick={() => router.push(`/revise/${material.id}`)}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-6"
            >
              <svg className="w-4 h-4"  fill="none"  stroke="currentColor" viewBox="0 0 24 24" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Studying
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
