"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Mic, MicOff, HelpCircle, Square } from "lucide-react";
import { Button } from "../components/ui/button";

import Image from "next/image";


// ------------------ Tipe data ------------------
interface ChatMessage {
  id: string;
  speaker: "dosen" | "user";
  text: string;
  timestamp: Date;
}

interface SessionData {
  fileName: string;
  abstract: string;
  sessionId: string;
  mode: "demo" | "simulasi";
  transcript: ChatMessage[];
  timeRemaining: number;
}

type SessionState =
  | "connecting"
  | "listening_ai"
  | "waiting_user"
  | "user_speaking"
  | "processing"
  | "ending";

// ------------------ Pertanyaan dummy ------------------
const mockQuestions = [
  "Selamat datang. Silakan mulai dengan memperkenalkan diri Anda dan menyampaikan judul penelitian Anda.",
  "Apa yang melatarbelakangi Anda untuk memilih topik penelitian ini?",
  "Bisakah Anda jelaskan rumusan masalah yang akan Anda teliti?",
  "Apa kebaruan atau kontribusi dari metode yang Anda gunakan?",
  "Bagaimana Anda akan mengukur keberhasilan penelitian ini?",
  "Apa kendala atau limitasi yang mungkin Anda hadapi dalam penelitian ini?",
  "Baik, waktu kita hampir habis. Sebagai penutup, terima kasih atas presentasi Anda.",
];

// ------------------ SpeechRecognition ------------------
const SpeechRecognition =
  typeof window !== "undefined"
    ? (window.SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      null)
    : null;

