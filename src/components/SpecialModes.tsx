import React from 'react';

interface SpecialModesProps {
  onModeSelect: (mode: string | null) => void;
  activeMode: string | null;
}

export default function SpecialModes({ onModeSelect, activeMode }: SpecialModesProps) {
  const modes = [
    { id: 'disco', name: 'Disco', emoji: '💃', color: 'bg-purple-500' },
    { id: 'relax', name: 'Relax', emoji: '🌙', color: 'bg-blue-300' },
    { id: 'focus', name: 'Focus', emoji: '🎯', color: 'bg-yellow-400' },
  ];

  const handleModeClick = (modeId: string) => {
    if (activeMode === modeId) {
      onModeSelect(null);
    } else {
      onModeSelect(modeId);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={`w-full h-16 ${mode.color} rounded-lg px-6 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all duration-200 flex items-center justify-center gap-2 ${
            activeMode === mode.id ? 'scale-105 ring-2 ring-white' : ''
          }`}
          onClick={() => handleModeClick(mode.id)}
        >
          <span className="text-2xl">{mode.emoji}</span>
          <span className="font-medium">{mode.name}</span>
        </button>
      ))}
    </div>
  );
}

