"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, MicOff, Volume2, Check, Play, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '../components/header';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';

// Anda perlu mendefinisikan tipe data untuk SessionData jika belum ada
interface SessionData {
  fileName: string;
  abstract: string;
  sessionId: string;
  transcript: any[];
  timeRemaining: number;
}

type SessionMode = 'demo' | 'simulasi';

export default function SessionSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [selectedMode, setSelectedMode] = useState<'demo' | 'simulasi'>('simulasi');
  const [isListening, setIsListening] = useState(false);
  const [micTestPassed, setMicTestPassed] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [browserSupport, setBrowserSupport] = useState(true);

  useEffect(() => {
    // Ambil data sesi dari parameter URL
    const dataString = searchParams.get('data');
    if (dataString) {
      try {
        const parsedData: SessionData = JSON.parse(decodeURIComponent(dataString));
        setSessionData(parsedData);
      } catch (e) {
        console.error("Failed to parse session data from URL", e);
        router.push('/upload');
      }
    } else {
      router.push('/upload');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setBrowserSupport(false);
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();

    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'id-ID';

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const trans = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += trans + ' ';
        } else {
          interimTranscript += trans;
        }
      }
      const fullTranscript = finalTranscript + interimTranscript;
      setTranscript(fullTranscript);
      if (fullTranscript.length > 0) {
        setMicTestPassed(true);
      }
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setTranscript('Terjadi kesalahan. Coba lagi.');
    };

    setRecognition(rec);

    return () => {
      if (rec) {
        rec.stop();
      }
    };
  }, []);

  const handleStartListening = () => {
    if (recognition && !isListening) {
      try {
        setTranscript('Silakan berbicara...');
        setMicTestPassed(false);
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error('Error starting recognition:', e);
        setTranscript('Tidak dapat memulai pengenalan suara.');
        setIsListening(false);
      }
    }
  };

  const handleStopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const renderMicTestStatus = () => {
    if (!browserSupport) {
      return (
        <p className="text-red-500 text-sm">
          Maaf, browser Anda tidak mendukung Web Speech API. Silakan gunakan Google Chrome.
        </p>
      );
    }

    if (isListening) {
      return (
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-blue-600 animate-pulse" />
          <span className="text-sm text-muted-foreground">Mendengarkan...</span>
        </div>
      );
    }

    if (micTestPassed) {
      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="font-medium">Tes Selesai.</span>
          </div>
        </div>
      );
    }

    return null;
  };

  const onBeginSimulation = () => {
    if (sessionData) {
      const newSessionData = {
        ...sessionData,
        mode: selectedMode,
      };
      const encodedData = encodeURIComponent(JSON.stringify(newSessionData));
      router.push(`/session?data=${encodedData}`);
    }
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat sesi, harap tunggu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-xl">Anda Akan Memulai Sesi Simulasi</h2>
            <div className="w-full h-px bg-border"></div>
          </div>

          {/* Setup Steps */}
          <div className="space-y-8">
            {/* Step 1: Mode Selection */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full p-1 text-xs font-medium min-w-[20px] h-5 flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-medium">Pilih Mode Sesi:</h3>
                </div>

                <div className="pl-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mode"
                          value="demo"
                          checked={selectedMode === 'demo'}
                          onChange={(e) => setSelectedMode(e.target.value as SessionMode)}
                          className="w-4 h-4 text-primary"
                        />
                        <span>Demo</span>
                      </label>

                      <span className="text-muted-foreground">——————</span>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mode"
                          value="simulasi"
                          checked={selectedMode === 'simulasi'}
                          onChange={(e) => setSelectedMode(e.target.value as SessionMode)}
                          className="w-4 h-4 text-primary"
                        />
                        <span>Simulasi</span>
                      </label>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Mode Simulasi akan menggunakan AI generatif
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 2: Microphone Test */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full p-1 text-xs font-medium min-w-[20px] h-5 flex items-center justify-center">
                    2
                  </div>
                  <h3 className="font-medium">Cek Mikrofon Anda:</h3>
                </div>

                <div className="pl-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleStartListening}
                      variant="outline"
                      disabled={isListening || !browserSupport}
                      className="min-w-[120px]"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Mulai Tes
                    </Button>
                    <Button
                      onClick={handleStopListening}
                      variant="outline"
                      disabled={!isListening || !browserSupport}
                      className="min-w-[120px]"
                    >
                      <MicOff className="w-4 h-4 mr-2" />
                      Berhenti
                    </Button>
                  </div>

                  <div className="flex-1">
                    {renderMicTestStatus()}
                  </div>
                </div>

                {/* Tampilan teks hasil transkripsi dalam div */}
                <div className="pl-8 pt-4">
                  <div className="bg-gray-100 p-4 rounded-md border border-gray-300 min-h-[50px] flex items-center">
                    <p className="text-gray-700 italic text-sm">
                      {transcript || "Hasil transkripsi akan muncul di sini."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 3: Ready Check */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full p-1 text-xs font-medium min-w-[20px] h-5 flex items-center justify-center">
                    3
                  </div>
                  <h3 className="font-medium">Apakah Anda Siap?</h3>
                </div>

                <div className="pl-8">
                  <p className="text-sm text-muted-foreground mb-6">
                    Sesi akan dimulai setelah Anda menekan tombol di bawah. Ambil napas dalam-dalam!
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Start Button */}
          <div className="flex justify-between items-center w-full max-w-2xl mt-8">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Kembali
            </Button>
            <Button
              onClick={onBeginSimulation}
              className="bg-black text-white font-semibold hover:bg-gray-800"
              disabled={!micTestPassed}
            >
              MULAI SESI SIMULASI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
