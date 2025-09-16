"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, Mic, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/header';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

// Anda perlu mendefinisikan tipe data untuk SessionData jika belum ada
// atau ambil dari file lain jika sudah didefinisikan secara global
interface SessionData {
  fileName: string;
  abstract: string;
  sessionId: string;
  transcript: any[];
  timeRemaining: number;
}

export default function ReadyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    // Ambil data sesi dari parameter URL
    const dataString = searchParams.get('data');
    if (dataString) {
      try {
        const parsedData: SessionData = JSON.parse(decodeURIComponent(dataString));
        setSessionData(parsedData);
      } catch (e) {
        console.error("Failed to parse session data from URL", e);
        // Jika parsing gagal, redirect kembali ke halaman utama
        router.push('/upload');
      }
    } else {
      // Jika tidak ada data, redirect kembali ke halaman upload
      router.push('/upload');
    }
  }, [searchParams, router]);

  const handleStartSession = () => {
    // Navigasi ke halaman sesi setup
    if (sessionData) {
      const encodedData = encodeURIComponent(JSON.stringify(sessionData));
      router.push(`/setup?data=${encodedData}`);
    }
  };

  // Tampilkan loading state atau redirect
  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat sesi, harap tunggu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Title and Subtitle Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Langkah 1: Unggah Dokumen Proposal Anda</h1>
          <p className="text-gray-600">Upload dokumen proposal thesis dalam format PDF atau DOCX untuk memulai simulasi.</p>
        </div>

        {/* Main Content Card */}
        <Card className="p-12 w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-lg text-center">
          <div className="flex flex-col items-center space-y-8">
            {/* Success Section */}
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
              <h2 className="text-xl font-medium text-gray-800">Dokumen berhasil Diproses! Sesi anda Telah Dibuat.</h2>
            </div>
            
            {/* Abstract Summary */}
            <div className="w-full p-6 border rounded-lg bg-white border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">Ringkasan Abstrak Terdeteksi</h3>
              <p className="text-gray-600 italic leading-relaxed">
                "{sessionData.abstract}"
              </p>
            </div>

            {/* Preparation Checklist */}
            <div className="w-full text-left">
              <h3 className="font-semibold text-gray-700 mb-4">PERSIAPAN SEBELUM MULAI:</h3>
              <div className="space-y-4">
                {/* Checklist Item 1 */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center min-w-[32px] min-h-[32px] bg-blue-600 text-white font-bold rounded-full text-sm">
                    1
                  </div>
                  <Mic className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">Pastikan mikrofon Anda aktif dan berfungsi.</span>
                </div>
                
                {/* Checklist Item 2 */}
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-center min-w-[32px] min-h-[32px] bg-orange-600 text-white font-bold rounded-full text-sm">
                    2
                  </div>
                  <span className="text-orange-800">
                    Pastikan mikrofon Anda aktif dan berfungsi.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
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
            onClick={handleStartSession}
            className="flex-1 bg-black text-white font-semibold hover:bg-blak-800"
          >
            Lanjut ke Simulasi
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}