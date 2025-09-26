"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Button } from './ui/button'; // Pastikan path ini benar

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 1. State untuk melacak status login pengguna
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 2. Cek status login saat komponen pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat komponen mount

  // 3. Fungsi untuk menangani logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Hapus token
    setIsLoggedIn(false); // Update state
    router.replace('/'); // Arahkan ke home
    // Anda bisa menambahkan notifikasi jika perlu
  };

  // Komponen untuk tombol Autentikasi (agar tidak duplikat kode)
  const AuthButtons = () => (
    <>
      {isLoggedIn ? (
        // Jika sudah login, tampilkan tombol Logout
        <Button onClick={handleLogout} variant="outline" size="sm">
          Logout
        </Button>
      ) : (
        // Jika belum login, tampilkan tombol Login
        <Link href="/login">
          <Button variant="default" size="sm" className="bg-gray-800 text-white hover:bg-gray-700">
            Login
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 left-0 w-full bg-white text-gray-800 shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        {/* Logo dan Nama Merek */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/topi.png"
            alt="Mendengarkan"
            width={64}
            height={64}
          />
          <span className="font-bold text-xl" style={{ color: '#01306D' }}>MENTORA</span>
        </Link>

        {/* Tombol Menu untuk Layar Kecil */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {/* ... ikon SVG Anda tidak berubah ... */}
          {isMenuOpen ? (
             <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           ) : (
             <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           )}
        </button>

        {/* 4. Navigasi untuk Layar Besar (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          {/* Tampilkan tombol Login/Logout di sini */}
          <AuthButtons />
        </nav>
      </div>

      {/* 5. Dropdown Menu untuk Layar Kecil (Mobile) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col items-start px-4 py-2 space-y-2 text-sm font-medium">
            <Link href="/about" className="w-full py-2 px-3 hover:bg-gray-100 rounded-md transition-colors">
              About
            </Link>
            <Link href="/" className="w-full py-2 px-3 hover:bg-gray-100 rounded-md transition-colors">
              Home
            </Link>
            {/* Tampilkan juga tombol Login/Logout di menu mobile */}
            <div className="w-full pt-2 border-t border-gray-200">
              <AuthButtons />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;