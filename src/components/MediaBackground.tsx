import { useEffect, useState } from 'react'

interface MediaItem {
  src: string
  type: 'image' | 'video'
}

// ====== DAFTAR MEDIA UNTUK BACKGROUND ======
// Taruh semua foto/video di folder public/
// Format: { src: '/namafile.jpg', type: 'image' } atau { src: '/namafile.mp4', type: 'video' }
const MEDIA_LIST: MediaItem[] = [
  { src: '/1.jpg', type: 'image' },
  { src: '/12.jpg', type: 'image' },
  { src: '/13.jpg', type: 'image' },
  { src: '/14.jpg', type: 'image' },
  { src: '/19.jpg', type: 'image' },
  { src: '/6.jpg', type: 'image' },
  { src: '/7.jpg', type: 'image' },
  { src: '/18.jpg', type: 'image' },
  { src: '/1.mp4', type: 'video' },
  { src: '/2.mp4', type: 'video' },
]

const SLIDE_DURATION = 5000 // 5 detik per slide

export default function MediaBackground() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MEDIA_LIST.length)
      setNextIndex((prev) => (prev + 1) % MEDIA_LIST.length)
    }, SLIDE_DURATION)
    return () => clearInterval(interval)
  }, [])

  const current = MEDIA_LIST[currentIndex]
  const next = MEDIA_LIST[nextIndex]

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Slide saat ini */}
      <MediaSlide media={current} key={`current-${currentIndex}`} />
      
      {/* Slide berikutnya (untuk transisi fade) */}
      <MediaSlide media={next} key={`next-${nextIndex}`} className="opacity-0 animate-fade-in-slow" />

      {/* Overlay gelap agar teks tetap terbaca */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/60 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,105,180,0.15)_0%,transparent_70%)]" />
    </div>
  )
}

function MediaSlide({ media, className = '' }: { media: MediaItem; className?: string }) {
  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      {media.type === 'image' ? (
        <img
          src={media.src}
          alt=""
          className="w-full h-full object-cover scale-110 animate-slow-zoom"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        <video
          src={media.src}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-110 animate-slow-zoom"
          onError={(e) => {
            (e.target as HTMLVideoElement).style.display = 'none'
          }}
        />
      )}
    </div>
  )
}