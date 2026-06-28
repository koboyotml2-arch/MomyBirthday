import { useRef, useEffect, useCallback } from 'react'

interface Heart {
  x: number; y: number; size: number; speed: number
  sway: number; opacity: number; color: string
  rotation: number; rotationSpeed: number
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heartsRef = useRef<Heart[]>([])

  const createHeart = useCallback((randomY = false): Heart => {
    const canvas = canvasRef.current!
    return {
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : -20,
      size: Math.random() * 14 + 6,
      speed: Math.random() * 1.2 + 0.4,
      sway: Math.random() * 1.5 - 0.75,
      opacity: Math.random() * 0.4 + 0.2,
      color: `hsl(${Math.random() * 40 + 320}, 80%, 70%)`,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 35; i++) heartsRef.current.push(createHeart(true))

    const drawHeart = (h: Heart) => {
      ctx.save()
      ctx.translate(h.x, h.y)
      ctx.rotate(h.rotation)
      ctx.globalAlpha = h.opacity
      ctx.fillStyle = h.color
      ctx.beginPath()
      const s = h.size
      ctx.moveTo(0, s / 4)
      ctx.bezierCurveTo(0, 0, -s / 2, 0, -s / 2, s / 4)
      ctx.bezierCurveTo(-s / 2, s / 2, 0, s / 1.5, 0, s)
      ctx.bezierCurveTo(0, s / 1.5, s / 2, s / 2, s / 2, s / 4)
      ctx.bezierCurveTo(s / 2, 0, 0, 0, 0, s / 4)
      ctx.fill()
      ctx.restore()
    }

    let raf: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const h of heartsRef.current) {
        h.y += h.speed
        h.x += Math.sin(h.y * 0.01) * h.sway
        h.rotation += h.rotationSpeed
        if (h.y > canvas.height + 20) Object.assign(h, createHeart(false))
        drawHeart(h)
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [createHeart])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}