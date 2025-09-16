import React, { useState, useEffect } from 'react';
import { Loader2, FileText, Search, Target, Beaker } from 'lucide-react';

const processingSteps = [
  { icon: FileText, text: "Membaca file: proposal_skripsi_anda.pdf", delay: 500 },
  { icon: Search, text: "Mengekstrak abstrak...", delay: 1500 },
  { icon: Target, text: "Mencari rumusan masalah...", delay: 2500 },
  { icon: Beaker, text: "Mengidentifikasi metodologi...", delay: 3500 }
];

export function ProcessingScreen() {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    processingSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
      }, step.delay);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-medium text-primary">AI Dosen Penguji - Simulasi Seminar Proposal</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8 text-center">
          {/* Spinner */}
          <div className="flex justify-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl">Menganalisis Dokumen & Mengekstrak Poin-Poin Kunci...</h2>
            <div className="w-full h-px bg-border"></div>
          </div>

          {/* Processing Steps */}
          <div className="space-y-4 text-left max-w-md mx-auto">
            {processingSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStep;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className="text-primary">&gt;</div>
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{step.text}</span>
                </div>
              );
            })}
          </div>

          <div className="text-center text-muted-foreground">
            <p>Harap tunggu, AI sedang "membaca" proposal Anda.</p>
          </div>
        </div>
      </div>
    </div>
  );
}