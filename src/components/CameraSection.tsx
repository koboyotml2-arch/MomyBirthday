import { useRef, useEffect, useState, useCallback } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import FlyingPhotos from './FlyingPhotos'

const CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17],
]

interface Point { x: number; y: number; z: number }

function detectLove(lm: Point[]): boolean {
  const middleClosed = lm[12].y > lm[10].y
  const ringClosed = lm[16].y > lm[14].y
  const pinkyClosed = lm[20].y > lm[18].y
  if (!middleClosed || !ringClosed || !pinkyClosed) return false

  const dx = lm[4].x - lm[8].x
  const dy = lm[4].y - lm[8].y
  const dist = Math.sqrt(dx * dx + dy * dy)

  const hx = lm[0].x - lm[5].x
  const hy = lm[0].y - lm[5].y
  const handSize = Math.sqrt(hx * hx + hy * hy)
  if (handSize < 0.01) return false

  return dist / handSize < 0.25
}

interface Props {
  onLoveDetected: () => void
}

export default function CameraSection({ onLoveDetected }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const rafRef = useRef(0)
  const stableRef = useRef(0)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const detectedRef = useRef(false)
  const [showPhotos, setShowPhotos] = useState(false)

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    landmarkerRef.current?.close()
  }, [])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        setStatus('camera')
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 },
        })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream

        const video = videoRef.current!
        video.srcObject = stream
        await video.play()

        setStatus('loading-model')
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
        )
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        })
        if (cancelled) { landmarker.close(); return }
        landmarkerRef.current = landmarker
        setStatus('ready')

        const loop = () => {
          if (cancelled || detectedRef.current) return
          const v = videoRef.current
          const c = canvasRef.current
          if (!v || !c || v.readyState < 2) { rafRef.current = requestAnimationFrame(loop); return }

          c.width = v.videoWidth
          c.height = v.videoHeight
          const ctx = c.getContext('2d')!
          ctx.clearRect(0, 0, c.width, c.height)

          const results = landmarker.detectForVideo(v, performance.now())

          if (results.landmarks && results.landmarks.length > 0) {
            const lm = results.landmarks[0] as Point[]
            const w = c.width, h = c.height

            ctx.strokeStyle = '#ff80ab'
            ctx.lineWidth = 2
            for (const [i, j] of CONNECTIONS) {
              ctx.beginPath()
              ctx.moveTo(lm[i].x * w, lm[i].y * h)
              ctx.lineTo(lm[j].x * w, lm[j].y * h)
              ctx.stroke()
            }
            for (const p of lm) {
              ctx.beginPath()
              ctx.arc(p.x * w, p.y * h, 4, 0, Math.PI * 2)
              ctx.fillStyle = '#ff4081'
              ctx.fill()
            }

            if (detectLove(lm)) {
              stableRef.current++
              setStatus('detected')
              if (stableRef.current >= 12) {
                detectedRef.current = true
                // Tampilkan foto-foto berterbangan dulu
                setShowPhotos(true)
                setStatus('photos')
                // Setelah 4.5 detik, lanjut ke halaman berikutnya
                setTimeout(() => {
                  onLoveDetected()
                }, 4500)
                return
              }
            } else {
              stableRef.current = 0
              setStatus('ready')
            }
          } else {
            stableRef.current = 0
            setStatus('no-hand')
          }
          rafRef.current = requestAnimationFrame(loop)
        }
        rafRef.current = requestAnimationFrame(loop)
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Unknown error'
          setError(msg)
          setStatus('error')
        }
      }
    }

    init()
    return () => { cancelled = true; cleanup() }
  }, [onLoveDetected, cleanup])

  const statusMap: Record<string, { text: string; color: string }> = {
    'loading':       { text: '⏳ Loading camera...', color: 'border-yellow-400 text-yellow-300' },
    'camera':        { text: '📷 Requesting camera permission...', color: 'border-yellow-400 text-yellow-300' },
    'loading-model': { text: '🧠 Loading AI model...', color: 'border-blue-400 text-blue-300' },
    'no-hand':       { text: '👋 Show your hand to the camera...', color: 'border-pink-400 text-pink-200' },
    'ready':         { text: '✋ Make the LOVE ♡ gesture (touch your thumb and index finger together).', color: 'border-pink-400 text-pink-200' },
    'detected':      { text: '💗LOVE DETECTED! Hold still for a moment...', color: 'border-pink-500 bg-pink-500/30 text-white' },
    'photos':        { text: '💕 Look at our memories...', color: 'border-pink-500 bg-pink-500/30 text-white animate-pulse' },
    'error':         { text: '❌Failed to access the camera.', color: 'border-red-400 text-red-300' },
  }
  const s = statusMap[status] || statusMap['loading']

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 px-4">
      {/* Kamera (tetap terlihat di background, sedikit redup saat foto muncul) */}
      <div
        className={`relative w-full max-w-[640px] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-pink-400/50 shadow-[0_20px_60px_rgba(255,105,180,0.4)] transition-opacity duration-1000 ${showPhotos ? 'opacity-30 scale-95' : 'opacity-100'}`}
      >
        <video ref={videoRef} className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} playsInline muted />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ transform: 'scaleX(-1)' }} />
      </div>

      {/* Instruksi (hilang saat foto muncul) */}
      {!showPhotos && (
        <>
          <p className="mt-6 font-dancing text-2xl text-pink-200 text-center animate-pulse-glow">
           ✋ Show your hand, then make the gesture. <strong>LOVE ♡</strong>
          </p>

          <div className={`mt-4 px-6 py-3 rounded-full border-2 text-center transition-all duration-300 ${s.color}`}>
            {s.text}
          </div>
        </>
      )}

      {/* Pesan saat foto berterbangan */}
      {showPhotos && (
        <div className="mt-8 text-center animate-fade-in-up">
          <p className="font-great-vibes text-5xl text-gradient-pink mb-2">
            Our Memories 💕
          </p>
          <p className="font-dancing text-xl text-pink-200">
            Every moment with you is the most beautiful gift...
          </p>
        </div>
      )}

      {/* Foto-foto berterbangan */}
      {showPhotos && <FlyingPhotos />}

      {status === 'error' && (
        <button
          onClick={() => onLoveDetected()}
          className="mt-4 px-6 py-2 rounded-full bg-pink-500/30 border border-pink-400 text-pink-200 hover:bg-pink-500/50 transition-all"
        >
          Go straight to the surprise
        </button>
      )}

      {error && <p className="mt-2 text-xs text-red-400 text-center max-w-md">{error}</p>}
    </div>
  )
}