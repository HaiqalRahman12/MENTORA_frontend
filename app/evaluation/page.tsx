"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trophy, RotateCcw, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import  Header  from '../components/header';

// Definisikan tipe data untuk SessionData
interface SessionData {
  fileName: string;
  abstract: string;
  sessionId: string;
  mode: 'demo' | 'simulasi';
  transcript: any[];
  timeRemaining: number;
}

interface EvaluationData {
  relevance: number;
  clarity: number;
  mastery: number;
  finalScore: string;
  aiFeedback: string;
}

// Progress Bar Component as seen in the image
const ProgressBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center gap-4">
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-700 text-sm font-medium">{label}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
    <span className="text-gray-700 font-semibold text-sm w-12 text-right">{value}/100</span>
  </div>
);

export default function EvaluationScreenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);

  useEffect(() => {
    const dataString = searchParams.get('data');
    if (dataString) {
      try {
        const parsedData: SessionData = JSON.parse(decodeURIComponent(dataString));
        setSessionData(parsedData);

        // Simulasi analisis dan pembuatan laporan evaluasi
        const relevance = 90; // Fixed value as per image
        const clarity = 80;   // Fixed value as per image
        const mastery = 80;   // Fixed value as per image
        const finalScore = ((relevance + clarity + mastery) / 3).toFixed(1);

        const aiFeedback = "Performa Anda sangat baik. Anda menunjukkan penguasaan materi yang kuat dan mampu menjawab pertanyaan dengan jelas. Beberapa area yang dapat ditingkatkan adalah dalam memberikan contoh konkret untuk mendukung argumen teoritis Anda. Secara keseluruhan, penampilan ini menunjukkan potensi yang menjanjikan dan metodologi yang solid.";
        
        setEvaluation({
          relevance,
          clarity,
          mastery,
          finalScore,
          aiFeedback
        });

      } catch (e) {
        console.error("Failed to parse session data from URL", e);
        router.push('/upload');
      }
    } else {
      router.push('/upload');
    }
  }, [searchParams, router]);

  const onNewSession = () => {
    router.push('/upload');
  };

  const handleDownloadReport = () => {
    alert("Fungsi unduh laporan belum diimplementasi.");
  };

  if (!sessionData || !evaluation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Menganalisis sesi, harap tunggu...</p>
      </div>
    );
  }

  return (
    <div><Header/>
    <div className="flex flex-col items-center min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      
      

      <div className="flex flex-col items-center py-12 px-4 max-w-4xl mx-auto">
        {/* Main Title Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 rounded-full bg-yellow-100 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Laporan Evaluasi Sesi Anda</h1>
        </div>

        {/* Main Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
          {/* Final Score Card */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">SKOR AKHIR</h2>
            <div className="text-7xl font-bold mb-2" style={{ color: '#22C55E' }}>
              85.3
            </div>
            <p className="text-gray-500">dari 100</p>
          </div>

          {/* AI Feedback Card */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">UMPAN BALIK DARI AI PENILAI:</h2>
            <p className="text-gray-700 leading-relaxed">
              {evaluation.aiFeedback}
            </p>
          </div>
        </div>

        {/* Detailed Evaluation Card */}
        <div className="w-full bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-600 mb-6">RINCIAN PENILAIAN:</h2>
          <div className="space-y-6">
            <ProgressBar label="Relevansi (Relevance)" value={evaluation.relevance} color="bg-green-500" />
            <ProgressBar label="Kejelasan (Clarity)" value={evaluation.clarity} color="bg-yellow-500" />
            <ProgressBar label="Penguasaan (Mastery)" value={evaluation.mastery} color="bg-yellow-500" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 w-full max-w-lg">
          <Button
            onClick={handleDownloadReport}
            variant="ghost"
            className="flex-1 w-full sm:w-auto text-blue-600 font-semibold hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Unduh Laporan
          </Button>
          <Button
            onClick={onNewSession}
            className="flex-1 w-full sm:w-auto bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Coba Sesi Baru (Upload Lagi)
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
}