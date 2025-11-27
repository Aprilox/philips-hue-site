import React from 'react'
import { Slider } from "@/components/ui/slider"

interface DiscoSpeedControlProps {
  speed: number
  onSpeedChange: (speed: number) => void
}

export default function DiscoSpeedControl({ speed, onSpeedChange }: DiscoSpeedControlProps) {
  const handleSpeedChange = (value: number[]) => {
    onSpeedChange(value[0])
  }

  return (
    <div className="w-full max-w-xs">
      <label htmlFor="disco-speed" className="block text-sm font-medium text-gray-300 mb-2">
        Vitesse du mode Disco
      </label>
      <Slider
        id="disco-speed"
        min={50}
        max={1000}
        step={50}
        value={[speed]}
        onValueChange={handleSpeedChange}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Rapide</span>
        <span>Lent</span>
      </div>
    </div>
  )
}

