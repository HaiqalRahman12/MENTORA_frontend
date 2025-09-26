"use client";

import React from 'react';
import Header from '../components/header';
import HistoryItemCard from '../components/HistoryItemCard';
import { Button } from '../components/ui/button';
import { FileText, Download, Calendar, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';

// Definisikan tipe data untuk setiap riwayat simulasi
interface SimulationHistory {
  id: number;
  fileName: string;
  date: string;
  time: string;
  score: number;
}

// Data Dummy untuk simulasi riwayat
const mockHistory: SimulationHistory[] = [
  { id: 1, fileName: 'Proposal_Skripsi_AI_Learning.pdf', date: '15 Desember 2025', time: '10.30', score: 85 },
  { id: 2, fileName: 'Proposal_Skripsi_AI_Learning.pdf', date: '15 Desember 2025', time: '10.30', score: 78 },
  { id: 3, fileName: 'Proposal_Skripsi_AI_Learning.pdf', date: '15 Desember 2025', time: '10.30', score: 92 },
  { id: 4, fileName: 'Proposal_Skripsi_AI_Learning.pdf', date: '15 Desember 2025', time: '10.30', score: 80 },
];

// Komponen untuk Badge Skor dengan Warna Kondisional
const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  let colorClass = 'bg-gray-200 text-gray-700'; // Default

  if (score >= 90) {
    colorClass = 'bg-green-100 text-green-700 border border-green-300';
  } else if (score >= 80) {
    colorClass = 'bg-blue-100 text-blue-700 border border-blue-300';
  } else if (score >= 75) {
    colorClass = 'bg-yellow-100 text-yellow-700 border border-yellow-300';
  } else {
    colorClass = 'bg-orange-100 text-orange-700 border border-orange-300';
  }

  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${colorClass}`}>
      Skor: {score}
    </span>
  );
};

// Fungsi untuk menghitung statistik
const calculateStats = (history: SimulationHistory[]) => {
  const total = history.length;
  if (total === 0) return { total: 0, average: 0, highest: 0 };

  const scores = history.map(item => item.score);
  const sum = scores.reduce((a, b) => a + b, 0);
  const average = Math.round(sum / total);
  const highest = Math.max(...scores);

  return { total, average, highest };
};

export default function HistoryPage() {
  const stats = calculateStats(mockHistory);
  
  const handleDownload = (fileName: string) => {
    alert(`Mendownload laporan untuk: ${fileName}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />

      <div className="flex-1 flex flex-col items-center p-6 pt-6">
        {/* Title Section */}
        <div className="text-center mb-5 max-w-4xl w-full">
          <h1 className="text-4xl font-bold mb-2">Riwayat Simulasi</h1>
          <p className="text-lg text-gray-600">Lihat dan unduh hasil simulasi ujian proposal Anda</p>
        </div>

        <div className="w-full max-w-4xl space-y-4 mb-12">
        {mockHistory.map((item) => (
            <HistoryItemCard 
            key={item.id}
            fileName={item.fileName}
            date={item.date}
            time={item.time}
            score={item.score}
            onDownload={handleDownload}
            />
        ))}
        </div>

        

        {/* Statistics Card */}
        <Card className="w-full max-w-4xl p-4 border border-gray-200 shadow-lg">
          <h2 className="text-xl font-bold text-center mb-8">Statistik Simulasi</h2>
          <div className="grid grid-cols-3 gap-8 text-center">
            {/* Total Simulasi */}
            <div>
              <p className="text-5xl font-bold mb-2 text-gray-800">{stats.total}</p>
              <p className="text-lg text-gray-600">Total Simulasi</p>
            </div>
            {/* Rata-rata Skor */}
            <div>
              <p className="text-5xl font-bold mb-2 text-green-600">{stats.average}</p>
              <p className="text-lg text-gray-600">Rata-rata Skor</p>
            </div>
            {/* Skor Tertinggi */}
            <div>
              <p className="text-5xl font-bold mb-2 text-blue-600">{stats.highest}</p>
              <p className="text-lg text-gray-600">Skor Tertinggi</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}