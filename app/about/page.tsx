"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/header';
import { Button } from '../components/ui/button';
import {
  SquareDashedKanban,
  Zap,
  Mic,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Smile,
  CircleArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />

      {/* About Section */}
      <div className="flex-1 flex flex-col items-center text-center p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Tentang MENTORA</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Platform simulasi ujian proposal thesis berbasis AI yang membantu mahasiswa
            mempersiapkan diri untuk ujian sesungguhnya dengan feedback yang konstruktif dan real-time.
          </p>
        </div>
      </div>

      {/* Features/Values Section */}
      <div className="bg-white py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {/* Feature Card 1 */}
          <div className="p-4">
            <Image
                            src="/assets/target.png"
                            alt="Mendengarkan"
                            width={200}
                            height={200}
                            className="w-11 h-11 mx-auto mb-4 "
                          />
            <h3 className="text-xl font-semibold mb-2">Simulasi Realistis</h3>
            <p className="text-gray-600 text-sm">
              Pengalaman presentasi proposal tesis dalam kondisi sesungguhnya
            </p>
          </div>
          {/* Feature Card 2 */}
          <div className="p-4">
            <Image
                            src="/assets/zap.png"
                            alt="Mendengarkan"
                            width={200}
                            height={200}
                            className="w-11 h-11 mx-auto mb-4 "
                          />
            <h3 className="text-xl font-semibold mb-2">Feedback Instan</h3>
            <p className="text-gray-600 text-sm">
              Dapatkan evaluasi dan saran perbaikan secara langsung
            </p>
          </div>
          {/* Feature Card 3 */}
          <div className="p-4">
            <Image
                            src="/assets/book-open.png"
                            alt="Mendengarkan"
                            width={200}
                            height={200}
                            className="w-11 h-11 mx-auto mb-4 "
                          />
            <h3 className="text-xl font-semibold mb-2">AI Expert</h3>
            <p className="text-gray-600 text-sm">
              Dilatih dengan data dan ujian proposal thesis
            </p>
          </div>
          {/* Feature Card 4 */}
          <div className="p-4">
            <Image
                            src="/assets/mic.png"
                            alt="Mendengarkan"
                            width={200}
                            height={200}
                            className="w-11 h-11 mx-auto mb-4 "
                          />
            <h3 className="text-xl font-semibold mb-2">Voice-to-Voice</h3>
            <p className="text-gray-600 text-sm">
              Interaksi menggunakan teknologi speech
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-100 py-16 px-6 mt-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Cara Kerja</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-full font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Proposal</h3>
              <p className="text-gray-600 text-sm">
                Unggah dokumen proposal anda dalam format PDF atau DOCX
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-full font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Mulai Simulasi</h3>
              <p className="text-gray-600 text-sm">
                Berinteraksi dengan AI penguji melalui voice chat real-time
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-full font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Dapatkan Feedback</h3>
              <p className="text-gray-600 text-sm">
                Terima skor dan umpan balik untuk meningkatkan performa ujian
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Manfaat untuk Mahasiswa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
            {/* Benefit Item 1 */}
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h3 className="text-lg font-semibold">Meningkatkan Kepercayaan Diri</h3>
                <p className="text-gray-600 text-sm">
                  Berlatih berulang kali hingga merasa siap untuk ujian sesungguhnya
                </p>
              </div>
            </div>
            {/* Benefit Item 2 */}
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h3 className="text-lg font-semibold">Feedback Konstruktif</h3>
                <p className="text-gray-600 text-sm">
                  Mendapat masukan yang membangun untuk perbaikan
                </p>
              </div>
            </div>
            {/* Benefit Item 3 */}
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h3 className="text-lg font-semibold">Fleksibilitas Waktu</h3>
                <p className="text-gray-600 text-sm">
                  Berlatih kapan saja sesuai jadwal yang diinginkan
                </p>
              </div>
            </div>
            {/* Benefit Item 4 */}
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h3 className="text-lg font-semibold">Identifikasi Kelemahan</h3>
                <p className="text-gray-600 text-sm">
                  Mengetahui area yang perlu diperbaiki sebelum ujian
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gray-100 py-20 px-6 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Siap untuk Memulai?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Bergabunglah dengan ribuan mahasiswa yang telah merasakan manfaatnya
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
            <Link href="/upload">
              <Button
                className="bg-gray-900 text-white font-semibold hover:bg-gray-700 transition-colors px-8 py-3"
              >
                Coba Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}