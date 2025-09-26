// src/app/login/page.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Siapkan data dengan format x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', email); // API Anda meminta 'username', kita isi dengan email
    formData.append('password', password);

    try {
      // 2. Kirim permintaan ke backend
      const response = await fetch('http://127.0.0.1:8000/auth/token', { // <-- Sesuaikan URL jika perlu
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      // 3. Tangani respons
      if (response.ok) {
        // Jika berhasil, simpan token dan arahkan pengguna
        console.log('Login berhasil:', data);
        localStorage.setItem('accessToken', data.access_token); // Simpan token
        router.push('/'); // Arahkan ke halaman simulasi/dashboard
      } else {
        // Jika gagal (misal: password salah)
        setError(data.detail || 'Email atau kata sandi salah.');
      }
    } catch (err) {
      // Jika terjadi error koneksi
      setError('Gagal terhubung ke server. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center mb-2">
        <Image src="/assets/topi.png" alt="MENTORA Logo" width={96} height={96} className="mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-gray-800">MENTORA</h1>
        <p className="text-sm" style={{ color: "#D49E4D" }}>SIMULASI SEMINAR PROPOSAL</p>
      </div>
      <Card className="w-full gap-2 max-w-lg p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold mb-2">Masuk</h2>
          <p className="text-sm text-gray-600">Masukkan email dan kata sandi Anda untuk memulai simulasi</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="nama@contoh.com"
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan kata sandi"
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end mt-1">
              <Link href="#" className="text-xs text-gray-500 hover:text-blue-600">Lupa kata sandi?</Link>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full bg-black text-white font-semibold hover:bg-gray-800 py-3" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
        <div className="text-center my-4 text-sm text-gray-500">ATAU</div>
        <Link href="/session">
          <Button variant="outline" className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 py-3">Coba Demo</Button>
        </Link>
        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Belum punya akun?</span>{' '}
          <Link href="/daftar" className="text-blue-600 hover:underline">Daftar sekarang</Link>
        </div>
      </Card>
      <div className="text-center text-xs text-gray-500 mt-8">
        ©2025 MentoraAI - Universitas Islam Riau
      </div>
    </div>
  );
}