"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation'; // <-- Impor useRouter
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function RegisterPage() {
  // 1. State untuk menyimpan nilai input dan status lainnya
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Inisialisasi router

  // 2. Fungsi untuk menangani pengiriman form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Mencegah refresh halaman
    setIsLoading(true);
    setError(null);

    try {
      // 3. Mengirim data ke backend FastAPI
      const response = await fetch('http://127.0.0.1:8000/auth/register', { // <-- Ganti URL jika perlu
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // 4. Menangani respons dari backend
      if (response.ok) {
        // Jika berhasil (status code 200-299)
        alert('Pendaftaran berhasil! Silakan masuk.');
        router.push('/login'); // Arahkan ke halaman login
      } else {
        // Jika gagal
        const errorData = await response.json();
        setError(errorData.detail || 'Terjadi kesalahan saat pendaftaran.');
      }
    } catch (err) {
      // Menangani error koneksi (misal: backend tidak aktif)
      setError('Tidak dapat terhubung ke server. Coba lagi nanti.');
      console.error(err);
    } finally {
      setIsLoading(false); // Selesaikan loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center mb-2">
        <Image
          src="/assets/topi.png"
          alt="MENTORA Logo"
          width={96}
          height={96}
          className="mx-auto mb-2"
        />
        <h1 className="text-2xl font-bold text-gray-800">MENTORA</h1>
        <p className="text-sm" style={{ color: "#D49E4D" }}>SIMULASI SEMINAR PROPOSAL</p>
      </div>

      <Card className="w-full gap-2 max-w-lg p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Daftar</h2>
          <p className="text-sm text-gray-600">Buat akun baru untuk memulai simulasi Anda</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="nama@contoh.com"
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
              value={email} // <-- Hubungkan ke state
              onChange={(e) => setEmail(e.target.value)} // <-- Update state saat diketik
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Buat kata sandi baru"
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
              value={password} // <-- Hubungkan ke state
              onChange={(e) => setPassword(e.target.value)} // <-- Update state saat diketik
            />
          </div>
          
          {/* Tampilkan pesan error jika ada */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full bg-black text-white font-semibold hover:bg-gray-800 py-3" disabled={isLoading}>
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </form>

        <div className="text-center my-4 text-sm text-gray-500">ATAU</div>
        
        <Link href="/session">
          <Button variant="outline" className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 py-3">
            Coba Demo
          </Button>
        </Link>
        

        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Sudah punya akun?</span>{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Masuk
          </Link>
        </div>
      </Card>

      <div className="text-center text-xs text-gray-500 mt-8">
        ©2025 MentoraAI - Universitas Islam Riau
      </div>
    </div>
  );
}