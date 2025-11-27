'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import debounce from 'lodash/debounce'

interface ColorWheelProps {
  onColorChange: (x: number, y: number, brightness: number, on: boolean) => void
}

export default function ColorWheel({ onColorChange }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedColor, setSelectedColor] = useState<{ x: number; y: number; cieX: number; cieY: number } | null>(null)
  const [brightness, setBrightness] = useState(100)

  const debouncedColorChange = useCallback(
    debounce((x: number, y: number, brightness: number, on: boolean) => {
      onColorChange(x, y, brightness, on)
    }, 50),
    [onColorChange]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 2

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const dx = x - centerX
        const dy = y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= radius) {
          const hue = ((Math.atan2(dy, dx) + Math.PI) / (Math.PI * 2)) * 360
          const saturation = Math.min(distance / radius, 1)
          const lightness = Math.max(0.5, 1 - saturation * 0.5) // Ajustez cette ligne pour contrôler la luminosité

          ctx.fillStyle = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  }, [])

  const handleColorClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const dx = x - centerX
    const dy = y - centerY
    const radius = Math.min(centerX, centerY) - 2

    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance <= radius) {
      const hue = ((Math.atan2(dy, dx) + Math.PI) / (Math.PI * 2)) * 360
      const saturation = Math.min(distance / radius, 1)

      const { x: cieX, y: cieY } = hslToXy(hue, saturation, 0.5)
      setSelectedColor({ x, y, cieX, cieY })
      debouncedColorChange(cieX, cieY, brightness, brightness > 0)
    }
  }

  const handleBrightnessChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const height = rect.height;
    const newBrightness = Math.round(100 - (y / height) * 100);
    const clampedBrightness = Math.max(0, Math.min(100, newBrightness));
    setBrightness(clampedBrightness);
    if (selectedColor) {
      debouncedColorChange(selectedColor.cieX, selectedColor.cieY, clampedBrightness, clampedBrightness > 0);
    }
  };

  const handleBrightnessChangeEnd = () => {
    if (selectedColor) {
      onColorChange(selectedColor.cieX, selectedColor.cieY, brightness, brightness > 0);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          onClick={handleColorClick}
          onMouseMove={(e) => e.buttons === 1 && handleColorClick(e)}
          className="cursor-pointer rounded-full shadow-lg"
        />
        {selectedColor && (
          <div
            className="absolute w-6 h-6 border-2 border-white rounded-full shadow-md pointer-events-none"
            style={{
              left: `${selectedColor.x}px`,
              top: `${selectedColor.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-64 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 bg-white transition-all duration-300 ease-in-out"
            style={{ height: `${brightness}%`, minHeight: '1px' }}
          ></div>
          <div
            className="absolute inset-0"
            onMouseDown={handleBrightnessChange}
            onMouseMove={(e) => e.buttons === 1 && handleBrightnessChange(e)}
            onMouseUp={handleBrightnessChangeEnd}
            onMouseLeave={handleBrightnessChangeEnd}
          ></div>
        </div>
        <div className="text-center mt-2 text-white">
          {brightness > 0 ? `${brightness}%` : 'Off'}
        </div>
      </div>
    </div>
  )
}

function hslToXy(h: number, s: number, l: number): { x: number; y: number } {
  h /= 360
  s = Math.min(s, 1)
  l = Math.min(l, 1)

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  // sRGB to XYZ
  const X = r * 0.4124 + g * 0.3576 + b * 0.1805
  const Y = r * 0.2126 + g * 0.7152 + b * 0.0722
  const Z = r * 0.0193 + g * 0.1192 + b * 0.9505

  // XYZ to xy
  const x = X / (X + Y + Z)
  const y = Y / (X + Y + Z)

  return { x, y }
}

