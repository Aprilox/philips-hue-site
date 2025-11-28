'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { HueBridge, Light } from '@/types/hue';
import ColorWheel from '@/components/ColorWheel';
import SpecialModes from '@/components/SpecialModes';

export default function LampControl({ bridgeInfo }: { bridgeInfo: HueBridge }) {
  const [lights, setLights] = useState<Light[]>([]);
  const [selectedLight, setSelectedLight] = useState<Light | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const discoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchLights();
  }, []);

  useEffect(() => {
    return () => {
      if (discoIntervalRef.current) {
        clearInterval(discoIntervalRef.current);
      }
    };
  }, []);

  const fetchLights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/get-lights?ip=${bridgeInfo.ip}`, {
        headers: {
          'hue-application-key': bridgeInfo.username,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch lights');
      }
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setLights(data.data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des lampes:', error);
      setError('Unable to fetch lights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorChange = async (x: number, y: number, brightness: number, on: boolean) => {
    if (!selectedLight) return;

    try {
      console.log('Sending color change request:', { x, y, brightness, on });
      const response = await fetch(`/api/set-light-color?ip=${bridgeInfo.ip}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'hue-application-key': bridgeInfo.username,
        },
        body: JSON.stringify({
          lightId: selectedLight.services.find((s) => s.rtype === 'light')?.rid,
          color: { xy: { x, y } },
          brightness: brightness,
          on: on,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Color change response:', data);
    } catch (error: unknown) {
      console.error('Erreur lors du changement de couleur:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to change light color: ${errorMessage}`);
    }
  };

  const handleLightClick = (light: Light) => {
    if (selectedLight?.id === light.id) {
      setSelectedLight(null);
      setActiveMode(null);
      stopAllModes();
    } else {
      setSelectedLight(light);
      setActiveMode(null);
      stopAllModes();
    }
  };

  const stopAllModes = () => {
    if (discoIntervalRef.current) {
      clearInterval(discoIntervalRef.current);
      discoIntervalRef.current = null;
    }
    // Reset to white at 100% brightness
    handleColorChange(0.3127, 0.3290, 100, true);
  };

  const handleModeSelect = useCallback(
    (mode: string | null) => {
      if (mode === activeMode) {
        // Désactiver le mode actuel
        setActiveMode(null);
        stopAllModes();
      } else {
        // Arrêter l'ancien mode et activer le nouveau
        stopAllModes();
        setActiveMode(mode);

        if (mode === 'disco') {
          startDiscoMode();
        } else if (mode === 'relax') {
          handleColorChange(0.5268, 0.4133, 30, true); // Warm orange at 30% brightness
        } else if (mode === 'focus') {
          handleColorChange(0.3151, 0.3252, 100, true); // Cool white at 100% brightness
        }
      }
    },
    [activeMode]
  );

  const vividColors = [
    { x: 0.7006, y: 0.2993 }, // Rouge
    { x: 0.2151, y: 0.7106 }, // Vert
    { x: 0.1380, y: 0.0808 }, // Bleu
    { x: 0.3127, y: 0.3290 }, // Blanc
    { x: 0.6378, y: 0.3594 }, // Orange
    { x: 0.1638, y: 0.3531 }, // Cyan
    { x: 0.4448, y: 0.4066 }, // Jaune
    { x: 0.2739, y: 0.1096 }, // Violet
  ];

  const startDiscoMode = () => {
    if (discoIntervalRef.current) {
      clearInterval(discoIntervalRef.current);
    }
    discoIntervalRef.current = setInterval(() => {
      const randomColor = vividColors[Math.floor(Math.random() * vividColors.length)];
      handleColorChange(randomColor.x, randomColor.y, 100, true);
    }, 150);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading lights...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-purple-300">Lampes disponibles</h2>
      {lights.length === 0 ? (
        <p className="text-center py-4">No lights found. Make sure your Hue Bridge is properly connected.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lights
            .filter((light) => light.metadata.name !== 'Hue Bridge')
            .map((light) => (
              <li
                key={light.id}
                className={`cursor-pointer p-4 rounded-md transition duration-300 ease-in-out ${
                  selectedLight?.id === light.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
                onClick={() => handleLightClick(light)}
              >
                {light.metadata.name}
              </li>
            ))}
        </ul>
      )}
      {selectedLight && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">{selectedLight.metadata.name}</h3>
          <div className="flex items-start space-x-6">
            <ColorWheel onColorChange={handleColorChange} />
            <SpecialModes onModeSelect={handleModeSelect} activeMode={activeMode} />
          </div>
        </div>
      )}
    </div>
  );
}