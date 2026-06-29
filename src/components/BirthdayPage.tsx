import { useEffect, useRef, useState } from 'react'
import MediaBackground from './MediaBackground'

const REASONS = [
 'Your smile can melt away even my worst days.',
 'Your laughter is my favorite melody in the whole world.',
 'You always know how to make me feel loved.',
 'Your heart is as vast as the ocean, filled with love and understanding.',
 'With you, I become the best version of myself.',
 'You are my home, the place I return to every day.',
 'Because of you, I believe in true love.',
]

// ====== FOTO YANG AKAN TERLEMPAR DARI KUE ======
const CAKE_PHOTOS = [
  { src: '6.jpg', caption: '' },
  { src: '2.jpg', caption: '🌸' },
  { src: '3.jpg', caption: '😊' },
  { src: '4.jpg', caption: '🌅' },
  { src: '5.jpg', caption: '💖' },
  { src: '6.jpg', caption: '' },
]

export default function BirthdayPage() {
  const reasonsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('animate-slide-in')
        })
      },
      { threshold: 0.2 },
    )
    reasonsRef.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <MediaBackground />

      <div className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-great-vibes text-7xl md:text-8xl text-gradient-pink animate-fade-in-down mb-4">
            Happy Birthday
          </h1>
          <p className="font-dancing text-3xl md:text-4xl text-pink-200 animate-fade-in-up delay-500 mb-6">
            To the most special woman in my life.
          </p>
          <p className="text-pink-300 tracking-[3px] animate-fade-in-up delay-1000">
            ✦ 28 08 2026 ✦
          </p>
        </section>

        <section className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <Cake />
        </section>

        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-[700px] bg-black/40 backdrop-blur-xl border-2 border-pink-200/30 rounded-3xl p-8 md:p-12 shadow-2xl relative">
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl animate-float"></span>
            <h2 className="font-great-vibes text-4xl md:text-5xl text-pink-400 text-center mb-8 mt-4">
              To my beloved Momy
            </h2>
            <p className="text-lg leading-[2] text-pink-100 text-center font-light">
              Today is a beautiful day because today is your day, Momy. Happy Birthday! 🌸{' '}
              <span className="text-pink-400 font-semibold italic">Lala </span>.
              <br /><br />
              Thank you for being the reason for my smile, for being my home during difficult times, and for being... <span className="text-pink-400 font-semibold italic">A beautiful home</span> For Me.
              <br /><br />
              On your special day, Lala, I want you to know...{' '}
              <span className="text-pink-400 font-semibold italic">Your presence feels like the greatest gift.
               </span> that God has ever given me in my life.

              <br /><br />
              Happy birthday, Momy. May this year bring you more happiness, good health, and a love that never fades.

            </p>
            <p className="mt-8 text-right font-dancing text-2xl text-pink-300">
             — With all my love, always for you. 💕
            </p>
          </div>
        </section>

        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <h2 className="font-great-vibes text-5xl text-pink-400 text-center mb-12">
            Reasons Why I Love You
          </h2>
          <div className="max-w-[700px] w-full space-y-4">
            {REASONS.map((text, i) => (
              <div
                key={i}
                ref={(el) => { reasonsRef.current[i] = el }}
                className="bg-black/40 backdrop-blur-md border border-pink-200/30 rounded-2xl p-5 flex items-center gap-5 hover:bg-pink-500/20 hover:border-pink-400 transition-all opacity-0"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <span className="font-great-vibes text-4xl text-pink-400 min-w-[50px]">{i + 1}</span>
                <span className="text-lg text-pink-100 font-light">{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 text-center">
          <h2 className="font-great-vibes text-5xl text-gradient-pink mb-4">
            I Love You <span className="animate-heartbeat inline-block text-4xl"></span> Forever
          </h2>
          <p className="font-dancing text-2xl text-pink-300">
           Today, tomorrow, and forever... you are my love.
          </p>
        </section>
      </div>
    </>
  )
}

/* ====== KOMPONEN KUE INTERAKTIF ====== */
function Cake() {
  const [poppedPhotos, setPoppedPhotos] = useState<number[]>([])
  const [isPopping, setIsPopping] = useState(false)

  const handleClick = () => {
    if (isPopping) return
    setIsPopping(true)
    setPoppedPhotos([])

    // Munculkan foto satu per satu dengan interval 400ms
    CAKE_PHOTOS.forEach((_, i) => {
      setTimeout(() => {
        setPoppedPhotos((prev) => [...prev, i])
      }, i * 400)
    })

    // Reset setelah semua foto selesai (6 foto × 400ms + 3 detik animasi)
    setTimeout(() => {
      setIsPopping(false)
      setPoppedPhotos([])
    }, CAKE_PHOTOS.length * 400 + 3000)
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Container Foto yang Terlempar */}
      {poppedPhotos.map((photoIndex) => {
        const photo = CAKE_PHOTOS[photoIndex]
        // Generate arah lemparan acak yang jauh
        const angle = Math.random() * Math.PI * 2 // 0-360 derajat
        const distance = 200 + Math.random() * 300 // 200-500px
        const tx = Math.cos(angle) * distance
        const ty = Math.sin(angle) * distance - 100 // Bias ke atas
        const rotation = (Math.random() - 0.5) * 720 // Rotasi acak -360 sampai 360

        return (
          <div
            key={photoIndex}
            className="cake-throw-photo absolute w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-4 border-white shadow-[0_15px_40px_rgba(255,105,180,0.8)] bg-white"
            style={{
              // @ts-ignore
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--rot': `${rotation}deg`,
            } as React.CSSProperties}
          >
            <img
              src={photo.src}
              alt="kenangan"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#ff80ab,#ff4081);display:flex;align-items:center;justify-content:center;font-size:2.5rem;">${photo.caption}</div>`
                }
              }}
            />
          </div>
        )
      })}

      {/* Kue Utama */}
      <div
        onClick={handleClick}
        className={`relative w-[200px] h-[220px] mx-auto transition-transform cursor-pointer z-10 ${
          isPopping ? 'scale-90 animate-shake' : 'hover:scale-105 active:scale-95'
        }`}
        title="Klick This! 🎂"
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180px] h-[65px] rounded-xl bg-gradient-to-b from-pink-400 to-pink-600 shadow-lg" />
        <div className="absolute bottom-[65px] left-1/2 -translate-x-1/2 w-[140px] h-[55px] rounded-xl bg-gradient-to-b from-pink-300 to-pink-400 shadow-lg" />
        <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 w-[100px] h-[50px] rounded-xl bg-gradient-to-b from-pink-200 to-pink-300 shadow-lg" />
        
        <div className="absolute bottom-[170px] left-1/2 -translate-x-1/2 w-[8px] h-[28px] rounded-sm bg-gradient-to-b from-white to-yellow-300" />
        
        <div
          className="absolute bottom-[198px] left-1/2 w-[14px] h-[22px] rounded-[50%_50%_20%_20%] bg-[radial-gradient(ellipse_at_center_bottom,#ffeb3b_0%,#ff9800_50%,#ff5722_100%)] shadow-[0_0_20px_#ffeb3b,0_0_40px_#ff9800]"
          style={{ animation: 'flicker 0.5s ease-in-out infinite alternate' }}
        />
      </div>
      
      <p className="text-center mt-6 font-dancing text-xl text-pink-200 animate-pulse-glow">
        {isPopping ? '✨ Foto-foto kenangan berterbangan! ' : '🎂 Klick This Cake  🎂'}
      </p>
    </div>
  )
}
