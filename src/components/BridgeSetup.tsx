'use client'

import { useState } from 'react'
import { setBridgeInfo } from '@/lib/bridgeUtils'

interface BridgeSetupProps {
  onConnected: () => void
}

export default function BridgeSetup({ onConnected }: BridgeSetupProps) {
  const [bridgeIp, setBridgeIp] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [countdown, setCountdown] = useState(45)

  const handleConnect = async () => {
    setConnecting(true)
    let timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setConnecting(false)
          return 45
        }
        return prev - 1
      })
    }, 1000)

    for (let i = 0; i < 45; i++) {
      try {
        const response = await fetch(`/api/connect-bridge?ip=${bridgeIp}`)
        const data = await response.json()
        if (data.success) {
          clearInterval(timer)
          setBridgeInfo({
            ip: bridgeIp,
            username: data.username,
            clientkey: data.clientkey,
          })
          setConnecting(false)
          onConnected()
          return
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error)
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    setConnecting(false)
  }

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={bridgeIp}
        onChange={(e) => setBridgeIp(e.target.value)}
        placeholder="Adresse IP du Bridge Philips Hue"
        className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        {connecting ? `Appuyez sur le bouton du bridge (${countdown}s)` : 'Se connecter'}
      </button>
    </div>
  )
}
