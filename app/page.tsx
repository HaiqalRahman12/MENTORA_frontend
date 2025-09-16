"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from './components/ui/button';
import Header from './components/header';
import { Upload, Mic, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  const handleStartSimulation = () => {
    router.push('/upload');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center text-center p-6 pt-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Simulasi Ujian Proposal Anda</h1>
          <div className="w-24 h-1 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Dapatkan feedback instan dari AI. Berlatih dan pertahanan proposal thesis Anda dengan simulasi yang realistis.
          </p>
          <Button
            onClick={handleStartSimulation}
            size="lg"
            className="bg-gray-900 text-white font-semibold hover:bg-gray-700 transition-colors px-8 py-3"
          >
            Mulai Simulasi
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="p-8 border rounded-lg shadow-sm text-center">
            <div className="mb-4">
              <Image
                                          src="/assets/file-text.png"
                                          alt="Mendengarkan"
                                          width={200}
                                          height={200}
                                          className="w-11 h-11 mx-auto mb-4 "
                                        />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Dokumen</h3>
            <p className="text-gray-600 text-sm">
              Unggah proposal thesis dalam format PDF atau DOCX untuk analisis AI.
            </p>
          </div>
          {/* Feature Card 2 */}
          <div className="p-8 border rounded-lg shadow-sm text-center">
            <div className="mb-4">
              <Image
                                          src="/assets/mic.png"
                                          alt="Mendengarkan"
                                          width={200}
                                          height={200}
                                          className="w-11 h-11 mx-auto mb-4 "
                                        />
            </div>
            <h3 className="text-xl font-semibold mb-2">Simulasi Real-time</h3>
            <p className="text-gray-600 text-sm">
              Berinteraksi dengan AI Dosen Penguji menggunakan voice-to-voice.
            </p>
          </div>
          {/* Feature Card 3 */}
          <div className="p-8 border rounded-lg shadow-sm text-center">
            <div className="mb-4">
              <Image
                                          src="/assets/zap.png"
                                          alt="Mendengarkan"
                                          width={200}
                                          height={200}
                                          className="w-11 h-11 mx-auto mb-4 "
                                        />
            </div>
            <h3 className="text-xl font-semibold mb-2">Feedback Instan</h3>
            <p className="text-gray-600 text-sm">
              Dapatkan Skor dan feedback untuk meningkatkan performa ujian.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-20 px-6 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Siap untuk Memulai?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Bergabunglah dengan ribuan mahasiswa yang telah meningkatkan kemampuan presentasi mereka.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/about">
              <Button
                variant="outline"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                Pelajari Lebih Lanjut
              </Button>
            </Link>
            <Button
              onClick={handleStartSimulation}
              className="bg-gray-900 text-white font-semibold hover:bg-gray-700 transition-colors px-8 py-3"
            >
              Coba Sekarang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}