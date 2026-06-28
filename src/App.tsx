import { useState, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import ParticleCanvas from './components/ParticleCanvas'
import CountdownPage from './components/CountdownPage'
import CameraSection from './components/CameraSection'
import BirthdayPage from './components/BirthdayPage'

type Phase = 'intro' | 'countdown' | 'camera' | 'love' | 'birthday'

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [musicPlaying, setMusicPlaying] = useState(false)

  const playMusic = useCallback(() => {
    const a = audioRef.current
    if (a && a.paused) {
      a.volume = 0.6
      a.play().then(() => setMusicPlaying(true)).catch(() => {})
    }
  }, [])

  const toggleMusic = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) { a.play(); setMusicPlaying(true) }
    else { a.pause(); setMusicPlaying(false) }
  }, [])

  const handleOpenSurprise = useCallback(() => setPhase('countdown'), [])

  const handleCountdownEnd = useCallback(() => setPhase('camera'), [])

  const handleLoveDetected = useCallback(() => {
    setPhase('love')
    playMusic()
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } })
    setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } }), 1000)
    setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } }), 2000)
  }, [playMusic])

  const handleContinue = useCallback(() => {
    setPhase('birthday')
    setTimeout(() => confetti({ particleCount: 100, spread: 80 }), 500)
  }, [])

  return (
    <>
      <ParticleCanvas />

      {/* ====== AUDIO ====== */}
      <audio ref={audioRef} loop>
        <source src="/Malcolm Todd - Earrings (Lyrics) [iu70iC7yFts].mp3" type="audio/mpeg" />
      </audio>

      {/* ====== INTRO ====== */}
      {phase === 'intro' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(circle,#2a0040_0%,#000_100%)]">
          <p className="font-great-vibes text-4xl md:text-5xl text-pink-200 text-center mb-4 animate-fade-in-up"
             style={{ textShadow: '0 0 20px rgba(255,105,180,0.8)' }}>
            Welcome to Your Special Day 
          </p>
          <h1 className="font-great-vibes text-6xl md:text-8xl text-gradient-pink animate-pulse-glow mb-12">
            Momy
          </h1>
          <button
            onClick={handleOpenSurprise}
            className="btn-shine px-12 py-5 text-xl font-semibold rounded-full bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-[0_10px_30px_rgba(255,64,129,0.5)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,64,129,0.7)] transition-all animate-pulse-glow"
          >
            🎁 Open  🎁
          </button>
        </div>
      )}

      {/* ====== COUNTDOWN ====== */}
      {phase === 'countdown' && <CountdownPage onCountdownEnd={handleCountdownEnd} />}

      {/* ====== CAMERA ====== */}
      {phase === 'camera' && <CameraSection onLoveDetected={handleLoveDetected} />}

      {/* ====== LOVE OVERLAY ====== */}
      {phase === 'love' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(circle,rgba(255,105,180,0.3)_0%,rgba(0,0,0,0.85)_100%)] animate-fade-in-up">
          <h1 className="font-great-vibes text-6xl md:text-8xl text-gradient-pink animate-heartbeat mb-6">
            I Love You ♡
          </h1>
          <p className="font-dancing text-2xl md:text-3xl text-pink-200 text-center max-w-lg px-6 animate-fade-in-up delay-500">
            Every beat of my heart is for you...<br />
            Happy Birthday, my love. 💕
          </p>
          <button
            onClick={handleContinue}
            className="mt-10 px-8 py-3 rounded-full border-2 border-pink-400 text-pink-200 hover:bg-pink-500 hover:text-white transition-all animate-fade-in-up delay-1000"
          >
            Continue →
          </button>
        </div>
      )}

      {/* ====== BIRTHDAY CONTENT ====== */}
      {phase === 'birthday' && <BirthdayPage />}

      {/* ====== MUSIC TOGGLE ====== */}
      {phase !== 'intro' && phase !== 'countdown' && (
        <button
          onClick={toggleMusic}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 border-none text-2xl cursor-pointer shadow-[0_5px_20px_rgba(255,64,129,0.5)] flex items-center justify-center z-[70] hover:scale-110 transition-transform ${musicPlaying ? 'animate-spin-slow' : ''}`}
          title="Play/Pause"
        >
          {musicPlaying ? '🎵' : '🔇'}
        </button>
      )}
    </>
  )
}