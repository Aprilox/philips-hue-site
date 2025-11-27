import React, { useState, useEffect } from 'react'

interface ConfirmationModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationModal({ onConfirm, onCancel }: ConfirmationModalProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1)
    }, 1000)

    if (countdown === 0) {
      clearInterval(timer)
    }

    return () => clearInterval(timer)
  }, [countdown])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Confirmer la déconnexion</h2>
        <p className="mb-4 text-gray-300">
          Êtes-vous sûr de vouloir déconnecter le bridge ? Cette action effacera toutes les informations de connexion.
        </p>
        <p className="mb-4 text-gray-300">Temps restant : <span className="font-bold text-purple-300">{countdown}</span> secondes</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={countdown > 0}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}

