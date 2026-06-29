import { useEffect, useState } from 'react'

interface Photo {
  id: number
  src: string
  caption: string
  startX: number
  startY: number
  endX: number
  endY: number
  rotation: number
  delay: number
  duration: number
  size: number
  scale: number
}

// ====== FOTO KENANGAN (gunakan foto yang sama dengan background) ======
const PHOTOS_DATA = [
  { src: '/1.jpg', caption: '' },
  { src: '/2.jpg', caption: '' },
  { src: '/3.jpg', caption: '' },
  { src: '/4.jpg', caption: '' },
  { src: '/5.jpg', caption: '' },
  { src: '/6.jpg', caption: '' },
  { src: '/7.jpg', caption: '' },
  { src: '/8.jpg', caption: '' },
  { src: '/9.jpg', caption: '' },
  { src: '/10.jpg', caption: '' },
  { src: '/11.jpg', caption: '' },
  { src: '/12.jpg', caption: '' },
  { src: '/13.jpg', caption: '' },
  { src: '/14.jpg', caption: '' },
  { src: '/15.jpg', caption: '' },
  { src: '/6.jpg', caption: '' },
  { src: '/7.jpg', caption: '' },
  { src: '/8.jpg', caption: '' },
  { src: '/19.jpg', caption: '' },
  { src: '/12.jpg', caption: '' },
]

export default function FlyingPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    const w = window.innerWidth
    const h = window.innerHeight

    const generated: Photo[] = PHOTOS_DATA.map((data, i) => {
      // Mulai dari luar layar secara acak
      const side = Math.floor(Math.random() * 4)
      let startX: number, startY: number
      if (side === 0) { startX = Math.random() * w; startY = -300 }
      else if (side === 1) { startX = w + 300; startY = Math.random() * h }
      else if (side === 2) { startX = Math.random() * w; startY = h + 300 }
      else { startX = -300; startY = Math.random() * h }

      // End position tersebar memenuhi seluruh layar (grid acak)
      const cols = 5
      const rows = 4
      const col = i % cols
      const row = Math.floor(i / cols)
      const endX = (w / cols) * col + Math.random() * (w / cols) - 50
      const endY = (h / rows) * row + Math.random() * (h / rows) - 50

      return {
        id: i,
        src: data.src,
        caption: data.caption,
        startX,
        startY,
        endX,
        endY,
        rotation: (Math.random() - 0.5) * 30,
        delay: i * 0.15,
        duration: 1.5 + Math.random() * 0.8,
        size: 120 + Math.random() * 60,
        scale: 0.8 + Math.random() * 0.4,
      }
    })

    setPhotos(generated)
  }, [])

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="absolute flying-photo"
          style={{
            left: photo.startX,
            top: photo.startY,
            width: photo.size,
            animationDelay: `${photo.delay}s`,
            animationDuration: `${photo.duration}s`,
            // @ts-ignore
            '--end-x': `${photo.endX - photo.startX}px`,
            '--end-y': `${photo.endY - photo.startY}px`,
            '--rotation': `${photo.rotation}deg`,
            '--scale': photo.scale,
          } as React.CSSProperties}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(255,105,180,0.7)] border-4 border-white/90 bg-white">
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full h-auto object-cover"
              style={{ aspectRatio: '1' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `
                    <div style="width:100%;aspect-ratio:1;background:linear-gradient(135deg,#ff80ab,#ff4081);display:flex;align-items:center;justify-content:center;font-size:3rem;">
                      💕
                    </div>
                  `
                }
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="font-dancing text-white text-center text-sm">
                {photo.caption}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
