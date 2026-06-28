import { useEffect, useState } from 'react'

// ====== TANGGAL ULANG TAHUN ======
// Ganti tanggal ini sesuai tanggal ulang tahun pacar Anda
const BIRTHDAY_DATE = new Date('2026-08-15T00:00:00')

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date().getTime()
  const target = BIRTHDAY_DATE.getTime()
  const difference = target - now

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  }
}

interface Props {
  onCountdownEnd: () => void
}

export default function CountdownPage({ onCountdownEnd }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft()
      setTimeLeft(newTime)

      // Jika countdown sudah selesai (atau kurang dari 5 detik)
      if (newTime.total <= 0) {
        setIsReady(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const isFinished = timeLeft.total <= 0

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(circle,#2a0040_0%,#000_100%)] px-4">
      
      {/* Judul */}
      <p className="font-dancing text-2xl md:text-3xl text-pink-200 text-center mb-4 animate-fade-in-up">
        On the Way to Your Special Day
      </p>

      <h1 className="font-great-vibes text-5xl md:text-7xl text-gradient-pink mb-12 animate-pulse-glow">
        {isFinished ? '🎂 Itstime! ' : 'Countdown'}
      </h1>

      {/* Kotak Countdown */}
      {!isFinished && (
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-12">
          <CountdownBox value={timeLeft.days} label="Hari" />
          <CountdownBox value={timeLeft.hours} label="Jam" />
          <CountdownBox value={timeLeft.minutes} label="Menit" />
          <CountdownBox value={timeLeft.seconds} label="Detik" />
        </div>
      )}

      {/* Tanggal Target */}
      <p className="text-pink-300 tracking-[3px] text-lg mb-8 animate-fade-in-up delay-500">
        ✦ 15 08 2026 ✦
      </p>

      {/* Tombol Lewati / Lanjut */}
      <button
        onClick={onCountdownEnd}
        className="btn-shine px-10 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-[0_10px_30px_rgba(255,64,129,0.5)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,64,129,0.7)] transition-all animate-fade-in-up delay-1000"
      >
        {isFinished ? '🎁 Start the Surprise! 🎁' : '⏭️ Cant wait? Skip →'}
      </button>

      {/* Pesan jika sudah waktunya */}
      {isFinished && (
        <p className="mt-6 font-dancing text-xl text-pink-200 animate-pulse-glow">
         Today is the most special day! 💕
        </p>
      )}
    </div>
  )
}

/* ====== KOTAK COUNTDOWN INDIVIDUAL ====== */
function CountdownBox({ value, label }: { value: number; label: string }) {
  const formatted = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-24 md:w-28 md:h-32 rounded-2xl bg-gradient-to-b from-pink-500/20 to-pink-700/20 backdrop-blur-md border-2 border-pink-400/50 shadow-[0_10px_30px_rgba(255,105,180,0.3)] flex items-center justify-center overflow-hidden">
        {/* Garis tengah seperti flip clock */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-pink-400/30" />
        
        {/* Angka */}
        <span className="font-great-vibes text-4xl md:text-6xl text-gradient-pink relative z-10">
          {formatted}
        </span>
      </div>
      <span className="mt-3 font-dancing text-lg md:text-xl text-pink-200">
        {label}
      </span>
    </div>
  )
}