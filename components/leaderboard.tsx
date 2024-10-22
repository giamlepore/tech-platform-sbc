import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LeaderboardEntry {
  id: string
  name: string | null
  points: number
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data))
  }, [])

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-400 font-sans tracking-tight sm:text-xl">Leaderboard</h2>
      <ul className="space-y-2">
        {leaderboard.map((entry, index) => (
          <motion.li
            key={entry.id}
            className="flex items-center justify-between bg-gray-700 p-2 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-300 mr-4">{index + 1}</span>
              <span className="text-gray-200">{entry.name || 'Anonymous'}</span>
            </div>
            <span className="text-indigo-400 font-bold">{entry.points} points</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}