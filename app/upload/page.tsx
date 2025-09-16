"use client";

import React, { useCallback, useState } from 'react';
import { Upload, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import Header from '../components/header';

export default function FileUploadPage() {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    if (validFile) {
      setSelectedFile(validFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setSelectedFile(file);
    }
  }, []);

  const handleSimulasi = () => {
    if (selectedFile) {
      router.push('/processing'); // Anda bisa tambahkan parameter file di sini jika perlu
    } else {
      alert("Silakan unggah dokumen terlebih dahulu.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Title and Subtitle Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Langkah 1: Unggah Dokumen Proposal Anda</h1>
          <p className="text-gray-600">Upload dokumen proposal thesis dalam format PDF atau DOCX untuk memulai simulasi.</p>
        </div>

        {/* Upload Area Card */}
        <Card
          className={`
            p-12 w-full max-w-2xl
            border-2 border-dashed rounded-lg
            transition-colors duration-300
            ${isDragOver ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Upload className="w-12 h-12 text-gray-400" />
            </div>

            <div className="space-y-2">
              <p className="text-xl font-medium">Drag & Drop file PDF/DOCX di sini</p>
              <p className="text-gray-500">atau</p>
            </div>

            <div>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 px-6"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  Pilih File
                </Button>
              </label>
            </div>

            <p className="text-sm text-gray-500">Maksimal 10MB</p>

            {selectedFile && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <FileText className="inline-block mr-2 w-4 h-4" />
                  File terpilih: {selectedFile.name}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8 w-full max-w-lg">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <Button
            onClick={handleSimulasi}
            disabled={!selectedFile}
            className={`
              flex-1 text-white font-semibold 
              ${selectedFile ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'}
            `}
          >
            Lanjut ke Simulasi
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}