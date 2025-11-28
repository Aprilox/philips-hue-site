'use client';

import { useState, useEffect } from 'react';
import BridgeSetup from '@/components/BridgeSetup';
import LampControl from '@/components/LampControl';
import ConfirmationModal from '@/components/ConfirmationModal';
import { getBridgeInfo, setBridgeInfo } from '@/lib/bridgeUtils';
import { HueBridge } from '@/types/hue'; // Import HueBridge from src/types/hue.ts

export default function Home() {
  const [bridgeInfo, setBridgeInfoState] = useState<HueBridge | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const storedInfo = getBridgeInfo();
    if (storedInfo) {
      setBridgeInfoState(storedInfo);
    }
  }, []);

  const handleBridgeConnected = () => {
    setBridgeInfoState(getBridgeInfo());
  };

  const handleDisconnect = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDisconnect = () => {
    setBridgeInfo(null);
    setBridgeInfoState(null);
    setShowConfirmation(false);
  };

  const handleCancelDisconnect = () => {
    setShowConfirmation(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-300">Contrôle Philips Hue</h1>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          {!bridgeInfo ? (
            <BridgeSetup onConnected={handleBridgeConnected} />
          ) : bridgeInfo.username && bridgeInfo.clientkey ? (
            <>
              <LampControl bridgeInfo={bridgeInfo} />
              <button
                onClick={handleDisconnect}
                className="mt-8 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Déconnecter le bridge
              </button>
            </>
          ) : (
            <p>Bridge info incomplete. Please reconnect.</p>
          )}
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationModal
          onConfirm={handleConfirmDisconnect}
          onCancel={handleCancelDisconnect}
        />
      )}
    </main>
  );
}