"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";

// Definisikan komponen fungsional untuk header
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white text-gray-800 shadow-md">
      <div className="container mx-auto px-50 py-2 flex justify-between items-center">
        {/* Logo dan Nama Merek */}
        <Link href="/" className="flex items-center gap-2">
          {/* Ganti SVG ini dengan ikon logo Anda */}
          <Image
                src="/assets/topi.png"
                alt="Mendengarkan"
                width={64}
                height={64}
                
              />
          <span className="font-bold text-xl style={{ color: '#01306D' }}">MENTORA</span>
        </Link>

        {/* Tombol Menu untuk Layar Kecil */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Navigasi untuk Layar Besar */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
        </nav>
      </div>

      {/* Dropdown Menu untuk Layar Kecil */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col items-start px-4 py-2 space-y-2 text-sm font-medium">
            <Link href="/about" className="w-full py-2 px-3 hover:bg-gray-100 rounded-md transition-colors">
              About
            </Link>
            <Link href="/home" className="w-full py-2 px-3 hover:bg-gray-100 rounded-md transition-colors">
              Home
            </Link>
          </nav>
        </div>
      )}
    </header>
    
  );
};

export default Header;