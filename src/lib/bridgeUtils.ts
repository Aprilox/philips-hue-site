import { HueBridge } from '@/types/hue'

export function getBridgeInfo(): HueBridge | null {
  if (typeof window === 'undefined') return null
  const storedInfo = localStorage.getItem('bridgeInfo')
  return storedInfo ? JSON.parse(storedInfo) : null
}

export function setBridgeInfo(info: HueBridge | null): void {
  if (typeof window === 'undefined') return
  if (info === null) {
    localStorage.removeItem('bridgeInfo')
  } else {
    localStorage.setItem('bridgeInfo', JSON.stringify(info))
  }
}