// ------------------ Komponen utama ------------------
export default function App() {
  const router = useRouter();
  // next/navigation is not available, so we mock session data
  const [sessionData, setSessionData] = useState<SessionData | null>({
    fileName: "Laporan Penelitian.pdf",
    abstract: "Ini adalah abstrak penelitian",
    sessionId: "12345",
    mode: "simulasi",
    transcript: [],
    timeRemaining: 1800,
  });

  const [sessionState, setSessionState] = useState<SessionState>("connecting");
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(1800);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Audio monitoring
  const [micLevel, setMicLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // SpeechRecognition refs
  const recognitionRef = useRef<any>(null);
  const currentFinalRef = useRef<string>("");
  const lastMessageIndexRef = useRef<number | null>(null);

  // ------------------ Init session data ------------------
  useEffect(() => {
    // next/navigation is not available, using hardcoded data
    if (!sessionData) return;

    setTimeout(() => {
      setSessionState("listening_ai");
      addMessage("dosen", mockQuestions[0]);

      setTimeout(() => {
        setSessionState("waiting_user");
      }, 3000);
    }, 2000);
  }, [sessionData]);

  // ------------------ Timer countdown ------------------
  useEffect(() => {
    if (sessionState === "connecting" || sessionState === "ending") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev: number) => {
        if (prev <= 1) {
          setSessionState("ending");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionState]);

  // ------------------ Auto-scroll ------------------
  useEffect(() => {
    if (scrollAreaRef.current) {
      const lastMessage = scrollAreaRef.current.querySelector(".last-message");
      if (lastMessage) {
        (lastMessage as HTMLElement).scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [transcript]);

  // ------------------ Helpers ------------------
  const addMessage = (speaker: "dosen" | "user", text: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      speaker,
      text,
      timestamp: new Date(),
    };
    setTranscript((prev: ChatMessage[]) => [...prev, newMessage]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const onSessionEnd = () => {
    if (sessionData) {
      const updatedSessionData: SessionData = {
        ...sessionData,
        transcript: transcript,
        timeRemaining: timeRemaining,
      };
      const encodedData = encodeURIComponent(
        JSON.stringify(updatedSessionData)
      );
      router.push(`/evaluation?data=${encodedData}`);
    }
  };

  // ------------------ Audio monitor ------------------
  const startAudioMonitor = async () => {
    try {
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      const source =
        audioContextRef.current.createMediaStreamSource(
          micStreamRef.current
        );
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.fftSize);

      const updateMicLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average =
            dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          setMicLevel(average / 255);
        }
        animationFrameIdRef.current = requestAnimationFrame(updateMicLevel);
      };
      updateMicLevel();
    } catch (err) {
      console.error("Gagal mendapatkan akses mikrofon:", err);
    }
  };

  const stopAudioMonitor = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();
    setMicLevel(0);
  };

  // ------------------ Mic toggle (fix repeat text) ------------------
  const handleMicToggle = () => {
    if (
      sessionState !== "waiting_user" &&
      sessionState !== "user_speaking"
    )
      return;

    if (!isRecording) {
      if (!SpeechRecognition) {
        console.error("Browser tidak mendukung SpeechRecognition");
        return;
      }

      const recognition = new (SpeechRecognition as any)();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "id-ID";

      recognitionRef.current = recognition;
      currentFinalRef.current = "";
      lastMessageIndexRef.current = null;

      recognition.onstart = () => {
        setIsRecording(true);
        setSessionState("user_speaking");
        startAudioMonitor();

        setTranscript((prev: ChatMessage[]) => {
          const newMsg: ChatMessage = {
            id: uuidv4(),
            speaker: "user",
            text: "",
            timestamp: new Date(),
          };
          lastMessageIndexRef.current = prev.length;
          return [...prev, newMsg];
        });
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcriptChunk = res[0].transcript;
          if (res.isFinal) {
            currentFinalRef.current =
              (currentFinalRef.current + transcriptChunk).trim() + " ";
          } else {
            interimTranscript += transcriptChunk;
          }
        }

        const combined = (currentFinalRef.current + interimTranscript).trim();

        setTranscript((prev: ChatMessage[]) => {
          const updated = [...prev];
          const idx = lastMessageIndexRef.current ?? updated.length - 1;
          if (idx < 0 || idx >= updated.length) return updated;
          updated[idx] = { ...updated[idx], text: combined };
          return updated;
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
        setSessionState("processing");
        stopAudioMonitor();

        setTranscript((prev: ChatMessage[]) => {
          const updated = [...prev];
          const idx = lastMessageIndexRef.current ?? updated.length - 1;
          if (idx >= 0 && idx < updated.length) {
            updated[idx] = {
              ...updated[idx],
              text: (updated[idx].text || "").trim(),
            };
          }
          return updated;
        });

        setTimeout(() => {
          addMessage(
            "dosen",
            `Simulasi: Menanggapi pertanyaan ke-${currentQuestionIndex + 1}.`
          );

          setTimeout(() => {
            if (currentQuestionIndex < mockQuestions.length - 1) {
              setSessionState("listening_ai");
              const nextIndex = currentQuestionIndex + 1;
              setCurrentQuestionIndex(nextIndex);
              addMessage("dosen", mockQuestions[nextIndex]);

              setTimeout(() => {
                if (nextIndex === mockQuestions.length - 1) {
                  setSessionState("ending");
                  setTimeout(onSessionEnd, 3000);
                } else {
                  setSessionState("waiting_user");
                }
              }, 3000);
            } else {
              setSessionState("ending");
              setTimeout(onSessionEnd, 3000);
            }
          }, 1500);
        }, 1000);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
        setSessionState("waiting_user");
        stopAudioMonitor();
      };

      recognition.start();
    } else {
      const recognition = recognitionRef.current;
      if (recognition) recognition.stop();
    }
  };

  // ------------------ UI helpers ------------------
  const getStatusText = () => {
    switch (sessionState) {
      case "connecting":
        return "Menyambungkan ke Ruang Simulasi...";
      case "listening_ai":
        return "Mentora sedang berbicara...";
      case "waiting_user":
        return "Giliran Anda. Tekan untuk berbicara.";
      case "user_speaking":
        return "Mendengarkan...";
      case "processing":
        return "Memproses...";
      case "ending":
        return "Sesi Selesai";
    }
  };

  const buttonClass = (variant: string) => {
    let base = "w-20 h-20 rounded-full transition-all duration-300 flex items-center justify-center";
    switch (variant) {
      case "destructive":
        return `${base} bg-red-500 text-white hover:bg-red-600`;
      case "default":
        return `${base} bg-blue-500 text-white hover:bg-blue-600`;
      case "secondary":
      default:
        return `${base} bg-gray-200 text-gray-800 hover:bg-gray-300`;
    }
  };

  const getMicButtonVariant = () => {
    if (sessionState === "user_speaking") return "destructive";
    if (sessionState === "waiting_user") return "default";
    return "secondary";
  };

  if (sessionData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p>Memuat data sesi...</p>
        </div>
      </div>
    );
  }

  const renderMicIcon = () => {
    if (sessionState === "user_speaking") {
      // Kondisi 1: Sedang Merekam (Tombol Merah)
      return (
        <Image
          src="/assets/mic-recording.png" // Ganti dengan path gambar "recording" Anda
          alt="Berhenti Merekam"
          width={25} // Sesuaikan ukuran
          height={25}
        />
      );
    } else if (sessionState === "waiting_user") {
      // Kondisi 2: Siap Merekam (Tombol Biru)
      return (
        <Image
          src="/assets/mic-disabled.png" // Ganti dengan path gambar "standby" Anda
          alt="Mulai Merekam"
          width={25} // Sesuaikan ukuran
          height={25}
        />
      );
    } else {
      // Kondisi 3: Tidak Aktif (Tombol Abu-abu)
      return (
        <Image
          src="/assets/mic-disabled.png" // Ganti dengan path gambar "disabled" Anda
          alt="Mikrofon Tidak Aktif"
          width={25} // Sesuaikan ukuran
          height={25}
        />
      );
    }
  };

  const isDisabled = 
    sessionState !== "waiting_user" && sessionState !== "user_speaking";

  // ------------------ Render ------------------
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Terhubung</span>
            </div>
            <div className="text-sm text-gray-600">
              Sisa Waktu:{" "}
              <span className="font-mono font-medium text-gray-900">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center">
              <span className="mr-1">?</span>
              Bantuan
            </button>

            <Button variant="outline" size="sm" onClick={onSessionEnd}>
              <Square className="w-4 h-4 mr-1" />
              Selesaikan Sesi
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Orb section */}
        <div className="flex flex-1 items-center justify-center px-4 py-8 relative">
          <div className="relative flex flex-col items-center">
            {/* The orb itself */}
            <div
              className="relative w-40 h-40 rounded-full shadow-lg flex items-center justify-center transition-transform duration-300"
              style={{
                backgroundColor: "#dbeafe",
                transform: `scale(${isRecording ? 1.1 + micLevel * 0.2 : 1})`,
              }}
            >
              <div
                className="absolute inset-4 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "#60a5fa",
                  opacity: 0.6 + micLevel * 0.4,
                  transform: `scale(${isRecording ? 1.1 : 1})`,
                }}
              ></div>
              <div className="relative z-10">
                {sessionState === "listening_ai" ? (
                  <Image
                    src="/assets/topi.png"
                    alt="Mendengarkan"
                    width={64}
                    height={64}
                    className="animate-pulse"
                  />
                ) : (
                  <Image
                    src="/assets/topi.png"
                    alt="Sedang merekam"
                    width={64}
                    height={64}
                  />
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {sessionState === "user_speaking" ? "Sedang merekam..." : "Mendengarkan..."}
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-1">
                {getStatusText()}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Mic button and status bar */}
      <div className="p-6 border-t border-gray-200 bg-white flex flex-col items-center">
      <button
        onClick={handleMicToggle}
        className={buttonClass(getMicButtonVariant())}
        disabled={isDisabled}
      >
        {/* Panggil fungsi untuk merender ikon yang sesuai */}
        {renderMicIcon()}
      </button>
      <p className="mt-2 text-sm text-gray-600">
        {isRecording ? "Sedang merekam..." : "Tekan untuk berbicara"}
      </p>
    </div>

      {/* Transcript section */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex justify-center p-4">
          <h3 className="text-lg font-semibold text-gray-800">Transkrip Percakapan</h3>
        </div>
        <div className="h-[300px] overflow-y-auto" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {transcript.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${message.speaker === "user"
                    ? "justify-end"
                    : "justify-start"
                  } ${index === transcript.length - 1 ? "last-message" : ""}`}
              >
                <div
                  className={`flex items-center gap-3 ${message.speaker === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-800">
                    {message.speaker === "user" ? "MA" : "DO"}
                  </div>
                  <div
                    className={`rounded-lg p-3 max-w-[75%] shadow-sm ${message.speaker === "user"
                        ? "bg-blue-100 text-gray-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    <div className="text-xs font-semibold">
                      [{message.speaker === "user" ? "Anda" : "Dosen-AI"}]
                    </div>
                    <p className="text-sm mt-1">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}
