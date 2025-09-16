// src/app/processing/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, FileText, Search, Target, Beaker, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import Header from '../components/header';

// Langkah-langkah pemrosesan yang akan ditampilkan secara berurutan
const processingSteps = [
  { icon: FileText, text: "Membaca file: proposal_skripsi_anda.pdf", delay: 500 },
  { icon: Search, text: "Mengekstrak abstrak...", delay: 1500 },
  { icon: Target, text: "Mencari rumusan masalah...", delay: 2500 },
  { icon: Beaker, text: "Mengidentifikasi metodologi...", delay: 3500 }
];

export default function ProcessingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Logika untuk menampilkan langkah-langkah secara berurutan dengan delay
    processingSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
      }, step.delay);
    });

    // Logika untuk animasi progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          const increment = Math.random() * 10 + 5;
          return Math.min(prev + increment, 100);
        }
        clearInterval(interval);
        return 100;
      });
    }, 500);

    // Setelah semua langkah selesai, navigasi ke halaman berikutnya
    const timeout = setTimeout(() => {
      const mockSessionData = {
        fileName: 'proposal.pdf',
        abstract: 'Penelitian ini bertujuan...',
        sessionId: `session_${Date.now()}`,
        transcript: [],
        timeRemaining: 30 * 60,
      };
      
      const encodedData = encodeURIComponent(JSON.stringify(mockSessionData));
      router.push(`/ready?data=${encodedData}`);
    }, 4000); // Waktu total simulasi loading

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Title and Subtitle Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Langkah 1: Unggah Dokumen Proposal Anda</h1>
          <p className="text-gray-600">Upload dokumen proposal thesis dalam format PDF atau DOCX untuk memulai simulasi.</p>
        </div>

        {/* Processing Card */}
        <Card
          className="p-12 w-full max-w-2xl border border-gray-200 rounded-lg text-center"
        >
          <div className="flex flex-col items-center">
            {/* Loading Spinner */}
            <div className="flex justify-center mb-8">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            </div>

            <h2 className="text-xl font-medium text-gray-800">Menganalisis Dokumen & Mengekstrak Poin-Poin Kunci...</h2>
            
            <div className="mt-8 w-full text-left max-w-xs mx-auto space-y-4">
              {processingSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStep;
                const isComplete = index < currentStep;

                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    {isComplete ? (
                        <span className="text-blue-600 text-lg">✔</span>
                    ) : (
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    )}
                    <span className={`text-sm ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                        {step.text}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <p className="mt-8 text-sm text-gray-500">
              Harap tunggu, AI sedang "membaca" proposal Anda.
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mt-6">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="mt-2 text-sm text-gray-600">{Math.floor(progress)}%</span>
          </div>
        </Card>

        {/* Action Buttons (Disabled as per design) */}
        <div className="flex justify-center gap-4 mt-8 w-full max-w-lg">
          <Button
            onClick={() => router.push('/upload')}
            variant="outline"
            className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <Button
            onClick={() => {}}
            disabled
            className="flex-1 bg-gray-300 text-white font-semibold cursor-not-allowed"
          >
            Lanjut ke Simulasi
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}