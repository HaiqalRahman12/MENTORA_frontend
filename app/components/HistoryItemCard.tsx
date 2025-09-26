// src/components/HistoryItemCard.tsx
"use client";

import React from 'react';
import { FileText, Download, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

// Definisikan tipe props untuk komponen ini
interface HistoryItemCardProps {
  fileName: string;
  date: string;
  time: string;
  score: number;
  onDownload: (fileName: string) => void;
}

// Komponen untuk Badge Skor dengan Warna yang Sesuai (Biru Muda untuk skor 85)
const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  // Untuk skor 85, kita akan menggunakan gaya biru muda seperti pada gambar
  //const colorClass = 'bg-blue-100 text-blue-700 border border-blue-200';
  
  // Jika Anda ingin menggunakan logika warna kondisional yang lebih lengkap:
  
  let colorClass = 'bg-gray-200 text-gray-700'; 
  if (score >= 90) colorClass = 'bg-green-100 text-green-700';
  else if (score >= 80) colorClass = 'bg-blue-100 text-blue-700';
  else if (score >= 70) colorClass = 'bg-yellow-100 text-yellow-700';
  

  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${colorClass}`}>
      Skor: {score}
    </span>
  );
};

const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ fileName, date, time, score, onDownload }) => {
  return (
    <div className="rounded-xl flex justify-between items-center border border-gray-200 shadow-sm p-4">
  {/* Bagian KIRI: Tulisan dan Ikon */}
  <div className="flex items-center gap-4">
    {/* Ikon FileText dan konten lainnya */}
    <FileText className="w-6 h-6 text-gray-500" />
    <div>
      {/* Nama file dan badge skor */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-800">{fileName}</span>
        <ScoreBadge score={score} />
      </div>
      {/* Tanggal dan Waktu */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  </div>

  {/* Bagian KANAN: Tombol Download */}
  <Button
    variant="outline"
    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
    
  >
    <Download className="w-4 h-4 mr-2" />
    Download
  </Button>
</div>
  );
};

export default HistoryItemCard;